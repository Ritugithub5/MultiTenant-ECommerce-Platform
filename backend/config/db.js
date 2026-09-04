const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/multitenant_mvp';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Please make sure MongoDB is running');
    console.error('💡 Run: mongod --dbpath ~/data/db');
    process.exit(1);
  }
};

module.exports = connectDB;