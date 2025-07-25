import React, { useState } from 'react';
import { useTheme, useProducts } from '../ThemeContext';
import { useCartLike } from '../CartLikeContext';
import ProductCard from '../ProductCard';
import ProductDetail from '../ProductDetail';
import { Pen, BookOpen, Palette } from 'lucide-react';

const StationaryPage: React.FC = () => {
  const { isDark } = useTheme();
  const { getProductsByCategory } = useProducts();
  const stationaryProducts = getProductsByCategory('stationary');
  const { like, unlike, isLiked, addToCart } = useCartLike();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { name: "Writing", icon: Pen, count: 45 },
    { name: "Notebooks", icon: BookOpen, count: 32 },
    { name: "Art Supplies", icon: Palette, count: 28 }
  ];

  const handleProductClick = (id: number) => {
    const product = stationaryProducts.find((p: any) => p.id === id);
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
                CREATIVE ESSENTIALS
              </span>
              <h1 className={`text-5xl lg:text-6xl font-light mt-1 mb-2 leading-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
                letterSpacing: '0.02em'
              }}>
                PREMIUM<br/>STATIONARY
              </h1>
              <p className={`text-lg mb-2 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Elevate your writing experience with our curated collection of luxury stationary and desk accessories.
              </p>
              <button className={`px-3 py-1.5 font-medium tracking-wider transition-all duration-300 ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}>
                SHOP COLLECTION
              </button>
            </div>
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}></div>
              <img 
                src="https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Premium Stationary" 
                className="relative z-10 w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={`py-16 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2">
          <h2 className={`text-3xl font-light text-center mb-12 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className={`group cursor-pointer p-8 rounded-lg transition-all duration-300 ${
                isDark ? 'bg-black hover:bg-gray-800' : 'bg-white hover:bg-gray-100'
              } shadow-lg hover:shadow-xl`}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? 'bg-white text-black group-hover:bg-gray-200' : 'bg-black text-white group-hover:bg-gray-800'
                  }`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {category.count} products
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-2">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-light mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Featured Products
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our most popular stationary items
            </p>
          </div>

          {stationaryProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No stationary products available yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stationaryProducts.map((product: any) => (
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

      {/* Newsletter Section */}
      <section className={`py-20 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2 text-center">
          <h2 className={`text-3xl font-light mb-4 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Stay Inspired
          </h2>
          <p className={`text-lg mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get the latest updates on new arrivals and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-0 overflow-hidden rounded-lg">
            <input 
              type="email" 
              placeholder="Enter your email"
              className={`flex-1 px-6 py-4 outline-none ${
                isDark ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            />
            <button className={`px-6 py-4 font-medium transition-all duration-300 ${
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StationaryPage;