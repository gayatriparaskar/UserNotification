import apiService from './api'

class WebPushService {
  constructor() {
    this.vapidPublicKey = null
    this.registration = null
    this.subscription = null
  }

  // Initialize web push service
  async initialize() {
    try {
      console.log('🚀 WebPushService: Starting initialization...')
      
      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        console.log('❌ Service Worker not supported')
        return { supported: false, reason: 'Service Worker not supported' }
      }
      console.log('✅ Service Worker supported')

      // Check if push manager is supported
      if (!('PushManager' in window)) {
        console.log('❌ Push Manager not supported')
        return { supported: false, reason: 'Push Manager not supported' }
      }
      console.log('✅ Push Manager supported')

      // Get VAPID public key from backend
      console.log('🔑 Getting VAPID public key...')
      await this.getVapidPublicKey()
      console.log('🔑 VAPID key after getting:', this.vapidPublicKey)

      // Register service worker
      console.log('🔧 Registering service worker...')
      this.registration = await navigator.serviceWorker.ready
      console.log('🔧 Service worker registered:', this.registration)

      // Set up push event listener
      this.setupPushEventListener()

      console.log('✅ Web Push Service initialized successfully')
      return { supported: true }
    } catch (error) {
      console.error('Error initializing web push service:', error)
      return { supported: false, reason: error.message }
    }
  }

  // Get VAPID public key from backend
  async getVapidPublicKey() {
    try {
      console.log('🔑 Requesting VAPID public key from backend...')
      console.log('🔑 API Base URL:', apiService.baseURL)
      console.log('🔑 Full URL:', `${apiService.baseURL}/push/vapid-key`)
      
      const response = await apiService.request('/push/vapid-key')
      console.log('🔑 VAPID key response:', response)
      console.log('🔑 Response type:', typeof response)
      console.log('🔑 Response keys:', Object.keys(response || {}))
      
      if (response.success) {
        this.vapidPublicKey = response.data.publicKey
        console.log('✅ VAPID public key received:', this.vapidPublicKey)
      } else {
        console.error('❌ VAPID key request failed:', response)
        throw new Error('Failed to get VAPID public key')
      }
    } catch (error) {
      console.error('❌ Error getting VAPID public key:', error)
      console.error('❌ Error details:', error.message)
      console.error('❌ Error stack:', error.stack)
      throw error
    }
  }

  // Convert VAPID key to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Subscribe to push notifications
  async subscribe() {
    try {
      if (!this.registration) {
        // Try to get the service worker registration
        if ('serviceWorker' in navigator) {
          this.registration = await navigator.serviceWorker.ready
        }
        
        if (!this.registration) {
          throw new Error('Service worker not registered')
        }
      }

      if (!this.vapidPublicKey) {
        console.error('❌ VAPID public key not available. Current value:', this.vapidPublicKey)
        throw new Error('VAPID public key not available')
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription()
      
      if (this.subscription) {
        console.log('Already subscribed to push notifications')
        return { success: true, alreadySubscribed: true }
      }

      // Create new subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      })

      // Send subscription to backend
      const response = await apiService.request('/push/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription: this.subscription })
      })

      if (response.success) {
        console.log('✅ Successfully subscribed to push notifications')
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to save subscription')
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return { success: false, error: error.message }
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe()
        this.subscription = null
      }

      // Remove subscription from backend
      const response = await apiService.request('/push/unsubscribe', {
        method: 'DELETE'
      })

      if (response.success) {
        console.log('✅ Successfully unsubscribed from push notifications')
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to remove subscription')
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return { success: false, error: error.message }
    }
  }

  // Test push notification
  async testNotification() {
    try {
      const response = await apiService.request('/push/test', {
        method: 'POST'
      })

      if (response.success) {
        console.log('✅ Test notification sent')
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to send test notification')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Get push notification status
  async getStatus() {
    try {
      const response = await apiService.request('/push/status')
      return response
    } catch (error) {
      console.error('Error getting push status:', error)
      return { success: false, error: error.message }
    }
  }

  // Update push preferences
  async updatePreferences(pushEnabled) {
    try {
      const response = await apiService.request('/push/preferences', {
        method: 'PUT',
        body: JSON.stringify({ pushEnabled })
      })

      if (response.success) {
        console.log('✅ Push preferences updated')
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating push preferences:', error)
      return { success: false, error: error.message }
    }
  }

  // Set up push event listener
  setupPushEventListener() {
    if (!this.registration) return

    this.registration.addEventListener('push', (event) => {
      console.log('🔔 Push event received:', event)

      let data = {}
      if (event.data) {
        data = event.data.json()
      }

      const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/icon-72x72.png',
        data: data.data || {},
        actions: data.actions || [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/icon-72x72.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        requireInteraction: data.requireInteraction || false,
        tag: data.tag || 'notification',
        timestamp: data.timestamp || Date.now()
      }

      event.waitUntil(
        this.registration.showNotification(data.title || 'SnacksShop', options)
      )
    })

    // Handle notification click
    this.registration.addEventListener('notificationclick', (event) => {
      console.log('🔔 Notification clicked:', event)

      event.notification.close()

      if (event.action === 'view' || !event.action) {
        // Open the app
        event.waitUntil(
          clients.openWindow(event.notification.data?.url || '/')
        )
      }
    })
  }

  // Check if push notifications are supported
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  // Check if user has granted permission
  async getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'not-supported'
    }
    return Notification.permission
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
}

export default new WebPushService()
