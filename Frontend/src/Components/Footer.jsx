import React from 'react';
import { Link } from 'react-router-dom';
import { showInfo } from '../utils/alert';

export default function Footer({ onCategoryClick }) {
  const categories = ['Laptops', 'Mobiles', 'Tablets', 'Electronics', 'Accessories'];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to='/' className='flex items-center gap-2.5 group'>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className='font-black text-2xl tracking-tight text-white'>
                Ayush <span className="text-indigo-400 font-bold">Store</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted destination for authentic electronics, top-tier laptops, flagship smartphones, and audio gear. Best quality delivered directly to your doorstep.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-400">Payment methods:</span>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] font-semibold text-slate-300">COD</span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] font-semibold text-slate-300">UPI</span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] font-semibold text-slate-300">Card</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => onCategoryClick && onCategoryClick(cat)}
                    className="text-slate-400 hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Customer Care</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/cart" className="hover:text-indigo-400 transition">View Cart</Link></li>
              <li><Link to="/checkout" className="hover:text-indigo-400 transition">Checkout</Link></li>
              <li><Link to="/checkout/address" className="hover:text-indigo-400 transition">Delivery Address</Link></li>
              <li><Link to="/admin/products" className="hover:text-indigo-400 transition">Inventory Admin</Link></li>
              <li>
                <a 
                  href="#track" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    showInfo("Track Your Order", "Use the order confirmation reference ID received at checkout to track your delivery status."); 
                  }} 
                  className="hover:text-indigo-400 transition cursor-pointer"
                >
                  Track Your Order
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Contact (Lucknow) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Contact & Help</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span>📍</span> <span>Lucknow, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> 
                <a href="tel:9335049033" className="hover:text-indigo-400 transition">
                  9335049033
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> 
                <a href="mailto:ayushuvitiwari9091@gmail.com" className="hover:text-indigo-400 transition break-all">
                  ayushuvitiwari9091@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span> <span>24x7 Customer Support</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ayush Store eCommerce. All rights reserved.</p>
          <div className="flex gap-6">
            <a 
              href="#privacy" 
              onClick={(e) => { 
                e.preventDefault(); 
                showInfo("Privacy Policy", "Your data and passwords are secure with SSL encryption and we never share your details."); 
              }} 
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              onClick={(e) => { 
                e.preventDefault(); 
                showInfo("Terms of Service", "We offer 7-day hassle-free returns and verified brand warranties on all electronics."); 
              }} 
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Terms of Service
            </a>
            <a 
              href="#security" 
              onClick={(e) => { 
                e.preventDefault(); 
                showInfo("Security", "100% Secure Checkout with verified Cash on Delivery protection."); 
              }} 
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
