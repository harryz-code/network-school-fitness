import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const PWAInstallPrompt = ({ isDark = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('🎉 PWA: App installed successfully');
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ PWA: User accepted install');
    } else {
      console.log('❌ PWA: User dismissed install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if dismissed this session or already installed
  if (isInstalled || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  // iOS install instructions
  if (isIOS && !isInstalled) {
    return (
      <div className="pwa-install-banner" style={{
        backgroundColor: isDark ? '#1a1a1a' : '#000000',
        color: isDark ? 'white' : 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Smartphone size={24} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Install Long Live The Network School</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Tap the share button, then "Add to Home Screen"
            </div>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            padding: '4px',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  // Standard PWA install prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="pwa-install-banner" style={{
        backgroundColor: isDark ? '#1a1a1a' : '#000000',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Download size={24} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Install Long Live The Network School</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Get the full app experience - works offline!
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleInstallClick}
            style={{
              background: 'white',
              color: '#1a1a1a',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Not now
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;