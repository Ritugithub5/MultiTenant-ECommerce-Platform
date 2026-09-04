// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id.toString() });
    if (!cart) {
      cart = new Cart({ userId: req.user._id.toString(), items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, name, price, image, qty, size, color, vendorEmail, vendorName, tenantId } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id.toString() });
    if (!cart) {
      cart = new Cart({ userId: req.user._id.toString(), items: [] });
    }
    
    // Check if item already exists (by productId and color)
    const existingIndex = cart.items.findIndex(
      item => item.productId === productId && item.color === color
    );
    
    if (existingIndex > -1) {
      cart.items[existingIndex].qty += qty || 1;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image,
        qty: qty || 1,
        size: size || 'N/A',
        color: color || 'N/A',
        vendorEmail: vendorEmail || 'fashion@store.com',
        vendorName: vendorName || 'Fashion Vendor',
        tenantId: tenantId || 'store_001'
      });
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, color, qty } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id.toString() });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId === productId && item.color === color
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].qty = qty;
    }
    
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove/:productId/:color', auth, async (req, res) => {
  try {
    const { productId, color } = req.params;
    
    let cart = await Cart.findOne({ userId: req.user._id.toString() });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => !(item.productId === productId && item.color === color)
    );
    
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/cart/clear - Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id.toString() });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    
    await cart.save();
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;