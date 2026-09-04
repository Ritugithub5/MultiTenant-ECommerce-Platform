import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/OrdersPage' } } });
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Filter orders for current user
    const userOrders = savedOrders.filter(order => order.userId === user.email || order.userId === user._id);
    setOrders(userOrders.reverse());
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-light text-amber-950 mb-2">No orders yet</h2>
          <p className="text-slate-400 text-sm mb-6">Start shopping and place your first order</p>
          <Link to="/products" className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs uppercase tracking-wider rounded-full hover:bg-amber-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-amber-100 text-amber-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-amber-950">My Orders</h1>
          <span className="text-sm text-slate-400">{orders.length} orders</span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Order #{order.id}</p>
                  <p className="text-sm font-medium text-amber-950">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t border-slate-100 mt-3 pt-3">
                <div className="flex flex-wrap items-center gap-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || 'https://via.placeholder.com/40'} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="text-xs text-slate-600">{item.name} × {item.quantity || item.qty || 1}</span>
                      {item.color && item.color !== 'N/A' && (
                        <span className="text-[9px] text-slate-400">({item.color})</span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-slate-400">+{order.items.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-3 pt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-amber-800">${order.total?.toFixed(2) || '0.00'}</span>
                <Link to={`/orders/${order.id}`} className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 transition">
                  View Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;