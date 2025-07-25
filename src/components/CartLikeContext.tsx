import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  quantity: number;
}

interface CartLikeContextType {
  liked: number[];
  cart: CartItem[];
  like: (id: number) => void;
  unlike: (id: number) => void;
  isLiked: (id: number) => boolean;
  addToCart: (id: number, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  getCartQuantity: (id: number) => number;
  clearCart: () => void;
}

const CartLikeContext = createContext<CartLikeContextType | undefined>(undefined);

export const useCartLike = () => {
  const ctx = useContext(CartLikeContext);
  if (!ctx) throw new Error('useCartLike must be used within a CartLikeProvider');
  return ctx;
};

export const CartLikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liked, setLiked] = useState<number[]>(() => {
    const stored = localStorage.getItem('liked');
    return stored ? JSON.parse(stored) : [];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const like = (id: number) => setLiked(prev => prev.includes(id) ? prev : [...prev, id]);
  const unlike = (id: number) => setLiked(prev => prev.filter(pid => pid !== id));
  const isLiked = (id: number) => liked.includes(id);

  const addToCart = (id: number, quantity: number = 1) => {
    setCart(prev => {
      const found = prev.find(item => item.id === id);
      if (found) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        return [...prev, { id, quantity }];
      }
    });
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: number, quantity: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  const getCartQuantity = (id: number) => cart.find(item => item.id === id)?.quantity || 0;
  const clearCart = () => setCart([]);

  return (
    <CartLikeContext.Provider value={{ liked, cart, like, unlike, isLiked, addToCart, removeFromCart, updateCartQuantity, getCartQuantity, clearCart }}>
      {children}
    </CartLikeContext.Provider>
  );
};