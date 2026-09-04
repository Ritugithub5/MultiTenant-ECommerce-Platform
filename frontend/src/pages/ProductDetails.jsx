import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield, Minus, Plus, ChevronLeft } from 'lucide-react';
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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Map image names to local imports
  const imageMap = {
    "dress.png": dressImg,
    "dress1.png": dress1Img,
    "top.png": topImg,
    "trouser.png": trouserImg,
    "trouser1.png": trouser1Img,
    "anarkali.png": anarkaliImg,
    "tshirt1.png": tshirt1Img,
    "tshirt2.png": tshirt2Img,
    "cargo.png": cargoImg,
    "kurta.png": kurtaImg,
    "kurta1.png": kurta1Img,
    "dell.png": dellImg,
    "pixel.png": pixelImg,
    "tablet.png": tableImg,
    "headphone.png": headphoneImg,
    "earbud.png": earbudImg,
    "sunglass1.png": sunglass1Img,
    "sunglass2.png": sunglass2Img,
    "sunglass3.png": sunglass3Img,
    "wallet2.png": wallet2Img,
    "bag1.png": bag1Img,
    "bag2.png": bag2Img,
    "bag3.png": bag3Img,
    "wallet1.png": wallet1Img,
    "pandent1.png": pandent1Img,
    "pandent2.png": pandent2Img,
    "bracelet1.png": bracelet1Img,
    "bracelet2.png": bracelet2Img,
    "jewelry.png": jewelry,
    "watch1.png": watch1Img,
    "watch2.png": watch2Img,
    "watch3.png": watch3Img,
    "shoes1.png": shoes1Img,
    "shoes2.png": shoes2Img,
    "heel1.png": heel1Img,
    "heel2.png": heel2Img,
    "footwear.png": footwearImg,
  };

  // Map product IDs to default images
  const defaultImages = {
    "featured-dress-01": dressImg,
    "featured-top-02": topImg,
    "featured-trouser-03": trouserImg,
    "featured-anarkali-04": anarkaliImg,
    "anime-graphic-tee": tshirt1Img,
    "la-oversized-hoodie": tshirt2Img,
    "relaxed-olive-cargos": cargoImg,
    "chikan-embroidered-kurta": kurtaImg,
    "dell-performance-laptop": dellImg,
    "google-pixel-smartphone": pixelImg,
    "moto-pad-70-tablet": tableImg,
    "studio-pro-headphones": headphoneImg,
    "champagne-gold-earbuds": earbudImg,
    "classic-gold-aviator": sunglass1Img,
    "matte-black-wayfarer": sunglass2Img,
    "vintage-round-tortoise": sunglass3Img,
    "lavie-paris-monogram-wallet": wallet2Img,
    "cream-crossbody-handbag": bag3Img,
    "rugged-olive-canvas-duffel": bag2Img,
    "london-alley-leather-wallet": wallet1Img,
    "cute-character-kids-backpack": bag1Img,
    "celestial-silver-pendant-set": pandent1Img,
    "gold-textured-link-bracelet": bracelet2Img,
    "purple-beaded-bow-jewelry-set": bracelet1Img,
    "bullet-pendant-steel-chain": pandent2Img,
    "lois-caron-emerald-steel": watch1Img,
    "rose-gold-butterfly-crystal": watch3Img,
    "monogram-r-silver-quartz": watch2Img,
    "patent-leather-loafer": shoes2Img,
    "strappy-stiletto-mules": heel1Img,
    "embellished-ethnic-jutti": heel2Img,
    "cushioned-runner-sneaker": shoes1Img,
    "classic-oxford-brogue": footwearImg,
  };

  // ✅ Check wishlist status ONLY if logged in
  useEffect(() => {
    if (!user) {
      setIsWishlisted(false);
      return;
    }
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const colorName = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
      
      const exists = wishlist.some(item => 
        item.productId === id && item.color === colorName
      );
      setIsWishlisted(exists);
    } catch (e) {
      setIsWishlisted(false);
    }
  }, [id, selectedColor, user]);

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Try to fetch from API first
        try {
          const response = await fetch(`http://localhost:4000/api/products/${id}`);
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Product from API:", data);
            
            const productData = data;
            let imageToShow = defaultImages[id] || dressImg;
            
            if (productData.image && imageMap[productData.image]) {
              imageToShow = imageMap[productData.image];
            }
            
            productData.image = imageToShow;
            setCurrentImage(imageToShow);
            
            if (productData.metadata?.colors && productData.metadata.colors.length > 0) {
              setSelectedColor(productData.metadata.colors[0]);
            }
            
            setProduct(productData);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log("⚠️ API not available, using mock data");
        }
        
        // ✅ Fallback to mock data
        const mockData = getMockProduct(id);
        if (mockData) {
          console.log("✅ Using mock product:", mockData);
          setProduct(mockData);
          setCurrentImage(mockData.image);
          if (mockData.metadata?.colors && mockData.metadata.colors.length > 0) {
            setSelectedColor(mockData.metadata.colors[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ✅ Mock product data
  const getMockProduct = (productId) => {
    const mockProducts = {
      'featured-dress-01': {
        _id: 'featured-dress-01',
        name: 'Off-Shoulder Silk Evening Gown',
        category: 'Dresses',
        price: 450,
        image: dressImg,
        badge: 'Couture',
        description: 'Sculpted drape bodice with an asymmetric train. Crafted from pure silk with hand-embroidered details.',
        metadata: {
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Black', 'Red', 'Navy', 'Blush'],
          rating: 4.8,
          reviews: 124,
          brand: 'Maison Luxe',
          material: '100% Silk',
          care: 'Dry clean only'
        }
      },
      'featured-top-02': {
        _id: 'featured-top-02',
        name: 'Draped Mesh Wrap Top',
        category: 'Tops',
        price: 180,
        image: topImg,
        badge: 'Trending',
        description: 'Sheer pleated overlay in rich wine hue. Perfect for evening occasions.',
        metadata: {
          sizes: ['XS', 'S', 'M', 'L'],
          colors: ['Wine', 'Black', 'Emerald'],
          rating: 4.6,
          reviews: 89,
          brand: 'Studio Noir',
          material: 'Premium Mesh',
          care: 'Hand wash recommended'
        }
      },
      'featured-trouser-03': {
        _id: 'featured-trouser-03',
        name: 'Pleated Wide-Leg Trousers',
        category: 'Trousers',
        price: 220,
        image: trouserImg,
        badge: 'Tailored',
        description: 'High-waisted silhouette in mocha wool blend. Effortless elegance for the modern woman.',
        metadata: {
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Mocha', 'Charcoal', 'Cream'],
          rating: 4.7,
          reviews: 67,
          brand: 'Tailored Threads',
          material: 'Wool Blend',
          care: 'Dry clean only'
        }
      },
      'featured-anarkali-04': {
        _id: 'featured-anarkali-04',
        name: 'Printed Silk Anarkali Set',
        category: 'Ethnic',
        price: 320,
        image: anarkaliImg,
        badge: 'Heritage',
        description: 'Floral block print paired with sheer dupatta. A celebration of timeless Indian craftsmanship.',
        metadata: {
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Rose', 'Teal', 'Gold'],
          rating: 4.9,
          reviews: 203,
          brand: 'Heritage Weaves',
          material: 'Pure Silk',
          care: 'Dry clean only'
        }
      }
    };
    return mockProducts[productId] || null;
  };

  // ✅ Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
    let newImage;
    
    if (typeof color === "object" && color.image && imageMap[color.image]) {
      newImage = imageMap[color.image];
    } else {
      newImage = defaultImages[id] || dressImg;
    }
    
    setCurrentImage(newImage);
    
    // Only update wishlist if logged in
    if (!user) return;
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const colorName = typeof color === 'object' ? color.name : color;
      const existingIndex = wishlist.findIndex(item => 
        item.productId === id && item.color === colorName
      );
      
      if (existingIndex > -1) {
        wishlist[existingIndex].image = newImage;
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (e) {
      console.error('Error updating wishlist:', e);
    }
  };

  // ✅ Add to Cart - Works only when logged in
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    if (!product) return;

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const colorName = typeof selectedColor === "object" ? selectedColor.name : selectedColor;
      
      const existingIndex = cart.findIndex(
        (item) => item.productId === product._id && item.color === colorName
      );
      
      if (existingIndex > -1) {
        cart[existingIndex].qty += quantity;
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: currentImage || product.image,
          qty: quantity,
          size: selectedSize || "N/A",
          color: colorName || "N/A",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (e) {
      console.error('Cart error:', e);
    }
  };

  // ✅ Wishlist - Works ONLY when logged in
  const handleWishlist = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    if (!product) return;

    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const colorName = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
      const colorImage = currentImage || defaultImages[id] || dressImg;
      
      const existingIndex = wishlist.findIndex(item => 
        item.productId === product._id && item.color === colorName
      );
      
      let updatedWishlist;
      
      if (existingIndex > -1) {
        updatedWishlist = wishlist.filter((_, index) => index !== existingIndex);
      } else {
        updatedWishlist = [...wishlist, { 
          productId: product._id, 
          color: colorName || 'Default',
          image: colorImage
        }];
      }
      
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(!isWishlisted);
      
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Wishlist error:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-amber-800 text-xs font-light">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-xl font-light text-amber-950 mb-2">Product Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">{error || `No product found with ID: ${id}`}</p>
          <Link to="/products" className="inline-block px-6 py-2.5 bg-amber-800 text-white text-xs uppercase tracking-wider rounded-full hover:bg-amber-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const sizes = product.metadata?.sizes || ["S", "M", "L", "XL"];
  const colors = product.metadata?.colors || ["Black", "White", "Navy"];
  const badge = product.badge || product.metadata?.badge || "";
  const brand = product.metadata?.brand || "";
  const material = product.metadata?.material || "";
  const rating = product.metadata?.rating || 4.5;
  const reviews = product.metadata?.reviews || 0;
  const care = product.metadata?.care || "";
  const displayImage = currentImage || product.image || dressImg;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Link to="/" className="hover:text-amber-800 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-800 capitalize transition">
            {product.category || 'Products'}
          </Link>
          <span>/</span>
          <span className="text-amber-800 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Success Message */}
        {addedToCart && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> ✓ Added to cart!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT - Product Image */}
          <div>
            <div className="relative bg-stone-100 rounded-xl overflow-hidden aspect-[3/4] max-h-[550px] flex items-center justify-center p-6">
              <img
                src={displayImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = dressImg;
                }}
              />
              {badge && (
                <span className="absolute top-3 left-3 bg-stone-900/90 text-amber-100 text-[10px] px-3 py-1 rounded-full">
                  {badge}
                </span>
              )}
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-sm group"
                title={user ? "Add to Wishlist" : "Login to add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 transition ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                  }`}
                />
                {!user && (
                  <span className="absolute -top-8 right-0 bg-black/80 text-white text-[8px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Login required
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT - Product Details */}
          <div className="space-y-4">
            {brand && (
              <span className="text-xs tracking-widest uppercase text-slate-400 font-medium">
                {brand}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-light text-amber-950 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-medium text-slate-700">{rating}</span>
                <span className="text-slate-400">({reviews} reviews)</span>
              </div>
              <span className="text-emerald-600 font-medium text-sm">
                ✓ In Stock
              </span>
            </div>

            <div className="text-2xl font-light text-amber-950">
              ${product.price?.toFixed(2)}
            </div>

            <p className="text-slate-600 font-light text-sm leading-relaxed">
              {product.description || "Beautiful piece from our collection."}
            </p>

            {material && (
              <div className="text-sm">
                <span className="text-slate-400">Material: </span>
                <span className="text-slate-700 font-medium">{material}</span>
              </div>
            )}

            {care && (
              <div className="text-sm">
                <span className="text-slate-400">Care: </span>
                <span className="text-slate-700 font-medium">{care}</span>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-600 font-medium block mb-1.5">
                Select Size
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 border rounded-lg text-sm transition ${
                      selectedSize === size
                        ? "border-amber-800 bg-amber-800 text-white"
                        : "border-slate-200 text-slate-600 hover:border-amber-800 hover:text-amber-800"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-600 font-medium block mb-1.5">
                Select Color
              </span>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const colorName = typeof color === "object" ? color.name : color;
                  const isSelected = selectedColor === color || (typeof selectedColor === "object" && selectedColor.name === colorName);

                  return (
                    <button
                      key={colorName}
                      onClick={() => handleColorChange(color)}
                      className={`px-3 py-1 border rounded-lg text-sm transition ${
                        isSelected
                          ? "border-amber-800 bg-amber-50 text-amber-800"
                          : "border-slate-200 text-slate-600 hover:border-amber-800 hover:text-amber-800"
                      }`}
                    >
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-600 font-medium block mb-1.5">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:border-amber-800 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:border-amber-800 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-700 text-white px-6 py-3.5 rounded-full hover:bg-amber-800 transition text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 border border-slate-200 rounded-full hover:border-amber-800 hover:text-amber-800 transition text-sm flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Continue Shopping
              </button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Free Shipping
                </p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  30-Day Returns
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;