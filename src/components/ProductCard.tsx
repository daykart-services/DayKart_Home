import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
  onProductClick: (id: number) => void;
  onLike: (id: number) => void;
  onAddToCart: (id: number) => void;
  isLiked: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  image, 
  title, 
  description, 
  price, 
  onProductClick, 
  onLike, 
  onAddToCart,
  isLiked 
}) => {
  const { isDark } = useTheme();

  const handleCardClick = () => {
    onProductClick(id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(id);
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 relative ${
        isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
      }`}
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleLikeClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : isDark 
                  ? 'bg-black/50 text-white hover:bg-red-500' 
                  : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleCartClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isDark 
                ? 'bg-black/50 text-white hover:bg-blue-500' 
                : 'bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white'
            }`}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className={`text-sm font-light tracking-wider mb-2 transition-colors ${
          isDark ? 'text-white group-hover:text-gray-300' : 'text-black group-hover:text-gray-700'
        }`}>
          {title}
        </h3>
        <p className={`text-xs font-light mb-4 transition-colors line-clamp-2 ${
          isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-800'
        }`}>
          {description}
        </p>
        <p className={`text-sm font-light tracking-wider transition-colors ${
          isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-black'
        }`}>
          {price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;