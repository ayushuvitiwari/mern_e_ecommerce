import { useState, useeffect } from "react";
import api from '../api/axios'


export default function Checkout() {
    const userId = localStorage.getItem('userId');
    const [address, setAddress] = useState([]);
    const [cart, setCart] = useState(null);

    useeffect(() => {
        api.get(`/cart/${userId}`).then((res) => setCart(res.data));
        api.get(`/address/${userId}`).then((res) => setAddress(res.data));
    }, []);

    if (!cart) {
        return <div>Loading...</div>
    }

    const total = cart.items.reduce(
        (sum, i) => sum + i.quantity * i.product.price, 0
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">CheckOut</h1>
            <h2 className="font-semibold mb-2">Select Address</h2>
            {
                address.map((addr) => (
                    <div key={addr._id} className="border p-4 mb-2 rounded">
                        <p>{addr.fullName}</p>
                        <p>{addr.phone}</p>
                        <p>{addr.address}, {addr.city}, {addr.state} - {addr.pinCode}</p>
                    </div>
                ))
            }
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <p>Total Amount : {total}</p>

            <button className="mt-4 w-full bg-green-500 text-white p-2 rounded">
                place Order (COD);
            </button>
        </div>
    )
}