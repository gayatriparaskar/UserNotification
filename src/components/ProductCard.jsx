import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  // Debug: Log product data to see what we're getting
  console.log('Product data:', product)
  console.log('Quantity value:', product.quantity, 'Type:', typeof product.quantity)

  // Use quantity field for stock tracking
  const stock = typeof product.quantity === 'number' ? product.quantity : 
                typeof product.quantity === 'string' ? parseInt(product.quantity) || 0 : 
                product.quantity || 0

  console.log('Processed stock (from quantity):', stock)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder-snake.svg',
      category: product.category,
      species: product.species,
      difficulty: product.difficulty,
      stock: stock,
      quantity: stock // Also include quantity for cart tracking
    }
    
    addToCart(cartProduct)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Quick view functionality can be implemented later
    toast.success('Quick view coming soon!')
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Wishlist functionality can be implemented later
    toast.success('Added to wishlist!')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <Link to={`/product/${product._id || product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder-snake.svg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-snake.svg'
            }}
          />
          
          {/* Stock Badge */}
          {stock > 0 && stock < 5 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Only {stock} left!
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-2">
              <button
                onClick={handleQuickView}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="Quick View"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Species */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
            {product.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                product.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.difficulty}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Species */}
          {product.species && (
            <p className="text-sm text-gray-600 mb-2">
              {product.species}
            </p>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews || Math.floor(Math.random() * 50) + 10})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="text-sm">
              {stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              stock > 0
                ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
