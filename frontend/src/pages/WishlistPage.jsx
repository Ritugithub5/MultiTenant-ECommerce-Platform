import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Women's Images
import dressImg from "../image/dress.png";
import dress1Img from "../image/dress1.png";
import topImg from "../image/top.png";
import trouserImg from "../image/trouser.png";
import trouser1Img from "../image/trouser1.png";
import anarkaliImg from "../image/anarkali.png";

// Men's Images
import tshirt1Img from "../image/tshirt1.png";
import tshirt2Img from "../image/tshirt2.png";
import cargoImg from "../image/cargo.png";
import kurtaImg from "../image/kurta.png";
import kurta1Img from "../image/kurta1.png";

// Electronics Images
import tableImg from "../image/tablet.png";
import dellImg from "../image/dell.png";
import earbudImg from "../image/earbud.png";
import headphoneImg from "../image/headphone.png";
import pixelImg from "../image/pixel.png";

// Sunglasses Images
import sunglass1Img from "../image/sunglass1.png";
import sunglass2Img from "../image/sunglass2.png";
import sunglass3Img from "../image/sunglass3.png";

// Bags Images
import wallet2Img from "../image/wallet2.png";
import bag1Img from "../image/bag1.png";
import bag2Img from "../image/bag2.png";
import bag3Img from "../image/bag3.png";
import wallet1Img from "../image/wallet1.png";

// Jewelry Images
import jewelry from "../image/jewelry.png";
import pandent1Img from "../image/pandent1.png";
import pandent2Img from "../image/pandent2.png";
import bracelet1Img from "../image/bracelet1.png";
import bracelet2Img from "../image/bracelet2.png";

// Watches Images
import watch1Img from "../image/watch1.png";
import watch2Img from "../image/watch2.png";
import watch3Img from "../image/watch3.png";

