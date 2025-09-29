import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

// Global connection counter
let connectionCount = 0

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const apiUrl = import.meta.env.VITE_API_URL || 'https://notificationbackend-35f6.onrender.com/api'
    const socketUrl = apiUrl.replace('/api', '')
    
    connectionCount++
    console.log(`🔌 Connecting to socket (attempt #${connectionCount}):`, socketUrl)
    
    const socketInstance = io(socketUrl, {
      transports: ['polling', 'websocket'], // Try polling first on mobile
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      timeout: 20000,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: false,
      // Mobile-specific options
      pingTimeout: 60000,
      pingInterval: 25000
    })

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected successfully')
      console.log('🔌 Socket URL:', socketUrl)
      console.log('🔌 Socket ID:', socketInstance.id)
      console.log('🔌 Transport:', socketInstance.io.engine.transport.name)
      console.log('🔌 User agent:', navigator.userAgent)
      console.log('🔌 Is mobile:', /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      console.log('🔌 Connection time:', new Date().toISOString())
      console.log('🔌 Socket instance:', socketInstance)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error)
      console.error('🔌 Socket URL attempted:', socketUrl)
      console.error('🔌 Error details:', error.message)
      setIsConnected(false)
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔌 Socket reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    socketInstance.on('reconnect_error', (error) => {
      console.error('🔌 Socket reconnection error:', error)
    })

    socketInstance.on('reconnect_failed', () => {
      console.error('🔌 Socket reconnection failed')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.close()
    }
  }, [])

  // Join user room for notifications
  const joinUserRoom = (userId) => {
    if (socket && userId) {
      socket.emit('join-user-room', userId)
    }
  }

  // Leave user room
  const leaveUserRoom = (userId) => {
    if (socket && userId) {
      socket.emit('leave-user-room', userId)
    }
  }

  // Listen for notifications
  const onNotification = (callback) => {
    if (socket) {
      socket.on('notification', callback)
      socket.on('new-notification', callback) // Also listen for new-notification events
    }
  }

  // Remove notification listener
  const offNotification = (callback) => {
    if (socket) {
      socket.off('notification', callback)
      socket.off('new-notification', callback)
    }
  }

  // Listen for order updates
  const onOrderUpdate = (callback) => {
    if (socket) {
      socket.on('order-update', callback)
    }
  }

  // Remove order update listener
  const offOrderUpdate = (callback) => {
    if (socket) {
      socket.off('order-update', callback)
    }
  }

  const value = {
    socket,
    isConnected,
    joinUserRoom,
    leaveUserRoom,
    onNotification,
    offNotification,
    onOrderUpdate,
    offOrderUpdate
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
