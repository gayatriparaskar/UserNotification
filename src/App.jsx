import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'

// Components
import Navbar from './components/Navbar'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAUpdateNotification from './components/PWAUpdateNotification'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import CareGuide from './pages/CareGuide'
import Login from './pages/Login'
import Register from './pages/Register'

// PWA Service
import pwaService from './services/pwaService'

function App() {
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
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/care-guide" element={<CareGuide />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
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
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
