// src/components/checkout/SignupStep.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../../redux/baseApi';
import { toast } from 'react-toastify';

const SignupStep = ({ onSignupSuccess, onBackToLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', country_code: '+91', mobile: '', terms_accepted: 0 });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.terms_accepted) return toast.error('Accept terms');
    setLoading(true);
    try {
      const res = await api.post('/user/register', form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role_id', res.data.role_id);
        toast.success('Registration successful! Please login.');
        onBackToLogin();
      } else {
        toast.error('Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required />
        <div className="flex gap-2">
          <select name="country_code" value={form.country_code} onChange={handleChange} className="px-3 py-3 border rounded-xl bg-white">
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input name="mobile" placeholder="Mobile number" value={form.mobile} onChange={handleChange} className="flex-1 px-4 py-3 border rounded-xl" required />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.terms_accepted === 1} onChange={handleChange} />
          I accept the <a href="/terms-conditions" className="text-amber-600">Terms & Conditions</a>
        </label>
        <button type="submit" disabled={loading} className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-gray-500">
        Already have an account?{' '}
        <button onClick={onBackToLogin} className="text-amber-600 font-medium">Login</button>
      </p>
    </div>
  );
};

export default SignupStep;