import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudinary and Unsplash images in next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  // Restrict build workers to avoid heap OOM crashes on systems with high cores
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
