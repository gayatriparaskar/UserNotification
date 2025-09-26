import apiService from './api'

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
      console.log('Notifications not available')
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
      if (this.registration && this.registration.showNotification) {
        await this.registration.showNotification(title, notificationOptions)
      } else {
        const notification = new Notification(title, notificationOptions)
        
        notification.onclick = () => {
          window.focus()
          if (options.url) {
            window.location.href = options.url
          }
          notification.close()
        }
      }

      return true
    } catch (error) {
      console.error('Error showing notification:', error)
      return false
    }
  }

  // Set badge count
  setBadgeCount(count) {
    console.log('Notification Service: Setting badge count to', count)
    
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
          console.log('Notification Service: Native badge set successfully to', count)
        }).catch(error => {
          console.log('Notification Service: Native badge failed:', error)
        })
      } else {
        navigator.clearAppBadge().then(() => {
          console.log('Notification Service: Native badge cleared successfully')
        }).catch(error => {
          console.log('Notification Service: Native badge clear failed:', error)
        })
      }
    } else {
      console.log('Notification Service: Badge API not supported')
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
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService
