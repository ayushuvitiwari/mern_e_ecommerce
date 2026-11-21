import { useState, useEffect } from "react";
import api from '../api/axios';
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
    const userId = localStorage.getItem('userId');
    const [addresses, setAddresses] = useState([]);
    const [cart, setCart] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [cartRes, addrRes] = await Promise.all([
                    api.get(`/cart/${userId}`),
                    api.get(`/address/${userId}`)
                ]);

                setCart(cartRes.data);
                const addressList = Array.isArray(addrRes.data) ? addrRes.data : addrRes.data.addresses || [];
                setAddresses(addressList);
                if (addressList.length > 0) {
                    setSelectedAddress(addressList[0]);
                }
            } catch (error) {
                console.error("Fetch checkout data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, navigate]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
                <p className="text-slate-500 text-sm">Preparing checkout...</p>
            </div>
        );
    }

    const items = (cart?.items || []).filter(item => item.productId);
    const total = items.reduce(
        (sum, i) => sum + i.quantity * (i.productId?.price || 0), 0
    );

    if (items.length === 0) {
        return (
            <div className="max-w-md mx-auto my-16 px-4">
                <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200/90">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                        🛒
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Your Bag is Empty</h2>
                    <p className="text-slate-500 text-sm mb-6">Add products to your cart before proceeding to checkout.</p>
                    <Link to="/" className="inline-block px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition">
                        Back to Store
                    </Link>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select or add a delivery address');
            return;
        }

        try {
            setPlacing(true);
            const res = await api.post('/order/place', {
                userId,
                address: selectedAddress,
            });

            window.dispatchEvent(new Event('cartUpdated'));
            navigate(`/order/success/${res.data.orderId}`);
        } catch (error) {
            console.error("Error placing order:", error);
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            
            {/* Header */}
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Secure Checkout
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                    Complete Your Purchase
                </h1>
                <p className="text-slate-500 text-sm">Select shipping address and confirm your Cash on Delivery order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Address Selection & Items Preview */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Delivery Address Box */}
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Delivery Address</h3>
                                <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                            </div>
                            <Link 
                                to="/checkout/address" 
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                            >
                                + Add New Address
                            </Link>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                <p className="text-slate-500 text-sm mb-3">No saved addresses found in your account.</p>
                                <Link 
                                    to="/checkout/address" 
                                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
                                >
                                    Add Address Now
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <label 
                                        key={addr._id}
                                        className={`flex items-start p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition ${
                                            selectedAddress?._id === addr._id 
                                                ? 'border-indigo-600 bg-indigo-50/30 shadow-xs' 
                                                : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress?._id === addr._id}
                                            onChange={() => setSelectedAddress(addr)}
                                            className="mt-1 mr-3.5 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-extrabold text-slate-900 text-sm">{addr.fullName}</h4>
                                                <span className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 px-2.5 py-0.5 rounded-full">{addr.phone}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                {addr.address}, {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pinCode}</span>
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Items Preview */}
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs">
                        <h3 className="font-black text-slate-900 text-lg tracking-tight mb-4">Items in Order ({items.length})</h3>
                        <div className="divide-y divide-slate-100">
                            {items.map(item => (
                                <div key={item.productId._id} className="py-3.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                                            <img src={item.productId.image} alt={item.productId.title} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{item.productId.title}</p>
                                            <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{Number(item.productId.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-900 text-sm">₹{(item.productId.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right: Payment & Summary */}
                <div className="lg:col-span-4 sticky top-24">
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Payment Summary</h3>
                        
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <span className="text-2xl">💵</span>
                            <div>
                                <span className="text-xs font-extrabold text-slate-900 block">Cash on Delivery (COD)</span>
                                <span className="text-[11px] text-slate-500">Pay cash or scan UPI when product arrives</span>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
                            <div className="flex justify-between">
                                <span>Cart Subtotal</span>
                                <span className="font-bold text-slate-900">₹{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping to Lucknow</span>
                                <span className="font-bold text-emerald-600">FREE</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Delivery</span>
                                <span className="font-bold text-slate-900">1 - 2 Business Days</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline pt-1">
                            <span className="font-bold text-slate-700 text-sm">Total Amount</span>
                            <span className="text-2xl font-black text-indigo-600 tracking-tight">
                                ₹{total.toLocaleString()}
                            </span>
                        </div>

                        <button 
                            onClick={handlePlaceOrder} 
                            disabled={placing || !selectedAddress}
                            className={`w-full py-4 text-white font-bold text-sm rounded-2xl transition cursor-pointer shadow-md ${
                                placing || !selectedAddress 
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-200'
                            }`}
                        >
                            {placing ? 'Placing Order...' : 'Confirm Order (Cash on Delivery)'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
