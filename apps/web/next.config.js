/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // Ignore TypeScript type errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint warnings during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
