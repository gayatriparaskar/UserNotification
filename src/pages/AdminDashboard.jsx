import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, DollarSign, TrendingUp, Eye, Plus, Check, X, Settings, Bell, AlertCircle, Package, ShoppingCart, UserCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useSocket } from '../contexts/SocketContext'
import NotificationTest from '../components/NotificationTest'
import NotificationTestButton from '../components/NotificationTestButton'
import apiService from '../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { unreadCount, loadNotifications } = useNotifications()
  const { socket, isConnected } = useSocket()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  // Test notification function
  const testNotification = async () => {
    try {
      console.log('🔔 Testing notification...')
      console.log('🔔 Socket connected:', isConnected)
      console.log('🔔 Socket ID:', socket?.id)
      
      // Test browser notification
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          const notification = new Notification('🔔 Test Notification', {
            body: 'This is a test notification from SnacksShop Admin',
            icon: '/logo192.png',
            tag: 'test-notification'
          })
          
          notification.onclick = () => {
            console.log('🔔 Test notification clicked')
            notification.close()
          }
          
          setTimeout(() => notification.close(), 5000)
          toast.success('🔔 Test notification sent!')
        } else {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            testNotification() // Retry after permission granted
          } else {
            toast.error('Notification permission denied')
          }
        }
      } else {
        toast.error('Notifications not supported in this browser')
      }
    } catch (error) {
      console.error('🔔 Test notification error:', error)
      toast.error('Failed to send test notification')
    }
  }

  // Refresh notifications function
  const refreshNotifications = async () => {
    try {
      toast.loading('Refreshing notifications...', { id: 'refresh' })
      await loadNotifications()
      toast.success('Notifications refreshed!', { id: 'refresh' })
    } catch (error) {
      console.error('Error refreshing notifications:', error)
      toast.error('Failed to refresh notifications', { id: 'refresh' })
    }
  }

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      window.location.href = '/'
    }
  }, [isAuthenticated, isAdmin])

  // Load data
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadDashboardData()
    }
  }, [isAuthenticated, isAdmin])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load orders
      const ordersResponse = await apiService.getOrders({ limit: 10 })
      if (ordersResponse.success) {
        setOrders(ordersResponse.data.orders || [])
      }

      // Load users
      const usersResponse = await apiService.getUsers({ limit: 10 })
      if (usersResponse.success) {
        setUsers(usersResponse.data.users || [])
      }

      // Load products
      const productsResponse = await apiService.getProducts({ limit: 10 })
      if (productsResponse.success) {
        setProducts(productsResponse.data.products || [])
      }

      // Calculate stats
      const ordersData = ordersResponse.success ? ordersResponse.data.orders || [] : []
      const usersData = usersResponse.success ? usersResponse.data.users || [] : []
      const productsData = productsResponse.success ? productsResponse.data.products || [] : []

      setStats({
        totalOrders: ordersData.length,
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        pendingOrders: ordersData.filter(order => order.status === 'pending').length,
        completedOrders: ordersData.filter(order => order.status === 'delivered').length
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderStatusUpdate = async (orderId, status, trackingNumber = '', notes = '') => {
    try {
      const response = await apiService.updateOrderStatus(orderId, status, trackingNumber, notes)
      if (response.success) {
        toast.success(`Order ${status} successfully!`)
        loadDashboardData() // Reload data
        setShowStatusModal(false)
        setShowRejectModal(false)
      } else {
        toast.error(response.message || 'Failed to update order status')
      }
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getStatusBadge = (status) => {
    const configs = {
      pending: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Confirmed', class: 'bg-blue-100 text-blue-800' },
      processing: { text: 'Processing', class: 'bg-purple-100 text-purple-800' },
      shipped: { text: 'Shipped', class: 'bg-indigo-100 text-indigo-800' },
      delivered: { text: 'Delivered', class: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-800' }
    }
    const config = configs[status] || { text: status, class: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>{config.text}</span>
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> }
  ]

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your snacks shop platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshNotifications}
              className="btn btn-outline inline-flex items-center"
            >
              <Bell className="h-5 w-5 mr-2" />
              Refresh Notifications
            </button>
            <button
              onClick={testNotification}
              className="btn btn-secondary inline-flex items-center"
            >
              <Bell className="h-5 w-5 mr-2" />
              Test Notification
            </button>
            <Link
              to="/admin/add-product"
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
            <button
              className="relative btn btn-outline hover:bg-gray-50 transition-colors"
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold animate-pulse shadow-lg px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customer?.name || 'Unknown Customer'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">${order.totalAmount}</span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600">{order.customer?.name || 'Unknown Customer'}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">${order.totalAmount}</span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setNewStatus('confirmed')
                                setShowStatusModal(true)
                              }}
                              className="btn btn-sm btn-primary"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowRejectModal(true)
                              }}
                              className="btn btn-sm btn-outline text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setNewStatus('processing')
                              setShowStatusModal(true)
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Process
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setNewStatus('shipped')
                              setShowStatusModal(true)
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Ship
                          </button>
                        )}
                        <Link
                          to={`/orders/${order._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Users</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No users found</p>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Products</h3>
              <Link
                to="/admin/add-product"
                className="btn btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={product.images?.[0] || '/placeholder-snake.svg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">${product.price}</p>
                          <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Link
                          to={`/product/${product._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No products found</p>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationTestButton />
            <NotificationTest />
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Order Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {newStatus === 'shipped' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter admin notes"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOrderStatusUpdate(selectedOrder._id, newStatus, trackingNumber, adminNotes)}
                  className="btn btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Order Modal */}
        {showRejectModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Order
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter rejection reason"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'cancelled', '', rejectReason)}
                  className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                >
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
