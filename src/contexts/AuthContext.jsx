import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import apiService from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      }
    
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('snakeUser')
    const token = localStorage.getItem('snakeAuthToken')
    
    if (savedUser && token) {
      dispatch({ type: 'LOAD_USER', payload: JSON.parse(savedUser) })
    }
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await apiService.login(email, password)
      
      if (response.success) {
        dispatch({ type: 'LOGIN', payload: response.data.user })
        toast.success('Login successful!')
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message })
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error(error.message || 'Login failed')
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await apiService.register({ name, email, password })
      
      if (response.success) {
        dispatch({ type: 'LOGIN', payload: response.data.user })
        toast.success('Registration successful!')
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message })
        toast.error(response.message || 'Registration failed')
        return false
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast.error(error.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    apiService.logout()
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
