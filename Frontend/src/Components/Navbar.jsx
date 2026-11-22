import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [navSearch, setNavSearch] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
        setMobileMenuOpen(false);
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/login');
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60' : 'bg-white border-b border-slate-100'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                
                {/* Main Top Bar */}
                <div className="flex justify-between items-center h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-6">
                    
                    {/* Brand Logo with Ayush Store text */}
                    <Link to='/' className='flex items-center gap-2 sm:gap-2.5 group shrink-0'>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className='font-black text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent'>
                                Ayush <span className="text-indigo-600 font-bold">Store</span>
                            </span>
                            <span className="hidden sm:block text-[9px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">Modern Market</span>
                        </div>
                    </Link>

                    {/* Desktop / Tablet Search Bar (Hidden on small mobile, rendered below) */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm lg:max-w-lg mx-2 lg:mx-4">
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

                    {/* Right Action Icons & Mobile Toggles */}
                    <div className='flex items-center gap-1.5 sm:gap-3 shrink-0'>
                        
                        {/* Admin Dashboard Button (Only for Admin - Desktop/Tablet) */}
                        {isAdmin && (
                            <Link 
                                to='/admin/products' 
                                className='hidden sm:flex px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 rounded-xl shadow-xs transition items-center gap-1.5'
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
                            className='relative p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition flex items-center justify-center'
                            aria-label="Shopping Cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className='absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md animate-bounce'>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop User Login/Logout actions */}
                        <div className="hidden sm:flex items-center gap-2">
                            {!userId ? (
                                <>
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
                                </>
                            ) : (
                                <div className='flex items-center gap-2 pl-2 border-l border-slate-200'>
                                    <div className="hidden lg:flex flex-col text-right">
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
                                        <span className="hidden md:inline">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger Menu Toggle Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                    </div>
                </div>

                {/* Mobile Dedicated Search Bar (Visible on mobile screens) */}
                <div className="md:hidden pb-3 pt-1">
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        <div className="relative flex items-center w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search products, brands, electronics..."
                                value={navSearch}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-100 transition shadow-inner"
                            />
                            {navSearch ? (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange('')}
                                    className="absolute right-2 px-1.5 py-0.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="absolute right-1.5 px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold"
                                >
                                    Find
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Mobile Dropdown Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="sm:hidden py-4 border-t border-slate-100 space-y-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl mb-3 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        {/* Admin Link on Mobile if logged in as Admin */}
                        {isAdmin && (
                            <Link 
                                to='/admin/products' 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-700 font-bold text-xs"
                            >
                                <span className="flex items-center gap-2">
                                    <span>⚙️</span>
                                    <span>Admin Inventory Panel</span>
                                </span>
                                <span className="text-xs">&rarr;</span>
                            </Link>
                        )}

                        <Link 
                            to='/' 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            🛍️ Store Catalog
                        </Link>

                        <Link 
                            to='/cart' 
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <span className="flex items-center gap-2">
                                <span>🛒</span>
                                <span>My Cart</span>
                            </span>
                            {cartCount > 0 && (
                                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                                    {cartCount} items
                                </span>
                            )}
                        </Link>

                        <div className="pt-2 border-t border-slate-100">
                            {!userId ? (
                                <div className="flex gap-2">
                                    <Link 
                                        to='/login' 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-1/2 py-2.5 text-center text-xs font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50"
                                    >
                                        Log In
                                    </Link>
                                    <Link 
                                        to='/signup' 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-1/2 py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-xs"
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between pt-1">
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{userName || 'User'}</p>
                                        <p className="text-[10px] text-slate-400">{userEmail}</p>
                                    </div>
                                    <button 
                                        onClick={logOut} 
                                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </header>
    );
}
