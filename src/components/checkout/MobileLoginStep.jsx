// src/components/checkout/MobileLoginStep.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userProfile } from '../../redux/slices/userAuthSlice';
import { toast } from 'react-toastify';
import { api } from '../../redux/baseApi';

const MobileLoginStep = ({ onLoginSuccess ,onSignupClick }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP using existing /user/login endpoint
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      // Your existing login endpoint sends OTP when only email is provided
      await api.post('/user/login', { email });
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not exist');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      const verifyRes = await api.post('/user/verify-login-otp', { email, otp });
      if (verifyRes.data.token) {
        localStorage.setItem('token', verifyRes.data.token);
        localStorage.setItem('role_id', verifyRes.data.user?.role_id);
        await dispatch(userProfile()).unwrap();
        toast.success('Logged in successfully');
        onLoginSuccess();
      } else {
        toast.error(verifyRes.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Login to Checkout</h2>

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="6-digit OTP"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setOtp(''); }}
            className="text-sm text-amber-600 hover:underline mt-2 block text-center"
          >
            ← Back to email
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSignupClick}
          className="text-amber-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default MobileLoginStep;