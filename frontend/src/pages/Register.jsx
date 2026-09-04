// frontend/src/pages/Register.jsx
import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import client from '../api/apiClient'
import { User, Mail, Lock, Store, ShoppingBag, UserPlus } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // ✅ Fixed: Generate tenantId safely
  const generateTenantId = () => {
    const timestamp = new Date().getTime().toString().slice(-6)
    return `store_${timestamp}`
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // ✅ Generate tenantId safely
      const tenantId = role === 'vendor' ? generateTenantId() : 'default'
      
      console.log('📤 Registering user:', { name, email, role, tenantId })
      
      const res = await client.post('/auth/register', { 
        name, 
        email, 
        password, 
        role,
        tenantId: tenantId
      })
      
      console.log('✅ Registration response:', res.data)
      const { user, token } = res.data
      
      setSuccess(true)
      
      setTimeout(() => {
        login(user, token)
        if (user.role === 'vendor') {
          navigate('/vendor')
        } else {
          navigate('/')
        }
      }, 1500)
      
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data || err.message)
      setError(err.response?.data?.msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-light text-amber-950">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join MultiStore today</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-lg text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-medium text-emerald-800">Registration Successful!</h3>
            <p className="text-sm text-emerald-600 mt-1">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="text"
                  className="w-full border border-slate-200 pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="email"
                  className="w-full border border-slate-200 pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="password"
                  className="w-full border border-slate-200 pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">At least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="password"
                  className="w-full border border-slate-200 pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">I want to:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 border rounded-lg text-center transition ${
                    role === 'customer' 
                      ? 'border-amber-800 bg-amber-50 text-amber-800' 
                      : 'border-slate-200 hover:border-amber-300 text-slate-600'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Shop as Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`p-3 border rounded-lg text-center transition ${
                    role === 'vendor' 
                      ? 'border-amber-800 bg-amber-50 text-amber-800' 
                      : 'border-slate-200 hover:border-amber-300 text-slate-600'
                  }`}
                >
                  <Store className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Sell as Vendor</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ❌ {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-700 text-white rounded-full font-medium hover:bg-amber-600 transition disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-slate-400 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-700 hover:text-amber-800 font-medium transition">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}