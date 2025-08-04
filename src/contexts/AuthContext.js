import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    console.log('AuthContext initializing...')
    
    // Check for guest mode first
    const guestMode = localStorage.getItem('fitness-guest-mode')
    console.log('Guest mode flag:', guestMode)
    
    if (guestMode === 'true') {
      console.log('Setting up guest user')
      setIsGuest(true)
      setUser({
        id: 'guest',
        email: 'guest@example.com',
        isGuest: true
      })
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      console.log('Getting initial session...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Initial session:', session?.user?.email || 'no user')
      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'no user')
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) throw error
  }



  // Sign up with email
  const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Sign in with email
  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // Continue as guest
  const continueAsGuest = () => {
    localStorage.setItem('fitness-guest-mode', 'true')
    setIsGuest(true)
    setUser({
      id: 'guest',
      email: 'guest@example.com',
      isGuest: true
    })
  }

  // Sign out
  const signOut = async () => {
    console.log('Signing out user, isGuest:', isGuest)
    
    // Always clear guest mode data to prevent conflicts
    localStorage.removeItem('fitness-guest-mode')
    localStorage.removeItem('fitness-guest-data')
    
    if (isGuest) {
      console.log('Guest user signing out')
      setIsGuest(false)
      setUser(null)
      return
    }
    
    console.log('Regular user signing out via Supabase')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Supabase signOut error:', error)
      throw error
    }
    console.log('Successfully signed out')
  }

  const value = {
    user,
    loading,
    isGuest,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    continueAsGuest,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}