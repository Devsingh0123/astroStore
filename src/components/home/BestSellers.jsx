import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "../common/Slider";
import ProductCard from "../product/ProductCard";
import { bestSellers } from "@/redux/slices/productSlice";

const BestSellers = ({ onAddToCart }) => {
  const dispatch = useDispatch();
  const { bestSellers: products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(bestSellers());
  }, []);

  if (!products.length) return null;
  return (
    <div className="">
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-stone-900 mb-2">
        Best Sellers
      </h2>

      <Slider slideCount={5}>
        {products.map((product) => {
          return (
            // <Link
            //   key={product.id}
            //   to={`/product/${product?.slug}`}
            //   className="flex flex-col h-full bg-white rounded-sm border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
            // >
            //   <img
            //     src={imageUrl}
            //     alt={product.name}
            //     className="w-full h-[150px] object-cover flex-shrink-0 rounded-sm"
            //   />
            //   <div className="flex flex-col flex-1 p-2">
            //     <div className="text-xs font-bold truncate">{product.name}</div>
            //     <div className="flex items-baseline gap-1 flex-wrap mt-1">
            //       <span className="text-xs font-semibold text-black">
            //         ₹{afterPrice.toLocaleString()}
            //       </span>
            //       {beforePrice > afterPrice && (
            //         <span className="text-[10px] text-gray-400 line-through">
            //           ₹{beforePrice.toLocaleString()}
            //         </span>
            //       )}
            //       {discount && (
            //         <span className="text-[10px] text-amber-600 font-semibold">
            //           {discount}% OFF
            //         </span>
            //       )}
            //     </div>
            //   </div>
            // </Link>
            <div
              key={product.id}
              className="w-[160px] sm:w-[180px] md:w-[200px] flex-shrink-0"
            >
              <ProductCard
                product={product}
                addToCart={onAddToCart}
                compact={true}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default BestSellers;