// Footwear Images
import shoes1Img from "../image/shoes1.png";
import shoes2Img from "../image/shoes2.png";
import heel1Img from "../image/heel1.png";
import heel2Img from "../image/heel2.png";
import footwearImg from "../image/footwear.png";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);

  // ✅ COMPLETE PRODUCT DATABASE - Add ALL your products here
  const productDatabase = {
    // Women's Fashion
    'featured-dress-01': { 
      name: 'Off-Shoulder Silk Evening Gown', 
      price: 450, 
      category: 'Dresses',
      colorImages: {
        'Black': dressImg,
        'Red': dress1Img,
        'Navy': dressImg,
        'Blush': dress1Img,
        'Wine': dress1Img
      }
    },
    'featured-top-02': { 
      name: 'Draped Mesh Wrap Top', 
      price: 180, 
      category: 'Tops',
      colorImages: {
        'Wine': topImg,
        'Black': topImg,
        'Emerald': topImg
      }
    },
    'featured-trouser-03': { 
      name: 'Pleated Wide-Leg Trousers', 
      price: 220, 
      category: 'Trousers',
      colorImages: {
        'Mocha': trouserImg,
        'Charcoal': trouserImg,
        'Cream': trouser1Img
      }
    },
    'featured-anarkali-04': { 
      name: 'Printed Silk Anarkali Set', 
      price: 320, 
      category: 'Ethnic',
      colorImages: {
        'Rose': anarkaliImg,
        'Teal': anarkaliImg,
        'Gold': anarkaliImg
      }
    },
    // ✅ ADD YOUR NEW PRODUCTS HERE
    'dusty-pink-kurta': { 
      name: 'Dusty Pink Embroidered Kurta', 
      price: 72, 
      category: 'Ethnic',
      colorImages: {
        'Green': anarkaliImg,
        'Magenta': anarkaliImg
      }
    },
    // Men's Fashion
    'anime-graphic-tee': { 
      name: 'Anime Graphic Tee', 
      price: 45, 
      category: 'T-Shirts',
      colorImages: { 'Default': tshirt1Img }
    },
    'la-oversized-hoodie': { 
      name: 'LA Oversized Hoodie', 
      price: 89, 
      category: 'Hoodies',
      colorImages: { 'Default': tshirt2Img }
    },
    'relaxed-olive-cargos': { 
      name: 'Relaxed Olive Cargos', 
      price: 79, 
      category: 'Cargos',
      colorImages: { 'Default': cargoImg }
    },
    'chikan-embroidered-kurta': { 
      name: 'Chikan Embroidered Kurta', 
      price: 149, 
      category: 'Kurtas',
      colorImages: { 'Default': kurtaImg }
    },
    // Electronics
    'dell-performance-laptop': { 
      name: 'Dell Performance Laptop', 
      price: 1299, 
      category: 'Laptops',
      colorImages: { 'Default': dellImg }
    },
    'google-pixel-smartphone': { 
      name: 'Google Pixel Smartphone', 
      price: 899, 
      category: 'Phones',
      colorImages: { 'Default': pixelImg }
    },
    'moto-pad-70-tablet': { 
      name: 'Moto Pad 70 Tablet', 
      price: 499, 
      category: 'Tablets',
      colorImages: { 'Default': tableImg }
    },
    'studio-pro-headphones': { 
      name: 'Studio Pro Headphones', 
      price: 199, 
      category: 'Audio',
      colorImages: { 'Default': headphoneImg }
    },
    'champagne-gold-earbuds': { 
      name: 'Champagne Gold Earbuds', 
      price: 149, 
      category: 'Audio',
      colorImages: { 'Default': earbudImg }
    },
    // Sunglasses
    'classic-gold-aviator': { 
      name: 'Classic Gold Aviator', 
      price: 159, 
      category: 'Sunglasses',
      colorImages: { 'Default': sunglass1Img }
    },
    'matte-black-wayfarer': { 
      name: 'Matte Black Wayfarer', 
      price: 129, 
      category: 'Sunglasses',
      colorImages: { 'Default': sunglass2Img }
    },
    'vintage-round-tortoise': { 
      name: 'Vintage Round Tortoise', 
      price: 179, 
      category: 'Sunglasses',
      colorImages: { 'Default': sunglass3Img }
    },
    // Bags
    'lavie-paris-monogram-wallet': { 
      name: 'Lavie Paris Monogram Wallet', 
      price: 89, 
      category: 'Wallets',
      colorImages: { 'Default': wallet2Img }
    },
    'cream-crossbody-handbag': { 
      name: 'Cream Crossbody Handbag', 
      price: 199, 
      category: 'Bags',
      colorImages: { 'Default': bag3Img }
    },
    'rugged-olive-canvas-duffel': { 
      name: 'Rugged Olive Canvas Duffel', 
      price: 149, 
      category: 'Bags',
      colorImages: { 'Default': bag2Img }
    },
    'london-alley-leather-wallet': { 
      name: 'London Alley Leather Wallet', 
      price: 69, 
      category: 'Wallets',
      colorImages: { 'Default': wallet1Img }
    },
    'cute-character-kids-backpack': { 
      name: 'Cute Character Kids Backpack', 
      price: 59, 
      category: 'Bags',
      colorImages: { 'Default': bag1Img }
    },
    // Jewelry
    'celestial-silver-pendant-set': { 
      name: 'Celestial Silver Pendant Set', 
      price: 249, 
      category: 'Pendants',
      colorImages: { 'Default': pandent1Img }
    },
    'gold-textured-link-bracelet': { 
      name: 'Gold Textured Link Bracelet', 
      price: 189, 
      category: 'Bracelets',
      colorImages: { 'Default': bracelet2Img }
    },
    'purple-beaded-bow-jewelry-set': { 
      name: 'Purple Beaded Bow Jewelry Set', 
      price: 129, 
      category: 'Bracelets',
      colorImages: { 'Default': bracelet1Img }
    },
    'bullet-pendant-steel-chain': { 
      name: 'Bullet Pendant Steel Chain', 
      price: 79, 
      category: 'Pendants',
      colorImages: { 'Default': pandent2Img }
    },
    // Watches
    'lois-caron-emerald-steel': { 
      name: 'Lois Caron Emerald Steel', 
      price: 399, 
      category: 'Watches',
      colorImages: { 'Default': watch1Img }
    },
    'rose-gold-butterfly-crystal': { 
      name: 'Rose Gold Butterfly Crystal', 
      price: 459, 
      category: 'Watches',
      colorImages: { 'Default': watch3Img }
    },
    'monogram-r-silver-quartz': { 
      name: 'Monogram R Silver Quartz', 
      price: 299, 
      category: 'Watches',
      colorImages: { 'Default': watch2Img }
    },
    // Footwear
    'patent-leather-loafer': { 
      name: 'Patent Leather Loafer', 
      price: 249, 
      category: 'Loafers',
      colorImages: { 'Default': shoes2Img }
    },
    'strappy-stiletto-mules': { 
      name: 'Strappy Stiletto Mules', 
      price: 299, 
      category: 'Heels',
      colorImages: { 'Default': heel1Img }
    },
    'embellished-ethnic-jutti': { 
      name: 'Embellished Ethnic Jutti', 
      price: 179, 
      category: 'Juttis',
      colorImages: { 'Default': heel2Img }
    },
    'cushioned-runner-sneaker': { 
      name: 'Cushioned Runner Sneaker', 
      price: 199, 
      category: 'Sneakers',
      colorImages: { 'Default': shoes1Img }
    },
    'classic-oxford-brogue': { 
      name: 'Classic Oxford Brogue', 
      price: 279, 
      category: 'Oxfords',
      colorImages: { 'Default': footwearImg }
    },
  };

  // Load wishlist function
  const loadWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log('📦 Wishlist data:', wishlist);
      
      const items = wishlist
        .map(item => {
          const product = productDatabase[item.productId];
          console.log(`🔍 Looking for: ${item.productId}`, product ? '✅ Found' : '❌ Not found');
          
          if (product) {
            const colorImage = product.colorImages?.[item.color] || product.colorImages?.['Default'] || dressImg;
            
            return { 
              id: item.productId,
              color: item.color || 'Default',
              image: colorImage,
              name: product.name,
              price: product.price,
              category: product.category
            };
          }
          return null;
        })
        .filter(item => item !== null);
      
      console.log('✅ Final wishlist items:', items);
      setWishlistItems(items);
    } catch (e) {
      console.error('Error loading wishlist:', e);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in - Redirect if not
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/WishlistPage' } } });
      return;
    }
    loadWishlist();
  }, [user, authLoading, navigate]);

  // Listen for wishlist updates
  useEffect(() => {
    if (!user) return;

    const handleStorageChange = (e) => {
      if (e.key === 'wishlist') {
        loadWishlist();
      }
    };

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  // Remove from wishlist
  const removeFromWishlist = (productId, color) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updated = wishlist.filter(item => 
        !(item.productId === productId && item.color === color)
      );
      localStorage.setItem('wishlist', JSON.stringify(updated));
      loadWishlist();
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error removing from wishlist:', e);
    }
  };

  // Add to cart from wishlist
  const addToCart = (item) => {
    try {
      // Add to cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const existingIndex = cart.findIndex(
        (cartItem) => cartItem.productId === item.id && cartItem.color === item.color
      );
      
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: 1,
          size: 'N/A',
          color: item.color
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Remove from wishlist
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updatedWishlist = wishlist.filter(w => 
        !(w.productId === item.id && w.color === item.color)
      );
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Update UI
      loadWishlist();
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('storage'));
      
      setAddedToCart(`${item.color} ${item.name}`);
      setTimeout(() => setAddedToCart(null), 3000);
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-amber-800 text-xs font-light">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-light text-amber-950 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400 text-sm mb-6">Save your favorite items here</p>
          <Link to="/products" className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs uppercase tracking-wider rounded-full hover:bg-amber-700 transition">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-amber-950">Wishlist</h1>
          <span className="text-sm text-slate-400">{wishlistItems.length} items</span>
        </div>

        {addedToCart && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>✅ Added <strong>{addedToCart}</strong> to cart!</span>
            <Link to="/CartPage" className="text-emerald-800 font-medium hover:underline text-xs">
              View Cart →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => (
            <div key={`${item.id}-${item.color}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="relative bg-stone-100 aspect-square overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`${item.name} - ${item.color}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.color}
                </span>
                <button 
                  onClick={() => removeFromWishlist(item.id, item.color)} 
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition shadow-sm"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-red-500 transition" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-light text-amber-950 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-slate-400">Color: <span className="font-medium text-slate-600">{item.color}</span></p>
                <p className="text-sm font-medium text-amber-800 mt-0.5">${item.price}</p>
                <button 
                  onClick={() => addToCart(item)} 
                  className="w-full mt-2 py-1.5 bg-amber-800 text-white text-[10px] uppercase tracking-wider rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3 h-3" /> Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/CartPage" className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs uppercase tracking-wider rounded-full hover:bg-amber-700 transition">
            View Cart →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;