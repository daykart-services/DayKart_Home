import React, { useState } from 'react';
import { useTheme, useProducts } from '../ThemeContext';
import { useCartLike } from '../CartLikeContext';
import ProductCard from '../ProductCard';
import ProductDetail from '../ProductDetail';

const BedsPage: React.FC = () => {
  const { isDark } = useTheme();
  const { getProductsByCategory } = useProducts();
  const bedProducts = getProductsByCategory('beds');
  const { like, unlike, isLiked, addToCart } = useCartLike();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (id: number) => {
    const product = bedProducts.find((p: any) => p.id === id);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleLike = (id: number) => {
    isLiked(id) ? unlike(id) : like(id);
  };

  const handleAddToCart = (id: number, quantity: number) => {
    addToCart(id, quantity);
    setIsModalOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-2 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
            <div>
              <span className={`text-sm font-medium tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                SLEEP COLLECTION
              </span>
              <h1 className={`text-5xl lg:text-6xl font-light mt-1 mb-2 leading-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
                letterSpacing: '0.02em'
              }}>
                PREMIUM<br/>BEDS
              </h1>
              <p className={`text-lg mb-2 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your bedroom into a sanctuary of comfort with our curated collection of luxury beds and mattresses.
              </p>
              <button className={`px-3 py-1.5 font-medium tracking-wider transition-all duration-300 ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}>
                EXPLORE COLLECTION
              </button>
            </div>
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}></div>
              <img 
                src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Premium Bed" 
                className="relative z-10 w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-light mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Featured Products
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our most popular beds and sleep essentials
            </p>
          </div>

          {bedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No bed products available yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bedProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.name}
                description={product.description}
                price={`₹${product.price}`}
                onProductClick={handleProductClick}
                onLike={handleLike}
                onAddToCart={(id) => handleAddToCart(id, 1)}
                isLiked={isLiked(product.id)}
              />
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={{
            id: selectedProduct.id,
            title: selectedProduct.name,
            description: selectedProduct.description,
            price: `₹${selectedProduct.price}`,
            images: selectedProduct.images || [selectedProduct.image],
            rating: selectedProduct.rating,
            reviews: selectedProduct.reviews,
            features: selectedProduct.features,
            specifications: selectedProduct.specifications || {},
          }}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          isLiked={isLiked(selectedProduct.id)}
        />
      )}

      {/* Features Section */}
      <section className={`py-6 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-1 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className={`text-xl font-medium mb-1 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Free Delivery
              </h3>
              <p className={`$${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Complimentary white-glove delivery and setup for all bed purchases
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-1 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className={`text-xl font-medium mb-1 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Sleep Trial
              </h3>
              <p className={`$${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                100-night sleep trial with full refund guarantee
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-1 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className={`text-xl font-medium mb-1 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Premium Quality
              </h3>
              <p className={`$${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Handcrafted with the finest materials and attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BedsPage;