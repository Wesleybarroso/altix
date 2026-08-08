/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Export as static HTML files

  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // i18n disabled for static export – translations handled client‑side
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
