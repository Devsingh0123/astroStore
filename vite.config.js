import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
// performance optimization y
build:{
  rollupOptions: {
    output: {
      manualChunks:  {
          // React ecosystem ko alag chunk (Ye sabse zaroori hai)
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          // Heavy UI aur Animation libraries ko alag chunk
          'ui-libs': ['framer-motion', 'lucide-react', 'react-icons', 'swiper', 'react-select'],
          // PDF aur Image capture utilities ko alag chunk
          'pdf-utils': ['html2canvas-pro', 'html2pdf.js', 'jspdf'],
        },
    },
  },
}

})
