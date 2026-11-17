import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.png",
        "robots.txt",
        "logo-192.png",
        "logo-512.png",
      ],
      manifest: {
        name: "Astrotring Shop",
        short_name: "Astrotring",
        description:
          "Buy Rudraksha, Karungali, Gemstones, Crystal bracelets, Yantras and other Spiritual items.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#FFFEF7",
        theme_color: "#FFFEF7",
        icons: [
          {
            src: "/logo-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // performance optimization y
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem ko alag chunk (Ye sabse zaroori hai)
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-redux",
            "@reduxjs/toolkit",
          ],
          // Heavy UI aur Animation libraries ko alag chunk
          "ui-libs": [
            "framer-motion",
            "lucide-react",
            "react-icons",
            "swiper",
            "react-select",
          ],
          // PDF aur Image capture utilities ko alag chunk
          "pdf-utils": ["html2canvas-pro", "html2pdf.js", "jspdf"],
        },
      },
    },
  },
});
