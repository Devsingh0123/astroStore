import React from "react";

import { ChevronLeft, Lock } from "lucide-react";
import { useSelector } from "react-redux";

/**
 * CheckoutHeader Component
 * Renders the top navigation bar, logo, and the 3-step progress bar.
 */
const CheckoutHeader = ({ onBackClick }) => {
  const { isLoggedIn } = useSelector((state) => state.userAuth);
  const { selectedAddressId, addresses } = useSelector((state) => state.address);

  // Step Completion Calculations
  const isAuthDone = Boolean(isLoggedIn);
  const hasValidAddress = Boolean(
    selectedAddressId && (addresses?.length > 0 ? addresses.some((a) => a.id === selectedAddressId) : true)
  );
  const isAddressDone = isAuthDone && hasValidAddress;
  const currentStep = !isAuthDone ? 1 : !isAddressDone ? 2 : 3;

  return (
    <div className="flex flex-col w-full shrink-0 bg-white">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* Left Side: Back/Chevron Action Button */}
        <button
          onClick={onBackClick}
          className="p-1 text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
        </div>

        {/* Right Side: Spacer block to balance center alignment */}
        <div className="w-8" aria-hidden="true"></div>
      </div>

      {/* Under-Header 3-Step Progress Strip */}
      <div className="w-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-400 py-2.5 px-4 sm:px-8 border-b border-gray-100 shadow-xs">
        <div className="flex items-center justify-between relative max-w-sm mx-auto">
          {/* Progress Line Connector */}
          <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 -z-0">
            <div
              className="h-full bg-amber-500 transition-all duration-500 ease-out"
              style={{
                width: isAddressDone ? "100%" : isAuthDone ? "50%" : "0%",
              }}
            />
          </div>

          {/* Step 1: Login */}
          <div className="flex items-center gap-1.5 z-10 bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-gray-100">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isAuthDone
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-amber-500 text-white ring-2 ring-amber-100 shadow-xs"
                }`}
            >
              {isAuthDone ? "✓" : "1"}
            </div>
            <span
              className={`text-[10px] font-bold tracking-tight ${isAuthDone
                  ? "text-emerald-700"
                  : currentStep === 1
                    ? "text-amber-600 font-extrabold"
                    : "text-gray-400"
                }`}
            >
              Login
            </span>
          </div>

          {/* Step 2: Address */}
          <div className="flex items-center gap-1.5 z-10 bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-gray-100">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isAddressDone
                  ? "bg-emerald-600 text-white shadow-xs"
                  : isAuthDone
                    ? "bg-amber-500 text-white ring-2 ring-amber-100 shadow-xs"
                    : "bg-gray-100 text-gray-400"
                }`}
            >
              {isAddressDone ? "✓" : isAuthDone ? "2" : <Lock size={10} />}
            </div>
            <span
              className={`text-[10px] font-bold tracking-tight ${isAddressDone
                  ? "text-emerald-700"
                  : currentStep === 2
                    ? "text-amber-600 font-extrabold"
                    : "text-gray-400"
                }`}
            >
              Address
            </span>
          </div>

          {/* Step 3: Payment */}
          <div className="flex items-center gap-1.5 z-10 bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-gray-100">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isAddressDone
                  ? "bg-amber-500 text-white ring-2 ring-amber-100 shadow-xs"
                  : "bg-gray-100 text-gray-400"
                }`}
            >
              {isAddressDone ? "3" : <Lock size={10} />}
            </div>
            <span
              className={`text-[10px] font-bold tracking-tight ${currentStep === 3
                  ? "text-amber-600 font-extrabold"
                  : "text-gray-400"
                }`}
            >
              Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;