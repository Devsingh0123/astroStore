// components/home/BestSellers.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const getDisplayPrice = (price) => {
  if (typeof price === 'number') return price;
  if (price && typeof price === 'object') {
    return parseFloat(price.after) || parseFloat(price.before) || 0;
  }
  return 0;
};

const BestSellers = () => {
  const { items: products } = useSelector((state) => state.product);

  if (!products.length) return null;

  return (
    <div className="overflow-hidden mb-4 sm:mb-6 md:mb-7">
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-stone-900 mb-2 sm:mb-3 capitalize">
        Best Sellers
      </h2>
      <div className="flex gap-2 sm:gap-3 md:gap-4 w-max animate-[scrollX_200s_linear_infinite]">
        {products.map((p) => (
          <div
            key={p.id}
            className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] bg-white rounded-xl border border-gray-100 shadow-md p-2 sm:p-2.5"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-[80px] sm:h-[100px] md:h-[120px] lg:h-[140px] object-cover rounded-lg mb-1 sm:mb-2"
            />
            <div className="text-xs sm:text-sm font-bold text-stone-900 mb-1 truncate">
              {p.name}
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-600">
              ₹{getDisplayPrice(p.price).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BestSellers;