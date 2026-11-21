import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const SignUp = () => {
  const [form, setform] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [msg, setmsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setform({
      ...form, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setmsg('');
    setLoading(true);

    try {
      const response = await api.post("/auth/signup", form);
      setmsg(response.data.message || "Registration successful!");
      setIsError(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setIsError(true);
      setmsg(err.response?.data?.message || "Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-[80vh] items-center justify-center px-4 py-8'>
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/90 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            ✨
          </div>
          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight'>Create Account</h2>
          <p className='text-slate-500 text-xs sm:text-sm mt-1'>Join Ayush Store for exclusive deals</p>
        </div>

        {msg && (
          <div className={`text-xs font-bold p-3.5 rounded-xl mb-4 text-center border ${
            isError ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name *</label>
            <input 
              type="text" 
              name='name' 
              placeholder='e.g. Ayush Tiwari' 
              value={form.name} 
              onChange={handleChange} 
              required
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition' 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address *</label>
            <input 
              type="email" 
              name='email' 
              placeholder='e.g. user@gmail.com' 
              value={form.email} 
              onChange={handleChange} 
              required
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition' 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Password *</label>
            <input 
              type="password" 
              name='password' 
              placeholder='Create secure password' 
              value={form.password} 
              onChange={handleChange} 
              required
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition' 
            />
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className='w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition cursor-pointer'
          >
            {loading ? 'Registering...' : 'Complete Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
