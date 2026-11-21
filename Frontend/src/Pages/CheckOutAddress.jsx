import { useState } from "react";
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'


export default function checkoutAddress() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [form, setform] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
    });

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const saveAddress = async (e) => {
        await api.post('/address/add', {
            ...form,
            userId: 
        });
        navigate('/checkout');
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
            {
                Object.keys(form).map((key) => (
                    <input
                        type="text"
                        key={key}
                        name={key}
                        placeholder={key}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                ))
            }
            <button
            onclick={saveAddress}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Save Address
            </button>
        </div>

    )
}