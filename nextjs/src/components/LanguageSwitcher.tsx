/** @format */
'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLocale} from 'next-intl';

const LOCALES = ['ja', 'en'] as const;

function stripLeadingLocale(path: string) {
  // remove a leading /ja or /en (but keep the rest)
  return path.replace(/^\/(ja|en)(?=\/|$)/, '');
}

function joinLocalePath(locale: 'ja' | 'en', rest: string) {
  const p = `/${locale}${rest || ''}`;
  return p.replace(/\/{2,}/g, '/');
}

export default function LanguageSwitcher() {
  const locale = (useLocale() as 'ja' | 'en') ?? 'ja';
  const pathname = usePathname() || '/';
  const rest = stripLeadingLocale(pathname); // e.g. '/news/abc' -> '/news/abc'
  const isJa = locale === 'ja';

  const jaHref = joinLocalePath('ja', rest);
  const enHref = joinLocalePath('en', rest);

  return (
    <div className="mt-4 flex gap-4 text-xs font-medium tracking-widest lg:text-sm">
      {/* 日本語 */}
      <Link
        href={jaHref}
        className={`flex flex-col items-center uppercase transition hover:opacity-80 cursor-pointer ${
          isJa ? 'text-black font-bold' : 'text-gray-400'
        }`}
        aria-label="Switch to Japanese"
        prefetch
      >
        日本語
        {isJa && <span className="mt-1 block h-2 w-2 rounded-full bg-black" />}
      </Link>

      <span className="select-none opacity-60 text-gray-500">|</span>

      {/* English */}
      <Link
        href={enHref}
        className={`flex flex-col items-center uppercase transition hover:opacity-80 cursor-pointer ${
          !isJa ? 'text-black font-bold' : 'text-gray-400'
        }`}
        aria-label="Switch to English"
        prefetch
      >
        English
        {!isJa && <span className="mt-1 block h-2 w-2 rounded-full bg-black" />}
      </Link>
    </div>
  );
}

