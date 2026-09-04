// backend/models/Cart.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    qty: { type: Number, default: 1 },
    size: { type: String, default: 'N/A' },
    color: { type: String, default: 'N/A' },
    vendorEmail: { type: String, default: 'fashion@store.com' },
    vendorName: { type: String, default: 'Fashion Vendor' },
    tenantId: { type: String, default: 'store_001' }
  }],
  totalItems: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);