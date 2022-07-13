/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'picsum.photos', 'server']
  }
}

module.exports = nextConfig
