/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../.env' })
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // seed data
      {
        protocol: 'https',
        hostname: 'therealfooddietitians.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.simplyquinoa.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'howtofeedaloon.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
