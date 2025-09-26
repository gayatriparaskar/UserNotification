import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useSocket } from '../contexts/SocketContext'
import notificationService from '../services/notificationService'
import toast from 'react-hot-toast'

const useRealtimeNotifications = () => {
  const { user, isAuthenticated } = useAuth()
  const { addNotification, loadNotifications } = useNotifications()
  const { socket, isConnected, joinUserRoom, leaveUserRoom, onNotification, offNotification } = useSocket()

  useEffect(() => {
    if (!isAuthenticated || !user || !socket) {
      console.log('🔔 useRealtimeNotifications: Missing requirements', { isAuthenticated, user: !!user, socket: !!socket })
      return
    }

    console.log('🔔 useRealtimeNotifications: Setting up notifications for user:', user._id)
    console.log('🔔 useRealtimeNotifications: Socket connected:', socket.connected)
    console.log('🔔 useRealtimeNotifications: Socket ID:', socket.id)
    
    // Wait for socket to be connected before joining room
    if (!socket.connected) {
      console.log('🔔 useRealtimeNotifications: Socket not connected, waiting...')
      socket.on('connect', () => {
        console.log('🔔 useRealtimeNotifications: Socket connected, joining room')
        joinUserRoom(user._id)
      })
    } else {
      // Join user room for notifications
      console.log('🔔 useRealtimeNotifications: Socket already connected, joining room')
      joinUserRoom(user._id)
    }

    // Handle incoming notifications
    const handleNotification = (data) => {
      console.log('🔔 Received notification data:', data)
      
      // Extract notification from the data object
      const notification = data.notification
      const unreadCount = data.unreadCount
      
      if (!notification) {
        console.error('🔔 No notification found in data:', data)
        return
      }
      
      console.log('🔔 Adding notification to context:', notification)
      // Add to notification context (this will trigger sound)
      addNotification(notification)
      
      // Show browser notification
      if (notificationService.getPermissionStatus().canShow) {
        notificationService.showNotification(notification.title, {
          body: notification.message,
          tag: `notification-${notification._id}`,
          data: {
            url: notification.data?.url || '/',
            notificationId: notification._id
          }
        })
      }
      
      // Show toast notification
      toast.success(notification.title, {
        duration: 4000,
        position: 'top-right'
      })
    }

    // Listen for notifications (backend emits 'new-notification')
    socket.on('new-notification', handleNotification)
    
    // Also listen for other possible event names for debugging
    socket.on('notification', handleNotification)
    socket.on('order-notification', handleNotification)
    
    console.log('🔔 useRealtimeNotifications: Event listeners attached for user:', user._id)

    // Cleanup
    return () => {
      socket.off('new-notification', handleNotification)
      socket.off('notification', handleNotification)
      socket.off('order-notification', handleNotification)
      leaveUserRoom(user._id)
    }
  }, [isAuthenticated, user, socket, isConnected])

  // Handle notification permission
  useEffect(() => {
    const requestPermission = async () => {
      if (isAuthenticated) {
        const granted = await notificationService.requestPermission()
        if (granted) {
          console.log('Notification permission granted')
        } else {
          console.log('Notification permission denied')
        }
      }
    }

    requestPermission()
  }, [isAuthenticated])

  // Load notifications when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications()
    }
  }, [isAuthenticated, user])

  return {
    isConnected,
    permissionStatus: notificationService.getPermissionStatus()
  }
}

export default useRealtimeNotifications
