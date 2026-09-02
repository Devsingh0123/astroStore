import { fetchCart } from "@/redux/slices/cartSlice";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckoutHeader from "./CheckoutHeader";
import CartSummary from "./CartSummary";
import CouponSection from "./CouponSection";
import AuthSection from "./AuthSection";
import AddressSection from "./AddressSection";
import PaymentSection from "./PaymentSection";
import { closeCheckout } from "@/redux/slices/uiSlice";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, User, MapPin, CreditCard } from "lucide-react";

/**
 * LockedStepWrapper Component
 * Renders a glassmorphism blur filter and lock badge when the step requirement is not met.
 */
const LockedStepWrapper = ({ isLocked, lockMessage, stepNumber, title, children }) => {
  return (
    <div className="relative rounded-2xl transition-all duration-300">
      {/* Blurred & Non-Clickable Content Layer when Locked */}
      <div
        className={`transition-all duration-300 ${isLocked
          ? "filter blur-[1px] opacity-90 pointer-events-none select-none grayscale-[20%]"
          : "opacity-100"
          }`}
        aria-hidden={isLocked}
      >
        {children}
      </div>

      {/* Modern Glassmorphic Step Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 backdrop-blur-[1px] cursor-not-allowed">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 text-gray-800 rounded-xl shadow-lg border border-white/20 text-xs font-bold animate-fade-in transform hover:scale-102 transition-all">
            <Lock size={14} className="text-gray-900 shrink-0" />
            <span className="leading-tight">{lockMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CheckoutPopup Component
 * Coordinates multi-step guided checkout:
 * Step 1: Authentication -> Step 2: Delivery Address -> Step 3: Payment Method
 */
const CheckoutPopup = () => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  // Redux state variables
  const { isLoggedIn, user } = useSelector((state) => state.userAuth);
  const { selectedAddressId, addresses } = useSelector((state) => state.address);
  const isOpen = useSelector((state) => state.ui.isCheckoutOpen);

  // Step Completion Calculations:
  // Step 1: Authentication
  const isAuthDone = Boolean(isLoggedIn);

  // Step 2: Address is available & selected
  const hasValidAddress = Boolean(
    selectedAddressId && (addresses?.length > 0 ? addresses.some((a) => a.id === selectedAddressId) : true)
  );
  const isAddressDone = isAuthDone && hasValidAddress;

  // Step 3: Payment is available ONLY if both Auth & Address are done
  const isPaymentAvailable = isAuthDone && isAddressDone;

  // Current active step number (1 = Auth, 2 = Address, 3 = Payment)
  const currentStep = !isAuthDone ? 1 : !isAddressDone ? 2 : 3;

  // Sync state data on visibility lifecycle triggers and handle underlying body scrolling limits
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCart());
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, dispatch]);

  // Handler – when back button clicked
  const handleBackClick = () => {
    setShowConfirm(true);
  };

  // Confirm – Checkout close
  const handleConfirmClose = () => {
    setShowConfirm(false);
    dispatch(closeCheckout());
  };

  // Cancel – Modal close, Checkout open
  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Main Structural Layout Container */}
      <div className="relative flex flex-col w-full max-w-xl h-[100vh] bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all transform scale-100">
        {/* Step-Sticky Anchor Block: Header */}
        <CheckoutHeader onBackClick={handleBackClick} />

        {/* Scrollable Workflow Management Sub-Form Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar bg-white">
          {/* Module 1: Order Summary Items Breakdown (Always Accessible) */}
          <CartSummary />

          {/* Module 2: Applied Promotional Vouchers / Coupon Selection (Always Accessible) */}
          <CouponSection />

          {/* Module 3: Security & Verification State Context blocks */}
          {!isAuthDone ? (
            <AuthSection />
          ) : (
            <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-xs flex items-center justify-between shadow-xs transition-all duration-300 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-gray-900">Step 1: Account Verified</span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Logged In
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {user?.mobile ? `+91 ${user.mobile}` : user?.name || "Session active & verified"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Delivery Address (Blurred/Locked until Auth is complete) */}
          <LockedStepWrapper
            isLocked={!isAuthDone}
            lockMessage="Step 2: Please login first to select address"
            stepNumber={2}
          >
            <AddressSection />
          </LockedStepWrapper>

          {/* Module 5: Payment Gateway triggers (Blurred/Locked until Address is selected) */}
          <LockedStepWrapper
            isLocked={!isPaymentAvailable}
            lockMessage={
              !isAuthDone
                ? "Step 3: Login & choose address to unlock payment"
                : "Step 3: Select or add a delivery address to choose payment"
            }
            stepNumber={3}
          >
            <PaymentSection />
          </LockedStepWrapper>

          <div className="text-center pt-2">
            <label htmlFor="terms" className="text-xs text-gray-400">
              I accept that I have read & understood{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                className="text-amber-500 hover:underline font-semibold"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms-conditions"
                target="_blank"
                className="text-amber-500 hover:underline font-semibold"
              >
                T&Cs.
              </Link>
            </label>
          </div>
        </div>
      </div>

      {/* Exit confirmation modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Close Checkout?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel the checkout process?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPopup;
