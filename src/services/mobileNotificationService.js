// Mobile-Specific Notification Service
class MobileNotificationService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;
    this.isMobile = this.detectMobile();
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  detectMobile() {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent;
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

  // Enhanced permission request for mobile
  async requestPermission() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    // Check current permission
    if (Notification.permission === "granted") {
      console.log("Notification permission already granted");
      return true;
    }

    if (Notification.permission === "denied") {
      console.log("Notification permission denied");
      return false;
    }

    try {
      console.log('Requesting notification permission on mobile...');
      console.log('User Agent:', navigator.userAgent);
      console.log('Is Mobile:', this.isMobile);
      
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Mobile notification permission granted');
        return true;
      } else {
        console.log('❌ Mobile notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting mobile notification permission:', error);
      return false;
    }
  }

  // Show mobile-optimized notification
  async showNotification(title, options = {}) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      console.log('Cannot show notification - permission not granted');
      return false;
    }

    try {
      const mobileOptions = {
        body: options.body || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: options.tag || 'default',
        requireInteraction: this.isMobile, // Require interaction on mobile
        vibrate: this.isMobile ? [200, 100, 200] : undefined, // Vibration for mobile
        data: {
          url: options.url || '/',
          timestamp: Date.now(),
          ...options.data
        },
        actions: this.isMobile ? [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/icon-72x72.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ] : undefined,
        ...options
      };

      const notification = new Notification(title, mobileOptions);
      
      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        console.log('Mobile notification clicked');
        
        // Focus the window
        if (window.focus) {
          window.focus();
        }
        
        // Navigate to the URL
        if (mobileOptions.data.url) {
          window.location.href = mobileOptions.data.url;
        }
        
        notification.close();
      };

      // Auto-close after 5 seconds on mobile
      if (this.isMobile) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      console.log('✅ Mobile notification shown:', title);
      return true;
    } catch (error) {
      console.error('Error showing mobile notification:', error);
      return false;
    }
  }

  // Test mobile notification
  async testMobileNotification() {
    console.log('Testing mobile notification...');
    console.log('Mobile detected:', this.isMobile);
    console.log('Permission:', Notification.permission);
    
    if (this.isMobile) {
      return await this.showNotification('Mobile Test', {
        body: 'This is a test notification for mobile devices',
        tag: 'mobile-test'
      });
    } else {
      console.log('Not on mobile device');
      return false;
    }
  }

  // Get mobile-specific status
  getMobileStatus() {
    return {
      isSupported: this.isSupported,
      isMobile: this.isMobile,
      permission: this.permission,
      canShow: this.isSupported && this.permission === 'granted',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }
}

export default new MobileNotificationService();
