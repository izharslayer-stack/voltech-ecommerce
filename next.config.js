/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase static generation timeout for slow build environments
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
