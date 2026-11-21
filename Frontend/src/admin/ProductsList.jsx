import { useEffect, useState } from "react";
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminSearch, setAdminSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("API Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title || 'this product'}"?`)) return;

        try {
            await api.delete(`/products/delete/${id}`);
            alert('Product deleted successfully!');
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Filtered products for admin
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.title?.toLowerCase().includes(adminSearch.toLowerCase()) || 
                              p.category?.toLowerCase().includes(adminSearch.toLowerCase());
        const matchesCat = selectedCategory ? p.category === selectedCategory : true;
        return matchesSearch && matchesCat;
    });

    const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

    return (
        <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
            
            {/* Header & Quick Stats Row */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Store Management
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Admin Inventory Dashboard
                    </h1>
                    <p className="text-sm text-slate-500">
                        View, search, edit and manage products in real-time
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        to='/' 
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                        View Storefront
                    </Link>
                    <Link 
                        to='/admin/products/add' 
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
                    >
                        <span>+ Add New Product</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                        📦
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                        <h3 className="text-2xl font-black text-slate-900">{products.length} Items</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                        📊
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stock Count</span>
                        <h3 className="text-2xl font-black text-slate-900">{totalStock} Units</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                        💰
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Value</span>
                        <h3 className="text-2xl font-black text-slate-900">₹{totalInventoryValue.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* Table Card Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
                
                {/* Search & Filter Toolbar inside table */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search in inventory..."
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-inner"
                        />
                        {adminSearch && (
                            <button
                                onClick={() => setAdminSearch('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Tablets">Tablets</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                            Showing {filteredProducts.length} of {products.length}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-slate-500 text-sm">Loading product database...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        <p className="text-base font-bold text-slate-700">No products matched</p>
                        <p className="text-xs text-slate-400 mt-1">Try changing filters or add a new product</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-xs uppercase tracking-wider font-extrabold">
                                    <th className="px-6 py-3.5">Product</th>
                                    <th className="px-6 py-3.5">Category</th>
                                    <th className="px-6 py-3.5">Price</th>
                                    <th className="px-6 py-3.5">Stock Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/70 transition">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0">
                                                <img 
                                                    src={product.image || 'https://via.placeholder.com/60?text=No+Img'} 
                                                    alt={product.title} 
                                                    className="max-h-full max-w-full object-contain rounded"
                                                />
                                            </div>
                                            <div>
                                                <Link 
                                                    to={`/product/${product._id}`} 
                                                    className="font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-1"
                                                >
                                                    {product.title}
                                                </Link>
                                                <span className="text-[11px] text-slate-400">ID: {product._id?.slice(-6)}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md uppercase">
                                                {product.category || 'General'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-extrabold text-slate-900">
                                            ₹{Number(product.price).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                                product.stock > 0 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link 
                                                to={`/admin/products/edit/${product._id}`} 
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition inline-block"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => deleteProduct(product._id, product.title)} 
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
