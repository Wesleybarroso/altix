/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export as static HTML files
  output: 'export',
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
