import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [navSearch, setNavSearch] = useState('');
    
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    const isAdmin = userRole === 'admin' || userEmail === 'ayushuvitiwari9091@gmail.com';

    const loadCart = async () => {
        const currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
            setCartCount(0);
            return;
        }

        try {
            const res = await api.get(`/cart/${currentUserId}`);
            if (res.data && res.data.items) {
                const total = res.data.items.reduce(
                    (sum, item) => sum + (item.quantity || 1), 0
                );
                setCartCount(total);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Cart count error:", error);
            setCartCount(0);
        }
    };

    useEffect(() => {
        loadCart();
        window.addEventListener('cartUpdated', loadCart);

        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('cartUpdated', loadCart);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [userId]);

    const handleSearchChange = (val) => {
        setNavSearch(val);
        window.dispatchEvent(new CustomEvent('navSearch', { detail: val }));
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('navSearch', { detail: navSearch }));
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const logOut = () => {
        localStorage.clear();
        setCartCount(0);
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/login');
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60' : 'bg-white border-b border-slate-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 gap-4 sm:gap-6">
                    
                    {/* Brand Logo with clear Ayush Store text */}
                    <Link to='/' className='flex items-center gap-2.5 group shrink-0'>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className='font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent'>
                                Ayush <span className="text-indigo-600 font-bold">Store</span>
                            </span>
                            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">Modern Market</span>
                        </div>
                    </Link>

                    {/* Attractive Polished Search Bar with Category Icon & Search Button */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm sm:max-w-md lg:max-w-lg mx-2 sm:mx-4">
                        <div className="relative flex items-center w-full group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Search gadgets, mobiles, laptops..."
                            value={navSearch}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-20 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
                          />

                          <div className="absolute right-1.5 flex items-center gap-1">
                            {navSearch && (
                              <button
                                type="button"
                                onClick={() => handleSearchChange('')}
                                className="p-1 text-slate-400 hover:text-slate-600 text-xs cursor-pointer rounded-full"
                                title="Clear"
                              >
                                ✕
                              </button>
                            )}
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center shadow-xs cursor-pointer"
                              title="Search"
                            >
                              <span>Find</span>
                            </button>
                          </div>
                        </div>
                    </form>

                    {/* Right Action Icons & Auth */}
                    <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
                        
                        {/* Admin Dashboard Button (Only for Admin) */}
                        {isAdmin && (
                            <Link 
                                to='/admin/products' 
                                className='px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 rounded-xl shadow-sm shadow-indigo-200 transition flex items-center gap-1.5'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Admin Panel</span>
                            </Link>
                        )}

                        {/* Cart Button */}
                        <Link 
                            to='/cart' 
                            className='relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition flex items-center justify-center'
                            aria-label="Shopping Cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className='absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-[10px] w-5 h-5 flex items-center justify-center shadow-md animate-bounce'>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Login/Logout status */}
                        {!userId ? (
                            <div className='flex items-center gap-1.5 sm:gap-2'>
                                <Link 
                                    to='/login' 
                                    className='px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition'
                                >
                                    Log In
                                </Link>
                                <Link 
                                    to='/signup' 
                                    className='px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 transition'
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-2 pl-2 border-l border-slate-200'>
                                <div className="hidden md:flex flex-col text-right">
                                    <span className='text-xs font-semibold text-slate-900 leading-tight'>
                                        {userName || 'User'}
                                        {isAdmin && <span className="ml-1 text-[10px] text-indigo-600 font-extrabold uppercase">(Admin)</span>}
                                    </span>
                                </div>
                                <button 
                                    onClick={logOut} 
                                    className='p-1.5 sm:px-3 sm:py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1 cursor-pointer'
                                    title="Logout"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </header>
    );
}
