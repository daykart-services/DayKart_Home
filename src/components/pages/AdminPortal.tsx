import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp, X, Save, Filter, Clock, Truck, CheckCircle, Check, ArrowRight } from 'lucide-react';
import { useTheme, useProducts } from '../ThemeContext';
import { useProductEvents } from '../ProductEventManager';

interface AdminPortalProps {
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { emitProductAdded, emitProductUpdated, emitProductDeleted } = useProductEvents();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ordersVisible, setOrdersVisible] = useState(() => {
    return localStorage.getItem('adminOrdersVisible') === 'true';
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    images: [''],
    rating: 5,
    reviews: 0,
    category: 'beds' as 'beds' | 'stationary' | 'bathware' | 'dorm' | 'new-collections',
    features: [''],
    specifications: {} as { [key: string]: string },
    isNew: false,
    collection: '',
    featured: false,
  });

  // Mock orders data (should be shared with user dashboard in real app)
  const [orders, setOrders] = useState([
    {
      id: 'ORD12345',
      date: '2024-06-01',
      products: [
        { id: 1, name: 'Luxury Memory Foam Mattress', image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800', price: 899, quantity: 1 }
      ],
      paymentStatus: 'Completed',
      transportStatus: 'Shipped',
      statusTimeline: [
        { label: 'Order Placed', completed: true },
        { label: 'Payment Completed', completed: true },
        { label: 'Processing', completed: true },
        { label: 'Shipped', completed: true },
        { label: 'Delivered', completed: false }
      ]
    },
    {
      id: 'ORD12346',
      date: '2024-06-02',
      products: [
        { id: 2, name: 'Premium Fountain Pen Set', image: 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=800', price: 149, quantity: 2 }
      ],
      paymentStatus: 'Pending',
      transportStatus: 'Processing',
      statusTimeline: [
        { label: 'Order Placed', completed: true },
        { label: 'Payment Completed', completed: false },
        { label: 'Processing', completed: false },
        { label: 'Shipped', completed: false },
        { label: 'Delivered', completed: false }
      ]
    }
  ]);

  // Admin actions
  const verifyPayment = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            paymentStatus: 'Completed',
            statusTimeline: order.statusTimeline.map(step =>
              step.label === 'Payment Completed' ? { ...step, completed: true } : step
            )
          }
        : order
    ));
  };

  const advanceTransportStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const nextStatus =
        order.transportStatus === 'Processing' ? 'Shipped' :
        order.transportStatus === 'Shipped' ? 'Delivered' : 'Delivered';
      const nextTimeline = order.statusTimeline.map(step => {
        if (nextStatus === 'Shipped' && step.label === 'Shipped') return { ...step, completed: true };
        if (nextStatus === 'Delivered' && step.label === 'Delivered') return { ...step, completed: true };
        return step;
      });
      return {
        ...order,
        transportStatus: nextStatus,
        statusTimeline: nextTimeline
      };
    }));
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beds', label: 'Beds' },
    { value: 'stationary', label: 'Stationary' },
    { value: 'bathware', label: 'Bathware' },
    { value: 'dorm', label: 'Dorm' },
    { value: 'new-collections', label: 'New Collections' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.description && newProduct.price && newProduct.image) {
      const productData = {
        ...newProduct,
        images: newProduct.images.filter(img => img.trim()),
        features: newProduct.features.filter(f => f.trim()),
        originalPrice: newProduct.originalPrice || undefined,
        featured: newProduct.featured,
      };
      
      const createdProduct = addProduct(productData);
      
      // Emit real-time event for immediate UI updates
      if (createdProduct) {
        emitProductAdded(createdProduct);
      }
      
      resetForm();
      setShowAddProduct(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      images: product.images || [product.image],
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      features: product.features || [''],
      specifications: product.specifications || {},
      isNew: product.isNew || false,
      collection: product.collection || '',
      featured: product.featured || false,
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.description && newProduct.price && newProduct.image) {
      const productData = {
        ...newProduct,
        images: newProduct.images.filter(img => img.trim()),
        features: newProduct.features.filter(f => f.trim()),
        originalPrice: newProduct.originalPrice || undefined,
        featured: newProduct.featured,
      };
      
      const updatedProduct = updateProduct(editingProduct.id, productData);
      
      // Emit real-time event for immediate UI updates
      if (updatedProduct) {
        emitProductUpdated(updatedProduct);
      }
      
      resetForm();
      setEditingProduct(null);
      setShowAddProduct(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      
      // Emit real-time event for immediate UI updates
      emitProductDeleted(id);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      images: [''],
      rating: 5,
      reviews: 0,
      category: 'beds',
      features: [''],
      specifications: {},
      isNew: false,
      collection: '',
      featured: false,
    });
  };

  const addImageField = () => {
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImageField = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeatureField = () => {
    setNewProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeatureField = (index: number, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeatureField = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    const key = prompt('Enter specification key:');
    if (key) {
      setNewProduct(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [key]: '' }
      }));
    }
  };

  const updateSpecification = (key: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value }
    }));
  };

  const removeSpecification = (key: string) => {
    setNewProduct(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const toggleOrdersVisibility = () => {
    const newVisibility = !ordersVisible;
    setOrdersVisible(newVisibility);
    localStorage.setItem('adminOrdersVisible', newVisibility.toString());
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('ordersVisibilityChanged', { 
      detail: { visible: newVisibility } 
    }));
  };

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    avgRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0,
    totalReviews: products.reduce((sum, p) => sum + p.reviews, 0),
    categoryBreakdown: categories.slice(1).map(cat => ({
      category: cat.label,
      count: products.filter(p => p.category === cat.value).length
    }))
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-7xl mx-auto m-4 rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-64 border-r ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Admin Portal
              </h2>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-500 text-white'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp size={20} />
                  Dashboard
                </button>
                
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'products'
                      ? 'bg-blue-500 text-white'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Package size={20} />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-500 text-white'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Truck size={20} />
                  Orders
                </button>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    User Dashboard Controls
                  </h3>
                  <button
                    onClick={toggleOrdersVisibility}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      ordersVisible
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Package size={16} />
                      Orders Display
                    </span>
                    <span className="text-xs font-medium">
                      {ordersVisible ? 'ON' : 'OFF'}
                    </span>
                  </button>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Control whether users can see orders in their dashboard
                  </p>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className={`border-b px-6 py-4 flex justify-between items-center ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'orders' ? 'Order Management' : 'Product Management'}
              </h1>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <Package className="text-blue-500" size={24} />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stats.totalProducts}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <ShoppingCart className="text-green-500" size={24} />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ₹{stats.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <TrendingUp className="text-yellow-500" size={24} />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stats.avgRating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <Users className="text-purple-500" size={24} />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Reviews</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stats.totalReviews}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Products by Category
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {stats.categoryBreakdown.map(item => (
                        <div key={item.category} className="text-center">
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.count}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Products */}
                  <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Recent Products
                    </h3>
                    <div className="space-y-3">
                      {products.slice(-5).map(product => (
                        <div key={product.id} className="flex items-center gap-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {product.name}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              ₹{product.price} • {product.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Products ({filteredProducts.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        <Filter size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`px-3 py-1 rounded border text-sm ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={20} />
                      Add Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product.id} className={`rounded-lg overflow-hidden ${
                        isDark ? 'bg-gray-800' : 'bg-gray-50'
                      }`}>
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {product.category}
                            </span>
                            {product.isNew && (
                              <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                          </h4>
                          <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="mt-8 w-full">
                  <h3 className="text-2xl font-bold mb-6">All Orders</h3>
                  {orders.length === 0 ? (
                    <div className="text-center text-gray-400">No orders yet.</div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map(order => (
                        <div key={order.id} className={`border rounded-xl p-6 shadow-sm ${isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-white'}`}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <span className="text-sm text-gray-400">Order ID:</span> <span className="font-semibold">{order.id}</span>
                              <span className="ml-6 text-sm text-gray-400">Date:</span> <span className="font-semibold">{order.date}</span>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <span className="text-sm text-gray-400">Payment:</span> <span className={`font-semibold ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span>
                              {order.paymentStatus === 'Pending' && (
                                <button onClick={() => verifyPayment(order.id)} className="ml-4 px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold flex items-center gap-1"><Check size={16}/>Verify</button>
                              )}
                              <span className="ml-6 text-sm text-gray-400">Status:</span> <span className="font-semibold">{order.transportStatus}</span>
                              {order.paymentStatus === 'Completed' && order.transportStatus !== 'Delivered' && (
                                <button onClick={() => advanceTransportStatus(order.id)} className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"><ArrowRight size={16}/>Advance</button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {order.products.map(product => (
                              <div key={product.id} className="flex items-center gap-4">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                                <div>
                                  <div className="font-semibold">{product.name}</div>
                                  <div className="text-sm text-gray-500">Qty: {product.quantity}</div>
                                  <div className="text-sm font-bold">₹{product.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Timeline/Status Tracker */}
                          <div className="flex items-center gap-4 mt-4">
                            {order.statusTimeline.map((step, idx) => (
                              <React.Fragment key={step.label}>
                                <div className="flex flex-col items-center">
                                  {step.completed ? (
                                    <CheckCircle className="text-green-500" size={22} />
                                  ) : (
                                    <Clock className="text-gray-400" size={22} />
                                  )}
                                  <span className={`text-xs mt-1 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                                {idx < order.statusTimeline.length - 1 && (
                                  <div className={`h-1 w-8 ${order.statusTimeline[idx + 1].completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`border-b px-6 py-4 flex justify-between items-center ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as any }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Price *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Original Price (Optional)
                    </label>
                    <input
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Description *
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Main Image URL *
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Additional Images
                    </label>
                    <button
                      onClick={addImageField}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Image
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newProduct.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateImageField(index, e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="https://example.com/image.jpg"
                        />
                        {newProduct.images.length > 1 && (
                          <button
                            onClick={() => removeImageField(index)}
                            className="text-red-500 hover:text-red-600 px-2"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Reviews Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.reviews}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, reviews: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Mark as New
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isNew}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, isNew: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Product
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.featured}
                    onChange={e => setNewProduct(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Show in Featured Products</label>
                </div>

                {newProduct.category === 'new-collections' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Collection Name
                    </label>
                    <input
                      type="text"
                      value={newProduct.collection}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, collection: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., Smart Home Essentials"
                    />
                  </div>
                )}

                {/* Available Stock Field */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={newProduct.specifications.Stock || ''}
                    onChange={e => setNewProduct(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, Stock: e.target.value }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Enter available stock"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Features
                    </label>
                    <button
                      onClick={addFeatureField}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newProduct.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeatureField(index, e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Enter feature"
                        />
                        {newProduct.features.length > 1 && (
                          <button
                            onClick={() => removeFeatureField(index)}
                            className="text-red-500 hover:text-red-600 px-2"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Specifications
                    </label>
                    <button
                      onClick={addSpecification}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Specification
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(newProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={key}
                          disabled
                          className={`w-1/3 px-3 py-2 border rounded-lg ${
                            isDark 
                              ? 'bg-gray-600 border-gray-600 text-gray-300' 
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSpecification(key, e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Enter value"
                        />
                        <button
                          onClick={() => removeSpecification(key)}
                          className="text-red-500 hover:text-red-600 px-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;