import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useSocket } from '../contexts/SocketContext'
import notificationService from '../services/notificationService'
import toast from 'react-hot-toast'

// Global notification processing flag to prevent duplicates across all instances
let isProcessingNotification = false

const useRealtimeNotifications = () => {
  const { user, isAuthenticated } = useAuth()
  const { addNotification, loadNotifications } = useNotifications()
  const { socket, isConnected, joinUserRoom, leaveUserRoom, onNotification, offNotification } = useSocket()
  
  // Track processed notifications to prevent duplicates
  const processedNotifications = new Set()

  useEffect(() => {
    if (!isAuthenticated || !user || !socket) {
      console.log('🔔 Not setting up notifications - missing requirements:', {
        isAuthenticated,
        hasUser: !!user,
        hasSocket: !!socket
      })
      return
    }

    // Get user ID from either _id or id field
    const userId = user._id || user.id
    if (!userId) {
      console.log('🔔 User ID not found in user object:', user)
      return
    }

    console.log('🔔 Setting up real-time notifications for user:', userId)
    console.log('🔔 Socket object:', socket)
    console.log('🔔 Socket connected:', socket.connected)
    console.log('🔔 Socket ID:', socket.id)

    // Wait for socket to be connected before joining room
    if (!socket.connected) {
      console.log('🔔 Socket not connected, waiting for connection...')
      socket.on('connect', () => {
        console.log('🔔 Socket connected, joining user room')
        joinUserRoom(userId)
      })
    } else {
      console.log('🔔 Socket already connected, joining user room')
      // Join user room for notifications
      joinUserRoom(userId)
    }

    // Handle incoming notifications
    const handleNotification = (data) => {
      console.log('🔔 Received real-time notification:', data)
      console.log('🔔 Data type:', typeof data)
      console.log('🔔 Data keys:', Object.keys(data || {}))
      console.log('🔔 Socket connected:', socket.connected)
      console.log('🔔 Socket ID:', socket.id)
      
      // Check global processing flag
      if (isProcessingNotification) {
        console.log('🔔 Notification already being processed globally, skipping')
        return
      }
      
      // Extract notification from the data object
      const notification = data.notification || data
      
      if (!notification) {
        console.log('🔔 No notification found in data')
        return
      }
      
      // Check if notification was already processed
      const notificationId = notification._id || notification.id
      if (notificationId && processedNotifications.has(notificationId)) {
        console.log('🔔 Notification already processed, skipping:', notificationId)
        return
      }
      
      // Set global processing flag
      isProcessingNotification = true
      
      // Reset flag after 5 seconds as a safety measure
      setTimeout(() => {
        isProcessingNotification = false
      }, 5000)
      
      // Mark as processed
      if (notificationId) {
        processedNotifications.add(notificationId)
      }
      
      console.log('🔔 Processing notification:', notification.title)
      
      // Add to notification context (this will trigger sound)
      addNotification(notification)
      
      // Show browser notification
      if (notificationService.getPermissionStatus && notificationService.getPermissionStatus().canShow) {
        console.log('🔔 Showing browser notification')
        notificationService.showNotification(notification.title, {
          body: notification.message,
          tag: `notification-${notification._id}`,
          data: {
            url: notification.data?.url || '/',
            notificationId: notification._id
          }
        })
      } else {
        console.log('🔔 Browser notifications not available')
      }
      
      // Show toast notification
      toast.success(notification.title, {
        duration: 4000,
        position: 'top-right'
      })
      
      console.log('🔔 Notification processed successfully')
      
      // Reset global processing flag
      isProcessingNotification = false
    }

    // Listen for notifications (backend emits 'new-notification')
    console.log('🔔 Setting up socket event listeners...')
    
    socket.on('new-notification', (data) => {
      console.log('🔔 Received new-notification event:', data)
      handleNotification(data)
    })
    
    // Listen for any socket events for debugging (but don't process notifications twice)
    socket.onAny((eventName, ...args) => {
      if (eventName !== 'new-notification') {
        console.log('🔔 Socket event received:', eventName, args)
      }
    })

    // Cleanup
    return () => {
      socket.off('new-notification', handleNotification)
      leaveUserRoom(userId)
    }
  }, [isAuthenticated, user, socket, isConnected])

  // Handle notification permission and web push subscription
  useEffect(() => {
    const setupNotifications = async () => {
      if (isAuthenticated) {
        try {
          // Request basic notification permission
          const granted = await (notificationService.requestPermission ? notificationService.requestPermission() : Promise.resolve(false))
          if (granted) {
            console.log('🔔 Notification permission granted')
            
            // Subscribe to web push notifications
            const pushSubscribed = await (notificationService.subscribeToPush ? notificationService.subscribeToPush() : Promise.resolve(false))
            if (pushSubscribed) {
              console.log('🔔 Web push subscription successful')
            } else {
              console.log('🔔 Web push subscription failed or not supported')
            }
          } else {
            console.log('🔔 Notification permission denied')
          }
        } catch (error) {
          console.error('🔔 Error setting up notifications:', error)
        }
      }
    }

    setupNotifications()
  }, [isAuthenticated])

  // Load notifications when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Add delay to ensure socket is connected
      const loadTimer = setTimeout(() => {
        loadNotifications()
      }, 2000) // 2 second delay
      
      return () => clearTimeout(loadTimer)
    }
  }, [isAuthenticated, user])

  return {
    isConnected,
    permissionStatus: notificationService.getPermissionStatus ? notificationService.getPermissionStatus() : { status: 'denied', canShow: false }
  }
}

export default useRealtimeNotifications
