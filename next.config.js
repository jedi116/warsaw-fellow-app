/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable image optimization for profile pictures
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    // Disable CSR bailout warnings
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore for now until we get the prototype working
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore for now until we get the prototype working
  },
}

module.exports = nextConfig