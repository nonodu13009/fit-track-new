import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimisations */
  reactStrictMode: true,
  
  /* Compression */
  compress: true,
  
  /* Images */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  /* Experimental features */
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
