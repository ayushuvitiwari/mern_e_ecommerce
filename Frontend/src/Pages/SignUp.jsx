import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { showSuccess, showError } from '../utils/alert';

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

      const successMsg = response.data.message || "Registration successful!";

      setmsg(successMsg);
      setIsError(false);

      await showSuccess(
        'Account Created!',
        'Your account has been registered successfully. Please sign in now.'
      );

      navigate('/login');

    } catch (err) {
      setIsError(true);

      const errMsg = err.response?.data?.message || "Server Error. Please try again.";

      setmsg(errMsg);

      showError('Registration Failed', errMsg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-[80vh] items-center justify-center px-4 py-8'>

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
            Creating Your Account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we set up your account...
          </p>

          {/* Loading Dots */}
          <div className="mt-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"></span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:150ms]"></span>
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:300ms]"></span>
          </div>

          <p className="absolute bottom-8 text-xs font-medium tracking-wide text-slate-400">
            SECURE REGISTRATION • PLEASE DON'T CLOSE THIS PAGE
          </p>

        </div>
      )}

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden">

        {/* Subtle Top Loading Line Animation */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 animate-pulse"></div>
          </div>
        )}

        <div className="text-center mb-8">

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-xs">
            ✨
          </div>

          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight'>
            Create Account
          </h2>

          <p className='text-slate-500 text-xs sm:text-sm mt-1'>
            Join Ayush Store for exclusive deals
          </p>

        </div>

        {msg && (
          <div className={`text-xs font-bold p-3.5 rounded-xl mb-4 text-center border flex items-center justify-center gap-2 ${isError ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
            <span>{isError ? '⚠️' : '✓'}</span> {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Name *
            </label>

            <input
              type="text"
              name='name'
              placeholder='e.g. Ayush Tiwari'
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition disabled:bg-slate-50'
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address *
            </label>

            <input
              type="email"
              name='email'
              placeholder='e.g. user@gmail.com'
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition disabled:bg-slate-50'
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password *
            </label>

            <input
              type="password"
              name='password'
              placeholder='Create secure password'
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition disabled:bg-slate-50'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-80 disabled:cursor-not-allowed'
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>

                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <span className="text-indigo-200">&rarr;</span>
              </>
            )}
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
