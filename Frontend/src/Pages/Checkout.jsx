import { useState, useeffect } from "react";
import api from '../api/axios'
import { useNavigate } from "react-router-dom";


export default function Checkout() {
    const userId = localStorage.getItem('userId');
    const [address, setAddress] = useState([]);
    const [cart, setCart] = useState(null);
    const [selectAddress, setselectAddress] = useState(null)

    const navigate = useNavigate();

    useeffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        api.get(`/cart/${userId}`).then((res) => setCart(res.data));
        api.get(`/address/${userId}`).then((res) => {
            setAddress(res.data);
            setselectAddress(res.data[0])
        }
        );
    }, []);

    if (!cart) {
        return <div>Loading...</div>
    }

    const total = cart.items.reduce(
        (sum, i) => sum + i.quantity * i.product.price, 0
    );

    const placeOrder = async () => {
        if (!selectAddress) {
            alert('Please select an address');
            return;
        }

        const res = await api.post('/order/place', {
            userId,
            addressId: selectAddress,
        })

    return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">CheckOut</h1>
                <h2 className="font-semibold mb-2">Select Address</h2>
                {
                    address.map((addr) => (
                        <label className="block border p-3 rounded cursor-pointer" key={}></label>
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