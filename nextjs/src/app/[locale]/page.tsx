/** @format */

'use client'

import Image from 'next/image'
import Link from 'next/link'

import localFont from 'next/font/local'
import LanguageSwitcher from '@/components/LanguageSwitcher'

import ImageSlider from '@/components/ImageSlider'
import NewsSection from '@/components/NewsSection'
import SectionTitle from '@/components/ui/SectionTitle'
import { ArrowButton } from '@/components/ui/Button'
import { shippori } from '@/styles/fonts'

type Locale = 'ja' | 'en'

/* ----------  Main Page Component ---------- */
export default function LocaleHome({ locale }: { locale: Locale }) {
  return (
    <main className={`relative overflow-x-hidden ${shippori.className}`}>
      {/* ------------------------------------------------------------------
            Header
        ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------
            Hero Section
        ------------------------------------------------------------------ */}
      <section className='relative isolate flex h-[40vh] flex-col justify-end overflow-hidden bg-[#f5f5f3] lg:h-[45vh]'>
        {/* Crest + vertical word‑mark */}
        <div className='absolute left-6 top-6 flex flex-col items-center gap-4 lg:left-12 lg:top-12'>
          <Link href='/' aria-label='サイトトップ'>
            <Image
              src='/logo/avatar.jpg'
              alt='東林寺 図章'
              width={84}
              height={84}
              priority
            />
          </Link>
          <Image
            src='/logo/donglinsi-moji.png'
            alt='東林寺'
            width={30}
            height={150}
            priority
            className='h-auto w-12 lg:w-15'
          />
        </div>

        {/* Optional hero background photo (uncomment if you have one) */}
        {/*<Image src="/imgs/hero.jpg" alt="Hero" fill className="absolute inset-0 -z-10 object-cover" />*/}

        {/* English intro & language selector */}
        <div className='container relative mx-auto max-w-7xl px-35 pb-20 lg:pb-20'>
          {/* <p className='max-w-sm text-xs leading-relaxed text-charcoal/90 lg:text-sm text-black/90'>
            Founded in 386 CE by Master Hui Yuan at Mt. Lushan, Donglin
            Monastery originated the Pure Land School and has inspired monks and
            poets for centuries. It still upholds strict precepts and Amitabha
            recitation, serving as a leading Buddhist and international exchange
            center in Jiangxi.
          </p> */}

          <div className='mt-6 space-x-4 text-xs font-medium tracking-widest text-charcoal lg:text-sm'>
            {/* <span className="text-charcoal">JAPANESE</span>
            <span className="opacity-50">|</span>
            <span className="opacity-50 hover:opacity-100 transition">ENGLISH</span>
            <span className="block pt-1 text-center text-charcoal">•</span> */}
            <LanguageSwitcher />
          </div>
        </div>
      </section>
      {/* ------------------------------------------------------------------
            Highlighted Event Slider (uses SwiperJS)
        ------------------------------------------------------------------ */}
      {/* <ImageSlider /> */}

      <section className='relative w-full overflow-hidden bg-black'>
        <video
          className='h-[45vh] w-full object-cover lg:h-[85vh]'
          src='/video/东林道风形象片-《思归》4k最终版.mp4'
          autoPlay
          muted
          loop
          playsInline
          poster='/imgs/hero-fallback.jpg' /* optional first frame */
        />

        {/* You can overlay headline / CTA here */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
       …text or buttons…
     </div> */}
      </section>
      {/* ------------------------------------------------------------------
            About Section
        ------------------------------------------------------------------ */}
      <section
        id='about'
        className='relative py-20 lg:py-28 lg:px-0 mx-auto max-w-7xl px-4'
      >
        <div className='mx-auto grid gap-10 px-6 lg:grid-cols-[auto_auto_1fr] lg:items-start  '>
          {/* ───── left : vertical headline ───── */}
          <SectionTitle
            jp='東林寺について'
            en='About'
            className='justify-self-start'
          />

          {/* ───── right : map + text — now a 2-col grid ───── */}

          {/* map illustration – top-left aligned */}
          <div className='place-self-start'>
            <Image
              src='/imgs/map-of-Lushan.png'
              alt='Map showing Donglin Temple location'
              width={320} // smaller width
              height={340}
              className='w-full max-w-xs lg:max-w-sm'
            />
          </div>
          <div className='w-full max-w-xl'>
            {/* descriptive copy */}
            <div className='text-black max-w-lg'>
              <p className='mb-6 max-w-prose text-sm leading-7 lg:text-base'>
                廬山は高く雲にそびえ、天地の精気を凝らし、万峰が重なり列をなし、青蓮が天際に広がる。中国江西省、長江中下流南岸に位置する「国家歴史文化名城」九江市の南部に、ある「仏教の聖山」がある。それが「人文始祖の地」である廬山である。東は南昌の滕王閣に接し、南は南昌に向かい、西は京九鉄道に臨み、北は長江中下流の平原地帯と鄱陽湖のほとりにそびえ立つ。廬山はその雄大さ、奇観、険しさ、美しさで広く知られている。
              </p>
              <p className='max-w-prose text-sm leading-7 lg:text-base'>
                遠く晋代まで遡ると、慧遠大師が廬山に至り、寺を創建して東林寺と名づけ、白蓮社を組織し、志を同じくする僧俗とともに西方極楽浄土への往生を願い修行した。廬山の北西麓には「古東林寺」と呼ばれる古刹があり、東晋太元十一年（386年）に完成された。東林寺は中国仏教浄土宗の初祖・慧遠大師が創建した道場であり、南北朝時代以降、「天下仏教八大道場」の一つとして歴代に伝えられた。1600年以上の歳月の中で興亡を繰り返しながらも、その文化の灯を守り続けてきた。
              </p>
            </div>
            <div className='mt-14 text-center'>
              <ArrowButton href='/about' className='inline-flex'>
                詳しく見る
              </ArrowButton>
            </div>
          </div>
        </div>
      </section>
      {/* ------------------------------------------------------------------
            News Section (latest 3)
        ------------------------------------------------------------------ */}
      <NewsSection />
      {/* ------------------------------------------------------------------
            Footer
        ------------------------------------------------------------------ */}
    </main>
  )
}
