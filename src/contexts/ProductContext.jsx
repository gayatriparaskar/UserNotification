import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import apiService from '../services/api'

const ProductContext = createContext()

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null
      }
    
    case 'SET_FILTER':
      return {
        ...state,
        currentFilter: action.payload,
        loading: true
      }
    
    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
        loading: true
      }
    
    case 'SET_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
        loading: true
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload
      }
    
    default:
      return state
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    loading: false,
    error: null,
    currentFilter: 'all',
    currentCategory: 'all',
    searchQuery: '',
    pagination: null
  })

  // Load products from API
  const loadProducts = useCallback(async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await apiService.getProducts(params)
      
      if (response.success) {
        // Ensure all products have quantity values for stock tracking
        const products = (response.data.products || []).map(product => ({
          ...product,
          quantity: product.quantity !== undefined ? product.quantity : 10, // Default quantity if missing
          stock: product.quantity !== undefined ? product.quantity : 10 // Also set stock for backward compatibility
        }))
        dispatch({ type: 'SET_PRODUCTS', payload: products })
        dispatch({ type: 'SET_PAGINATION', payload: response.data.pagination })
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message })
      }
    } catch (error) {
      console.error('Error loading products:', error)
      // Set empty products array instead of error to allow the app to work
      dispatch({ type: 'SET_PRODUCTS', payload: [] })
      dispatch({ type: 'SET_ERROR', payload: null })
    }
  }, [])

  // Load products on mount and when filters change
  useEffect(() => {
    const params = {}
    
    if (state.searchQuery) {
      params.search = state.searchQuery
    }
    
    if (state.currentCategory !== 'all') {
      params.category = state.currentCategory
    }
    
    if (state.currentFilter !== 'all') {
      params.difficulty = state.currentFilter
    }

    loadProducts(params)
  }, [state.searchQuery, state.currentCategory, state.currentFilter, loadProducts])

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  const setSearch = (query) => {
    dispatch({ type: 'SET_SEARCH', payload: query })
  }

  const setCategory = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category })
  }

  const getProductById = async (id) => {
    try {
      const response = await apiService.getProduct(id)
      if (response.success) {
        return response.data.product
      }
      return null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  const getCategories = useCallback(async () => {
    try {
      const response = await apiService.getProductCategories()
      if (response.success && response.data.categories) {
        return response.data.categories.map(category => ({
          name: category,
          displayName: category.charAt(0).toUpperCase() + category.slice(1),
          count: 0 // We'll need to get this from a separate API call
        }))
      }
      return []
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Return some default categories if API fails
      return [
        { name: 'pythons', displayName: 'Pythons', count: 0 },
        { name: 'boas', displayName: 'Boas', count: 0 },
        { name: 'colubrids', displayName: 'Colubrids', count: 0 },
        { name: 'accessories', displayName: 'Accessories', count: 0 }
      ]
    }
  }, [])

  const value = {
    products: state.products,
    loading: state.loading,
    error: state.error,
    currentFilter: state.currentFilter,
    currentCategory: state.currentCategory,
    searchQuery: state.searchQuery,
    pagination: state.pagination,
    setFilter,
    setSearch,
    setCategory,
    getProductById,
    getCategories,
    loadProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
