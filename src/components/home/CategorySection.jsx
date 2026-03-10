// components/home/CategorySection.jsx
import React, { forwardRef } from 'react';
import ProductCard from '../features/ProductCard';

const CategorySection = forwardRef(({ category, products, onAddToCart }, ref) => {
  if (!products.length) return null;

  return (
    <div ref={ref} className="scroll-mt-[110px]">
      <div className="flex items-center gap-1.5 sm:gap-2.5 mb-2 sm:mb-3.5">
        <span className="text-lg sm:text-xl">{category.icon}</span>
        <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-stone-900">
          {category.label}
        </h3>
        <span className="text-xs text-stone-400 font-semibold">({products.length})</span>
        <div className="flex-1 h-px bg-stone-200 ml-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} addToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection;