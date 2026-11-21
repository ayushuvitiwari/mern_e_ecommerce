import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [form, setform] = useState({
    email: "",
    password: ""
  });

  const [msg, setmsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setmsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);

      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role || 'user');
      
      const isAdmin = user.role === 'admin' || user.email === 'ayushuvitiwari9091@gmail.com';
      setmsg(isAdmin ? 'Admin Login Successful! Redirecting...' : 'Login Successful! Redirecting...');
      window.dispatchEvent(new Event('cartUpdated'));

      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin/products');
        } else {
          navigate('/');
        }
      }, 700);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-100">

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            👋
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Login to access your cart and account
          </p>
        </div>

        {msg && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-sm font-semibold text-emerald-700">
            {msg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-center text-sm font-semibold text-rose-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. yourname@example.com"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition cursor-pointer active:scale-95"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-indigo-600 hover:underline">
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
