import { useState, useEffect } from "react";
import api from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setform] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/products/${id}`);
            if (res.data) {
                setform({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    price: res.data.price ?? "",
                    category: res.data.category || "",
                    image: res.data.image || "",
                    stock: res.data.stock ?? "",
                });
            }
        } catch (error) {
            console.error("API Error loading product:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            await api.put(`/products/update/${id}`, {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock || 0)
            });
            alert('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            console.error("Update Error:", error);
            alert('Failed to update product');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-500 text-sm">Loading product details...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-10 px-4">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Inventory Action
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Edit Product
                    </h1>
                </div>
                <Link
                    to="/admin/products"
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition"
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
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Available Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
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
                            disabled={updating}
                            className="w-1/2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer"
                        >
                            {updating ? 'Updating Product...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
