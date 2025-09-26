import React, { useState, useEffect } from 'react'
import { Bell, X, AlertCircle, Info, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loadNotifications } = useNotifications()
  const { isAuthenticated } = useAuth()
  const [filter, setFilter] = useState('all')
  const [markingAsRead, setMarkingAsRead] = useState(null)

  // Load notifications when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadNotifications()
    }
  }, [isOpen, isAuthenticated, loadNotifications])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_placed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'order_confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'order_shipped':
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      case 'order_delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'order_cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'product_added':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'stock_low':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_placed':
        return 'bg-green-50 border-green-200'
      case 'order_confirmed':
        return 'bg-blue-50 border-blue-200'
      case 'order_shipped':
        return 'bg-purple-50 border-purple-200'
      case 'order_delivered':
        return 'bg-green-50 border-green-200'
      case 'order_cancelled':
        return 'bg-red-50 border-red-200'
      case 'product_added':
        return 'bg-blue-50 border-blue-200'
      case 'stock_low':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId)
      await markAsRead(notificationId)
      toast.success('✅ Notification marked as read', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      })
    } catch (error) {
      toast.error('Failed to mark notification as read')
    } finally {
      setMarkingAsRead(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success('✅ All notifications marked as read', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      })
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead
    if (filter === 'orders') return notification.type?.includes('order')
    return true
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('orders')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'orders' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    notification.isRead 
                      ? 'bg-white border-gray-200 opacity-75' 
                      : `${getNotificationColor(notification.type)} border-l-4 shadow-sm`
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              disabled={markingAsRead === notification._id}
                              className="text-xs text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {markingAsRead === notification._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Marking...
                                </>
                              ) : (
                                'Mark as read'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      {notification.data?.url && (
                        <a
                          href={notification.data.url}
                          className="text-xs text-primary-600 hover:text-primary-800 mt-2 inline-block"
                        >
                          View details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-sm text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up!" 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            <span>
              {unreadCount} unread
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter