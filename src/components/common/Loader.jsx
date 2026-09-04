import React from "react";

const Loader = ({ data }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-gray-200 animate-spin" />

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">{data || "Loading..."}</p>
          <div className="flex justify-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;