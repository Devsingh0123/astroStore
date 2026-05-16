// src/components/checkout/MobileLoginStep.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userProfile, userVerifyLoginOtp } from '../../redux/slices/userAuthSlice';
import { toast } from 'react-toastify';
import { api } from '../../redux/baseApi';
import { mergeGuestCart, fetchCart } from '../../redux/slices/cartSlice';

const MobileLoginStep = ({ onLoginSuccess, onSignupClick }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await api.post('/user/login', { email });
      setStep('otp');
      toast.success('OTP sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not registered');
    } finally {
      setLoading(false);
    }
  };



const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (!otp) return toast.error("Please enter the OTP");
  setLoading(true);
  try {
    await dispatch(userVerifyLoginOtp({ email, otp })).unwrap();
    await dispatch(userProfile()).unwrap();

    // toast.success('Logged in successfully');
    onLoginSuccess();
    
    
    const mergeResult = await dispatch(mergeGuestCart()).unwrap();
    
    // Only show toast if merge actually happened (guest cart had items)
    if (mergeResult.partial) {
      toast.warning(`Some items couldn't be added: ${mergeResult.errors.join(', ')}`);
    } else if (mergeResult.merged) {
      toast.success('Cart merged successfully');
    }
    // if merged === false → guest cart was empty, no toast needed
    
    await dispatch(fetchCart());
    
  } catch (err) {
    // All items failed → show error
    console.log("error",err)
    // toast.error(err || 'Failed to merge cart');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Login to Checkout</h2>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
          name='email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-300 focus:border-transparent transition" 
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-300"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setOtp(''); }}
            className="w-full text-amber-600  text-sm hover:underline"
          >
            ← Back to email
          </button>
        </form>
      )}
      <p className="text-center text-gray-500">
        New user?{' '}
        <button onClick={onSignupClick} className="text-amber-600 font-medium hover:underline">
          Create account
        </button>
      </p>
    </div>
  );
};

export default MobileLoginStep;