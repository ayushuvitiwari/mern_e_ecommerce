import { useEffect, useState } from "react"
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [products, setproducts] = useState([]);
  const [search, setsearch] = useState('');
  const [category, setcategory] = useState('');

  const loadProducts = async () => {
    const res = await api.get(`/products?search=${search}&category=${category}`);
    setproducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);


  const addToCart = async (productId) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('please login in to add items to your cart.');
      return;
    }

    const res = await api.post(`/cart/add`, { userId, productId });

    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    localStorage.setItem('cartCount', total);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <>
      <div className="p-6"></div>

      {/* Search */}

      <div className="mb-4 flex gap-3">
        <input type="text" placeholder="Search products" value={search} onChange={(e) => setsearch(e.target.value)} className="border px-3 py-2 rounded w1/2" />
      </div>


      {/* Catrgory filter */}

      <select value={category} onChange={(e) => setcategory(e.target.value)} className="border px-3 py-2 rounded">
        <option value='' >All Categories</option>
        <option value='Laptops'>Laptops</option>
        <option value='Mobiles'>Mobiles</option>
        <option value='Tablets'>Tablets</option>
      </select>

      {/* products grid */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div>
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded p-3 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />

              <h2 className="mt-2 font-semibold text-lg">
                {product.title}
              </h2>

              <p className="text-gray-600">
                ₹{product.price}
              </p>
            </Link>
            <button onClick={() => addToCart(products._id)} className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded ">Add To Cart </button>
          </div>
        ))}
      </div>
    </>
  )
}