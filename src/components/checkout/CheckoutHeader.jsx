import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import logo from "@/assets/logo.png"

const CheckoutHeader = ({ onBack, onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
      {/* Left: Back button */}
      <button
        onClick={onBack}
        className=" hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="text-gray-500 font-semibold" />
      </button>

      {/* Middle: Logo / brand name */}
      {/* <img className="font-bold text-xl text-amber-600">Astrotring</img> */}
      <img src={logo} alt="Logo" className='h-8 ' />

      {/* Right: Close button */}
      <button
        onClick={onClose}
        className=" hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close"
      >
        <X size={16} className="text-gray-500 font-semibold" />
      </button>
    </div>
  );
};

export default CheckoutHeader;