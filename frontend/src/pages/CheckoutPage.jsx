// frontend/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Lock, CheckCircle, ShoppingBag, Wallet } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
    paypalEmail: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/CheckoutPage' } } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/CartPage');
      return;
    }
    setCartItems(cart);
    setLoading(false);
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
      const missing = required.filter(field => !formData[field]);
      
      if (missing.length > 0) {
        setError('Please fill in all shipping fields');
        return;
      }
      
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (selectedPayment === 'card') {
        const required = ['cardName', 'cardNumber', 'expiry', 'cvc'];
        const missing = required.filter(field => !formData[field]);
        if (missing.length > 0) {
          setError('Please fill in all card details');
          return;
        }
      } else if (selectedPayment === 'paypal') {
        if (!formData.paypalEmail) {
          setError('Please enter your PayPal email');
          return;
        }
      } else if (selectedPayment === 'googlepay' || selectedPayment === 'applepay') {
        if (!formData.phoneNumber) {
          setError('Please enter your phone number');
          return;
        }
      }
      
      placeOrder();
    }
  };

  const generateOrderId = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.random().toString(36).slice(-4).toUpperCase();
    return 'ORD-' + timestamp + '-' + random;
  };

  // frontend/src/pages/CheckoutPage.jsx - placeOrder function

  const placeOrder = () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const subtotal = calculateSubtotal();
      const shipping = calculateShipping();
      const tax = calculateTax();
      const total = calculateTotal();
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // ✅ Determine vendor based on user role
      // If customer, order goes to default vendor (fashion@store.com)
      // If vendor, order goes to their own store
      const isCustomer = user?.role === 'customer' || user?.role === undefined;
      const isVendor = user?.role === 'vendor';
      
      let vendorEmail = 'fashion@store.com';
      let vendorName = 'Fashion Vendor';
      let tenantId = 'store_001';
      
      // ✅ If vendor is placing order, use their info
      if (isVendor) {
        vendorEmail = user.email || 'fashion@store.com';
        vendorName = user.name || 'Fashion Vendor';
        tenantId = user.tenantId || 'store_001';
      }
      
      const order = {
        id: generateOrderId(),
        items: cartItems.map(item => ({
          productId: item.productId || item.id || 'unknown',
          name: item.name || 'Product',
          price: item.price || 0,
          quantity: item.qty || 1,
          qty: item.qty || 1,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          image: item.image || 'https://via.placeholder.com/100'
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        paymentMethod: getPaymentMethodName(selectedPayment),
        status: 'Processing',
        date: new Date().toISOString(),
        
        // ✅ Customer who placed the order
        userId: user.email || user._id || 'guest',
        userEmail: user.email || 'guest@email.com',
        customerName: user.name || 'Guest',
        customerRole: user.role || 'customer',
        
        // ✅ Vendor who handles this order
        vendorEmail: vendorEmail,
        vendorName: vendorName,
        tenantId: tenantId,
        
        // ✅ Who placed this order
        placedBy: user.email || 'guest',
        placedByRole: user.role || 'customer'
      };
      
      console.log('📦 Order placed:', {
        id: order.id,
        customer: order.userEmail,
        customerRole: order.customerRole,
        vendor: order.vendorEmail,
        total: order.total
      });
      
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cartUpdated'));
      
      setOrderPlaced(true);
      
      setTimeout(() => {
        navigate('/OrderSuccessPage', { state: { orderId: order.id } });
      }, 1500);
      
    } catch (error) {
      console.error('❌ Order error:', error);
      setError('Failed to place order: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodName = (method) => {
    const names = {
      'card': '💳 Credit Card',
      'paypal': '📱 PayPal',
      'googlepay': '🔵 Google Pay',
      'applepay': '⚫ Apple Pay'
    };
    return names[method] || method;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 15;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-amber-800 text-xs font-light">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-light text-amber-950 mb-2">Order Placed! 🎉</h2>
          <p className="text-slate-400 text-sm">Redirecting to confirmation...</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/CartPage" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-800 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-light text-amber-950 mb-4">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-between mb-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'}`}>1</span>
            <span className={`text-xs ${step === 1 ? 'text-amber-800 font-medium' : 'text-slate-400'}`}>Shipping</span>
          </div>
          <div className={`flex-1 h-0.5 ${step === 2 ? 'bg-amber-800' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'}`}>2</span>
            <span className={`text-xs ${step === 2 ? 'text-amber-800 font-medium' : 'text-slate-400'}`}>Payment</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-4">
                    <h2 className="text-base font-light text-amber-950 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600" /> Shipping Address
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        name="firstName" 
                        placeholder="First Name" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                        required 
                      />
                      <input 
                        name="lastName" 
                        placeholder="Last Name" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                        required 
                      />
                    </div>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="Email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                      required 
                    />
                    <input 
                      name="phone" 
                      placeholder="Phone Number" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                      required 
                    />
                    <input 
                      name="address" 
                      placeholder="Street Address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                      required 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        name="city" 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                        required 
                      />
                      <input 
                        name="state" 
                        placeholder="State/Province" 
                        value={formData.state} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        name="zip" 
                        placeholder="ZIP Code" 
                        value={formData.zip} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                        required 
                      />
                      <select 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>India</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-amber-800 text-white py-3 rounded-full hover:bg-amber-700 transition text-xs uppercase tracking-wider"
                    >
                      Continue to Payment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-base font-light text-amber-950 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-600" /> Payment Method
                    </h2>
                    
                    <div className="space-y-2">
                      <div 
                        className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition ${
                          selectedPayment === 'card' ? 'bg-amber-50 border-amber-200' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedPayment('card')}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === 'card'} readOnly className="accent-amber-800" />
                        <span className="text-sm">💳 Credit / Debit Card</span>
                      </div>

                      <div 
                        className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition ${
                          selectedPayment === 'paypal' ? 'bg-amber-50 border-amber-200' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedPayment('paypal')}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === 'paypal'} readOnly className="accent-amber-800" />
                        <span className="text-sm">📱 PayPal</span>
                      </div>

                      <div 
                        className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition ${
                          selectedPayment === 'googlepay' ? 'bg-amber-50 border-amber-200' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedPayment('googlepay')}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === 'googlepay'} readOnly className="accent-amber-800" />
                        <span className="text-sm">🔵 Google Pay</span>
                      </div>

                      <div 
                        className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition ${
                          selectedPayment === 'applepay' ? 'bg-amber-50 border-amber-200' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedPayment('applepay')}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === 'applepay'} readOnly className="accent-amber-800" />
                        <span className="text-sm">⚫ Apple Pay</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      {selectedPayment === 'card' && (
                        <div className="space-y-3">
                          <input 
                            name="cardName" 
                            placeholder="Name on Card" 
                            value={formData.cardName} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                            required 
                          />
                          <input 
                            name="cardNumber" 
                            placeholder="Card Number" 
                            value={formData.cardNumber} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                            required 
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              name="expiry" 
                              placeholder="MM/YY" 
                              value={formData.expiry} 
                              onChange={handleChange} 
                              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                              required 
                            />
                            <input 
                              name="cvc" 
                              placeholder="CVC" 
                              value={formData.cvc} 
                              onChange={handleChange} 
                              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                              required 
                            />
                          </div>
                        </div>
                      )}

                      {selectedPayment === 'paypal' && (
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">You will be redirected to PayPal to complete your payment securely.</p>
                          </div>
                          <input 
                            name="paypalEmail" 
                            placeholder="PayPal Email" 
                            value={formData.paypalEmail} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                            required 
                          />
                        </div>
                      )}

                      {(selectedPayment === 'googlepay' || selectedPayment === 'applepay') && (
                        <div className="space-y-3">
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-600">
                              {selectedPayment === 'googlepay' ? '🔵' : '⚫'} 
                              {selectedPayment === 'googlepay' ? ' Google Pay' : ' Apple Pay'} will open on your device.
                            </p>
                          </div>
                          <input 
                            name="phoneNumber" 
                            placeholder="Phone Number" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-800" 
                            required 
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                      <Lock className="w-3 h-3" /> Your payment is secure and encrypted
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-amber-800 text-white py-3 rounded-full hover:bg-amber-700 transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4" /> Place Order • ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 sticky top-20">
              <h3 className="text-sm font-light text-amber-950 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-600" /> Order Summary
              </h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-slate-600 text-xs border-b border-slate-50 pb-1.5">
                    <div>
                      <span>{item.name || 'Product'}</span>
                      <span className="text-slate-400 ml-1">× {item.qty || 1}</span>
                      {item.color && item.color !== 'N/A' && (
                        <span className="text-[9px] text-slate-400 ml-1">({item.color})</span>
                      )}
                    </div>
                    <span>${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-3 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span className="text-amber-950">Total</span>
                  <span className="text-amber-800 text-base">${total.toFixed(2)}</span>
                </div>
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-[10px] text-emerald-600">✓ Free shipping applied</p>
                )}
              </div>

              {/* ✅ Show vendor info */}
              {cartItems.length > 0 && cartItems[0].vendorName && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400">Sold by: <span className="text-slate-600 font-medium">{cartItems[0].vendorName}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;