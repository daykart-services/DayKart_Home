import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useUser } from './ThemeContext';
import { useProducts } from './ThemeContext';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  images: string[];
  rating: number;
  reviews: number;
  features: string[];
  specifications: { [key: string]: string };
}

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: number) => void;
  onAddToCart: (id: number, quantity: number) => void;
  isLiked: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  isOpen,
  onClose,
  onLike,
  onAddToCart,
  isLiked
}) => {
  const { isDark } = useTheme();
  const { isAdmin } = useUser();
  const { updateProduct } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [editStock, setEditStock] = useState(false);
  const [stock, setStock] = useState(product.specifications?.Stock ? Number(product.specifications.Stock) : 0);
  const [showStockSuccess, setShowStockSuccess] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleLike = () => {
    onLike(product.id);
  };

  const handleStockSave = () => {
    updateProduct(product.id, {
      specifications: {
        ...product.specifications,
        Stock: String(stock)
      }
    });
    setEditStock(false);
    setShowStockSuccess(true);
    setTimeout(() => setShowStockSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-blue-500'
                      : isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className={`text-3xl font-light tracking-wide mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({product.reviews} reviews)
                </span>
              </div>

              <p className={`text-2xl font-light tracking-wider mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {product.price}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Description
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {product.description}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className={`text-sm flex items-start gap-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Quantity:</span>
                <div className={`flex items-center rounded-lg px-2 py-1 
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-100 border border-gray-300'
                  }`}> 
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className={`p-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={`px-4 py-2 min-w-[3rem] text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className={`p-2 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Available Stock:</span>
                <span className={`px-3 py-1 rounded-lg font-semibold text-xs
                  ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}>{product.specifications?.Stock || 0}</span>
              </div>
            </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-lg border transition-colors ${
                    isLiked
                      ? 'bg-red-500 text-white border-red-500'
                      : isDark
                        ? 'border-gray-700 text-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500'
                        : 'border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-green-700">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Truck size={20} className="text-blue-500" />
                <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Free Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-green-500" />
                <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Premium Quality
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={20} className="text-orange-500" />
                <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  No Returns Possible
                </span>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Specifications
              </h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {key}:
                    </span>
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;