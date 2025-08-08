'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import {useLocale} from 'next-intl';


export default function LanguageSwitcher() {
  const locale   = useLocale() as 'ja' | 'en';   
  const router   = useRouter();                  
  const pathname = usePathname();                

  const other = locale === 'ja' ? 'en' : 'ja';

  function switchLocale() {

    router.replace(pathname, {locale: other});
  }

  return (
    <div className="mt-4 flex gap-4 text-xs font-medium tracking-widest lg:text-sm">
      {/* 日本語 */}
      <button
        onClick={switchLocale}
        className={`flex flex-col items-center uppercase transition hover:opacity-80 cursor-pointer
          ${locale === 'ja' ? 'text-black font-bold' : 'text-gray-400'}`}
        aria-label="Switch to Japanese"
      >
        日本語
        {locale === 'ja' && <span className="mt-1 block h-2 w-2 rounded-full bg-black" />}
      </button>

      <span className="select-none opacity-60 text-gray-500">|</span>

      {/* English */}
      <button
        onClick={switchLocale}
        className={`flex flex-col items-center uppercase transition hover:opacity-80 cursor-pointer
          ${locale === 'en' ? 'text-black font-bold' : 'text-gray-400'}`}
        aria-label="Switch to English"
      >
        English
        {locale === 'en' && <span className="mt-1 block h-2 w-2 rounded-full bg-black" />}
      </button>
    </div>
  );
}
