import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, ArrowLeft, RotateCcw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await apiService.getOrders()
      
      if (response.success) {
        setOrders(response.data.orders)
      } else {
        setError(response.message)
        toast.error(response.message || 'Failed to load orders')
      }
    } catch (error) {
      setError(error.message)
      toast.error(error.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleReorder = (order) => {
    // Add items back to cart
    const cart = JSON.parse(localStorage.getItem('snakeCart')) || []
    order.items.forEach(item => {
      const existingItem = cart.find(cartItem => cartItem.product._id === item.product._id)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        cart.push({
          id: item.product._id,
          name: item.product.name,
          price: item.price,
          image: item.product.images?.[0] || 'https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop',
          quantity: item.quantity
        })
      }
    })
    
    localStorage.setItem('snakeCart', JSON.stringify(cart))
    toast.success('Items added to cart!')
    window.location.href = '/cart'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h1>
            <p className="text-gray-600 mb-8">
              Start shopping to see your orders here!
            </p>
            <Link to="/catalog" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-primary-800">
            Order History
          </h1>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-primary-800">{item.name}</h4>
                        {item.breed && (
                          <p className="text-sm text-gray-600">{item.breed}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-800">
                          ${item.price} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-primary-600" />
                    <span className="font-medium text-primary-800">
                      Tracking: {order.trackingNumber}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.trackingStatus || 'Package in transit'}
                  </p>
                </div>
              )}

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-lg font-bold text-primary-800">
                  Total: ${order.total.toFixed(2)}
                </div>
                <div className="flex gap-3">
                  <button className="btn btn-outline text-sm">
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="btn btn-primary text-sm flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
