import React, { useState } from 'react';
import { useTheme, useProducts } from '../ThemeContext';
import { useCartLike } from '../CartLikeContext';
import ProductCard from '../ProductCard';
import ProductDetail from '../ProductDetail';
import { Droplets, Sparkles, Shield } from 'lucide-react';

const BathwarePage: React.FC = () => {
  const { isDark } = useTheme();
  const { getProductsByCategory } = useProducts();
  const bathwareProducts = getProductsByCategory('bathware');
  const { like, unlike, isLiked, addToCart } = useCartLike();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: Droplets,
      title: "Water Efficient",
      description: "Eco-friendly products that conserve water without compromising performance"
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Luxury materials and finishes that stand the test of time"
    },
    {
      icon: Shield,
      title: "Warranty Protected",
      description: "Comprehensive warranty coverage on all bathroom fixtures"
    }
  ];

  const handleProductClick = (id: number) => {
    const product = bathwareProducts.find((p: any) => p.id === id);
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
                BATHROOM ESSENTIALS
              </span>
              <h1 className={`text-5xl lg:text-6xl font-light mt-1 mb-2 leading-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
              style={{
                fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
                letterSpacing: '0.02em'
              }}>
                LUXURY<br/>BATHWARE
              </h1>
              <p className={`text-lg mb-2 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your bathroom into a personal spa with our premium collection of fixtures and accessories.
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
                src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR8hAE8MYIVlqXbL_UiVGERgmjZ6IrilJF8y2AQ0OFZck1RmhEbmG7zNgis8ul4EwK0Nhqi6TtO57dkJi_ry45uUcYD46Vdx4-PHqF1MKQEuDO9hXcJRa1O6w" 
                alt="Luxury Bathroom" 
                className="relative z-10 w-full h-96 object-cover object-[0_12%] rounded-lg shadow-2xl:none"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  <feature.icon size={24} />
                </div>
                <h3 className={`text-xl font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
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
              Featured Products
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our most popular bathroom essentials
            </p>
          </div>

          {bathwareProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No bathware products available yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bathwareProducts.map((product: any) => (
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

      {/* Installation Service Section */}
      <section className={`py-20 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2 text-center">
          <h2 className={`text-3xl font-light mb-4 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Professional Installation
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our certified technicians provide expert installation services for all bathroom fixtures. 
            Schedule your appointment today and enjoy worry-free setup.
          </p>
          <button className={`px-3 py-1.5 font-medium tracking-wider transition-all duration-300 ${
            isDark 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            BOOK INSTALLATION
          </button>
        </div>
      </section>
    </div>
  );
};

export default BathwarePage;