import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import apiService from '../services/api'

// Play notification sound
const playNotificationSound = () => {
  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (error) {
    console.log('Could not play notification sound:', error)
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
      return {
        ...state,
        notifications: action.payload,
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
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }
    
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
    
    case 'MARK_ALL_AS_READ':
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

  // Load notifications
  const loadNotifications = async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
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
      // Don't play sound on error, just set error state
      dispatch({ type: 'SET_ERROR', payload: 'Unable to load notifications. Please check your connection.' })
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await apiService.markNotificationAsRead(notificationId)
      if (response.success) {
        dispatch({ type: 'MARK_AS_READ', payload: notificationId })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await apiService.markAllNotificationsAsRead()
      if (response.success) {
        dispatch({ type: 'MARK_ALL_AS_READ' })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Only play sound for new notifications, not on every add
    if (!localStorage.getItem('realtime-notification-sound-played')) {
      playNotificationSound()
      localStorage.setItem('realtime-notification-sound-played', Date.now().toString())
      // Clear the flag after 3 seconds
      setTimeout(() => {
        localStorage.removeItem('realtime-notification-sound-played')
      }, 3000)
    }
  }

  // Load notifications on mount with retry logic
  useEffect(() => {
    if (isAuthenticated) {
      let retryCount = 0
      const maxRetries = 3
      
      const loadWithRetry = async () => {
        try {
          await loadNotifications()
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++
            const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff: 2s, 4s, 8s
            console.log(`Retrying notification load in ${delay}ms (attempt ${retryCount}/${maxRetries})`)
            setTimeout(loadWithRetry, delay)
          } else {
            console.log('Max retries reached for notification loading')
          }
        }
      }
      
      loadWithRetry()
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
