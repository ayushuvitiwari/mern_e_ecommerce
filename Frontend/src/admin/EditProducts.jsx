import { useState, useEffect } from "react";
import api from '../api/axios'
import { useNavigate, useParams } from 'react-router'

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
    })

    const allowedFields = ['title', 'description', 'price', 'category', 'image', 'stock']


    const loadProduct = async () => {
        const res = await api.get(`/products`);
        const product = res.data.find((p) => p.id === parseInt(id));
        setform(product)
    }
    useEffect(() => {
        loadProduct();
    }, []);

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.put(`/products/edit/${id}`,form);
        alert('product update sucessfully!');
        navigate('/admin/products');
    }

    return (
        <div className="max-w-lg max-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {
                    allowedFields.map((key) => (
                        allowedFields.includes(key) &&
                        <input key={key} name={key} value={form[key]} onChange={handleChange} placeholder={key} className="w-full p-2 border border-gray-300 rounded" />
                    ))
                }
                <button type="submit" className="w-full bg-blue-500 text-white ">
                    Update Product
                </button>
            </form>
        </div>
    )
}