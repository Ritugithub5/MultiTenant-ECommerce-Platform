// frontend/src/pages/Login.jsx
import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import client from '../api/apiClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('📤 Sending login request for:', email)
      const res = await client.post('/auth/login', { email, password })
      console.log('📥 Login response:', res.data)
      
      const { user, token } = res.data
      console.log('👤 User role from backend:', user.role)
      
      login(user, token)
      
      // ✅ Redirect based on role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin', { replace: true })
      } else if (user.role === 'vendor') {
        navigate('/vendor', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (email, password) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-amber-950">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email"
              className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password"
              className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-700 text-white rounded-full font-medium hover:bg-amber-600 transition disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-700 hover:text-amber-800 font-medium transition">
              Register
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-wider">Demo Credentials</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => demoLogin('admin@gmail.com', 'admin123')}
              className="w-full text-left px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition flex items-center justify-between"
            >
              <span><span className="font-medium">Vendor:</span> admin@gmail.com</span>
              <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Vendor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}