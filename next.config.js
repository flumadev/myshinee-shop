/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    AUTH: process.env.AUTH
  },
  images: {
    domains: ['api.pagar.me'],
  },
}

module.exports = nextConfig
