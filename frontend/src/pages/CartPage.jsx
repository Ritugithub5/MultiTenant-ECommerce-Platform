import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  };

  const updateQuantity = (productId, color, change) => {
    const updated = cartItems.map(item => {
      if (item.productId === productId && item.color === color) {
        const newQty = Math.max(1, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId, color) => {
    const updated = cartItems.filter(item => !(item.productId === productId && item.color === color));
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-light text-amber-950 mb-2">Your bag is empty</h2>
          <p className="text-slate-400 text-sm mb-6">Discover our collection and find something you love</p>
          <Link to="/products" className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs uppercase tracking-wider rounded-full hover:bg-amber-700 transition">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-amber-950">Shopping Bag</h1>
          <span className="text-sm text-slate-400">{cartItems.length} items</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => {
              const uniqueKey = `${item.productId}-${item.color}`;
              
              return (
                <div key={uniqueKey} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition">
                  <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-light text-amber-950">{item.name}</h3>
                        <span className="text-[10px] text-amber-600 font-medium">{item.color}</span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId, item.color)} 
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">Size: {item.size || 'N/A'} | Color: {item.color}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.color, -1)} 
                          className="w-6 h-6 border rounded-full flex items-center justify-center hover:border-amber-800 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.color, 1)} 
                          className="w-6 h-6 border rounded-full flex items-center justify-center hover:border-amber-800 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-amber-800">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 sticky top-20">
              <h3 className="text-base font-light text-amber-950 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
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
                <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                  <span className="text-amber-950">Total</span>
                  <span className="text-amber-800 text-lg">${total.toFixed(2)}</span>
                </div>
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-[10px] text-emerald-600">✓ Free shipping applied</p>
                )}
              </div>

              <button
                onClick={() => navigate('/CheckoutPage')}
                className="w-full mt-4 bg-amber-800 text-white py-3 rounded-full hover:bg-amber-700 transition text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-2 text-xs text-slate-400 hover:text-red-500 transition text-center"
              >
                Clear Cart
              </button>

              <Link to="/products" className="block text-center text-xs text-slate-400 mt-3 hover:text-amber-800 transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;