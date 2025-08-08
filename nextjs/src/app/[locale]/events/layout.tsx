/** @format */

import '@/styles/globals.css'          // すでに global で読み込んでいるなら不要
import HeroHeader from '@/components/ui/HeroHeader'
import { shippori } from '@/styles/fonts'

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      className={`min-h-screen bg-white text-gray-900 ${shippori.className} font-semibold`}
    >
      {/* ─────── Hero (全イベントページ共通) ─────── */}
      <HeroHeader
        bgSrc="/imgs/sub-pages/event.jpg"
        title="行事・体験"
        subtitle="events"
      />

      {/* ─────── ページごとの中身 ─────── */}
      {children}
    </main>
  )
}
