import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import pic1 from "../image/pic1.png";
import pic2 from "../image/pic2.png";
import pic3 from "../image/pic3.png";
import pic4 from "../image/pic4.png";
import pic5 from "../image/pic5.png";
import pic6 from "../image/pic6.png";
import pic7 from "../image/pic7.png";
import pic8 from "../image/pic8.png";

// Accessory images
import watch from "../image/watch.png";
import bags from "../image/bags.png";
import jewelry from "../image/jewelry.png";
import sunglasses from "../image/sunglasses.png";
import footwear from "../image/footwear.png";

const HeroSection = () => {
  // Accessories data
  const accessories = [
    {
      id: 1,
      name: "Watches",
      badge: "Timeless",
      image: watch,
      link: "/WatchesPage",
      icon: "⌚"
    },
    {
      id: 2,
      name: "Bags",
      badge: "Essential",
      image: bags,
      link: "/BagsPage",
      icon: "👜"
    },
    {
      id: 3,
      name: "Jewelry",
      badge: "Adorn",
      image: jewelry,
      link: "/JewelryPage",
      icon: "💎"
    },
    {
      id: 4,
      name: "Sunglasses",
      badge: "Iconic",
      image: sunglasses,
      link: "/SunglassesPage",
      icon: "🕶️"
    },
    {
      id: 5,
      name: "Footwear",
      badge: "Step Up",
      image: footwear,
      link: "/FootwearPage",
      icon: "👞"
    }
  ];

  // brands
  const brands = [
    ["Gucci", "https://www.gucci.com/us/en/"],
    ["Prada", "https://www.prada.com/ww/en"],
    ["Chanel", "https://www.chanel.com/in/"],
    ["Louis Vuitton", "https://in.louisvuitton.com/eng-in"],
    ["Dior", "https://www.dior.com/en_in"],
  ];

  // Auto-scroll logic
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Duplicate accessories for seamless infinite scroll
  const duplicatedAccessories = [...accessories, ...accessories, ...accessories];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Start auto-scroll - FASTER SPEED
    autoScrollInterval.current = setInterval(() => {
      if (container) {
        const scrollAmount = 2.5;
        container.scrollLeft += scrollAmount;
        
        const totalWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= totalWidth * 2) {
          container.scrollLeft = 0;
        }
      }
    }, 20);

    // Pause on hover
    const handleMouseEnter = () => {
      clearInterval(autoScrollInterval.current);
    };

    const handleMouseLeave = () => {
      autoScrollInterval.current = setInterval(() => {
        if (container) {
          const scrollAmount = 2.5;
          container.scrollLeft += scrollAmount;
          const totalWidth = container.scrollWidth / 3;
          if (container.scrollLeft >= totalWidth * 2) {
            container.scrollLeft = 0;
          }
        }
      }, 20);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(autoScrollInterval.current);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative min-h-screen bg-[#FAF7F2] text-amber-950 overflow-hidden flex items-center justify-center py-20">
        {/* Warm Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-amber-200/50 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-orange-200/40 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-100/30 rounded-full blur-[160px] pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f08_1px,transparent_1px),linear-gradient(to_bottom,#78350f08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        <div className="relative container mx-auto px-6 max-w-7xl z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/60 border border-amber-200/80 backdrop-blur-md shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-amber-900 font-medium">
                  Bespoke Marketplace
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.1] text-amber-950">
                Shop from <br />
                <span className="font-serif italic font-normal bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                  Curated Stores
                </span>
              </h1>

              <p className="text-amber-900/70 font-light leading-relaxed text-base sm:text-lg max-w-lg mx-auto lg:mx-0">
                Discover verified independent ateliers, bespoke designers, and
                luxury creators across five specialized categories.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-900 text-amber-50 font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-amber-800 hover:shadow-[0_10px_25px_rgba(120,53,15,0.2)] hover:scale-[1.02]"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[480px] sm:h-[550px] w-full flex items-center justify-center">
              <div className="absolute w-56 sm:w-72 h-80 sm:h-96 rounded-3xl overflow-hidden border border-orange-300/25 shadow-[0_25px_60px_rgba(0,0,0,0.75)] transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <img src={pic5} alt="Crafting" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 left-4 sm:left-12 w-40 sm:w-52 h-48 sm:h-60 rounded-2xl overflow-hidden border border-orange-300/20 shadow-[0_20px_45px_rgba(0,0,0,0.65)] transform -rotate-12 hover:-rotate-6 transition-transform duration-500 z-20">
                <img src={pic1} alt="Haute Couture" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 left-8 sm:left-20 w-36 sm:w-48 h-44 sm:h-56 rounded-2xl overflow-hidden border border-orange-300/20 shadow-[0_20px_45px_rgba(0,0,0,0.65)] transform rotate-6 hover:rotate-0 transition-transform duration-500 z-30">
                <img src={pic2} alt="Fashion" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 right-4 sm:right-12 w-40 sm:w-52 h-48 sm:h-60 rounded-2xl overflow-hidden border border-orange-300/20 shadow-[0_20px_45px_rgba(0,0,0,0.65)] transform rotate-12 hover:rotate-6 transition-transform duration-500 z-20">
                <img src={pic3} alt="Menswear" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-2 right-8 sm:right-20 w-36 sm:w-48 h-44 sm:h-56 rounded-2xl overflow-hidden border border-orange-300/20 shadow-[0_20px_45px_rgba(0,0,0,0.65)] transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-30">
                <img src={pic4} alt="Watch" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WOMEN'S FASHION SECTION */}
      {/* ============================================================ */}
      <section className="relative py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src={pic6}
                  alt="Women's Fashion Collection"
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-4 text-center lg:text-left">
              {/* Tag */}
              <div className="inline-block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-600 font-medium border-b border-amber-300 pb-1.5">
                  Women's Collection
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-amber-950">
                They've <br />
                <span className="font-serif italic font-normal text-rose-700">
                  Landed!
                </span>
              </h2>

              {/* Description */}
              <p className="text-amber-900/70 font-light leading-relaxed text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                The Autumn/Winter 2026 collection brings together handcrafted
                silhouettes, premium fabrics, and sustainable artistry. Each
                piece is a celebration of timeless elegance — from flowing silks
                to structured tailoring.
              </p>

              {/* Shop Now Button */}
              <div className="pt-2">
                <Link
                  to="/WomenFashionPage"
                  className="inline-block px-8 py-3 bg-rose-700 text-white font-light text-xs tracking-[0.15em] uppercase hover:bg-amber-800 transition-all duration-300 hover:shadow-xl"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MEN'S FASHION SECTION */}
      {/* ============================================================ */}
      <section className="relative py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src={pic7}
                  alt="Men's Fashion Collection"
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-4 text-center lg:text-left">
              {/* Tag */}
              <div className="inline-block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-blue-700 font-medium border-b border-blue-300 pb-1.5">
                  Men's Collection
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-amber-950">
                Tailored <br />
                <span className="font-serif italic font-normal text-blue-700">
                  Excellence
                </span>
              </h2>

              {/* Description */}
              <p className="text-amber-900/70 font-light leading-relaxed text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                Expertly crafted from the finest wools and leathers, every piece — from structured blazers to luxury knitwear — exudes quiet 
                confidence and understated sophistication for the modern wardrobe.
              </p>

              {/* Shop Now Button */}
              <div className="pt-2">
                <Link
                  to="/MenFashionPage"
                  className="inline-block px-8 py-3 bg-blue-800 text-white font-light text-xs tracking-[0.15em] uppercase hover:bg-amber-800 transition-all duration-300 hover:shadow-xl"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LUXURY ELECTRONICS SECTION */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left - Image */}
            <div className="relative order-1 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={pic8} 
                  alt="Luxury Electronics" 
                  className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-2 lg:order-2 space-y-6 text-center lg:text-left">
              <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-slate-500 font-medium border-b border-slate-300 pb-1.5">
                Premium Electronics
              </span>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] text-slate-900">
                Where <br />
                <span className="font-serif italic font-normal bg-gradient-to-r from-slate-700 via-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Innovation Meets
                </span>
                <br />
                <span className="font-serif italic font-normal bg-gradient-to-r from-slate-700 via-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Luxury
                </span>
              </h2>

              <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                Discover cutting-edge technology wrapped in exquisite design. 
                From premium audio to smart home innovations — redefining 
                the future of luxury electronics.
              </p>

              <div className="pt-2">
                <Link
                  to="/electronics"
                  className="inline-block px-10 py-4 bg-slate-900 text-white font-light text-xs tracking-[0.15em] uppercase hover:bg-blue-800 transition-all duration-300 hover:shadow-xl rounded-lg"
                >
                  Explore Electronics →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACCESSORIES SECTION - AUTOMATIC SCROLLING */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-[#FAF7F2] overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-amber-100/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-rose-100/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-600 font-medium border-b border-amber-300 pb-1.5">
                Complete The Look
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-[1.1] text-amber-950 mt-3">
                Curated <span className="font-serif italic text-rose-600">Accessories</span>
              </h2>
              <p className="text-amber-900/60 font-light text-sm mt-2 hidden sm:block">
                Elevate your style with our handpicked collection
              </p>
            </div>
            <Link
              to="/products?category=accessories"
              className="mt-4 sm:mt-0 inline-block px-6 py-2.5 bg-amber-900 text-white font-light text-xs tracking-[0.15em] uppercase hover:bg-amber-800 transition-all duration-300 hover:shadow-xl rounded-lg whitespace-nowrap"
            >
              View All →
            </Link>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="relative">
            {/* Gradient Fade - Left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none" />
            
            {/* Gradient Fade - Right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none" />

            {/* Auto-scroll Indicator */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-amber-700 font-medium">Auto-scroll</span>
            </div>

            {/* Scrollable Content */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 sm:gap-6 min-w-max px-2">
                {duplicatedAccessories.map((item, index) => (
                  <Link
                    key={`${item.id}-${index}`}
                    to={item.link}
                    className="group relative flex-shrink-0 w-[200px] sm:w-[260px] overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                  >
                    <div className="relative h-[220px] sm:h-[280px] overflow-hidden bg-[#FAF7F2]">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Icon */}
                      <div className="absolute top-3 right-3 text-2xl sm:text-3xl opacity-60">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-amber-300 font-semibold">
                          {item.badge}
                        </span>
                        <h3 className="text-base sm:text-xl font-light font-serif italic mt-0.5">
                          {item.name}
                        </h3>
                        <span className="text-[10px] sm:text-xs text-white/70 group-hover:text-amber-300 transition">
                          Shop Collection →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND LOGOS SECTION */}
      {/* ============================================================ */}
      <section className="py-16 bg-[#FAF7F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.35em] uppercase text-amber-600">
              Trusted Partners
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif text-amber-950">
              Featured{" "}
              <span className="italic text-amber-600">
                Maisons
              </span>
            </h2>
          </div>

          <div className="overflow-hidden">
            <div className="flex w-max animate-[brandScroll_25s_linear_infinite] hover:[animation-play-state:paused]">
              {[...brands, ...brands].map(([name, url], index) => (
                <a 
                  key={`${name}-${index}`} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-48 sm:w-56 h-32 sm:h-36 mx-2 flex-shrink-0 flex items-center justify-center bg-white border border-[#e6ddd1] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <span className="font-serif text-lg sm:text-xl tracking-wider text-gray-800 group-hover:text-amber-700">
                    {name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CSS for animations */}
      {/* ============================================================ */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes brandScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

export default HeroSection;
