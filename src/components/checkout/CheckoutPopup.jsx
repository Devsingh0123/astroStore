import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CheckoutHeader from './CheckoutHeader';
import MobileLoginStep from './MobileLoginStep';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import SignupStep from './SignupStep';   // 👈 import

const CheckoutPopup = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useSelector((state) => state.userAuth);
  const [step, setStep] = useState(() => (!isLoggedIn ? 'login' : 'address'));
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  if (!isOpen) return null;

  const handleBack = () => {
    if (step === 'login') {
      onClose();
    } else if (step === 'signup') {
      setStep('login');
    } else if (step === 'address') {
      setStep('login');
    } else if (step === 'payment') {
      setStep('address');
    }
  };

  const handleLoginSuccess = () => setStep('address');
  const handleSignupSuccess = () => setStep('address');
  const handleAddressSuccess = (addressId) => {
    setSelectedAddressId(addressId);
    setStep('payment');
  };
  const handleOrderComplete = () => onClose();

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px] h-[90vh] overflow-y-auto relative">
        <CheckoutHeader onBack={handleBack} onClose={onClose} />
        <div className="p-4">
          {step === 'login' && (
            <MobileLoginStep
              onLoginSuccess={handleLoginSuccess}
              onSignupClick={() => setStep('signup')}
            />
          )}
          {step === 'signup' && (
            <SignupStep
              onSignupSuccess={handleSignupSuccess}
              onBackToLogin={() => setStep('login')}
            />
          )}
          {step === 'address' && <AddressStep onContinue={handleAddressSuccess} />}
          {step === 'payment' && (
            <PaymentStep
              selectedAddressId={selectedAddressId}
              onOrderComplete={handleOrderComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;