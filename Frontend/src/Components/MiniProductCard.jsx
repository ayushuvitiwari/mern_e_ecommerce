import React from 'react';
import { Link } from 'react-router-dom';

export default function MiniProductCard({ product, onAddToCart, isAdding }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between w-full max-w-[210px] min-w-[160px]">
      
      {/* Clickable Image + Title */}
      <Link to={`/product/${product._id}`} className="block">
        {/* Compact Square Image Container */}
        <div className="relative w-full h-32 sm:h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2.5 border border-slate-100 group-hover:bg-indigo-50/30 transition">
          <img
            src={product.image || fallbackImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {/* Mini Category badge */}
          {product.category && (
            <span className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs uppercase tracking-wider">
              {product.category}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-2.5">
          <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-600 transition line-clamp-1 leading-snug">
            {product.title}
          </h4>
        </div>
      </Link>

      {/* Price & Compact Add Button */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <span className="text-sm font-extrabold text-slate-900 tracking-tight">
          ₹{Number(product.price).toLocaleString()}
        </span>

        <button
          onClick={(e) => onAddToCart(product._id, e)}
          disabled={product.stock <= 0 || isAdding}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs ${
            product.stock <= 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isAdding
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
          }`}
          title="Add to cart"
        >
          {isAdding ? (
            <span>✓</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
