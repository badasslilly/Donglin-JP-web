// src/styles/fonts/fonts.ts
import localFont from 'next/font/local';

/** Shippori Mincho — prefer WOFF2; keep only weights you use */
export const shippori = localFont({
  src: [
    { path: './ShipporiMincho-Regular.woff2', weight: '400', style: 'normal' },
    { path: './ShipporiMincho-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './ShipporiMincho-Bold.woff2',    weight: '700', style: 'normal' },

    // TEMP fallback if you still only have TTFs:
    { path: './ShipporiMincho-Regular.ttf',   weight: '400', style: 'normal' },
    { path: './ShipporiMincho-Medium.ttf',    weight: '500', style: 'normal' },
    { path: './ShipporiMincho-Bold.ttf',      weight: '700', style: 'normal' },
  ],
  variable: '--font-shippori-mincho',
  display: 'swap',
  preload: true
});

/** Hannari Mincho */
export const hannariMinchoFont = localFont({
  src: [{ path: './HannariMincho-Regular.woff2', weight: '400', style: 'normal' }],
  variable: '--font-hannari-mincho',
  display: 'swap',
  preload: true
});

