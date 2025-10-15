/** @format */

import Image from 'next/image'
import clsx  from 'clsx'

import BorderWrapper        from '@/components/ui/BorderWrapper'
import SectionTitle         from '@/components/ui/SectionTitle'
import HomeBottomNav        from '@/components/HomeBottomNav'
import NewsSection          from '@/components/NewsSection'
import BlockRendererClient  from '@/components/BlockRendererClient'
import { ArrowButton }      from '@/components/ui/Button'

import { shippori } from '@/styles/fonts'
import {
  Locale,
  getGlobal,
  getHomePage,
  SectionTitleCmp,
  TextWithImgCmp,
  ButtonCmp,
  mediaURL,
  resolveMediaUrl,        //  ← NEW
} from '@/lib/strapi'
import HeroVideo from '@/components/ui/HeroVideo'

export default async function LocaleHome({
  params,
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale    
  /* --------- fetch --------- */
  const global = await getGlobal(locale)      // not used yet, but keep for nav
  const home   = await getHomePage(locale)

  /* --------- About dynamic-zone --------- */
  const aboutComps = home?.About ?? []

  const aboutTitle = aboutComps.find(
    (c): c is SectionTitleCmp => c.__component === 'sections.section-title',
  )

  const aboutIntro = aboutComps.find(
    (c): c is TextWithImgCmp => c.__component === 'sections.text-with-img',
  )

  const aboutBtn = aboutComps.find(
    (c): c is ButtonCmp => c.__component === 'sections.button',
  )

  /* --------- News heading --------- */
  const newsTitle =
    (home?.News ?? []).find(
      (c): c is SectionTitleCmp => c.__component === 'sections.section-title',
    ) ?? { title_ja: '新着情報', title_en: 'News' }

  /* --------- Media --------- */
  const heroVideo =
  resolveMediaUrl(home?.home_video);

  /* helper: choose locale-specific string */
  const t = (jp: string, en: string) => (locale === 'ja' ? jp : en)

  return (

    <main className={`relative overflow-x-hidden ${shippori.className}`}>
       <header className='h-20 z-0 border-b border-black/10 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
          <div className='flex flex-col text-[12px] leading-tight tracking-wide'></div>
        </div>
      </header>
      {/* ------------------------------------------------------------------
          Hero (video)
      ------------------------------------------------------------------ */}
      <section className="relative isolate flex flex-col justify-end overflow-hidden bg-black h-[50vh] md:h-[70vh] lg:h-[80vh]">
        <div className="absolute inset-0 z-0 bg-black/50">
          <BorderWrapper className="h-full w-full">
            <video
              className="h-full w-full object-cover"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
            />
          </BorderWrapper>
        </div>
      </section>
      {/* <HeroVideo 
        src={heroVideo}
        poster="/videos/home-hero-poster.jpg"
        className="mx-auto max-w-screen-2xl"
        splashTitle="東林寺 Dōnglín Monastery"
        splashCrestSrc="/images/crest-donglin.svg"
        splashOncePerSession
        maxSplashMs={2400}
        splashDurations={{ intro: 500, hold: 700, doors: 900, fade: 300 }}
      /> */}

      <HomeBottomNav />

      {/* ------------------------------------------------------------------
          About
      ------------------------------------------------------------------ */}
      <section
        id="about"
        className="relative py-20 lg:py-28 mx-auto max-w-7xl px-4"
      >
        <div
          className={clsx(
            'mx-auto flex flex-row gap-4 md:gap-10 items-start lg:px-0',
          )}
        >
          <SectionTitle
            jp={aboutTitle?.title_ja ?? ''}
            en={aboutTitle?.title_en ?? ''}
            className="lg:mb-14"
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14 items-center">
            {/* static map (replace with CMS image if you add one) */}
            <Image
              src="/imgs/map-of-Lushan.png"
              alt="Map showing Donglin Temple location"
              width={300}
              height={340}
              className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]"
            />

            <div className="max-w-xl text-black">
              {aboutIntro && (
                <BlockRendererClient content={aboutIntro.intro} />
              )}

              {/* CTA button from CMS, with fallback */}
              <div className="mt-5 text-center">
                <ArrowButton
                  href={aboutBtn?.url ?? '/about'}
                  className="inline-flex"
                >
                  {aboutBtn?.title ?? t('詳しく見る', 'Read more')}
                </ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          News (latest 3)
      ------------------------------------------------------------------ */}
      <NewsSection heading={{ jp: newsTitle.title_ja, en: newsTitle.title_en }} button={aboutBtn?.title ?? t('お知らせ一覧', 'View All')} />
    </main>
  )
}
