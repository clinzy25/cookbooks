/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../.env' })
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 31536000,
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
      {
        protocol: 'https',
        hostname: 'izzycooking.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.theendlessmeal.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cookbooks0347.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
