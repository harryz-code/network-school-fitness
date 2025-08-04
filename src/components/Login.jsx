import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Simple icons for social providers
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
    <path d="M6.772 20L20 4h-4.267L1.505 20z"/>
  </svg>
)

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
)

export default function Login({ isDark = false }) {
  const { signInWithGoogle, signInWithTwitter, signInWithDiscord, signInWithEmail, signUpWithEmail, continueAsGuest } = useAuth()
  const [loading, setLoading] = useState(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSocialLogin = async (provider, loginFunction) => {
    try {
      setLoading(provider)
      await loginFunction()
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error.message)
      alert(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      setLoading('email')
      if (isSignUp) {
        await signUpWithEmail(email, password)
        alert('Check your email for verification link!')
      } else {
        await signInWithEmail(email, password)
      }
    } catch (error) {
      console.error('Email auth error:', error.message)
      alert(error.message)
    } finally {
      setLoading(null)
    }
  }

  const buttonStyle = {
    width: '100%',
    padding: '16px 24px',
    margin: '8px 0',
    border: `2px solid ${isDark ? 'white' : 'black'}`,
    borderRadius: '12px',
    backgroundColor: isDark ? '#000000' : 'white',
    color: isDark ? 'white' : 'black',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    fontWeight: '500'
  }

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = isDark ? 'white' : 'black'
    e.target.style.color = isDark ? 'black' : 'white'
    e.target.style.transform = 'scale(1.02)'
  }

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = isDark ? '#000000' : 'white'
    e.target.style.color = isDark ? 'white' : 'black'
    e.target.style.transform = 'scale(1)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'black' : 'white',
      color: isDark ? 'white' : 'black',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '48px 32px',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '16px',
        backgroundColor: isDark ? '#000000' : 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              color: isDark ? 'white' : 'black',
              lineHeight: '1.1',
              marginBottom: '4px'
            }}>
              Long Live
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              color: isDark ? 'white' : 'black',
              lineHeight: '1.1'
            }}>
              The Network School
            </div>
          </div>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#cccccc' : '#666666',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginBottom: '8px'
          }}>
            fitness & wellness tracking for NS residents
          </p>
          <p style={{
            fontSize: '14px',
            color: isDark ? '#999999' : '#888888',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            sign in to save your progress
          </p>
        </div>

        <div>
          {!showEmailForm ? (
            <>
              <button
                onClick={() => handleSocialLogin('google', signInWithGoogle)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={buttonStyle}
                disabled={loading !== null}
              >
                <GoogleIcon />
                {loading === 'google' ? 'signing in...' : 'continue with google'}
              </button>

              <button
                onClick={() => handleSocialLogin('twitter', signInWithTwitter)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={buttonStyle}
                disabled={loading !== null}
              >
                <TwitterIcon />
                {loading === 'twitter' ? 'signing in...' : 'continue with x'}
              </button>

              <button
                onClick={() => handleSocialLogin('discord', signInWithDiscord)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={buttonStyle}
                disabled={loading !== null}
              >
                <DiscordIcon />
                {loading === 'discord' ? 'signing in...' : 'continue with discord'}
              </button>

              <div style={{ 
                textAlign: 'center', 
                margin: '24px 0 16px',
                color: isDark ? '#666' : '#999',
                fontSize: '14px'
              }}>
                or
              </div>

              <button
                onClick={() => setShowEmailForm(true)}
                style={{
                  ...buttonStyle,
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? '#333' : '#ddd'}`,
                  color: isDark ? '#ccc' : '#666'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#111' : '#f5f5f5'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                continue with email
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailAuth}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>

              {isSignUp && (
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#000000' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                style={buttonStyle}
                disabled={loading === 'email'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {loading === 'email' ? 'please wait...' : (isSignUp ? 'create account' : 'sign in')}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#ccc' : '#666',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isSignUp ? 'already have an account? sign in' : 'need an account? sign up'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#888' : '#999',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← back to social login
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: isDark ? '#737373' : '#9ca3af'
        }}>
          by continuing, you agree to our terms of service
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={continueAsGuest}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#888' : '#999',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = isDark ? '#ccc' : '#666'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = isDark ? '#888' : '#999'
            }}
          >
            continue as guest (data not saved)
          </button>
        </div>
      </div>
    </div>
  )
}