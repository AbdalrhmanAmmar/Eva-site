/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // يمكنك إضافة المزيد من النطاقات هنا حسب الحاجة
    ],
  },
}

module.exports = nextConfig