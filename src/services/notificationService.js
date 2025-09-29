// Enhanced Notification Service for PWA
class NotificationService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.registration = null;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported || typeof window === 'undefined') {
      console.log('Notifications are not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  async subscribeToPush() {
    if (!this.isSupported || this.permission !== 'granted' || typeof window === 'undefined') {
      console.log('Notifications not supported or permission not granted');
      return null;
    }

    try {
      // Get service worker registration
      this.registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push notifications
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI8F7V7jz0swbINB6FUrr7g8cWf3u8u3BqH7yQf4QvY4nF3U8X9Y2Z1A='
        )
      });

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush() {
    if (!this.registration) {
      console.log('No active registration found');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Successfully unsubscribed from push notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  // Show local notification
  async showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted' || typeof window === 'undefined') {
      console.log('Cannot show notification - not supported or permission denied');
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Check if push notifications are supported
  isPushSupported() {
    return this.isSupported && typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Get current subscription
  async getSubscription() {
    if (typeof window === 'undefined' || !this.registration) {
      if (typeof window !== 'undefined') {
        this.registration = await navigator.serviceWorker.ready;
      } else {
        return null;
      }
    }
    return await this.registration.pushManager.getSubscription();
  }

  // Convert VAPID key to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Test notification
  async testNotification() {
    return await this.showNotification('SnacksShop Test', {
      body: 'This is a test notification from SnacksShop!',
      tag: 'test-notification'
    });
  }

  // Get current permission status
  getPermissionStatus() {
    if (!this.isSupported) {
      return { status: 'denied', canShow: false };
    }
    return { 
      status: this.permission, 
      canShow: this.permission === 'granted' 
    };
  }
}

export default new NotificationService();