/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '../.env' })

const nextConfig = {
  env: {
    AUTH0_BASE_URL:
      process.env.NODE_ENV === 'development'
        ? process.env.AUTH0_BASE_URL
        : process.env.AUTH0_BASE_URL_PROD,
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cookbooks0347.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
