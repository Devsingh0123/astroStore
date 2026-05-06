import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress } from '../../redux/slices/addressSlice';
import { toast } from 'react-toastify';
import { Home, Plus, X, MapPin } from 'lucide-react';

const AddressStep = ({ onContinue }) => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [selectedId, setSelectedId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country_code: '+91',
    country: 'India',
    is_default: false,
  });
  const [adding, setAdding] = useState(false);
  const hasFetched = useRef(false);

  // Fetch addresses once
  useEffect(() => {
    if (!hasFetched.current && !loading) {
      hasFetched.current = true;
      dispatch(fetchAddresses());
    }
  }, [dispatch, loading]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Address added');
      setShowAddForm(false);
      setNewAddress({
        name: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country_code: '+91',
        country: 'India',
        is_default: false,
      });
      // Refresh list and allow refetch
      hasFetched.current = false;
      dispatch(fetchAddresses());
    } catch (err) {
      toast.error(err || 'Failed to add address');
    } finally {
      setAdding(false);
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      toast.error('Please select a delivery address');
      return;
    }
    onContinue(selectedId);
  };

  if (loading && addresses.length === 0) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

      {/* Address list */}
      {addresses.length > 0 && (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                selectedId === addr.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedId === addr.id}
                onChange={() => setSelectedId(addr.id)}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-medium">{addr.name}</span>
                  {addr.is_default && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Default</span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Mobile: {addr.mobile}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Add address button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 text-amber-600 text-sm font-medium mb-4 hover:underline"
        >
          <Plus size={16} /> Add new address
        </button>
      )}

      {/* Inline add address form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">New Address</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
          <input
            name="name"
            placeholder="Label (e.g., Home, Office)"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
            required
          />
          <input
            name="mobile"
            placeholder="Mobile number"
            value={newAddress.mobile}
            onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="address"
            placeholder="Street, House No."
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-2">
            <input
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              name="state"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              className="w-24 p-2 border rounded"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newAddress.is_default}
              onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
            />
            Set as default address
          </label>
          <button
            type="submit"
            disabled={adding}
            className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {adding ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}

      {/* Continue button */}

        <button
          onClick={handleContinue}
          className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
        >
          Continue to Payment
        </button>
    </div>
  );
};

export default AddressStep;