/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  eslint: {
    // Pre-existing prettier noise must not block a production build.
    // Use `npm run lint` for the warning report.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 