import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showDelay, setShowDelay] = useState(false)

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
      // Add delay before showing prompt
      setTimeout(() => {
        setShowDelay(true)
        setShowInstallPrompt(true)
      }, 10000) // Show after 10 seconds
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

  // Check if user dismissed recently (within 7 days)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
    return null
  }

  if (!showInstallPrompt || !showDelay) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-in">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🍿</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Install SnacksShop</h3>
              <p className="text-xs text-gray-600">Get quick access</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              To install on iOS: Share → Add to Home Screen
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Smartphone className="h-3 w-3" />
              <span>Native app experience</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Download className="h-3 w-3" />
              <span>Get notifications</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="btn btn-primary btn-sm flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="btn btn-outline btn-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
