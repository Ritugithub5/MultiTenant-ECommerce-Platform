// backend/middleware/auth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' })
    }
    console.log('🔑 Auth middleware - User:', req.user.email, 'Role:', req.user.role)
    next()
  } catch (err) {
    console.error('❌ Auth error:', err.message)
    return res.status(401).json({ msg: 'Invalid token' })
  }
}

module.exports = auth