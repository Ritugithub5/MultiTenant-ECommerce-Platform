// frontend/src/pages/VendorDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle, Truck, DollarSign, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/vendor' } } });
      return;
    }

    // ✅ Only vendors can access
    if (user.role !== 'vendor') {
      navigate('/');
      return;
    }

    loadVendorData();
  }, [user, navigate]);

  const loadVendorData = () => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('📦 All orders in localStorage:', savedOrders.length);
      
      // ✅ Show ALL orders - NO FILTERING
      const vendorOrders = savedOrders;
      
      console.log('🛒 Orders to display:', vendorOrders.length);
      
      // ✅ Reverse to show newest first
      setOrders(vendorOrders.reverse());
      
      const totalOrders = vendorOrders.length;
      const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const processing = vendorOrders.filter(o => o.status === 'Processing').length;
      const shipped = vendorOrders.filter(o => o.status === 'Shipped').length;
      const delivered = vendorOrders.filter(o => o.status === 'Delivered').length;
      const cancelled = vendorOrders.filter(o => o.status === 'Cancelled').length;

      setStats({
        totalOrders,
        totalRevenue,
        processing,
        shipped,
        delivered,
        cancelled
      });
      
    } catch (error) {
      console.error('Error loading vendor data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light text-amber-950">Vendor Dashboard</h1>
            <p className="text-sm text-slate-400">Welcome back, {user?.name}</p>
            <p className="text-xs text-slate-400 mt-1">Email: {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Vendor</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{orders.length} Orders</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400">Total Orders</p>
            <p className="text-2xl font-light text-amber-950">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400">Revenue</p>
            <p className="text-2xl font-light text-amber-950">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400">Processing</p>
            <p className="text-2xl font-light text-amber-950">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400">Delivered</p>
            <p className="text-2xl font-light text-amber-950">{stats.delivered}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-light text-amber-950 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-light text-amber-950 mb-2">No orders yet</h3>
              <p className="text-sm text-slate-400">When customers place orders, they'll appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Order ID</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Total</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/50 transition">
                      <td className="px-6 py-3 text-sm text-amber-950">#{order.id}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {order.shippingAddress?.firstName || 'Unknown'} {order.shippingAddress?.lastName || ''}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-amber-800">
                        ${order.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <Link 
                          to={`/vendor/order/${order.id}`}
                          className="text-xs text-amber-600 hover:text-amber-800 transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;