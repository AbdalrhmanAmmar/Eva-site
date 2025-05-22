// next.config.js
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
};

module.exports = nextConfig;
