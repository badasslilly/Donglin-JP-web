import HeroHeader from "@/components/ui/HeroHeader";
import PageTabs from "@/components/ui/PageTabs";


const tabs = [
  { label: '東林大仏', href: '/highlights' },
  { label: '法然上人のお言葉', href: '/highlights/words' },
  { label: '知恩院にお参りしよう', href: '/highlights/visit' },
]

export default function Highlights() {
  return (
    <main className='min-h-screen bg-white text-gray-900'>
    {/* ─────────── Hero ─────────── */}
    <HeroHeader
      bgSrc={'/imgs/sub-pages/big-buddha.jpg'}
      title={'見どころ'}
      subtitle='Highlights'
    />
    <PageTabs tabs={tabs} />
    </main>
  );
}