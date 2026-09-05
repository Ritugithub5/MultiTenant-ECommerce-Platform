import React, { useState } from "react";
import { Link } from "react-router-dom";

// Local Fashion Image Imports
import pic6 from "../image/pic6.png";
import trouserImg from "../image/trouser.png";
import anarkaliImg from "../image/anarkali.png";
import dressImg from "../image/dress.png";
import topImg from "../image/top.png";

const WomenFashionPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ONLY these 4 products - NO API call
  const products = [
    {
      _id: "featured-dress-01",
      name: "Off-Shoulder Silk Evening Gown",
      category: "Dresses",
      price: 450,
      image: dressImg,
      badge: "Couture",
      description: "Sculpted drape bodice with an asymmetric train.",
    },
    {
      _id: "featured-top-02",
      name: "Draped Mesh Wrap Top",
      category: "Tops",
      price: 180,
      image: topImg,
      badge: "Trending",
      description: "Sheer pleated overlay in rich wine hue.",
    },
    {
      _id: "featured-trouser-03",
      name: "Pleated Wide-Leg Trousers",
      category: "Trousers",
      price: 220,
      image: trouserImg,
      badge: "Tailored",
      description: "High-waisted silhouette in mocha wool blend.",
    },
    {
      _id: "featured-anarkali-04",
      name: "Printed Silk Anarkali Set",
      category: "Ethnic",
      price: 320,
      image: anarkaliImg,
      badge: "Heritage",
      description: "Floral block print paired with sheer dupatta.",
    },
  ];

  const categories = ["All", "Dresses", "Tops", "Trousers", "Ethnic"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans">
      {/* Editorial Hero Header */}
      <section className="relative py-10 lg:py-14 bg-[#FAF7F2] text-slate-900 overflow-hidden">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 text-left">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extralight tracking-normal leading-none text-slate-900">
                Elegance <br />
                <span className="font-serif italic font-normal text-amber-800 block mt-2">
                  Redefined
                </span>
              </h1>
              <p className="text-slate-600 font-light text-base sm:text-lg max-w-md leading-relaxed">
                An exquisite union of sharp tailoring, fluid silhouettes, and
                timeless craftsmanship—tailored for the modern muse.
              </p>
              <div className="pt-2">
                <a
                  href="#collection"
                  className="inline-block px-8 py-3.5 bg-slate-900 text-amber-50 text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-amber-900 hover:text-white transition-all duration-300 shadow-md"
                >
                  Explore Collection
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                <img
                  src={pic6}
                  alt="Elegance Redefined"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/10 py-5">
        <div className="container mx-auto px-6 max-w-7xl flex justify-center items-center gap-3 sm:gap-8 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b-2 ${
                selectedCategory === cat
                  ? "border-amber-800 text-amber-950 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Grid Area */}
      <main className="container mx-auto px-6 max-w-7xl py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;

              return (
                <div
                  key={productId}
                  className="group relative flex flex-col justify-between bg-white rounded-xl overflow-hidden border border-amber-900/5 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=Product';
                      }}
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-stone-900/90 text-amber-100 text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-sm">
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <Link
                        to={`/product/${productId}`}
                        className="w-full py-3 bg-white/95 text-stone-900 text-xs uppercase tracking-[0.2em] font-medium text-center rounded-md hover:bg-amber-950 hover:text-white transition-colors duration-300 shadow-md"
                      >
                        Discover Piece
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[10px] tracking-[0.15em] uppercase text-amber-800/60 font-semibold">
                        {product.category || "Womenswear"}
                      </span>
                      <Link
                        to={`/product/${productId}`}
                        className="block group-hover:text-amber-900 transition-colors"
                      >
                        <h3 className="text-sm font-normal text-slate-800 mt-1 line-clamp-1 group-hover:text-amber-900 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="text-xs text-slate-400 font-light mt-1.5 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/product/${productId}`}
                        className="text-sm font-medium text-slate-900 hover:text-amber-800 transition-colors"
                      >
                        ${product.price}
                      </Link>
                      <Link
                        to={`/product/${productId}`}
                        className="text-xs font-light tracking-wide text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-all hover:underline"
                      >
                        View Product →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-200/60">
            <h3 className="text-2xl font-light text-slate-800 mb-2">
              No Items Found
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              There are currently no items under the "{selectedCategory}"
              category.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs tracking-widest uppercase rounded-md hover:bg-amber-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WomenFashionPage;
