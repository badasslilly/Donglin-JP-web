// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const cookieName = 'dl_vid';

  if (!req.cookies.get(cookieName)?.value) {
    // Use Web Crypto in Edge (no import needed)
    const vid = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    res.cookies.set(cookieName, vid, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    });
  }
  return res;
}

