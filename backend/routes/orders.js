// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// GET /api/orders - Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    
    let query = {};
    
    if (userRole === 'vendor') {
      // Vendor sees orders for their store
      query = { vendorEmail: req.user.email };
    } else if (userRole === 'admin' || userRole === 'superadmin') {
      // Admin sees all orders
      query = {};
    } else {
      // Customer sees their own orders
      query = { userId: userId };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check authorization
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    
    if (userRole === 'customer' && order.userId !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    if (userRole === 'vendor' && order.vendorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/orders/create - Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const { 
      items, subtotal, shipping, tax, total, 
      shippingAddress, paymentMethod, vendorEmail, vendorName, tenantId 
    } = req.body;
    
    // Generate order ID
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.random().toString(36).slice(-4).toUpperCase();
    const orderId = 'ORD-' + timestamp + '-' + random;
    
    const order = new Order({
      orderId: orderId,
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      customerName: req.user.name || 'Guest',
      customerRole: req.user.role || 'customer',
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Processing',
      vendorEmail: vendorEmail || 'fashion@store.com',
      vendorName: vendorName || 'Fashion Vendor',
      tenantId: tenantId || 'store_001',
      placedBy: req.user.email,
      placedByRole: req.user.role || 'customer',
      statusHistory: [{
        status: 'Processing',
        date: new Date(),
        note: 'Order placed'
      }]
    });
    
    await order.save();
    
    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id.toString() },
      { items: [], totalItems: 0, totalPrice: 0 }
    );
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const userRole = req.user.role;
    
    // Only vendors and admins can update status
    if (userRole !== 'vendor' && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Vendor can only update their own orders
    if (userRole === 'vendor' && order.vendorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    order.status = status;
    order.statusHistory.push({
      status: status,
      date: new Date(),
      note: `Status updated to ${status} by ${req.user.name} (${userRole})`
    });
    
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;