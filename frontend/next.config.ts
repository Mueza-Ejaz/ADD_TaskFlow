import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add env configuration to expose environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001",
  },
  /* config options here */
};

export default nextConfig;
