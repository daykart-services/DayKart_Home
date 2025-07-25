import React, { useState } from 'react';
import { useTheme, useProducts } from '../ThemeContext';
import { useCartLike } from '../CartLikeContext';
import ProductCard from '../ProductCard';
import ProductDetail from '../ProductDetail';
import { Home, Users, Zap } from 'lucide-react';

const DormPage: React.FC = () => {
  const { isDark } = useTheme();
  const { getProductsByCategory } = useProducts();
  const dormProducts = getProductsByCategory('dorm');
  const { like, unlike, isLiked, addToCart } = useCartLike();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dormEssentials = [
    {
      icon: Home,
      title: "Space Optimization",
      description: "Smart solutions designed specifically for small dorm rooms"
    },
    {
      icon: Users,
      title: "Roommate Friendly",
      description: "Products that work well in shared living spaces"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Easy assembly and installation for busy students"
    }
  ];

  const handleProductClick = (id: number) => {
    const product = dormProducts.find((p: any) => p.id === id);
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
                STUDENT LIVING
              </span>
              <h1 className={`text-5xl lg:text-6xl font-light mt-1 mb-2 leading-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
                letterSpacing: '0.02em'
              }}>
                DORM<br/>ESSENTIALS
              </h1>
              <p className={`text-lg mb-2 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Everything you need to make your dorm room feel like home. Smart, space-saving solutions for student life.
              </p>
              <button className={`px-3 py-1.5 font-medium tracking-wider transition-all duration-300 ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}>
                SHOP DORM ESSENTIALS
              </button>
            </div>
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}></div>
              <img 
                src="https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Dorm Room Setup" 
                className="relative z-10 w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-light mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Why Choose Our Dorm Collection
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dormEssentials.map((essential, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  <essential.icon size={24} />
                </div>
                <h3 className={`text-xl font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  {essential.title}
                </h3>
                <p className={`${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {essential.description}
                </p>
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
              Dorm Room Must-Haves
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Essential items to maximize your dorm room space and comfort
            </p>
          </div>

          {dormProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No dorm products available yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dormProducts.map((product: any) => (
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

      {/* Student Discount Section */}
      <section className={`py-20 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2 text-center">
          <h2 className={`text-3xl font-light mb-4 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Student Discount Program
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Unlock exclusive student discounts on all dorm essentials. Register with your student email to save more!
          </p>
          <button className={`px-8 py-4 font-medium tracking-wider transition-all duration-300 ${
            isDark 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            REGISTER NOW
          </button>
        </div>
      </section>
    </div>
  );
};

export default DormPage;