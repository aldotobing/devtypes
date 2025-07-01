/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Handle API routes for static export
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/quiz': { page: '/quiz' },
      '/result': { page: '/result' },
      // Add other static pages here
    };
  },
  // Skip API routes during export
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
