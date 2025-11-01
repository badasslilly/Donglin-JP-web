// src/app/layout.tsx  (or src/app/[locale]/layout.tsx)
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { shippori, hannariMinchoFont } from '@/styles/fonts/fonts';

export const metadata: Metadata = {
  title: '東林寺 / Donglin Monastery',
  description: 'Pureland Monastery website powered by Strapi & Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
 	<html 
	  className={`${shippori.variable} ${hannariMinchoFont.variable}`}>
  	  <body className="antialiased font-sans">{children}</body>
	</html>
  );
}

