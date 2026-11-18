import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Login from './Pages/Login'
import ProductsDetails from './Pages/ProductsDetails'
import SignUp from './Pages/SignUp'
import AddProduct from './admin/AddProducts'
import EditProduct from './admin/EditProducts'
import ProductList from './admin/ProductsList'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/product/:id' element={<ProductsDetails />} />

          <Route path='/admin/products' element={<ProductList/>}/>
          <Route path='/admin/products/add' element={<AddProduct/>}/>
          <Route path='/admin/products/edit/:id' element={<EditProduct/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App