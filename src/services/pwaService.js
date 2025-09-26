// PWA Service for SnakeShop
class PWAService {
  constructor() {
    this.registration = null
    this.updateAvailable = false
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.onStatusChange('online')
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.onStatusChange('offline')
    })

    // Service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.onControllerChange()
      })

      navigator.serviceWorker.addEventListener('message', (event) => {
        this.onServiceWorkerMessage(event)
      })
    }
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully:', this.registration)

      // Check for updates
      this.registration.addEventListener('updatefound', () => {
        this.onUpdateFound()
      })

      // Handle updates
      if (this.registration.waiting) {
        this.updateAvailable = true
        this.onUpdateAvailable()
      }

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  async unregisterServiceWorker() {
    if (this.registration) {
      const success = await this.registration.unregister()
      if (success) {
        console.log('Service Worker unregistered')
        this.registration = null
      }
      return success
    }
    return false
  }

  async updateServiceWorker() {
    if (this.registration && this.registration.waiting) {
      // Tell the waiting service worker to skip waiting and become active
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Reload the page to use the new service worker
      window.location.reload()
    }
  }

  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('All caches cleared')
    }
  }

  async getCacheInfo() {
    if (!('caches' in window)) {
      return { totalCaches: 0, totalSize: 0 }
    }

    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      totalSize += keys.length
    }

    return {
      totalCaches: cacheNames.length,
      totalSize,
      cacheNames
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Show notification
  async showNotification(title, options = {}) {
    if (!this.registration || Notification.permission !== 'granted') {
      return false
    }

    const defaultOptions = {
      body: 'New notification from SnakeShop',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-96x96.png'
        }
      ]
    }

    try {
      await this.registration.showNotification(title, { ...defaultOptions, ...options })
      return true
    } catch (error) {
      console.error('Failed to show notification:', error)
      return false
    }
  }

  // Background sync
  async registerBackgroundSync(tag) {
    if (!this.registration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.log('Background sync not supported')
      return false
    }

    try {
      await this.registration.sync.register(tag)
      console.log('Background sync registered:', tag)
      return true
    } catch (error) {
      console.error('Background sync registration failed:', error)
      return false
    }
  }

  // Periodic background sync
  async registerPeriodicSync(tag, minInterval) {
    if (!this.registration || !('periodicSync' in window.ServiceWorkerRegistration.prototype)) {
      console.log('Periodic background sync not supported')
      return false
    }

    try {
      await this.registration.periodicSync.register(tag, { minInterval })
      console.log('Periodic background sync registered:', tag)
      return true
    } catch (error) {
      console.error('Periodic background sync registration failed:', error)
      return false
    }
  }

  // Event handlers
  onStatusChange(status) {
    console.log('Network status changed:', status)
    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('pwa-status-change', { 
      detail: { status, isOnline: this.isOnline } 
    }))
  }

  onUpdateFound() {
    console.log('Service Worker update found')
    this.updateAvailable = true
    window.dispatchEvent(new CustomEvent('pwa-update-found'))
  }

  onUpdateAvailable() {
    console.log('Service Worker update available')
    window.dispatchEvent(new CustomEvent('pwa-update-available'))
  }

  onControllerChange() {
    console.log('Service Worker controller changed')
    window.dispatchEvent(new CustomEvent('pwa-controller-change'))
  }

  onServiceWorkerMessage(event) {
    console.log('Service Worker message:', event.data)
    window.dispatchEvent(new CustomEvent('pwa-message', { 
      detail: event.data 
    }))
  }

  // Utility methods
  isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator.standalone === true)
  }

  isInstallable() {
    return 'BeforeInstallPromptEvent' in window
  }

  getInstallPrompt() {
    return new Promise((resolve) => {
      const handler = (e) => {
        e.preventDefault()
        resolve(e)
        window.removeEventListener('beforeinstallprompt', handler)
      }
      window.addEventListener('beforeinstallprompt', handler)
    })
  }

  // Install app
  async installApp() {
    if (!this.isInstallable()) {
      return false
    }

    try {
      const prompt = await this.getInstallPrompt()
      const result = await prompt.prompt()
      const outcome = await result.userChoice
      
      console.log('Install prompt outcome:', outcome)
      return outcome.outcome === 'accepted'
    } catch (error) {
      console.error('Install failed:', error)
      return false
    }
  }

  // Get app info
  getAppInfo() {
    return {
      isOnline: this.isOnline,
      isStandalone: this.isStandalone(),
      isInstallable: this.isInstallable(),
      hasServiceWorker: !!this.registration,
      updateAvailable: this.updateAvailable
    }
  }
}

// Create and export singleton instance
const pwaService = new PWAService()
export default pwaService
