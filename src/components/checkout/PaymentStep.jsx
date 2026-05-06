import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../redux/baseApi';
import { clearCart } from '../../redux/slices/cartSlice';
import { fetchWallet } from '../../redux/slices/walletSlice';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentStep = ({ selectedAddressId, onOrderComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, appliedCoupon, couponDiscount } = useSelector((state) => state.cart);
  const { balance: walletBalance, loading: walletLoading } = useSelector((state) => state.wallet);

  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);

  // Load Razorpay script once
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 599 ? 0 : 199;
  const grandTotal = subtotal + shipping - couponDiscount;

  const handleUseWallet = (checked) => {
    setUseWallet(checked);
    setWalletAmount(checked ? Math.min(walletBalance, grandTotal) : 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    if (useWallet && walletAmount > walletBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/store/create-order', {
        amount: grandTotal,
        coupon_code: appliedCoupon?.code || null,
        delivery_charge: shipping,
        wallet_amount: useWallet ? walletAmount : 0,
        address_id: selectedAddressId,
      });
      if (!data.status) throw new Error(data.message);

      const { order_id: razorpayOrderId, amount: onlineAmount, payment_mode } = data;

      // Wallet-only payment
      if (onlineAmount <= 0 || payment_mode === 'wallet_only') {
        const verify = await api.post('/store/verify-payment', {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: 'wallet_payment',
          razorpay_signature: 'wallet_paid',
          coupon_code: appliedCoupon?.code || null,
          delivery_charge: shipping,
          address_id: selectedAddressId,
          wallet_amount: useWallet ? walletAmount : 0,
          amount: grandTotal,
        });
        if (verify.data.status) {
          toast.success('Order placed!');
          navigate('/order-success', { state: { orderData: verify.data.order } });
          dispatch(clearCart());
          onOrderComplete(); // close popup
        } else {
          toast.error('Verification failed');
        }
        setLoading(false);
        return;
      }

      // Online payment
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(onlineAmount * 100),
        currency: 'INR',
        name: 'Astrotring Store',
        order_id: razorpayOrderId,
        handler: async (response) => {
          setIsProcessingPayment(true);
          try {
            const verify = await api.post('/store/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              coupon_code: appliedCoupon?.code || null,
              delivery_charge: shipping,
              address_id: selectedAddressId,
              wallet_amount: useWallet ? walletAmount : 0,
              amount: grandTotal,
            });
            if (verify.data.status) {
              toast.success('Payment successful!');
              navigate('/order-success', { state: { orderData: verify.data.order } });
              dispatch(clearCart());
              onOrderComplete(); // close popup
            } else {
              toast.error('Verification failed');
            }
          } catch (err) {
            toast.error('Verification error');
          } finally {
            setIsProcessingPayment(false);
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || 'Order creation failed');
      setLoading(false);
    }
  };

  if (walletLoading) {
    return <div className="text-center py-4">Loading wallet...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="bg-gray-50 p-3 rounded space-y-2 mb-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} {item.ratti ? `(${item.ratti} ratti)` : ''} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
        {appliedCoupon && <div className="flex justify-between text-green-600"><span>Coupon ({appliedCoupon.code})</span><span>-₹{couponDiscount}</span></div>}
        <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>₹{grandTotal}</span></div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useWallet} onChange={(e) => handleUseWallet(e.target.checked)} />
          <span>Use Wallet (balance: ₹{walletBalance})</span>
        </label>
        {useWallet && (
          <input
            type="number"
            value={walletAmount}
            onChange={(e) => setWalletAmount(Math.min(walletBalance, grandTotal, parseFloat(e.target.value) || 0))}
            className="w-full border rounded p-1 text-sm mt-1"
          />
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || isProcessingPayment}
        className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
      >
        {isProcessingPayment ? 'Processing...' : loading ? 'Please wait...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentStep;