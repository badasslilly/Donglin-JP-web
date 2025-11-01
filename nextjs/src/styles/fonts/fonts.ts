// src/styles/fonts/fonts.ts
import localFont from 'next/font/local';

/** Shippori Mincho — prefer WOFF2; keep only weights you use */
export const shippori = localFont({
  src: [{ path: './ShipporiMincho-Regular.woff2', weight: '400', style: 'normal' },
  	{ path: './ShipporiMincho-Medium.woff2',    weight: '500', style: 'normal' },
	{ path: './ShipporiMincho-SemiBold.woff2',     weight: '600', style: 'normal' },
	{ path: './ShipporiMincho-Bold.woff2',      weight: '700', style: 'normal' },
  ],
  variable: '--font-shippori-mincho',
  display: 'swap',
  preload: true,
  fallback: ['system-ui','-apple-system','Segoe UI','Arial','sans-serif'],
});

/** Hannari Mincho */
export const hannariMinchoFont = localFont({
  src: [{ path: './HannariMincho-Regular.woff2', weight: '400', style: 'normal' }],
  variable: '--font-hannari-mincho',
  display: 'swap',
  preload: true
});

export const aiharaKaisho = localFont({
  src: [
    // Prefer WOFF2; keep TTF as fallback while migrating
    { path: './Aiharahudemojikaisho_free305.woff2', weight: '400', style: 'normal' },
    { path: './Aiharahudemojikaisho_free305.ttf',    weight: '400', style: 'normal' },
  ],
  variable: '--font-aihara-kaisho',
  display: 'swap',
  preload: false
});

