import React, { useState, useEffect } from 'react';
import { X, Package, Edit, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useProductEvents } from './ProductEventManager';

interface Notification {
  id: string;
  type: 'PRODUCT_ADDED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED';
  product: any;
  timestamp: number;
}

const ProductNotification: React.FC = () => {
  const { isDark } = useTheme();
  const { subscribeToProductEvents } = useProductEvents();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToProductEvents((event) => {
      const notification: Notification = {
        id: `${event.type}-${event.timestamp}`,
        type: event.type,
        product: event.payload,
        timestamp: event.timestamp
      };

      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep max 5 notifications

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    });

    return unsubscribe;
  }, [subscribeToProductEvents]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT_ADDED':
        return <Package size={20} className="text-green-500" />;
      case 'PRODUCT_UPDATED':
        return <Edit size={20} className="text-blue-500" />;
      case 'PRODUCT_DELETED':
        return <Trash2 size={20} className="text-red-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'PRODUCT_ADDED':
        return `New product added: ${notification.product.name}`;
      case 'PRODUCT_UPDATED':
        return `Product updated: ${notification.product.name}`;
      case 'PRODUCT_DELETED':
        return `Product deleted (ID: ${notification.product.id})`;
      default:
        return 'Product updated';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform animate-slide-in ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {getNotificationIcon(notification.type)}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {getNotificationMessage(notification)}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className={`flex-shrink-0 p-1 rounded transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductNotification;