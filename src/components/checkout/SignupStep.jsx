// src/components/checkout/SignupStep.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userProfile } from '../../redux/slices/userAuthSlice';
import { toast } from 'react-toastify';
import { api } from '../../redux/baseApi';

const SignupStep = ({ onSignupSuccess, onBackToLogin }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    email: '',
    country_code: '+91',
    mobile: '',
    terms_accepted: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.terms_accepted) {
      toast.error('You must accept terms & conditions');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/user/register', form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role_id', res.data.role_id);
        await dispatch(userProfile()).unwrap();
        toast.success('Account created & logged in');
        onSignupSuccess(); // go to address step
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full name *"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <select
            name="country_code"
            value={form.country_code}
            onChange={handleChange}
            className="w-24 p-2 border rounded"
          >
            <option value="+91">+91 (India)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
          </select>
          <input
            name="mobile"
            placeholder="Mobile *"
            value={form.mobile}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="terms_accepted"
            checked={form.terms_accepted === 1}
            onChange={handleChange}
          />
          <label className="text-sm">I accept the Terms & Conditions</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 rounded-md"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-amber-600 underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupStep;