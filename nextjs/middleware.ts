// middleware.ts
import createMiddleware from 'next-intl/middleware';
import intlConfig from './next-intl.config';

export default createMiddleware(intlConfig);

export const config = {
  matcher: [
    // Match everything except Next internals/static files
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt)).*)'
  ]
};

