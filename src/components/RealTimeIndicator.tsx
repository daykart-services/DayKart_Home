import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useProductEvents } from './ProductEventManager';

const RealTimeIndicator: React.FC = () => {
  const { isDark } = useTheme();
  const { subscribeToProductEvents } = useProductEvents();
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToProductEvents((event) => {
      setLastUpdate(new Date());
      setRecentActivity(true);
      
      // Reset activity indicator after 2 seconds
      setTimeout(() => setRecentActivity(false), 2000);
    });

    return unsubscribe;
  }, [subscribeToProductEvents]);

  // Simulate connection status (in real app, this would check actual connection)
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    } ${recentActivity ? 'scale-110' : 'scale-100'}`}>
      {isConnected ? (
        <Wifi size={16} className={`${recentActivity ? 'text-green-500' : 'text-blue-500'}`} />
      ) : (
        <WifiOff size={16} className="text-red-500" />
      )}
      
      <div className="flex flex-col">
        <span className="text-xs font-medium">
          {isConnected ? 'Real-time' : 'Offline'}
        </span>
        {lastUpdate && (
          <span className="text-xs opacity-70">
            {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {recentActivity && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default RealTimeIndicator;