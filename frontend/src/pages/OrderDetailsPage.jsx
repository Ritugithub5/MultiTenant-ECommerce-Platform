// frontend/src/pages/OrderDetailsPage.jsx
// ✅ Customer sees only tracking (read-only) - NO status update dropdown

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Package, Truck, Calendar, MapPin, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Only customers can view their orders (read-only)
  const isCustomer = user?.role === 'customer' || user?.role === undefined;

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/OrdersPage' } } });
      return;
    }

    // ✅ Customers can only see their own orders
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = savedOrders.find(o => 
      o.id === id && (o.userId === user.email || o.userId === user._id)
    );
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [id, user, navigate]);

  const statuses = [
    { value: 'Processing', label: 'Order Confirmed', icon: Clock, description: 'Your order has been confirmed and is being prepared.' },
    { value: 'Shipped', label: 'Shipped', icon: Package, description: 'Your order has been shipped and is on its way.' },
    { value: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, description: 'Your order is out for delivery today!' },
    { value: 'Delivered', label: 'Delivered', icon: CheckCircle, description: 'Your order has been delivered successfully!' },
    { value: 'Cancelled', label: 'Cancelled', icon: AlertCircle, description: 'Your order has been cancelled.' },
  ];

  const getStatusDetails = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getStatusPercentage = (status) => {
    const percentages = {
      'Processing': 25,
      'Shipped': 50,
      'Out for Delivery': 75,
      'Delivered': 100,
      'Cancelled': 0
    };
    return percentages[status] || 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-amber-100 text-amber-800 border-amber-200',
      'Shipped': 'bg-blue-100 text-blue-800 border-blue-200',
      'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
      'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEstimatedDelivery = () => {
    const date = new Date(order?.date);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
          <Link to="/OrdersPage" className="text-amber-800 hover:underline text-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = getStatusDetails(order.status);
  const StatusIcon = currentStatus.icon;
  const progressPercentage = getStatusPercentage(order.status);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/OrdersPage" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-800 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-xl font-light text-amber-950">Order #{order.id}</h1>
              <p className="text-sm text-slate-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-4 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              {/* ✅ Customer gets NO status update button - read-only */}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <User className="w-3 h-3" />
            <span>Order placed by: {order.userEmail || 'Guest'}</span>
            <span className="text-slate-400">• 👀 View only</span>
          </div>
        </div>

        {/* ✅ Order Tracking - Customer View (Read-Only) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-amber-950 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" /> Order Tracking
            </h3>
            <div className="text-right">
              <p className="text-xs text-slate-400">Estimated Delivery</p>
              <p className="text-sm font-medium text-amber-800">{getEstimatedDelivery()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Order Placed</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-slate-200" />
            
            {statuses.filter(s => s.value !== 'Cancelled').map((status, index) => {
              const isCompleted = getStatusPercentage(order.status) >= getStatusPercentage(status.value);
              const isCurrent = order.status === status.value;
              const StatusIconStep = status.icon;
              
              return (
                <div key={status.value} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted ? 'bg-amber-50 text-amber-600 border-2 border-amber-200' : 'bg-slate-100 text-slate-300 border-2 border-slate-200'
                    } ${isCurrent ? 'ring-4 ring-amber-200 shadow-lg' : ''}`}>
                      <StatusIconStep className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-medium ${
                        isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {status.label}
                      </h4>
                      {isCompleted && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Done</span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full animate-pulse">● In Progress</span>
                      )}
                    </div>
                    
                    <p className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                      {isCompleted ? status.description : 'Waiting...'}
                    </p>
                    
                    {isCurrent && order.statusHistory && order.statusHistory.length > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated: {new Date(order.statusHistory[order.statusHistory.length - 1]?.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-sm font-light text-amber-950 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" /> Order Items
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
      </div>
    </div>
  );
};

export default OrderDetailsPage;