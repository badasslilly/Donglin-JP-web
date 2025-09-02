// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intl = createMiddleware({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
  // localePrefix: 'always' | 'as-needed'  // your choice
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Skip API/static paths so they are NOT redirected to /ja/...
  if (
    pathname.startsWith('/site-api') ||
    pathname.startsWith('/api') ||          // if you have other APIs
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')                  // files like /robots.txt, /images/foo.png
  ) {
    return NextResponse.next();
  }

  return intl(req);
}

// Only run middleware for real pages
export const config = {
  matcher: ['/((?!site-api|api|_next|.*\\..*).*)'],
};
