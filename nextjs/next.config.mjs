// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Or, more precise control:
    remotePatterns: [
       {protocol: 'https', hostname: 'jp.donglin.org', pathname: '/uploads/**'},
       {protocol: 'http',  hostname: '127.0.0.1', port: '1337', pathname: '/uploads/**'},
     ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverComponentsExternalPackages: ['pg', '@maxmind/geoip2-node'],
  },
};

export default withNextIntl(nextConfig);

