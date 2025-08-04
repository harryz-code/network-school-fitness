import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/dashboard'
import Login from './components/Login'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import './App.css'
import { useEffect } from 'react'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #333',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>loading...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <Dashboard user={user} />
}

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW: Service Worker registered successfully', registration.scope);
          })
          .catch((error) => {
            console.error('❌ SW: Service Worker registration failed', error);
          });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        <PWAInstallPrompt />
      </div>
    </AuthProvider>
  )
}

export default App