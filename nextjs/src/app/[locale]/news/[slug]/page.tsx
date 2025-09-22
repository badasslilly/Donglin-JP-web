export const dynamic = 'force-dynamic';

import HeroHeader from '@/components/ui/HeroHeader';
import BlockRendererClient from '@/components/BlockRendererClient';
import { getNewsBySlug, Locale } from '@/lib/strapi';
import { shippori } from '@/styles/fonts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  // ✅ Next 15: params is async
  const { locale, slug } = await params;

  const detail = await getNewsBySlug(slug, locale);
  if (!detail) notFound();

  return (
    <main className={`${shippori.className} font-semibold bg-white`}>
      <HeroHeader bgSrc="/imgs/sub-pages/news1.jpeg" title="お知らせ" subtitle="News" />

      <header className="mx-auto max-w-xl px-4 pt-12 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl leading-snug mb-2">
          {detail.title}
        </h1>
        <time className="block text-sm text-gray-600">
          {detail.date.replaceAll('-', '.')}
        </time>
      </header>

      <article
        className={`
          prose prose-lg mx-auto max-w-3xl
          py-16 px-6 mt-10 mb-20
          border border-gray-300 rounded-xl bg-white shadow-sm
          space-y-8 prose-p:leading-8 prose-p:mb-0
          prose-headings:mt-10 prose-headings:mb-4
        `}
      >
        <BlockRendererClient content={detail.body} />
      </article>

      <div className="w-full flex justify-center">
        <div className="mb-10">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors shadow-sm"
          >
            <span className="text-lg">←</span> ニュース一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
