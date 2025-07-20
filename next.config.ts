import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "images.clerk.dev"],
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
