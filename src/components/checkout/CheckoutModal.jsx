import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../redux/baseApi';
import { fetchAddresses, addAddress } from '../../redux/slices/addressSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { fetchWallet } from '../../redux/slices/walletSlice';
import { userLogin, userProfile } from '../../redux/slices/userAuthSlice';
import Loader from '../common/Loader';
import { Plus } from 'lucide-react';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

// ----- Login form (inside modal) -----
const LoginForm = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(userLogin({ username, password })).unwrap();
      await dispatch(userProfile()).unwrap();
      toast.success('Logged in');
      onLoginSuccess();
    } catch (err) {
      toast.error(err || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Login to Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Email / Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
};

// ----- Add address form (inline) -----
const AddAddressForm = ({ onAdded, onCancel }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', city: '', state: '', pincode: '', country_code: '+91' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addAddress(form)).unwrap();
      toast.success('Address added');
      onAdded();
    } catch (err) { toast.error(err || 'Failed to add address'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded mt-2 space-y-2">
      <input name="name" placeholder="Full name" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="address" placeholder="Address" onChange={handleChange} className="w-full p-2 border rounded" required />
      <div className="flex gap-2">
        <input name="city" placeholder="City" onChange={handleChange} className="flex-1 p-2 border rounded" required />
        <input name="state" placeholder="State" onChange={handleChange} className="flex-1 p-2 border rounded" required />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} className="w-24 p-2 border rounded" required />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
        <button type="button" onClick={onCancel} className="text-gray-500 underline">Cancel</button>
      </div>
    </form>
  );
};

// ----- Main Modal -----
export default function CheckoutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(s => s.userAuth);
  const { items: cartItems, loading: cartLoading, appliedCoupon, couponDiscount } = useSelector(s => s.cart);
  const { addresses, loading: addressesLoading } = useSelector(s => s.address);
  const { balance: walletBalance, loading: walletLoading } = useSelector(s => s.wallet);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      if (!addresses.length) dispatch(fetchAddresses());
      dispatch(fetchWallet());
    }
  }, [isLoggedIn, addresses.length, dispatch]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 599 ? 0 : 199;
  const grandTotal = subtotal + shipping - couponDiscount;

  const handleUseWallet = (checked) => {
    setUseWallet(checked);
    setWalletAmount(checked ? Math.min(walletBalance, grandTotal) : 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return toast.error('Select delivery address');
    if (useWallet && walletAmount > walletBalance) return toast.error('Insufficient wallet balance');
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
      const { order_id, amount: onlineAmount, payment_mode } = data;
      if (onlineAmount <= 0 || payment_mode === 'wallet_only') {
        const verify = await api.post('/store/verify-payment', {
          razorpay_order_id: order_id,
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
          onClose();
        } else toast.error('Verification failed');
        setLoading(false);
        return;
      }
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(onlineAmount * 100),
        currency: 'INR',
        name: 'Astrotring Store',
        order_id,
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
              onClose();
            } else toast.error('Verification failed');
          } catch (err) { toast.error('Verification error'); }
          finally { setIsProcessingPayment(false); setLoading(false); }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Order creation failed');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
          <LoginForm onLoginSuccess={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  if (cartLoading || addressesLoading || walletLoading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Address */}
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              {addresses.length === 0 ? (
                <p className="text-sm text-gray-500">No addresses. Click below to add.</p>
              ) : (
                addresses.map(addr => (
                  <label key={addr.id} className="flex items-start gap-2 p-2 border rounded mb-2 cursor-pointer">
                    <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">{addr.name}, {addr.mobile}</p>
                      <p>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))
              )}
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                <Plus size={14} /> Add new address
              </button>
              {showAddressForm && <AddAddressForm onAdded={() => { setShowAddressForm(false); dispatch(fetchAddresses()); }} onCancel={() => setShowAddressForm(false)} />}
            </div>

            {/* Right: Order summary */}
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="bg-gray-50 p-3 rounded space-y-2">
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
                <div className="mt-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={useWallet} onChange={e => handleUseWallet(e.target.checked)} /> Use Wallet (balance: ₹{walletBalance})</label>
                  {useWallet && <input type="number" value={walletAmount} onChange={e => setWalletAmount(Math.min(walletBalance, grandTotal, parseFloat(e.target.value) || 0))} className="w-full border rounded p-1 text-sm mt-1" />}
                </div>
                <button onClick={handlePlaceOrder} disabled={loading || !selectedAddressId || isProcessingPayment} className="w-full mt-3 bg-amber-600 text-white py-2 rounded hover:bg-amber-700 disabled:opacity-50">
                  {isProcessingPayment ? 'Processing...' : loading ? 'Please wait...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}