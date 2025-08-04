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
    // Check for guest mode first
    const guestMode = localStorage.getItem('fitness-guest-mode')
    if (guestMode === 'true') {
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
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

  // Sign in with Twitter
  const signInWithTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
    })
    if (error) throw error
  }

  // Sign in with Discord
  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
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
    if (isGuest) {
      localStorage.removeItem('fitness-guest-mode')
      localStorage.removeItem('fitness-guest-data') // Clear guest data
      setIsGuest(false)
      setUser(null)
      return
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    isGuest,
    signInWithGoogle,
    signInWithTwitter,
    signInWithDiscord,
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