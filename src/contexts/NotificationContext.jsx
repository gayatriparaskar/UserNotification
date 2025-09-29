import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import apiService from '../services/api'

// Play notification sound
const playNotificationSound = () => {
  try {
    console.log('🔔 Playing notification sound...')
    console.log('🔔 Window object available:', typeof window !== 'undefined')
    console.log('🔔 AudioContext available:', typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined')
    console.log('🔔 User agent:', navigator.userAgent)
    console.log('🔔 Is mobile:', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    
    // Check if audio context is suspended and resume if needed
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    console.log('🔔 Audio context created, state:', audioContext.state)
    
    if (audioContext.state === 'suspended') {
      console.log('🔔 Audio context suspended, trying to resume...')
      // Try to resume the audio context (requires user interaction)
      audioContext.resume().then(() => {
        console.log('🔔 Audio context resumed successfully')
        playSound(audioContext)
      }).catch((error) => {
        console.log('🔔 Audio context could not be resumed - user interaction required:', error)
        // Try to play sound anyway
        playSound(audioContext)
      })
    } else {
      console.log('🔔 Audio context ready, playing sound...')
      playSound(audioContext)
    }
  } catch (error) {
    console.log('🔔 Could not play notification sound:', error)
    console.log('🔔 Error details:', error.message)
  }
}

// Helper function to actually play the sound
const playSound = (audioContext) => {
  try {
    console.log('🔔 Playing notification sound...')
    console.log('🔔 Audio context state:', audioContext.state)
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Create a pleasant notification sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
    
    console.log('🔔 Notification sound played successfully')
  } catch (error) {
    console.log('🔔 Could not play sound:', error)
    console.log('🔔 Sound error details:', error.message)
  }
}

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_NOTIFICATIONS':
      const unreadCount = action.payload.filter(n => !n.isRead).length
      
      // Update app badge with initial unread count
      try {
        if (unreadCount > 0) {
          notificationService.setBadgeCount(unreadCount)
        } else {
          notificationService.clearBadge()
        }
        console.log('🔔 Initial app badge set to:', unreadCount)
      } catch (error) {
        console.error('🔔 Error setting initial app badge:', error)
      }
      
      return {
        ...state,
        notifications: action.payload,
        unreadCount,
        loading: false,
        error: null
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'ADD_NOTIFICATION':
      const newUnreadCount = state.unreadCount + 1
      console.log('🔔 Adding notification, new unread count:', newUnreadCount)
      
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: newUnreadCount
      }
    
    case 'MARK_AS_READ':
      const updatedUnreadCount = Math.max(0, state.unreadCount - 1)
      
      // Update app badge when notification is marked as read
      try {
        if (updatedUnreadCount > 0) {
          notificationService.setBadgeCount(updatedUnreadCount)
        } else {
          notificationService.clearBadge()
        }
        console.log('🔔 App badge updated to:', updatedUnreadCount)
      } catch (error) {
        console.error('🔔 Error updating app badge:', error)
      }
      
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        ),
        unreadCount: updatedUnreadCount
      }
    
    case 'MARK_ALL_AS_READ':
      // Clear app badge when all notifications are marked as read
      try {
        notificationService.clearBadge()
        console.log('🔔 App badge cleared - all notifications read')
      } catch (error) {
        console.error('🔔 Error clearing app badge:', error)
      }
      
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        })),
        unreadCount: 0
      }
    
    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload
      }
    
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0
  })

  // Load notifications with retry logic
  const loadNotifications = async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null }) // Clear previous errors
      
      const response = await apiService.getNotifications(params)
      
      if (response.success) {
        const notifications = response.data.notifications || []
        const unreadCount = response.data.unreadCount || 0
        
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications })
        dispatch({ type: 'SET_UNREAD_COUNT', payload: unreadCount })
        
        // Only play sound if there are unread notifications AND we haven't played recently
        if (unreadCount > 0 && !localStorage.getItem('notification-sound-played')) {
          playNotificationSound()
          localStorage.setItem('notification-sound-played', Date.now().toString())
          // Clear the flag after 5 seconds
          setTimeout(() => {
            localStorage.removeItem('notification-sound-played')
          }, 5000)
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message })
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      
      // Handle different error types
      let errorMessage = 'Unable to load notifications. Please check your connection.'
      
      if (error.message.includes('timeout')) {
        errorMessage = 'Server is taking too long to respond. Please try again.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.'
      } else if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        errorMessage = 'Server is overloaded. Please try again later.'
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // Optimistically update UI first
      dispatch({ type: 'MARK_AS_READ', payload: notificationId })
      
      // Then try to update on server
      try {
        const response = await apiService.markNotificationAsRead(notificationId)
        if (!response.success) {
          // Revert if server update failed
          console.warn('Server update failed, but UI updated locally')
        }
      } catch (serverError) {
        // Server error, but UI already updated
        console.warn('Server error marking as read, but UI updated locally:', serverError.message)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Don't show error to user for read operations
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await apiService.markAllNotificationsAsRead()
      if (response.success) {
        dispatch({ type: 'MARK_ALL_AS_READ' })
        
        // Clear app badge when all notifications are read
        try {
          notificationService.clearBadge()
          console.log('🔔 App badge cleared - all notifications read')
        } catch (error) {
          console.error('🔔 Error clearing app badge:', error)
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    console.log('🔔 Adding new notification:', notification.title)
    console.log('🔔 Notification data:', notification)
    console.log('🔔 Current unread count:', state.unreadCount)
    console.log('🔔 Notification ID:', notification._id || notification.id)
    console.log('🔔 Notification type:', notification.type)
    
    // Check if notification already exists to prevent duplicates
    const notificationId = notification._id || notification.id
    const exists = state.notifications.some(n => 
      (n._id || n.id) === notificationId
    )
    
    if (exists) {
      console.log('🔔 Notification already exists, skipping:', notificationId)
      return
    }
    
    console.log('🔔 Dispatching ADD_NOTIFICATION action')
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Always play sound for new real-time notifications
    console.log('🔔 Calling playNotificationSound...')
    try {
      playNotificationSound()
      console.log('🔔 Sound function called successfully')
    } catch (error) {
      console.error('🔔 Error calling sound function:', error)
    }
    
    // Update badge count
    const newUnreadCount = state.unreadCount + 1
    console.log('🔔 New unread count:', newUnreadCount)
    
    // Update app badge
    try {
      notificationService.setBadgeCount(newUnreadCount)
      console.log('🔔 App badge updated to:', newUnreadCount)
    } catch (error) {
      console.error('🔔 Error updating app badge:', error)
    }
  }

  // Load notifications on mount with retry logic
  useEffect(() => {
    if (isAuthenticated) {
      let retryCount = 0
      const maxRetries = 2 // Reduced retries
      
      const loadWithRetry = async () => {
        try {
          await loadNotifications()
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++
            const delay = Math.pow(2, retryCount) * 2000 // Exponential backoff: 2s, 4s
            console.log(`Retrying notification load in ${delay}ms (attempt ${retryCount}/${maxRetries})`)
            setTimeout(loadWithRetry, delay)
          } else {
            console.log('Max retries reached for notification loading')
            // Don't show error for initial load failures
            dispatch({ type: 'SET_ERROR', payload: null })
          }
        }
      }
      
      // Add small delay before first load
      setTimeout(loadWithRetry, 1000)
    }
  }, [isAuthenticated])

  const value = {
    notifications: state.notifications,
    loading: state.loading,
    error: state.error,
    unreadCount: state.unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    isOnline: !state.error || !state.error.includes('Unable to load notifications')
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
