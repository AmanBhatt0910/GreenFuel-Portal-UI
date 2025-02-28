import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // This disables ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This disables TypeScript checking during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
