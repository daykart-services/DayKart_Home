import React, { useState } from 'react';
import { useCartLike } from '../CartLikeContext';
import { useProducts, useTheme, useUser } from '../ThemeContext';
import { ShoppingCart, Heart, Trash2, ArrowRight, X, Clock, Truck, CheckCircle } from 'lucide-react';
import UserAuth from '../UserAuth';

const Dashboard: React.FC = () => {
  const { liked, cart, removeFromCart, updateCartQuantity, unlike, clearCart, addToCart } = useCartLike();
  const { products } = useProducts();
  const { isDark } = useTheme();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'cart' | 'liked' | 'orders'>('cart');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    payment: '',
    paymentDetails: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // Mock orders data
  const orders = [
    {
      id: 'ORD12345',
      date: '2024-06-01',
      products: [
        { id: 1, name: 'Luxury Memory Foam Mattress', image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800', price: 899, quantity: 1 }
      ],
      paymentStatus: 'Completed',
      transportStatus: 'Shipped', // Processing | Shipped | Delivered
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
  ];

  const likedProducts = products.filter(p => liked.includes(p.id));
  const cartProducts = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);

  const cartTotal = cartProducts.reduce((sum, p: any) => sum + (Number(p.price) * p.quantity), 0);
  const cartCount = cartProducts.reduce((sum, p: any) => sum + p.quantity, 0);

  const handleBuyNow = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCheckout = () => {
    const newErrors: typeof errors = {};
    if (!userDetails.name.trim()) newErrors.name = 'Name is required';
    if (!userDetails.phone.trim() || !/^\d{10}$/.test(userDetails.phone)) newErrors.phone = 'Valid 10-digit phone required';
    if (!userDetails.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = () => {
    if (!validateCheckout()) return;
    alert('Payment successful! (Simulated)');
    setShowCheckout(false);
    clearCart();
  };

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-start ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}> 
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold mb-12 text-center tracking-tight">DASHBOARD</h2>
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-4 border-b border-gray-200 dark:border-gray-800">
          <button
            className={`pb-3 px-2 text-lg font-medium transition-colors duration-200 border-b-2 rounded-t-md ${
              activeTab === 'cart'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 dark:text-gray-400 hover:text-black'
            }`}
            onClick={() => setActiveTab('cart')}
          >
            <ShoppingCart className="inline mr-2 mb-1" size={20} /> Cart ({cartCount})
          </button>
          <button
            className={`pb-3 px-2 text-lg font-medium transition-colors duration-200 border-b-2 rounded-t-md ${
              activeTab === 'liked'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 dark:text-gray-400 hover:text-black'
            }`}
            onClick={() => setActiveTab('liked')}
          >
            <Heart className="inline mr-2 mb-1" size={20} /> Liked ({likedProducts.length})
          </button>
          <button
            className={`pb-3 px-2 text-lg font-medium transition-colors duration-200 border-b-2 rounded-t-md ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 dark:text-gray-400 hover:text-black'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck className="inline mr-2 mb-1" size={20} /> Orders
          </button>
        </div>

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            {cartProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-16 px-6 bg-transparent dark:bg-transparent rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                <ShoppingCart size={48} className="mb-6 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-semibold mb-2 text-center">Your cart is empty</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 text-center">Start shopping and add items to your cart!</p>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8 w-full">
                  {cartProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center gap-5 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 bg-transparent dark:bg-transparent">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100 dark:border-gray-800 bg-white" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{product.name}</h4>
                        <p className="text-sm mb-2 text-gray-500 dark:text-gray-400">{product.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-bold text-base">₹{product.price}</span>
                          <input
                            type="number"
                            min={1}
                            value={product.quantity}
                            onChange={e => updateCartQuantity(product.id, Math.max(1, Number(e.target.value)))}
                            className="w-14 border rounded px-2 py-1 text-center text-base bg-white text-black border-gray-200 dark:border-gray-700"
                          />
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="ml-2 text-red-500 hover:underline"
                            title="Remove from cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Cart Summary */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-6 mt-6 gap-4 w-full">
                  <div>
                    <span className="text-gray-400 dark:text-gray-500">Total Items: </span>
                    <span className="font-semibold text-base">{cartCount}</span>
                    <span className="ml-6 text-gray-400 dark:text-gray-500">Total Price: </span>
                    <span className="font-bold text-lg">₹{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="mt-2 md:mt-0 px-8 py-3 rounded-full font-bold text-base transition-all duration-200 bg-black text-white hover:bg-gray-900"
                  >
                    Checkout <ArrowRight size={18} className="inline ml-2" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Liked Tab */}
        {activeTab === 'liked' && (
          <div className="flex flex-col items-center justify-center min-h-[0] w-full">
            {likedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-16 px-6 bg-transparent dark:bg-transparent rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 mt-0">
                <Heart size={48} className="mb-6 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-semibold mb-2 text-center">No liked items yet</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 text-center">Tap the heart on any product to save it here!</p>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                {likedProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-5 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 bg-transparent dark:bg-transparent">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100 dark:border-gray-800 bg-white" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{product.name}</h4>
                      <p className="text-sm mb-2 text-gray-500 dark:text-gray-400">{product.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-bold text-base">₹{product.price}</span>
                        <button
                          onClick={() => addToCart(product.id, 1)}
                          className="px-6 py-2 rounded-full font-semibold text-base transition-all duration-200 bg-black text-white hover:bg-gray-900"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => unlike(product.id)}
                          className="ml-2 text-red-500 hover:underline text-base"
                          title="Remove from liked"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="mt-8 w-full">
            <h3 className="text-2xl font-bold mb-6">Your Orders</h3>
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
                        <span className="ml-6 text-sm text-gray-400">Status:</span> <span className="font-semibold">{order.transportStatus}</span>
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

        {/* Checkout Modal */}
        {showCheckout && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className={`rounded-2xl border p-10 max-w-md w-full relative ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} overflow-y-auto max-h-screen`}> 
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => setShowCheckout(false)}
              >
                <X size={22} />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-center">Checkout</h3>
              <form onSubmit={e => { e.preventDefault(); handleConfirmPayment(); }}>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                    placeholder="Enter your name"
                    required
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                    placeholder="10-digit phone number"
                    required
                  />
                  {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                </div>
                <div className="mb-6">
                  <label className="block font-medium mb-2">Address/University</label>
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                    placeholder="Enter your delivery address"
                    rows={3}
                    required
                  />
                  {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-400 dark:text-gray-500">Total Items:</span>
                    <span className="font-semibold text-base">{cartCount}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-400 dark:text-gray-500">Total Price:</span>
                    <span className="font-bold text-lg">₹{cartTotal}</span>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block font-medium mb-2">Payment Method</label>
                  <select
                    name="payment"
                    value={userDetails.payment}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-3 mb-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                    required
                  > 
                    <option value="">Select payment method</option>
                    <option>UPI</option>
                    <option>QR</option>
                    <option>Credit/Debit Card</option>
                    <option>Net Banking</option>
                    <option>Cash on Delivery</option>
                  </select>
                  {/* Conditional payment details */}
                  {userDetails.payment === 'UPI' && (
                    <input
                      type="text"
                      name="paymentDetails"
                      value={userDetails.paymentDetails}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                      placeholder="Enter your UPI ID"
                      required
                    />
                  )}
                  {userDetails.payment === 'QR' && (
                    <div className="flex flex-col items-center gap-3 mt-2">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9652377187-2@ybl&pn=Daykart&am=" alt="QR Code" className="w-40 h-40 rounded border" />
                      <a
                        href="upi://pay?pa=9652377187-2@ybl&pn=Daykart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-medium"
                      >
                        Pay with UPI App
                      </a>
                      <span className="text-xs text-gray-500">Scan QR with any UPI app</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-1">UPI ID: 9652377187-2@ybl</span>
                    </div>
                  )}
                  {(userDetails.payment === 'Credit/Debit Card' || userDetails.payment === 'Net Banking') && (
                    <input
                      type="text"
                      name="paymentDetails"
                      value={userDetails.paymentDetails}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-3 text-base bg-white text-black border-gray-200 dark:border-gray-700"
                      placeholder={userDetails.payment === 'Credit/Debit Card' ? 'Enter Card Details' : 'Enter Net Banking Details'}
                      required
                    />
                  )}
                  {/* No extra input for Cash on Delivery */}
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-full font-bold text-base transition-all duration-200 bg-black text-white hover:bg-gray-900"
                >
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Login Modal */}
        {showLogin && (
          <UserAuth
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onAdminPortalRequest={() => setShowLogin(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 