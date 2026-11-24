import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showConfirm, showError, toast } from '../utils/alert';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const addToCart = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      const confirmed = await showConfirm({
        title: 'Sign In Required',
        text: 'Please log in to your account to add items to your shopping cart.',
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        icon: 'info'
      });
      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    try {
      setAdding(true);
      await api.post(`/cart/add`, { userId, productId: product._id });
      window.dispatchEvent(new Event('cartUpdated'));
      toast('Item added to cart!', 'success');
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError('Failed to Add Item', error.response?.data?.message || 'Something went wrong while adding to cart.');
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-slate-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-16 p-10 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
        <div className="text-3xl mb-3">📦</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The product you are looking for does not exist or was removed.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs">
          Back to Storefront
        </Link>
      </div>
    );
  }

  const discountPercent = Math.min(Math.floor((Number(product.price) % 30) + 12), 40);
  const originalPrice = Math.round(Number(product.price) * (1 + discountPercent / 100));

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-600">{product.category || 'Product'}</span>
        <span>/</span>
        <span className="text-slate-900 font-bold line-clamp-1 max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Card Showcase */}
      <div className='bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10'>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left: Product Image Box */}
          <div className="md:col-span-6 flex justify-center p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-3xl border border-slate-100 relative overflow-hidden group">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
              alt={product.title}
              className='max-h-80 sm:max-h-96 w-auto object-contain group-hover:scale-105 transition duration-500'
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="md:col-span-6 space-y-5">
            {product.category && (
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
                {product.category}
              </span>
            )}

            <h1 className='text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug'>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-400 font-bold">★★★★★</span>
              <span className="text-slate-700 font-bold">4.9</span>
              <span className="text-slate-400 font-medium">· Verified authentic product</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3">
              <span className='text-3xl sm:text-4xl font-black text-slate-900 tracking-tight'>
                ₹{Number(product.price).toLocaleString()}
              </span>
              <span className='text-sm text-slate-400 line-through font-medium'>
                ₹{originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                Save ₹{(originalPrice - Number(product.price)).toLocaleString()}
              </span>
            </div>

            {/* Stock indicator */}
            <div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${product.stock > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                {product.stock > 0 ? `Ready to Dispatch (${product.stock} units left)` : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-sm text-slate-600 leading-relaxed pt-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Product Overview</h4>
              <p>{product.description || "Designed with cutting-edge engineering to offer high performance, ergonomic durability, and all-day battery efficiency. Includes official manufacturer warranty coverage."}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={addToCart}
                disabled={product.stock <= 0 || adding}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : adding
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-200 hover:shadow-indigo-300'
                  }`}
              >
                {adding ? (
                  <>
                    <span>✓ Added to Cart</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="py-4 px-6 rounded-2xl font-bold text-sm border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Go to Cart &rarr;
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span>🚚</span> <span>Free Express Delivery (Lucknow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span> <span>1 Year Warranty Guaranteed</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
