// app/[lang]/layout.tsx
import { ReactNode } from 'react';
import * as strapi from '@/data/loaders';
import Header from '@/components/Header';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Footer } from '../../components/Footer';

// app/(lang)/layout.tsx  – simplified
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="relative">
        {/* ① Top (white) */}
        <header className="bg-neutral-50 text-neutral-900">
          …your current hero content…
        </header>

        {/* ② White Path */}
        <div className="white-path" aria-hidden />

        {/* ③ Bottom (black) */}
        <main className="bg-black text-neutral-100">
          {children}
        </main>
      </body>
    </html>
  );
}

