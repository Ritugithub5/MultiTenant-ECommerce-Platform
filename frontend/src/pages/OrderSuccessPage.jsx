import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/OrderSuccessPage' } } });
      return;
    }

    const id = location.state?.orderId || 'ORD-' + Date.now().slice(-6);
    setOrderId(id);
    setLoading(false);
  }, [user, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-light text-amber-950 mb-2">Order Placed! 🎉</h1>
        <p className="text-slate-500 text-sm mb-1">Thank you for your purchase</p>
        <p className="text-slate-400 text-xs">Order #{orderId}</p>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mt-6 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Order Status</p>
                <p className="text-sm font-medium text-amber-950">Processing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Estimated Delivery</p>
                <p className="text-sm font-medium text-amber-950">5-7 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Order Date</p>
                <p className="text-sm font-medium text-amber-950">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">A confirmation email has been sent to your email address.</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to="/OrdersPage" className="flex-1 bg-amber-800 text-white py-2.5 rounded-full hover:bg-amber-700 transition text-xs uppercase tracking-wider">
            View My Orders
          </Link>
          <Link to="/products" className="flex-1 border border-slate-200 py-2.5 rounded-full hover:border-amber-800 hover:text-amber-800 transition text-xs uppercase tracking-wider">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;