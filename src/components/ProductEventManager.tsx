import React, { createContext, useContext, useEffect } from 'react';

interface ProductEventManagerContextType {
  emitProductAdded: (product: any) => void;
  emitProductUpdated: (product: any) => void;
  emitProductDeleted: (productId: number) => void;
  subscribeToProductEvents: (callback: (event: ProductEvent) => void) => () => void;
}

interface ProductEvent {
  type: 'PRODUCT_ADDED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED';
  payload: any;
  timestamp: number;
}

const ProductEventManagerContext = createContext<ProductEventManagerContextType | undefined>(undefined);

export const useProductEvents = () => {
  const context = useContext(ProductEventManagerContext);
  if (!context) {
    throw new Error('useProductEvents must be used within a ProductEventManagerProvider');
  }
  return context;
};

// Global event manager for real-time updates
class ProductEventManager {
  private listeners: ((event: ProductEvent) => void)[] = [];
  private eventQueue: ProductEvent[] = [];

  subscribe(callback: (event: ProductEvent) => void): () => void {
    this.listeners.push(callback);
    
    // Send any queued events to new subscribers
    this.eventQueue.forEach(event => callback(event));
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(event: ProductEvent) {
    // Add to queue for persistence
    this.eventQueue.push(event);
    
    // Keep only last 100 events to prevent memory leaks
    if (this.eventQueue.length > 100) {
      this.eventQueue = this.eventQueue.slice(-100);
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in product event listener:', error);
      }
    });

    // Persist to localStorage for cross-tab communication
    this.persistEvent(event);
  }

  private persistEvent(event: ProductEvent) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('productEvents') || '[]');
      existingEvents.push(event);
      
      // Keep only last 50 events in localStorage
      const recentEvents = existingEvents.slice(-50);
      localStorage.setItem('productEvents', JSON.stringify(recentEvents));
      
      // Dispatch custom event for cross-tab communication
      window.dispatchEvent(new CustomEvent('productEventUpdate', { detail: event }));
    } catch (error) {
      console.error('Failed to persist product event:', error);
    }
  }

  getQueuedEvents(): ProductEvent[] {
    return [...this.eventQueue];
  }

  clearQueue() {
    this.eventQueue = [];
  }
}

// Global instance
const globalEventManager = new ProductEventManager();

export const ProductEventManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Listen for cross-tab events
    const handleStorageEvent = (event: CustomEvent) => {
      if (event.type === 'productEventUpdate') {
        // Re-emit the event to local listeners
        globalEventManager.emit(event.detail);
      }
    };

    window.addEventListener('productEventUpdate', handleStorageEvent as EventListener);
    
    return () => {
      window.removeEventListener('productEventUpdate', handleStorageEvent as EventListener);
    };
  }, []);

  const emitProductAdded = (product: any) => {
    globalEventManager.emit({
      type: 'PRODUCT_ADDED',
      payload: product,
      timestamp: Date.now()
    });
  };

  const emitProductUpdated = (product: any) => {
    globalEventManager.emit({
      type: 'PRODUCT_UPDATED',
      payload: product,
      timestamp: Date.now()
    });
  };

  const emitProductDeleted = (productId: number) => {
    globalEventManager.emit({
      type: 'PRODUCT_DELETED',
      payload: { id: productId },
      timestamp: Date.now()
    });
  };

  const subscribeToProductEvents = (callback: (event: ProductEvent) => void) => {
    return globalEventManager.subscribe(callback);
  };

  return (
    <ProductEventManagerContext.Provider value={{
      emitProductAdded,
      emitProductUpdated,
      emitProductDeleted,
      subscribeToProductEvents
    }}>
      {children}
    </ProductEventManagerContext.Provider>
  );
};

export default ProductEventManager;