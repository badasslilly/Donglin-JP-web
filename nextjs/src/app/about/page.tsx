/** @format */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import HeroHeader from '@/components/ui/HeroHeader'
import PageTabs from '@/components/ui/PageTabs'

/**
 * /about page mock‑up matching the reference screenshot
 *
 * Structure
 * ─ Hero (background image + boxed title)
 * ─ Section tabs
 * ─ Breadcrumb
 * ─ Article body
 */
export default function AboutPage() {
  /* Replace with Strapi / CMS navigation if needed */
  const tabs = [
    { label: '慧遠大師とお念仏', href: '/about' },
    { label: '法然上人のお言葉', href: '/about/words' },
    { label: '知恩院にお参りしよう', href: '/about/visit' },
  ]

  const active = '/about' // rudimentary; detect via router in real build

  return (
    <main className='min-h-screen bg-white text-gray-900'>
      {/* ─────────── Hero ─────────── */}
      <HeroHeader
        bgSrc={'/imgs/sub-pages/donglin_draw.png'}
        title={'東林寺について'}
        subtitle='About'
      />
      {/* ─────────── Tabs ─────────── */}
      <PageTabs tabs={tabs} />

      {/* ─────────── Breadcrumb ─────────── */}
      <div className='mx-auto flex max-w-5xl items-center gap-2 px-4 py-4 text-sm text-gray-600'>
        <Link href='/' className='hover:text-indigo-600'>
          ホーム
        </Link>
        <ChevronRight size={16} />
        <span className='text-gray-800'>法然上人とお念仏</span>
      </div>

      {/* ─────────── Content ─────────── */}
      <article className='mx-auto max-w-5xl px-4 pb-24'>
        <hr className='mb-10 border-t-2 border-[#d0d0d0]' />

        <h2 className='mb-8 font-hannari text-3xl tracking-widest'>
          法然上人とお念仏
        </h2>

        <p className='mb-6 text-[15px] leading-8'>
          法然上人は平安の末、長承2年（1133）4月7日、美作国（現在の岡山県）久米南条稲岡庄に押領使・漆間時国（うるまのときくに）の長子として生まれ、幼名を勢至丸（せいしまる）といいました。勢至丸が9歳のとき…
        </p>
        <p className='text-[15px] leading-8'>
          この言葉に従い勢至丸は菩提寺で修学し、その後15歳（一説には13歳）で比叡山に登って剃髪受戒、天台の学問を修めます。久安6年（1150）18歳の秋、黒谷の慈眼房叡空の弟子として表然房源空（ほうねんぼうげんくう）の名を授けられました…
        </p>
      </article>
    </main>
  )
}
