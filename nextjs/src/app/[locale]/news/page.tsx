/** @format */

import Link from 'next/link';
import { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

import HeroHeader   from '@/components/ui/HeroHeader';
import { shippori } from '@/styles/fonts';
import { getNewsList, Locale } from '@/lib/strapi';

export const metadata: Metadata = { title: 'お知らせ一覧' };

export default async function NewsIndex({
  params,
}: {
  params: { locale: Locale }; 
}) {

  const { locale } = params;
  const news = await getNewsList(locale);
  
  console.log('[NewsIndex] news', news); 

  return (
    <main className={`${shippori.className} font-semibold bg-white`}>
      <HeroHeader
        bgSrc="/imgs/sub-pages/news1.jpeg"
        title="お知らせ"
        subtitle="News"
      />

      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="w-full max-w-3xl mx-auto">
          {news.map((n) => (
            <div key={n.slug}>
              <article className="grid grid-cols-[110px_1fr_auto] items-start gap-4 text-sm md:text-base ">
                <time className="font-medium text-gray-700">
                  {n.date.replaceAll('-', '.')}
                </time>

                <Link
                  href={`/news/${n.slug}`}
                  locale={locale}
                  className="pb-0.5 text-gray-900 transition-colors hover:text-purple-700"
                >
                  {n.title}
                </Link>

                <Link
                  href={`/news/${n.slug}`}
                  locale={locale}
                  className="ml-auto shrink-0 p-1 text-gray-600 transition-colors hover:text-purple-700"
                >
                  <ExternalLink size={18} strokeWidth={1.5} />
                </Link>
              </article>
              <hr className="my-6 border-t border-stone-300/70" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
