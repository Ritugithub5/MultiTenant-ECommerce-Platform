// frontend/src/pages/VendorOrderDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Package, Truck, MapPin, 
  CheckCircle, Clock, AlertCircle, User, 
  ShoppingBag, DollarSign, ChevronDown 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VendorOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // ✅ Only vendors can access
    if (user.role !== 'vendor') {
      navigate('/');
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('🔍 Looking for order:', id);
    console.log('📦 All orders:', savedOrders.map(o => o.id));
    
    // ✅ Find order by ID - NO FILTERING
    const foundOrder = savedOrders.find(o => o.id === id);
    
    if (foundOrder) {
      console.log('✅ Order found:', foundOrder.id);
      setOrder(foundOrder);
    } else {
      console.log('❌ Order not found');
    }
    setLoading(false);
  }, [id, user, navigate]);

  const statuses = [
    { value: 'Processing', label: 'Order Confirmed', icon: Clock },
    { value: 'Shipped', label: 'Shipped', icon: Truck },
    { value: 'Out for Delivery', label: 'Out for Delivery', icon: Package },
    { value: 'Delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'Cancelled', label: 'Cancelled', icon: AlertCircle },
  ];

  const updateOrderStatus = (status) => {
    if (!order) return;
    setUpdating(true);
    
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex(o => o.id === order.id);
    
    if (orderIndex > -1) {
      if (!savedOrders[orderIndex].statusHistory) {
        savedOrders[orderIndex].statusHistory = [];
      }
      savedOrders[orderIndex].statusHistory.push({
        status: status,
        date: new Date().toISOString(),
        note: `Status updated to ${status} by ${user.name}`
      });
      savedOrders[orderIndex].status = status;
      localStorage.setItem('orders', JSON.stringify(savedOrders));
      setOrder(savedOrders[orderIndex]);
    }
    
    setShowStatusDropdown(false);
    setUpdating(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-amber-100 text-amber-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Out for Delivery': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-amber-950 mb-2">Order Not Found</h2>
          <p className="text-slate-400 text-sm mb-4">The order you're looking for doesn't exist.</p>
          <p className="text-xs text-slate-400 mb-4">Order ID: {id}</p>
          <Link to="/vendor" className="text-amber-800 hover:underline text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/vendor" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-800 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-xl font-light text-amber-950">Order #{order.id}</h1>
              <p className="text-sm text-slate-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-xs text-slate-400 mt-1">Customer: {order.shippingAddress?.email || order.userEmail}</p>
              <p className="text-xs text-slate-400">Vendor: {order.vendorName || 'Fashion Vendor'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-4 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              {/* ✅ Vendor Update Status Button */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={updating}
                  className="flex items-center gap-1 text-xs bg-amber-700 text-white px-4 py-1.5 rounded-full hover:bg-amber-600 transition"
                >
                  {updating ? 'Updating...' : 'Update Status'} 
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
                    {statuses.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateOrderStatus(status.value)}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 transition flex items-center gap-2"
                      >
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-emerald-600 font-medium">🔑 You can manage this order</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-sm font-light text-amber-950 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-600" /> Order Items
          </h3>
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 pb-3 border-b border-slate-100 last:border-0">
              <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-light text-amber-950">{item.name}</h4>
                <p className="text-xs text-slate-400">Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">Qty: {item.quantity || item.qty || 1}</span>
                  <span className="text-sm font-medium text-amber-800">${(item.price * (item.quantity || item.qty || 1)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-light text-amber-950 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping?.toFixed(2) || '0.00'}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax</span>
                <span>${order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                <span className="text-amber-950">Total</span>
                <span className="text-amber-800 text-lg">${order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h4 className="text-sm font-light text-amber-950 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" /> Shipping Address
              </h4>
              <p className="text-sm text-slate-600">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 mb-3">Status History</h4>
            <div className="space-y-1.5">
              {order.statusHistory.slice().reverse().map((history, index) => (
                <div key={index} className="flex justify-between text-[10px] text-slate-400 border-b border-slate-50 pb-1">
                  <span>{history.status}</span>
                  <span>{new Date(history.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrderDetailsPage;