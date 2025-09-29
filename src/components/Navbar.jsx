import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X, Bell, Download, Settings } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { usePWA } from '../hooks/usePWA'
import NotificationCenter from './NotificationCenter'
import notificationService from '../services/notificationService'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { unreadCount } = useNotifications()
  const { isInstallable, isInstalled, install } = usePWA()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/care-guide', label: 'Care Guide' },
    { path: '/orders', label: 'Orders' }
  ]

  // Add admin link if user is admin
  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Admin' })
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleRequestNotificationPermission = async () => {
    try {
      const granted = await notificationService.requestPermission()
      if (granted) {
        console.log('Notification permission granted')
      } else {
        console.log('Notification permission denied')
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  return (
    <nav className="bg-gradient-primary text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-primary-800 font-bold text-lg">🍟</span>
            </div>
            <span className="text-xl font-bold">SnacksShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search snacks, brands, accessories..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors group"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold animate-pulse shadow-lg px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {Notification.permission === 'denied' && (
                  <button 
                    onClick={handleRequestNotificationPermission}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                    title="Enable notifications"
                  >
                    <Settings className="h-6 w-6" />
                  </button>
                )}
              </>
            )}

            {/* Wishlist */}
            <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <Heart className="h-6 w-6" />
              <span className="badge">0</span>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="badge">{getTotalItems()}</span>
              )}
            </Link>

            {/* PWA Install Button */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                title="Install App"
              >
                <Download className="h-6 w-6" />
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              >
                <User className="h-6 w-6" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Welcome, {user.name}
                      </div>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path) 
                      ? 'bg-secondary-500 text-primary-800' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </nav>
  )
}

export default Navbar
