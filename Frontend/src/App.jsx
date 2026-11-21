import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Home from './Pages/Home';
import Login from './Pages/Login';
import ProductsDetails from './Pages/ProductsDetails';
import SignUp from './Pages/SignUp';
import AddProduct from './admin/AddProducts';
import EditProduct from './admin/EditProducts';
import ProductList from './admin/ProductsList';
import Navbar from './Components/Navbar';
import Cart from './Pages/cart';
import Checkout from './Pages/Checkout';
import CheckOutAddress from './Pages/CheckOutAddress';
import OrderSuccess from './Pages/OrderSucess';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'product/:id',
        element: <ProductsDetails />
      },
      {
        path: 'admin/products',
        element: <ProductList />
      },
      {
        path: 'admin/products/add',
        element: <AddProduct />
      },
      {
        path: 'admin/products/edit/:id',
        element: <EditProduct />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'checkout/address',
        element: <CheckOutAddress />
      },
      {
        path: 'order/success/:id',
        element: <OrderSuccess />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
