
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../utils/alert';

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

      toast(isAdmin ? 'Welcome Back, Admin!' : `Welcome back, ${user.name}!`, 'success');

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

      {/* White Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">

          <div className="relative flex items-center justify-center">

            {/* Outer Spinner */}
            <div className="h-20 w-20 rounded-full border-[5px] border-indigo-100 border-t-indigo-600 animate-spin"></div>

            {/* Center Icon */}
            <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m16-13a4 4 0 010 8m4 5v-2a4 4 0 00-3-3.87M9 11a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            </div>

          </div>

          <h2 className="mt-7 text-xl font-extrabold tracking-tight text-slate-800">
            Verifying Your Account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we securely log you in...
          </p>

          {/* Loading Dots */}
          <div className="mt-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"></span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:150ms]"></span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:300ms]"></span>
          </div>

          <p className="absolute bottom-8 text-xs font-medium tracking-wide text-slate-400">
            SECURE LOGIN • PLEASE DON'T CLOSE THIS PAGE
          </p>

        </div>
      )}

      <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-100 relative overflow-hidden">

        {/* Subtle Top Loading Line Animation */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 animate-pulse"></div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-xs">
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
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-2">
            <span>✓</span> {msg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-center text-xs font-bold text-rose-600 flex items-center justify-center gap-2">
            <span>⚠️</span> {errorMsg}
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
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition disabled:bg-slate-50"
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
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition disabled:bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 py-3.5 font-bold text-xs sm:text-sm text-white shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>

                <span>Authenticating Account...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <span className="text-indigo-200">&rarr;</span>
              </>
            )}
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
