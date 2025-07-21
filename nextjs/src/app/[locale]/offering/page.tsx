/** @format */



import HeroHeader from '@/components/ui/HeroHeader'
import PageTabs from '@/components/ui/PageTabs'
import { shippori } from '@/styles/fonts'


const tabs = [
  { label: '慧遠大師とお念仏', href: '/about' },
  { label: '法然上人のお言葉', href: '/about/words' },
  { label: '知恩院にお参りしよう', href: '/about/visit' },
]

export default function Offering() {
  return (
    <main
      className={`min-h-screen bg-white text-gray-900 ${shippori.className} font-semibold`}
    >
      {/* ─────────── Hero ─────────── */}
      <HeroHeader
        bgSrc={'/imgs/sub-pages/lotus.jpg'}
        title={'授与品一覧'}
        subtitle='Offerings'
      />
      {/* ─────────── Tabs ─────────── */}
      <PageTabs tabs={tabs} />
    </main>
  )
}
