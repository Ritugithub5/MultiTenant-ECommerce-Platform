import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ShoppingBag, Heart, Package, User, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateCounts = () => {
      // Only count if user is logged in
      if (user) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        setCartCount(totalItems);

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(wishlist.length);
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/WomenFashionPage', label: 'Women' },
    { to: '/MenFashionPage', label: 'Men' },
    { to: '/about', label: 'About' },
    { to: '/electronics', label: 'Electronics' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🏪</span>
            <span className="font-light text-xl text-amber-950 tracking-tight group-hover:text-amber-700 transition">
              Multi<span className="font-serif italic text-amber-700">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-slate-600 hover:text-amber-800 font-medium transition relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* ✅ Wishlist - Only show if logged in */}
            {user && (
              <Link to="/WishlistPage" className="relative text-slate-500 hover:text-amber-700 transition p-2 rounded-full hover:bg-amber-50" title="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* ✅ Orders - Only show if logged in */}
            {user && (
              <Link to="/OrdersPage" className="text-slate-500 hover:text-amber-700 transition p-2 rounded-full hover:bg-amber-50" title="Orders">
                <Package className="w-5 h-5" />
              </Link>
            )}

            {/* ✅ Cart - Only show if logged in */}
            {user && (
              <Link to="/CartPage" className="relative text-slate-500 hover:text-amber-700 transition p-2 rounded-full hover:bg-amber-50" title="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200">
                <span className="text-sm text-slate-700">{user.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {user.role}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-red-500 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm text-amber-700 hover:text-amber-800 font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-1.5 bg-amber-700 text-white text-sm rounded-full hover:bg-amber-600 transition font-medium shadow-sm hover:shadow-md">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm text-slate-600 hover:text-amber-800 font-medium transition px-2 py-1.5 hover:bg-amber-50 rounded"
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link to="/WishlistPage" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-600 hover:text-amber-800 font-medium transition px-2 py-1.5 hover:bg-amber-50 rounded">
                  ❤️ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/OrdersPage" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-600 hover:text-amber-800 font-medium transition px-2 py-1.5 hover:bg-amber-50 rounded">
                  📦 Orders
                </Link>
                <Link to="/CartPage" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-600 hover:text-amber-800 font-medium transition px-2 py-1.5 hover:bg-amber-50 rounded">
                  🛒 Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <div className="flex items-center gap-3 px-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{user.name}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-500 hover:text-red-600 font-medium px-2 py-1.5 hover:bg-red-50 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm text-amber-700 hover:text-amber-800 font-medium px-2 py-1.5 hover:bg-amber-50 rounded">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-sm bg-amber-700 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}