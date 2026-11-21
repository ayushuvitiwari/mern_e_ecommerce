import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, isAdding }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80';

  const discountPercent = Math.min(Math.floor((Number(product.price) % 30) + 12), 45);
  const originalPrice = Math.round(Number(product.price) * (1 + discountPercent / 100));

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Floating Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.category && (
          <span className="bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/60 uppercase tracking-wider">
            {product.category}
          </span>
        )}
      </div>

      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
          product.stock > 0 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
            : 'bg-rose-50 text-rose-700 border border-rose-200/80'
        }`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
        </span>
      </div>

      {/* Main Clickable Product Body */}
      <Link to={`/product/${product._id}`} className="block">
        
        {/* Product Image Stage */}
        <div className="relative w-full h-52 bg-gradient-to-b from-slate-50/80 to-slate-100/50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 group-hover:from-indigo-50/40 group-hover:to-slate-50 transition duration-300">
          <img
            src={product.image || fallbackImage}
            alt={product.title}
            className={`max-h-full max-w-full object-contain group-hover:scale-108 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-90'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { e.target.src = fallbackImage; }}
            loading="lazy"
          />
        </div>

        {/* Product Meta */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <span>★★★★☆</span>
            <span className="text-slate-400 text-[11px] font-medium">(4.8)</span>
          </div>

          <h3 className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition text-base line-clamp-1 leading-snug tracking-tight">
            {product.title}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 h-8 leading-relaxed">
            {product.description || "Premium engineered design packed with modern capabilities and reliable performance."}
          </p>
        </div>
      </Link>

      {/* Pricing & Add To Cart Button */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ₹{Number(product.price).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Free Express Delivery</span>
        </div>

        <button
          onClick={(e) => onAddToCart(product._id, e)}
          disabled={product.stock <= 0 || isAdding}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
            product.stock <= 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isAdding
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 active:scale-95'
          }`}
          aria-label="Add to cart"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
