import { hannariMinchoFont, shippori } from '@/styles/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: '東林寺 / Donglin Temple',
  description: 'Zen temple website powered by Strapi & Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={`${shippori.variable} ${hannariMinchoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
