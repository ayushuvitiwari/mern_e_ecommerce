import { useState } from "react";
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { showSuccess, showError } from '../utils/alert';

export default function AddProducts() {
    const [form, setform] = useState({
        title: "",
        description: "",
        price: "",
        category: "Laptops",
        image: "",
        stock: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/products/add', {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock || 0)
            });
            await showSuccess('Product Added!', `"${form.title}" has been successfully added to inventory.`);
            navigate('/admin/products');
        } catch (error) {
            console.error("Error adding product:", error);
            showError('Add Failed', error.response?.data?.message || 'Failed to add product to inventory.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 px-4">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Inventory Action
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Add New Product
                    </h1>
                </div>
                <Link
                    to="/admin/products"
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                    &larr; Back to Inventory
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 sm:p-8 shadow-sm rounded-3xl border border-slate-200/90">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Product Title *
                        </label>
                        <input 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            placeholder="e.g. Apple MacBook Pro M3 (16GB, 512GB)" 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition cursor-pointer"
                            >
                                <option value="Laptops">Laptops</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Tablets">Tablets</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Price (₹) *
                            </label>
                            <input 
                                type="number"
                                name="price" 
                                value={form.price} 
                                onChange={handleChange} 
                                placeholder="e.g. 89999" 
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Initial Stock Available
                            </label>
                            <input 
                                type="number"
                                name="stock" 
                                value={form.stock} 
                                onChange={handleChange} 
                                placeholder="e.g. 25" 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Image URL
                            </label>
                            <input 
                                name="image" 
                                value={form.image} 
                                onChange={handleChange} 
                                placeholder="Paste image link..." 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                            />
                        </div>
                    </div>

                    {form.image && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <span className="text-xs text-slate-500">Preview:</span>
                            <img src={form.image} alt="Preview" className="w-12 h-12 object-contain rounded-lg border bg-white" />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                            Description
                        </label>
                        <textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange} 
                            placeholder="Key features, specifications, and warranty info..." 
                            rows="3"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/products')}
                            className="w-1/2 py-3.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-1/2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer"
                        >
                            {loading ? 'Adding Product...' : 'Save & Publish Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
