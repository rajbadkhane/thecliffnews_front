import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['canvas', 'pdfjs-dist'],
  },
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist canvas dependency
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/how-to-download',
        destination: '/en/download',
        permanent: true,
      },
      {
        source: '/playstore',
        destination: 'https://play.google.com/store/apps/details?id=com.thecliffnews',
        permanent: true,
      },
      {
        source: '/app-store',
        destination: 'https://apps.apple.com/us/app/the-cliff-news/id6746549944',
        permanent: true,
      },
      {
        source: '/:locale/about-us',
        destination: '/:locale/about',
        permanent: true,
      },
      {
        source: '/:locale/how-to-download',
        destination: '/:locale/download',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);