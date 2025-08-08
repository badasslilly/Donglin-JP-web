/** @format */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowButton } from './ui/Button';
import { ExternalLink } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import clsx from 'clsx';
import type { Locale } from '@/lib/strapi';


interface NewsItem {
  id: number;
  title?: string;
  slug?: string;
  date?: string; // ISO yyyy-mm-dd
}

/* ✨ NEW: allow parent to override the heading text */
interface Props {
  heading?: { jp: string; en: string };
  button?:  string ;
}

export default function NewsSection({ heading, button }: Props) {
  const locale = useLocale() as Locale;
  const [news, setNews] = useState<NewsItem[]>([]);
  /* fetch latest 3 news items */
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

    const qs = new URLSearchParams();
    qs.append('locale', locale);
    ['title', 'slug', 'date'].forEach((f) => qs.append('fields', f));
    qs.append('sort', 'date:desc');
    qs.append('pagination[pageSize]', '3');

    fetch(`${API}/api/news-items?${qs.toString()}`)
      .then((r) => r.json())
      .then((json) => setNews(Array.isArray(json.data) ? json.data : []))
      .catch((e) => console.error('[NewsSection] fetch failed', e));
  }, [locale]);

  return (
    <section id="news" className="bg-stone-50 bg-repeat py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={clsx(
            'mx-auto flex flex-col gap-10 sm:flex-row sm:gap-12 lg:gap-16',
            'px-4 sm:px-6 lg:px-0 items-start'
          )}
        >
           <SectionTitle
            jp={heading?.jp ?? '新着情報'}
            en={heading?.en ?? 'News'}
            className="shrink-0"
          />

          <div className="w-full max-w-3xl">
            {news.map(({ id, title, slug, date }) => (
              <div key={id}>
                <article className="grid grid-cols-[110px_1fr_auto] items-start gap-4 text-sm md:text-base">
                  <time className="font-medium text-gray-700 sm:pt-1">
                    {date?.replaceAll('-', '.')}
                  </time>
                  <Link
                    href={`/news/${slug}`}
                    className="pb-0.5 text-gray-900 transition-colors hover:text-indigo-600"
                  >
                    {title}
                  </Link>
                  <Link
                    href={`/news/${slug}`}
                    className="ml-auto shrink-0 p-1 text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    <ExternalLink strokeWidth={1.5} size={18} />
                  </Link>
                </article>
                <hr className="my-5 sm:my-6 border-t border-stone-300/70" />
              </div>
            ))}

            <div className="mt-10 sm:mt-14 text-center">
              <ArrowButton href="/news" className="inline-flex">
                {button}
              </ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
