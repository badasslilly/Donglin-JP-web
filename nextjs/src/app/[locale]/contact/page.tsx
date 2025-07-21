/** @format */



import HeroHeader from '@/components/ui/HeroHeader'
import { shippori } from '@/styles/fonts'



export default function Contact() {
  return (
    <main
      className={`min-h-screen bg-white text-gray-900 ${shippori.className} font-semibold`}
    >
      {/* ─────────── Hero ─────────── */}
      <HeroHeader
        bgSrc={'/imgs/sub-pages/comeback.jpg'}
        title={'お問い合わせ'}
        subtitle='contact'
      />
    </main>
  )
}
