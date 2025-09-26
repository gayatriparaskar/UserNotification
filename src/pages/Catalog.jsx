import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import ProductCard from '../components/ProductCard'

const Catalog = () => {
  const { products, loading, error, currentFilter, currentCategory, setFilter, setSearch, setCategory } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const difficultyFilters = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'chips', label: 'Chips' },
    { value: 'crackers', label: 'Crackers' },
    { value: 'nuts', label: 'Nuts' },
    { value: 'cookies', label: 'Cookies' },
    { value: 'accessories', label: 'Accessories' }
  ]

  useEffect(() => {
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')

    if (category) setCategory(category)
    if (difficulty) setFilter(difficulty)
    if (search) {
      setSearchQuery(search)
      setSearch(search)
    }
  }, [searchParams, setCategory, setFilter, setSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchQuery)
    setSearchParams({ search: searchQuery })
  }

  const handleFilterChange = (filter) => {
    setFilter(filter)
    setSearchParams({ difficulty: filter })
  }

  const handleCategoryChange = (category) => {
    setCategory(category)
    setSearchParams({ category })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            Snacks Catalog
          </h1>
          <p className="text-xl text-gray-600">
            Discover our premium collection of snacks and accessories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search snacks, brands, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center justify-center lg:hidden"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {(showFilters || window.innerWidth >= 1024) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {difficultyFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => handleFilterChange(filter.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        currentFilter === filter.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        currentCategory === category.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading products...' : `Showing ${products.length} products`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Error loading products
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🍟</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products available
            </h3>
            <p className="text-gray-600 mb-6">
              We're working on adding more snacks to our collection. Check back soon!
            </p>
            <Link to="/care-guide" className="btn btn-primary">
              Learn About Snacks
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
