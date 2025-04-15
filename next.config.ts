import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};
