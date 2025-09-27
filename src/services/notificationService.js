import apiService from './api'
import webPushService from './webPushService'

class NotificationService {
  constructor() {
    this.registration = null
    this.isSupported = 'Notification' in window
    this.permission = this.isSupported ? Notification.permission : 'denied'
  }

  // Initialize notification service
  async initialize() {
    if (!this.isSupported) {
      console.log('Notifications not supported')
      return false
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service worker registered for notifications')
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    // Initialize web push service
    try {
      console.log('🔧 NotificationService: Initializing web push service...')
      const webPushResult = await webPushService.initialize()
      console.log('🔧 WebPushService initialization result:', webPushResult)
      
      if (webPushResult.supported) {
        console.log('✅ Web push service initialized successfully')
      } else {
        console.log('❌ Web push not supported:', webPushResult.reason)
      }
    } catch (error) {
      console.error('❌ Error initializing web push service:', error)
      console.error('❌ Error details:', error.message)
    }

    return true
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  // Show notification
  async showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      console.log('🔔 Notifications not available - permission:', this.permission)
      return false
    }

    const notificationOptions = {
      body: options.body || 'New notification from SnacksShop',
      icon: options.icon || '/logo192.png',
      badge: options.badge || '/logo192.png',
      tag: options.tag || 'snacksshop-notification',
      requireInteraction: options.requireInteraction || false,
      data: {
        url: options.url || '/',
        badgeCount: options.badgeCount || 0,
        ...options.data
      }
    }

    try {
      console.log('🔔 Showing browser notification:', title)
      
      if (this.registration && this.registration.showNotification) {
        await this.registration.showNotification(title, notificationOptions)
        console.log('🔔 Service worker notification shown')
      } else {
        const notification = new Notification(title, notificationOptions)
        console.log('🔔 Native notification shown')
        
        notification.onclick = () => {
          console.log('🔔 Notification clicked')
          window.focus()
          if (options.url) {
            window.location.href = options.url
          }
          notification.close()
        }
        
        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      return true
    } catch (error) {
      console.error('🔔 Error showing notification:', error)
      return false
    }
  }

  // Set badge count
  setBadgeCount(count) {
    console.log('🔔 Setting badge count to', count)
    
    // Update document title
    this.updateDocumentTitle(count)
    
    // Try to set badge through service worker
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'SET_BADGE',
        count: count
      })
    }
    
    // Try native Badge API
    if ('setAppBadge' in navigator) {
      if (count > 0) {
        navigator.setAppBadge(count).then(() => {
          console.log('🔔 Native badge set successfully to', count)
        }).catch(error => {
          console.log('🔔 Native badge failed:', error)
        })
      } else {
        navigator.clearAppBadge().then(() => {
          console.log('🔔 Native badge cleared successfully')
        }).catch(error => {
          console.log('🔔 Native badge clear failed:', error)
        })
      }
    } else {
      console.log('🔔 Badge API not supported')
    }
  }

  // Update document title with badge count
  updateDocumentTitle(count) {
    const originalTitle = 'SnacksShop - Premium Snacks Collection'
    if (count > 0) {
      document.title = `(${count}) ${originalTitle}`
    } else {
      document.title = originalTitle
    }
  }

  // Show order notification
  async showOrderNotification(order) {
    const title = `Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`
    const body = `Your order #${order.orderNumber} has been ${order.status}`
    
    return this.showNotification(title, {
      body,
      tag: `order-${order._id}`,
      data: {
        url: `/orders/${order._id}`,
        orderId: order._id
      }
    })
  }

  // Show product notification
  async showProductNotification(product) {
    const title = 'New Product Available'
    const body = `${product.name} is now available for purchase`
    
    return this.showNotification(title, {
      body,
      tag: `product-${product._id}`,
      data: {
        url: `/product/${product._id}`,
        productId: product._id
      }
    })
  }

  // Show stock notification
  async showStockNotification(product) {
    const title = 'Low Stock Alert'
    const body = `Only ${product.stock} ${product.name} left in stock`
    
    return this.showNotification(title, {
      body,
      tag: `stock-${product._id}`,
      data: {
        url: `/product/${product._id}`,
        productId: product._id
      }
    })
  }

  // Clear all notifications
  clearAllNotifications() {
    if (this.registration) {
      this.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => notification.close())
      })
    }
  }

  // Get notification permission status
  getPermissionStatus() {
    return {
      isSupported: this.isSupported,
      permission: this.permission,
      canShow: this.isSupported && this.permission === 'granted'
    }
  }

  // Subscribe to web push notifications
  async subscribeToPush() {
    try {
      const result = await webPushService.subscribe()
      if (result.success) {
        console.log('✅ Successfully subscribed to web push notifications')
        return true
      } else {
        console.error('Failed to subscribe to web push:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error subscribing to web push:', error)
      return false
    }
  }

  // Unsubscribe from web push notifications
  async unsubscribeFromPush() {
    try {
      const result = await webPushService.unsubscribe()
      if (result.success) {
        console.log('✅ Successfully unsubscribed from web push notifications')
        return true
      } else {
        console.error('Failed to unsubscribe from web push:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error unsubscribing from web push:', error)
      return false
    }
  }

  // Test web push notification
  async testPushNotification() {
    try {
      const result = await webPushService.testNotification()
      if (result.success) {
        console.log('✅ Test push notification sent')
        return true
      } else {
        console.error('Failed to send test push notification:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error sending test push notification:', error)
      return false
    }
  }

  // Get web push status
  async getPushStatus() {
    try {
      return await webPushService.getStatus()
    } catch (error) {
      console.error('Error getting push status:', error)
      return { success: false, error: error.message }
    }
  }

  // Update push preferences
  async updatePushPreferences(pushEnabled) {
    try {
      const result = await webPushService.updatePreferences(pushEnabled)
      if (result.success) {
        console.log('✅ Push preferences updated')
        return true
      } else {
        console.error('Failed to update push preferences:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error updating push preferences:', error)
      return false
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService
