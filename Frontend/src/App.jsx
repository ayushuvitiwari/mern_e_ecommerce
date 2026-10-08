import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Login from './Pages/Login'
import ProductsDetails from './Pages/ProductsDetails'
import SignUp from './Pages/SignUp'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/product/:id' element={<ProductsDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App