import React, { useState, useEffect } from 'react'
import { RefreshCw, X, Download } from 'lucide-react'

const PWAUpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Listen for PWA update events
    const handleUpdateAvailable = () => {
      setShowUpdate(true)
    }

    const handleUpdateComplete = () => {
      setShowUpdate(false)
      setIsUpdating(false)
    }

    window.addEventListener('pwa-update-available', handleUpdateAvailable)
    window.addEventListener('pwa-controller-change', handleUpdateComplete)

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable)
      window.removeEventListener('pwa-controller-change', handleUpdateComplete)
    }
  }, [])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      // Import PWA service dynamically to avoid circular dependencies
      const { default: pwaService } = await import('../services/pwaService')
      await pwaService.updateServiceWorker()
    } catch (error) {
      console.error('Update failed:', error)
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
    // Store dismissal to avoid showing again immediately
    localStorage.setItem('pwa-update-dismissed', Date.now().toString())
  }

  if (!showUpdate) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Download className="h-5 w-5 text-primary-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm">
              Update Available
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              A new version of SnakeShop is ready to install
            </p>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="btn btn-primary btn-sm flex items-center gap-1"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3" />
                    Update Now
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="btn btn-outline btn-sm"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAUpdateNotification
