import { useEffect, useState, useMemo } from "react";
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import HeroSlider from '../Components/HeroSlider';
import ProductCard from '../Components/ProductCard';
import MiniProductCard from '../Components/MiniProductCard';
import Footer from '../Components/Footer';
import { showConfirm, showError, toast } from '../utils/alert';

const CATEGORIES = [
  { id: '', label: 'All Products', icon: '⚡' },
  { id: 'Laptops', label: 'Laptops', icon: '💻' },
  { id: 'Mobiles', label: 'Smartphones', icon: '📱' },
  { id: 'Tablets', label: 'Tablets', icon: '📟' },
  { id: 'Electronics', label: 'Electronics', icon: '🎧' },
  { id: 'Accessories', label: 'Accessories', icon: '🔌' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();

  // Listen to search events dispatched from Navbar
  useEffect(() => {
    const handleNavSearch = (e) => {
      setSearch(e.detail || '');
    };
    window.addEventListener('navSearch', handleNavSearch);

    return () => {
      window.removeEventListener('navSearch', handleNavSearch);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Load products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  // Sorting products
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [products, sortBy]);

  // Featured Flash Deals (first 4)
  const flashDeals = useMemo(() => {
    return sortedProducts.slice(0, 4);
  }, [sortedProducts]);

  const addToCart = async (productId, e) => {
    if (e) e.stopPropagation();
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
      setAddingId(productId);
      await api.post(`/cart/add`, { userId, productId });
      window.dispatchEvent(new Event('cartUpdated'));
      toast('Item added to cart!', 'success');
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError('Failed to Add Item', error.response?.data?.message || 'Something went wrong while adding to cart.');
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* 1. Hero Dynamic Slider with smooth category switch */}
        <HeroSlider onSelectCategory={(cat) => setCategory(cat)} />

        {/* 2. Category Quick Discovery Row */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Browse by Department</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Popular Categories</h3>
            </div>
            {category && (
              <button 
                onClick={() => setCategory('')} 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  category === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 -translate-y-1'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-bold tracking-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Quick Pick Mini Cards Row */}
        {products.length > 0 && !search && (
          <div className="mb-12 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Quick Pick Deals</h3>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Mini Picks</span>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-results');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {products.map((prod) => (
                <MiniProductCard
                  key={`mini-${prod._id}`}
                  product={prod}
                  onAddToCart={addToCart}
                  isAdding={addingId === prod._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Flash Sale / Hot Deals Highlight Section */}
        {flashDeals.length > 0 && !search && (
          <div className="mb-14 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10 relative">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  🔥
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black tracking-tight">Today's Flash Deals</h3>
                    <span className="px-2.5 py-0.5 bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold rounded-full animate-pulse">
                      Live Now
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">Unbeatable prices on flagship devices - limited quantities available</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-xs">
                <span>Offer ends soon!</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 z-10 relative">
              {flashDeals.map((prod) => (
                <ProductCard 
                  key={`flash-${prod._id}`} 
                  product={prod} 
                  onAddToCart={addToCart} 
                  isAdding={addingId === prod._id} 
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Main Products Catalog Header & Sorting */}
        <div id="catalog-results" className="mb-8 space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Catalog</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {category ? `${category} Collection` : 'All Available Products'}
                <span className="text-slate-400 text-base font-normal ml-2">({sortedProducts.length} items)</span>
              </h2>
              {search && (
                <p className="text-xs text-indigo-600 font-semibold mt-1">
                  Filtering products matching "{search}"
                </p>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-xs cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. Main Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm animate-pulse space-y-4">
                <div className="h-48 bg-slate-100 rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">No products found</h3>
            <p className="text-slate-500 text-sm mt-1.5 mb-6">
              No items matched "{search}". Try searching another name or reset filters.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { setSearch(''); setCategory(''); }} 
                className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Reset Filters
              </button>
              <Link 
                to="/admin/products/add" 
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition"
              >
                + Add Product in Admin
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                isAdding={addingId === product._id}
              />
            ))}
          </div>
        )}

        {/* Bottom Compact Mini Products Row */}
        {products.length > 0 && !search && (
          <div className="mt-14 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">You Might Also Like</h3>
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">Explore More</span>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Back to Top &uarr;
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {products.slice().reverse().map((prod) => (
                <MiniProductCard
                  key={`bottom-mini-${prod._id}`}
                  product={prod}
                  onAddToCart={addToCart}
                  isAdding={addingId === prod._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* 7. Why Choose Ayush Store Feature Showcase */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl mb-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
              The Ayush Store Promise
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Why 25,000+ Customers Love Shopping With Us
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              We provide original electronics with verified warranties, swift Lucknow deliveries, and dedicated customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-indigo-50/40 hover:border-indigo-100 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm shadow-indigo-200">
                🚀
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-1.5">Superfast Dispatch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders placed before 2 PM are processed and dispatched the very same day across Lucknow with live tracking updates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-indigo-50/40 hover:border-indigo-100 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm shadow-sky-200">
                🛡️
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-1.5">100% Authentic Brand Gear</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every single laptop, smartphone, and accessory is directly sourced with genuine brand seals and valid warranties.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-indigo-50/40 hover:border-indigo-100 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm shadow-emerald-200">
                💬
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-1.5">Dedicated Human Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need help deciding or facing issues? Speak directly with our support team at 9335049033 for instant assistance.
              </p>
            </div>
          </div>
        </div>

        {/* 8. Trust Badges & Guarantee Row */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Express Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Dispatched within 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl">
              🛡️
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">100% Genuine</h4>
              <p className="text-xs text-slate-500 mt-0.5">Authentic certified items</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-2xl">
              🔄
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">7-Day Free Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hassle-free replacements</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-2xl">
              💵
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Cash on Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Pay safely upon receipt</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modern Responsive Footer */}
      <Footer onCategoryClick={(cat) => {
        setCategory(cat);
        const target = document.getElementById('catalog-results');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }} />
    </div>
  );
}
