import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Home from './Pages/Home'
import Login from './Pages/Login'
import ProductsDetails from './Pages/ProductsDetails'
import SignUp from './Pages/SignUp'
import AddProduct from './admin/AddProducts'
import EditProduct from './admin/EditProducts'
import ProductList from './admin/ProductsList'
import Navbar from './Components/Navbar';
import Cart from './Pages/cart'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
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
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App