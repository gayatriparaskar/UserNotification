import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, Clock } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const { getProductById } = useProducts()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductById(id)
        if (productData) {
          setProduct(productData)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, getProductById])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/catalog" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This product is out of stock')
      return
    }
    addToCart(product)
  }

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist!`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const images = [product.image, product.image, product.image] // In real app, multiple images

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(product.difficulty)}`}>
                  {product.difficulty.charAt(0).toUpperCase() + product.difficulty.slice(1)}
                </span>
                {!product.inStock && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-primary-800 mb-2">
                {product.name}
              </h1>
              
              {product.breed && (
                <p className="text-xl text-gray-600 mb-4">{product.breed}</p>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  ${product.price}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Shield className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-800">Health Guarantee</p>
                  <p className="text-sm text-gray-600">30 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Truck className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-800">Safe Shipping</p>
                  <p className="text-sm text-gray-600">Overnight</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Clock className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-800">Expert Support</p>
                  <p className="text-sm text-gray-600">24/7</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToWishlist}
                className="btn btn-outline flex items-center justify-center"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn btn-primary flex items-center justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                  <Link to="/login" className="font-medium hover:underline">
                    Sign in
                  </Link>{' '}
                  to save items to your wishlist and track orders.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-primary-800 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* In a real app, this would show related products */}
            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop"
                alt="Related Product"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-primary-800 mb-2">Corn Snake</h3>
                <p className="text-2xl font-bold text-primary-600 mb-4">$199</p>
                <Link to="/product/2" className="btn btn-primary w-full text-center">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
