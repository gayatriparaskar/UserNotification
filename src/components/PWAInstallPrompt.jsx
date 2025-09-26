import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setIsStandalone(true)
      }
    }

    // Check if it's iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone
      setIsIOS(isIOSDevice)
      setIsStandalone(isInStandaloneMode)
    }

    checkInstalled()
    checkIOS()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or dismissed recently
  if (isInstalled || isStandalone) {
    return null
  }

  // Check if user dismissed recently (within 24 hours)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null
  }

  if (!showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 animate-slide-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐍</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Install SnakeShop</h3>
              <p className="text-sm text-gray-600">Get quick access to our snake collection</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              To install SnakeShop on your iOS device:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Tap the Share button in Safari</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Scroll down and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Tap "Add" to confirm</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Smartphone className="h-4 w-4" />
              <span>Access SnakeShop like a native app</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Monitor className="h-4 w-4" />
              <span>Works offline with cached content</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Download className="h-4 w-4" />
              <span>Get notifications for new snakes</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Install App
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="btn btn-outline flex-1"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
