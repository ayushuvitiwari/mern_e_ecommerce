import React, { useState } from 'react'
import api from '../api/axios'

const SignUp = () => {

  const [form, setform] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [msg, setmsg] = useState('');

  const handleChange = (e) => {
    setform({
      ...form, [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responce = await api.post("/auth/signup", form);
      setmsg(responce.data.message);
    } catch (err) {
      setmsg(err.response?.data?.message || "Server Error");
    }
  }
  return (
    <>
      <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className='text-2xl font-bold mb-6 text-center'>Create Account</h2>

          {msg && (
            <div className="text-sm font-medium text-blue-600 p-3 rounded mb-4 text-center">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input type="text" name='name' placeholder='Enter Name' value={form.name} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required' />

            <input type="email" name='email' placeholder='Enter Email' value={form.email} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required' />

            <input type="password" name='password' placeholder='Enter Password' value={form.password} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required' />

            <button type='submit' className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'>Sign Up</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp