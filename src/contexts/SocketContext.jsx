import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const socketUrl = apiUrl.replace('/api', '')
    console.log('🔔 Socket connecting to:', socketUrl)
    console.log('🔔 VITE_API_URL:', import.meta.env.VITE_API_URL)
    console.log('🔔 Processed socket URL:', socketUrl)
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    })

    socketInstance.on('connect', () => {
      console.log('🔔 Socket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('🔔 Socket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('🔔 Socket connection error:', error)
      console.error('🔔 Error details:', error.message)
      setIsConnected(false)
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔔 Socket reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    socketInstance.on('reconnect_error', (error) => {
      console.error('🔔 Socket reconnection error:', error)
    })

    socketInstance.on('reconnect_failed', () => {
      console.error('🔔 Socket reconnection failed')
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
      console.log('🔔 Joining user room for:', userId)
      socket.emit('join-user-room', userId)
      console.log('🔔 Joined user room for:', userId)
    } else {
      console.log('🔔 Cannot join room - socket:', !!socket, 'userId:', userId)
    }
  }

  // Manual connection test
  const testConnection = () => {
    if (socket) {
      console.log('🔔 Testing socket connection...')
      socket.emit('test-connection', { message: 'Hello from frontend' })
    } else {
      console.log('🔔 No socket available for testing')
    }
  }

  // Leave user room
  const leaveUserRoom = (userId) => {
    if (socket && userId) {
      socket.emit('leave-user-room', userId)
      console.log('Left user room for:', userId)
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
    offOrderUpdate,
    testConnection
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
