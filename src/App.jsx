import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { SocketProvider } from './contexts/SocketContext'
import useRealtimeNotifications from './hooks/useRealtimeNotifications'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAUpdateNotification from './components/PWAUpdateNotification'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import CareGuide from './pages/CareGuide'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AddProduct from './pages/AddProduct'
import Dashboard from './pages/Dashboard'

// PWA Service
import pwaService from './services/pwaService'

// Inner component that uses the notification hook
const AppContent = () => {
  // Initialize real-time notifications
  useRealtimeNotifications()

  useEffect(() => {
    // Initialize PWA service
    const initializePWA = async () => {
      try {
        await pwaService.registerServiceWorker()
        console.log('PWA initialized successfully')
      } catch (error) {
        console.error('PWA initialization failed:', error)
      }
    }

    initializePWA()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/care-guide" element={<CareGuide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-product" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddProduct />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* PWA Update Notification */}
      <PWAUpdateNotification />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4a7c59',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

function App() {

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <ProductProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </ProductProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
