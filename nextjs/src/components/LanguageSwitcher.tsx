'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher({ lang }: { lang: 'ja' | 'en' }) {
  const pathname = usePathname();            // e.g. /ja/about
  const other    = lang === 'ja' ? 'en' : 'ja';
  const href     = pathname.replace(`/${lang}`, `/${other}`);

  return (
    <div className="mt-6 flex gap-4 text-xs font-medium tracking-widest lg:text-sm">
      {/* JAPANESE */}
      <Link
        href={href}
        className={`
          flex flex-col items-center uppercase transition hover:opacity-80
          ${lang === 'ja' ? 'text-black font-bold' : 'text-gray-400'}
        `}
      >
        日本語
        {lang === 'ja' && (
          <span className="mt-1 block h-2 w-2 rounded-full bg-black" />
        )}
      </Link>

      {/* Divider */}
      <span className="select-none opacity-60 text-gray-500">|</span>

      {/* ENGLISH */}
      <Link
        href={href}
        className={`
          flex flex-col items-center uppercase transition hover:opacity-80
          ${lang === 'en' ? 'text-black font-bold' : 'text-gray-400'}
        `}
      >
        English
        {lang === 'en' && (
          <span className="mt-1 block h-2 w-2 rounded-full bg-black" />
        )}
      </Link>
    </div>
  );
}
