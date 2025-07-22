import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import AdminPortal from './pages/AdminPortal';
import { useTheme, useProducts } from './ThemeContext';
import type { Product } from './ThemeContext';
import { useCartLike } from './CartLikeContext';

const ProductGrid: React.FC = () => {
  const { isDark } = useTheme();
  const { like, unlike, isLiked, addToCart } = useCartLike();
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  const handleProductClick = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleLike = (id: number) => {
    if (isLiked(id)) {
      unlike(id);
    } else {
      like(id);
    }
  };

  const handleAddToCart = (id: number, quantity: number = 1) => {
    addToCart(id, quantity);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleProductsUpdate = (updatedProducts: Product[]) => {
    // This function is no longer needed as products are managed by useProducts()
  };

  return (
    <>
      <div id="product-grid" className={`transition-colors border-t-8 ${isDark ? 'bg-black border-black' : 'bg-white border-white'}`}>
        <div className="flex flex-col items-center mb-10 mt-2">
          <h2
            className={`font-bold text-3xl md:text-4xl tracking-wide mb-2 transition-colors ${isDark ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
          >
            Featured Products
          </h2>
          <div className={`h-1 w-16 rounded-full mb-2 transition-colors ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.filter(product => product.featured).map((product) => (
            <div
              key={product.id}
              className={`border-b border-r last:border-r-0 transition-colors ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <ProductCard
                id={product.id}
                image={product.image}
                title={product.name}
                description={product.description}
                price={`₹${product.price}`}
                onProductClick={handleProductClick}
                onLike={handleLike}
                onAddToCart={handleAddToCart}
                isLiked={isLiked(product.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={{
            ...selectedProduct,
            images: selectedProduct.images || [selectedProduct.image],
            specifications: selectedProduct.specifications || {},
          }}
          isOpen={!!selectedProduct}
          onClose={handleCloseDetail}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          isLiked={isLiked(selectedProduct.id)}
        />
      )}

    </>
  );
};

export default ProductGrid;