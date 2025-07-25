import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProductEvents } from './ProductEventManager';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export Product type for use in other files
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: 'beds' | 'stationary' | 'bathware' | 'dorm' | 'new-collections';
  features: string[];
  specifications?: { [key: string]: string };
  isNew?: boolean;
  collection?: string;
  featured: boolean;
}

interface ProductsContextType {
  products: Product[];
  getProductsByCategory: (category: string) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    // Load products from localStorage on initialization
    const stored = localStorage.getItem('products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load products from localStorage:', error);
      }
    }
    
    // Default products if no stored data
    return [
    // Sample products
    {
      id: 1,
      name: "Luxury Memory Foam Mattress",
      description: "Premium memory foam mattress with cooling gel technology for the perfect night's sleep.",
      price: 899,
      originalPrice: 1199,
      image: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800",
      images: [
        "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      rating: 4.8,
      reviews: 124,
      category: 'beds',
      features: ['Memory Foam', 'Cooling Gel', '10-Year Warranty', 'CertiPUR-US Certified'],
      specifications: {
        'Size': 'Queen',
        'Thickness': '12 inches',
        'Material': 'Memory Foam',
        'Firmness': 'Medium-Firm'
      },
      featured: true
    },
    {
      id: 2,
      name: "Premium Fountain Pen Set",
      description: "Elegant fountain pen set with gold-plated nib and luxury leather case.",
      price: 149,
      image: "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.6,
      reviews: 89,
      category: 'stationary',
      features: ['Gold-Plated Nib', 'Leather Case', 'Refillable', 'Gift Box Included'],
      featured: false
    },
    {
      id: 3,
      name: "Smart Shower System",
      description: "Digital shower system with temperature control and water-saving technology.",
      price: 599,
      originalPrice: 799,
      image: "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      reviews: 156,
      category: 'bathware',
      features: ['Digital Display', 'Temperature Control', 'Water-Saving', 'Easy Installation'],
      featured: true
    },
    {
      id: 4,
      name: "Space-Saving Desk Organizer",
      description: "Multi-functional desk organizer perfect for small dorm rooms and study spaces.",
      price: 39,
      image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.4,
      reviews: 203,
      category: 'dorm',
      features: ['Space-Saving', 'Multiple Compartments', 'Durable Material', 'Easy Assembly'],
      featured: false
    },
    {
      id: 5,
      name: "Smart Home Hub",
      description: "Central control hub for all your smart home devices with voice control.",
      price: 199,
      image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      reviews: 78,
      category: 'new-collections',
      features: ['Voice Control', 'WiFi Enabled', 'App Integration', 'Easy Setup'],
      isNew: true,
      collection: 'Smart Home Essentials',
      featured: true
    }
    ];
  });

  // Persist products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }, [products]);

  // Subscribe to real-time product events
  useEffect(() => {
    // Only subscribe if ProductEventManager is available
    if (typeof window !== 'undefined') {
      const handleProductEvent = (event: any) => {
        switch (event.type) {
          case 'PRODUCT_ADDED':
            setProducts(prev => {
              // Check if product already exists to prevent duplicates
              const exists = prev.some(p => p.id === event.payload.id);
              if (exists) return prev;
              return [...prev, event.payload];
            });
            break;
          case 'PRODUCT_UPDATED':
            setProducts(prev => prev.map(product => 
              product.id === event.payload.id ? { ...product, ...event.payload } : product
            ));
            break;
          case 'PRODUCT_DELETED':
            setProducts(prev => prev.filter(product => product.id !== event.payload.id));
            break;
        }
      };

      // Listen for custom events (fallback for when context isn't available)
      const handleCustomEvent = (event: CustomEvent) => {
        handleProductEvent(event.detail);
      };

      window.addEventListener('productEventUpdate', handleCustomEvent as EventListener);
      
      return () => {
        window.removeEventListener('productEventUpdate', handleCustomEvent as EventListener);
      };
    }
  }, []);

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    
    setProducts(prev => {
      const updated = [...prev, newProduct];
      return updated;
    });
    
    return newProduct;
  };

  const updateProduct = (id: number, productData: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      );
      return updated;
    });
    
    const updatedProduct = products.find(p => p.id === id);
    return updatedProduct ? { ...updatedProduct, ...productData } : null;
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <ProductsContext.Provider value={{
      products,
      getProductsByCategory,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

// UserContext for authentication
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = (name: string, email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};