import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, GraduationCap, Star } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'

const Home = () => {
  const { getCategories } = useProducts()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const categoriesData = await getCategories()
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [getCategories])

  const featuredProducts = [
    {
      id: 1,
      name: "Ball Python",
      price: 299,
      image: "https://images.unsplash.com/photo-1544966503-7cc4ac81b4d4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 127
    },
    {
      id: 2,
      name: "Corn Snake",
      price: 199,
      image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 203
    },
    {
      id: 3,
      name: "Boa Constrictor",
      price: 599,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89
    }
  ]

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Health Guarantee",
      description: "All snakes come with a 30-day health guarantee"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Safe Shipping",
      description: "Professional overnight shipping with live arrival guarantee"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Expert Support",
      description: "24/7 support from our reptile experts"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Premium Snake Collection
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Discover the world's finest collection of exotic and domestic snakes. 
                Expert care, safe shipping, and lifetime support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalog"
                  className="btn btn-primary inline-flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/care-guide"
                  className="btn btn-secondary inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`card p-4 transform hover:scale-105 transition-all duration-300 ${
                      index === 0 ? 'lg:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-primary-800">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect snake for your experience level
            </p>
          </div>
          
          {loadingCategories ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/catalog?category=${category.name}`}
                  className="category-card group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <span className="text-2xl">🐍</span>
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">
                    {category.displayName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} species
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No categories available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Featured Snakes
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular and highly-rated snakes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-primary w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="btn btn-outline inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Why Choose SnakeShop?
            </h2>
            <p className="text-xl text-gray-600">
              We're passionate about providing the best snake care and support
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Snake?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Browse our extensive collection and find the perfect companion for your reptile journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="btn bg-secondary-500 text-primary-800 hover:bg-secondary-600"
            >
              Browse Catalog
            </Link>
            <Link
              to="/care-guide"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800"
            >
              Care Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
