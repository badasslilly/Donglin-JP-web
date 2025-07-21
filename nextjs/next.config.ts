import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',          // or 'https' in prod
        hostname: '127.0.0.1',     // your Strapi host
        port: '1337',              // if you use :1337 in dev
        pathname: '/uploads/**'
      },

    ]
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);