import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (id && orders.length > 0) {
      const order = orders.find(o => o._id === id)
      if (order) {
        setSelectedOrder(order)
      }
    }
  }, [id, orders])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await apiService.getOrders()
      
      if (response.success) {
        setOrders(response.data.orders || [])
      } else {
        toast.error(response.message || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-purple-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Single order view
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to="/orders"
                className="flex items-center text-primary-600 hover:text-primary-800 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Orders
              </Link>
              <h1 className="text-3xl font-bold text-primary-800">
                Order #{selectedOrder.orderNumber}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusIcon(selectedOrder.status)}
              {getStatusBadge(selectedOrder.status)}
              <span className="text-gray-600">
                {formatDate(selectedOrder.createdAt)}
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-gray-600">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                  <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-snake.svg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Information */}
            {selectedOrder.trackingNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Tracking Information</h3>
                <p className="text-blue-800">Tracking Number: {selectedOrder.trackingNumber}</p>
                {selectedOrder.trackingStatus && (
                  <p className="text-blue-700 mt-1">{selectedOrder.trackingStatus}</p>
                )}
              </div>
            )}

            {/* Admin Notes */}
            {selectedOrder.notes?.admin && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Admin Notes</h3>
                <p className="text-gray-700">{selectedOrder.notes.admin}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Orders list view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-primary-600">
                      ${order.totalAmount?.toFixed(2)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </div>
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn btn-outline flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/catalog" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders