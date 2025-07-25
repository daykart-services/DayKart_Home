import React, { useState } from 'react';
import { useTheme, useProducts } from '../ThemeContext';
import { useCartLike } from '../CartLikeContext';
import ProductCard from '../ProductCard';
import ProductDetail from '../ProductDetail';
import { Sparkles, TrendingUp, Calendar } from 'lucide-react';

const NewCollectionsPage: React.FC = () => {
  const { isDark } = useTheme();
  const { getProductsByCategory } = useProducts();
  const featuredProducts = getProductsByCategory('new-collections');
  const { like, unlike, isLiked, addToCart } = useCartLike();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newCollections = [
    {
      id: 1,
      name: "Autumn Comfort Collection",
      description: "Warm textures and cozy essentials for the fall season",
      image: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800",
      products: 24,
      launchDate: "October 2024",
      featured: true
    },
    {
      id: 2,
      name: "Minimalist Living",
      description: "Clean lines and functional design for modern homes",
      image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
      products: 18,
      launchDate: "September 2024",
      featured: false
    },
    {
      id: 3,
      name: "Smart Home Essentials",
      description: "Technology-integrated products for the connected home",
      image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800",
      products: 15,
      launchDate: "November 2024",
      featured: true
    }
  ];

  const handleProductClick = (id: number) => {
    const product = featuredProducts.find((p: any) => p.id === id);
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
          <div className="text-center max-w-4xl mx-auto">
            <span className={`text-sm font-medium tracking-wider ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              LATEST ARRIVALS
            </span>
            <h1 className={`text-5xl lg:text-6xl font-light mt-4 mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}
            style={{
              fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
              letterSpacing: '0.02em'
            }}>
              NEW<br/>COLLECTIONS
            </h1>
            <p className={`text-lg mb-8 leading-relaxed max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our latest curated collections featuring innovative designs, 
              premium materials, and cutting-edge functionality for modern living.
            </p>
            <button className={`px-3 py-1.5 font-medium tracking-wider transition-all duration-300 ${
              isDark 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}>
              EXPLORE ALL COLLECTIONS
            </button>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-6">
        <div className="container mx-auto px-2">
          <div className="text-center mb-4">
            <h2 className={`text-3xl font-light mb-2 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Featured Collections
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Carefully curated themes for every lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6">
            {newCollections.map((collection) => (
              <div key={collection.id} className={`group cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
              } rounded-lg overflow-hidden hover:shadow-2xl ${
                collection.featured ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      collection.featured ? 'h-80' : 'h-64'
                    }`}
                  />
                  {collection.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm font-medium rounded flex items-center gap-1">
                        <Sparkles size={14} />
                        FEATURED
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded ${
                      isDark ? 'bg-black/70 text-white' : 'bg-white/90 text-black'
                    }`}>
                      {collection.products} Products
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {collection.launchDate}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    {collection.name}
                  </h3>
                  
                  <p className={`mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {collection.description}
                  </p>
                  
                  <button className={`text-sm font-medium tracking-wider transition-colors ${
                    isDark 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`}>
                    VIEW COLLECTION →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Products Grid */}
      <section className={`py-6 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-2">
          <div className="text-center mb-4">
            <h2 className={`text-3xl font-light mb-2 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Latest Products
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Fresh arrivals from our newest collections
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No new collection products available yet. Check back soon!
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {featuredProducts.map((product: any) => (
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
    </div>
  );
};

export default NewCollectionsPage;