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
  },  experimental: {
    allowedDevOrigins: ['https://sugamgreenfuel.in', 'http://sugamgreenfuel.in', 'http://localhost:4000'],
  // },  async rewrites() {
  //   // Force production URL when running in production
  //   const isProduction = process.env.NODE_ENV === 'production';
  //   console.log('NODE_ENV:', process.env.NODE_ENV);
  //   console.log('Is Production Environment:', isProduction);
  //   console.log('NEXT_PUBLIC_BACKEND_API_URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
    
  //   // Always prioritize the production URL in production mode
  //   const apiBaseUrl = isProduction
  //     ? 'http://sugamgreenfuel.in/api'
  //     : (process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000');
    
  //   console.log('Using API base URL for rewrites:', apiBaseUrl);
    
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${apiBaseUrl}/:path*`,
  //     },
  //   ];
  },
};

export default nextConfig;
