/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_STRAPI_HOST, // e.g. 127.0.0.1
        port: process.env.NEXT_PUBLIC_STRAPI_PORT || '1337',
      },
    ],
  },
};
