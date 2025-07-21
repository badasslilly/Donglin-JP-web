import localFont from 'next/font/local';

export const shippori = localFont({
  src: [
    { path: '../fonts/ShipporiMincho-Regular.ttf',      weight: '400' },
    { path: '../fonts/ShipporiMincho-Medium.ttf',       weight: '500' },
    { path: '../fonts/ShipporiMincho-SemiBold.ttf',     weight: '600' },
    { path: '../fonts/ShipporiMincho-Bold.ttf',         weight: '700' },
    { path: '../fonts/ShipporiMincho-ExtraBold.ttf',    weight: '800' }
  ],
  variable: '--font-shippori-mincho',
  display: 'swap'
});

export const hannariMinchoFont = localFont({
  src: '../fonts/HannariMincho-Regular.woff2',
  variable: '--font-hannari-mincho',
  display: 'swap'
});
