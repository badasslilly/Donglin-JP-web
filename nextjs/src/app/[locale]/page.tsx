/** @format */

import Image from 'next/image';
import clsx from 'clsx';

import BorderWrapper        from '@/components/ui/BorderWrapper';
import SectionTitle         from '@/components/ui/SectionTitle';
import HomeBottomNav        from '@/components/HomeBottomNav';
import NewsSection          from '@/components/NewsSection';
import BlockRendererClient  from '@/components/BlockRendererClient';
import { ArrowButton }      from '@/components/ui/Button';
import { shippori } from '@/styles/fonts';

import {
  Locale,
  getGlobal,
  getHomePage,
  SectionTitleCmp,
  TextWithImgCmp,
  ButtonCmp,
  resolveMediaUrl,
} from '@/lib/strapi';
import { localeHref } from '@/lib/localeHref';
import HeroVideoHLS from '@/components/ui/HeroVideoHLS';


const HERO_HLS   = process.env.NEXT_PUBLIC_HERO_HLS || '/videos/hero/master.m3u8';
const HERO_POSTER= process.env.NEXT_PUBLIC_HERO_POSTER || '/videos/home-hero-poster.jpg';

// Next 15 async request props shim (from codemod)
type PageProps = {
  params: Promise<{ slug: string; locale: 'ja' | 'en' }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LocaleHome(props: PageProps) {
  const params = await props.params;
  const locale = params.locale as Locale;

  // Fetch in parallel (server → fast; ISR via getGlobal/getHomePage)
  const [global, home] = await Promise.all([getGlobal(locale), getHomePage(locale)]);

  const aboutComps = home?.About ?? [];

  const aboutTitle = aboutComps.find(
    (c): c is SectionTitleCmp => c.__component === 'sections.section-title'
  );

  const aboutIntro = aboutComps.find(
    (c): c is TextWithImgCmp => c.__component === 'sections.text-with-img'
  );

  const aboutBtn = aboutComps.find(
    (c): c is ButtonCmp => c.__component === 'sections.button'
  );

  const newsTitle =
    (home?.News ?? []).find(
      (c): c is SectionTitleCmp => c.__component === 'sections.section-title'
    ) ?? { title_ja: '新着情報', title_en: 'News' };

  const heroVideo = resolveMediaUrl(home?.home_video);
  const t = (jp: string, en: string) => (locale === 'ja' ? jp : en);
  const aboutHref = localeHref(aboutBtn?.url ?? '/about', locale);

  return (
    <main className={`relative overflow-x-hidden ${shippori.className}`}>
      <header className="h-20 z-0 border-b border-black/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex flex-col text-[12px] leading-tight tracking-wide"></div>
        </div>
      </header>

      {/* Hero (video) */}
      <section className="relative isolate flex flex-col justify-end overflow-hidden bg-black h-[50vh] md:h-[70vh] lg:h-[80vh]">
  {/* 🔧 pull in by 2px so the border isn't clipped by overflow-hidden */}
  <div className="absolute inset-0 z-0 bg-black/50">
    <BorderWrapper className="h-full w-full">
      <HeroVideoHLS
        src={HERO_HLS}                 // e.g. "/videos/hero/master.m3u8"
        poster={HERO_POSTER}           // e.g. "/videos/home-hero-poster.jpg"
        heightClasses="h-full"         // fill the frame height
        className="w-full"             // fill width
      />
    </BorderWrapper>
  </div>
</section>

      {/* ✅ Pass server-fetched nav items; no client fetch */}
      <HomeBottomNav locale={locale} items={global.nav_items ?? []} />

      {/* About */}
      <section id="about" className="relative py-20 lg:py-28 mx-auto max-w-7xl px-4">
        <div className={clsx('mx-auto flex flex-row gap-4 md:gap-10 items-start lg:px-0')}>
          <SectionTitle
            jp={aboutTitle?.title_ja ?? ''}
            en={aboutTitle?.title_en ?? ''}
            className="lg:mb-14"
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14 items-center">
            <Image
              src="/imgs/map-of-Lushan.png"
              alt="Map showing Donglin Temple location"
              width={300}
              height={340}
              priority
              sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
              className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] h-auto"
            />

            <div className="max-w-xl text-black">
              {aboutIntro && <BlockRendererClient content={aboutIntro.intro} />}

              <div className="mt-5 text-center">
                <ArrowButton href={aboutHref} className="inline-flex">
                  {aboutBtn?.title ?? t('詳しく見る', 'Read more')}
                </ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News (latest 3) */}
      <NewsSection
        heading={{ jp: newsTitle.title_ja, en: newsTitle.title_en }}
        button={aboutBtn?.title ?? t('お知らせ一覧', 'View All')}
      />
    </main>
  );
}

