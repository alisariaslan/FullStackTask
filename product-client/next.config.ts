import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Yerel IP ve localhost üzerinden gelen resimlere izin verir
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '6004',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '6004',
        pathname: '/images/**',
      },
    ],
    // Geliştirme aşamasında private IP hatalarını bypass eder
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
};

export default withNextIntl(nextConfig);