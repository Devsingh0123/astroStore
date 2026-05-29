import { useDispatch, useSelector } from "react-redux";
import CartPage from "@/pages/CartPage";
import { closeCartDrawer } from "@/redux/slices/uiSlice";
// import { useEffect } from "react";


const CartDrawer = () => {
  const dispatch = useDispatch();

  const { isCartDrawerOpen } = useSelector(
    (state) => state.ui
  );

  if (!isCartDrawerOpen) return null;
  //   useEffect(() => {
  //   if (isCartDrawerOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [isCartDrawerOpen]);

  return (
    <>
       {/* Overlay */}
      <div
        onClick={() => dispatch(closeCartDrawer())}
        className="fixed inset-0 bg-black/40 z-40"
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-full sm:w-[60%] bg-white z-50 overflow-y-auto shadow-2xl">
        <CartPage />
      </div>
    </>
  );
};

export default CartDrawer;