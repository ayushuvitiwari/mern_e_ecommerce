import { useState } from "react";
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { showSuccess, showError, showInfo } from '../utils/alert';

export default function CheckOutAddress() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pinCode: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveAddress = async (e) => {
        e.preventDefault();

        if (!userId) {
            showInfo('Login Required', 'Please login to save delivery addresses.');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            await api.post('/address/add', {
                ...form,
                userId
            });
            await showSuccess('Address Saved!', 'Your delivery address has been saved successfully.');
            navigate('/checkout');
        } catch (error) {
            console.error("Error saving address:", error);
            showError('Save Failed', 'Could not save your address. Please verify your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 px-4">
            
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Shipping Info
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Add Delivery Address
                    </h1>
                </div>
                <Link
                    to="/checkout"
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition"
                >
                    &larr; Back to Checkout
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
                <form onSubmit={saveAddress} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            placeholder="e.g. Ayush Tiwari"
                            required
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Mobile Contact Number *
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            placeholder="10-digit mobile number"
                            required
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Street & Building Address *
                        </label>
                        <textarea
                            name="address"
                            value={form.address}
                            placeholder="Flat/House no., Floor, Landmark, Colony/Area"
                            required
                            rows="2"
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                required
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                required
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            PIN Code *
                        </label>
                        <input
                            type="text"
                            name="pinCode"
                            value={form.pinCode}
                            placeholder="e.g. 226001"
                            required
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/checkout')}
                            className="w-1/2 py-3.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer"
                        >
                            {loading ? 'Saving Address...' : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
