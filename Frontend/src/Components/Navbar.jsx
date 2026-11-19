import { Link useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios'


export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setcartCount] = useState(0);
    const userId = localStorage.getItem('userId');


    useEffect(() => { 
        const loadCart = async () =>{
            if(!userId) return setcartCount(0);

            const res = await api.get(`/cart/${userId}`);
            const total = res.data.items.reduce(
                (sum,item) => sum + item.quantity,0
            );
            setcartCount(total)
        };
        loadCart();
        window.addEventListener('cartUpdated', loadCart);

        return () =>{
            window.removeEventListener('cartUpdated', loadCart);
        };
    }, [userId]);

    const logOut = () => {
        localStorage.clear();
        setcartCount(0);
        navigate('/login');
    };

    return (
        <nav className='flex justify-between p-4 shadow'>
            <Link to='/' className='font-bold text-xl'>Ayush Store</Link>

            <div className='flex gap-4 items-center'>
                <Link to='/cart' className='relative text-xl'>
                    🛒
                    {
                        cartCount > 0 && (
                            <span className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
                                {cartCount}
                            </span>
                        )
                    }
                </Link>

                {
                    !userId ? (
                        <>
                            <Link to='/login' className='text-lg'>Login</Link>
                            <Link to='/signup' className='text-lg'>Signup</Link>
                        </>
                    ) : (
                        <button onClick={logOut} className='text-lg'>Logout</button>
                    )
                }
            </div>
        </nav>
    )
}
