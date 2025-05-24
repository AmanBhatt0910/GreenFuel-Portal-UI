import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['https://sugamgreenfuel.in', 'http://sugamgreenfuel.in', 'http://localhost:4000'],
  },  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://api.sugamgreenfuel.in' 
        : 'http://127.0.0.1:8000');
    
    console.log('Using API base URL for rewrites:', apiBaseUrl);
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
