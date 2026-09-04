// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  customerName: { type: String, default: 'Guest' },
  customerRole: { type: String, default: 'customer' },
  
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    qty: { type: Number, default: 1 },
    size: { type: String, default: 'N/A' },
    color: { type: String, default: 'N/A' },
    image: { type: String, default: 'https://via.placeholder.com/100' }
  }],
  
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'United States' }
  },
  
  paymentMethod: { type: String, default: 'Credit Card' },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing' 
  },
  
  vendorEmail: { type: String, default: 'fashion@store.com', index: true },
  vendorName: { type: String, default: 'Fashion Vendor' },
  tenantId: { type: String, default: 'store_001' },
  
  placedBy: { type: String },
  placedByRole: { type: String, default: 'customer' },
  
  statusHistory: [{
    status: { type: String },
    date: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);