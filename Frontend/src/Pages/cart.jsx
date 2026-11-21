import { useState, useEffect } from "react";
import api from '../api/axios';
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCart = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get(`/cart/${userId}`);
            setCart(res.data);
        } catch (error) {
            console.error("Load cart error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [userId]);

    const removeItem = async (productId) => {
        try {
            const res = await api.post(`/cart/remove`, { userId, productId });
            setCart(res.data.cart);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Remove item error:", error);
        }
    };

    const updateQty = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeItem(productId);
            return;
        }

        try {
            const res = await api.post(`/cart/update`, { userId, productId, quantity });
            setCart(res.data.cart);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Update qty error:", error);
        }
    };

    if (!userId) {
        return (
            <div className="max-w-xl mx-auto my-16 px-4">
                <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200/90">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                        🛒
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Please Sign In</h2>
                    <p className="text-slate-500 text-sm mb-6">Login to your account to review saved items and proceed to checkout.</p>
                    <Link to="/login" className="inline-block px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition">
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
                <p className="text-slate-500 text-sm">Loading your cart...</p>
            </div>
        );
    }

    const items = (cart?.items || []).filter(item => item.productId);
    const total = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Review Items
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Shopping Bag ({items.length} unique items)
                    </h1>
                </div>
                <Link to="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-2xs transition inline-block">
                    &larr; Continue Shopping
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200/90 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                        🛍️
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Your Cart is Empty</h3>
                    <p className="text-slate-500 text-sm mt-1.5 mb-6">Looks like you haven't added anything yet. Explore our latest electronics collection!</p>
                    <Link to="/" className="inline-block px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition">
                        Explore Storefront
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {items.map((item) => (
                            <div 
                                key={item.productId._id} 
                                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-slate-300 transition"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                                        <img 
                                            src={item.productId.image || 'https://via.placeholder.com/100'} 
                                            alt={item.productId.title} 
                                            className="max-h-full max-w-full object-contain" 
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-slate-800 text-base line-clamp-1">{item.productId.title}</h3>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.productId.category || 'Item'}</span>
                                        <p className="text-indigo-600 font-black text-base mt-0.5">₹{Number(item.productId.price).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    {/* Quantity controls */}
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
                                        <button 
                                            onClick={() => updateQty(item.productId._id, item.quantity - 1)} 
                                            className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1.5 font-bold text-xs text-slate-800">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQty(item.productId._id, item.quantity + 1)} 
                                            className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Line item subtotal */}
                                    <div className="text-right min-w-[90px]">
                                        <span className="text-[10px] text-slate-400 block font-medium">Subtotal</span>
                                        <span className="font-black text-slate-900 text-base tracking-tight">
                                            ₹{(item.productId.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Remove icon */}
                                    <button 
                                        onClick={() => removeItem(item.productId._id)} 
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                        title="Remove item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sticky Card */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
                            <h3 className="font-black text-slate-900 text-xl tracking-tight">Order Summary</h3>
                            
                            <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
                                <div className="flex justify-between">
                                    <span>Items Total</span>
                                    <span className="font-bold text-slate-900">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="font-bold text-emerald-600">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery City</span>
                                    <span className="font-bold text-slate-900">Lucknow (Express)</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline pt-1">
                                <span className="font-bold text-slate-700 text-sm">Total Payable</span>
                                <span className="text-2xl font-black text-indigo-600 tracking-tight">
                                    ₹{total.toLocaleString()}
                                </span>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')} 
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Checkout</span>
                                <span>&rarr;</span>
                            </button>

                            <div className="text-[11px] text-center text-slate-400">
                                🔒 Safe & Secure COD Checkout with 7-Day Guarantee
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
