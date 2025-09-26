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
      return
    }

    // Wait for socket to be connected before joining room
    if (!socket.connected) {
      socket.on('connect', () => {
        joinUserRoom(user._id)
      })
    } else {
      // Join user room for notifications
      joinUserRoom(user._id)
    }

    // Handle incoming notifications
    const handleNotification = (data) => {
      // Extract notification from the data object
      const notification = data.notification
      
      if (!notification) {
        return
      }
      
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

    // Cleanup
    return () => {
      socket.off('new-notification', handleNotification)
      leaveUserRoom(user._id)
    }
  }, [isAuthenticated, user, socket, isConnected])

  // Handle notification permission
  useEffect(() => {
    const requestPermission = async () => {
      if (isAuthenticated) {
        await notificationService.requestPermission()
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
