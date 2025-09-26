import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useSocket } from '../contexts/SocketContext'
import apiService from '../services/api'

const NotificationTest = () => {
  const { isAuthenticated, user } = useAuth()
  const { unreadCount, notifications } = useNotifications()
  const { socket, isConnected, testConnection } = useSocket()
  const [testResult, setTestResult] = useState('')

  const testSocketConnection = () => {
    testConnection()
    setTestResult(`Socket connected: ${isConnected}, ID: ${socket?.id}`)
  }

  const testSound = () => {
    try {
      // Test the sound function directly
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
      
      setTestResult('Sound test played successfully')
    } catch (error) {
      setTestResult(`Sound test error: ${error.message}`)
    }
  }

  const testLoadNotifications = async () => {
    try {
      const { loadNotifications } = useNotifications()
      await loadNotifications()
      setTestResult('Notifications loaded - should play sound if unread')
    } catch (error) {
      setTestResult(`Load notifications error: ${error.message}`)
    }
  }

  const testNotification = async () => {
    try {
      const response = await apiService.request('/notifications/test', {
        method: 'POST'
      })
      setTestResult(`Test notification sent: ${JSON.stringify(response)}`)
    } catch (error) {
      setTestResult(`Test notification error: ${error.message}`)
    }
  }

  const testOrder = async () => {
    try {
      // Create a test order to trigger real notification
      const orderData = {
        items: [
          {
            product: '507f1f77bcf86cd799439011', // Use a real product ID
            quantity: 1,
            price: 10.99
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        totalAmount: 10.99
      }
      
      const response = await apiService.createOrder(orderData)
      setTestResult(`Order created: ${JSON.stringify(response)}`)
    } catch (error) {
      setTestResult(`Order error: ${error.message}`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: 'white', 
        border: '1px solid #ccc', 
        padding: '10px', 
        zIndex: 9999,
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <h4>🔔 Notification Test</h4>
        <p>Please login to test notifications</p>
      </div>
    )
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto'
    }}>
      <h4>🔔 Notification Test</h4>
      <p><strong>User:</strong> {user?.name} (ID: {user?._id})</p>
      <p><strong>Unread Count:</strong> {unreadCount}</p>
      <p><strong>Notifications:</strong> {notifications?.length || 0}</p>
      <p><strong>Socket Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
      <p><strong>Socket ID:</strong> {socket?.id || 'None'}</p>
      <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL}</p>
      
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button onClick={testSocketConnection} style={{ padding: '5px' }}>
          Test Socket
        </button>
        <button onClick={testSound} style={{ padding: '5px' }}>
          Test Sound
        </button>
        <button onClick={testLoadNotifications} style={{ padding: '5px' }}>
          Load Notifications
        </button>
        <button onClick={testNotification} style={{ padding: '5px' }}>
          Test Notification
        </button>
        <button onClick={testOrder} style={{ padding: '5px' }}>
          Test Order
        </button>
      </div>
      
      {testResult && (
        <div style={{ marginTop: '10px', background: '#f5f5f5', padding: '5px', fontSize: '10px' }}>
          <strong>Result:</strong>
          <pre>{testResult}</pre>
        </div>
      )}
    </div>
  )
}

export default NotificationTest
