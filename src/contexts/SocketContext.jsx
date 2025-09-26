import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const apiUrl = import.meta.env.VITE_API_URL || 'https://notificationbackend-35f6.onrender.com/api'
    const socketUrl = apiUrl.replace('/api', '')
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      setIsConnected(false)
    })

    socketInstance.on('reconnect', () => {
      setIsConnected(true)
    })

    socketInstance.on('reconnect_error', () => {
      // Handle reconnection error silently
    })

    socketInstance.on('reconnect_failed', () => {
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
    }
  }

  // Remove notification listener
  const offNotification = (callback) => {
    if (socket) {
      socket.off('notification', callback)
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
