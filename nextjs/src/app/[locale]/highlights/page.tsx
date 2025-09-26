/** @format */

import SectionHeading from '@/components/ui/SectionHeading'
import BlockRow from '@/components/ui/BlockRow'
import VideoBlock from '@/components/ui/VideoBlock'
import { getHighlightsShell, getPageContentBySlug } from '@/lib/strapi'

export default async function Highlights({
  params,
}: {
  params: { locale: 'ja' | 'en' }
}) {
  const locale = params.locale
  const data = await getPageContentBySlug('donglin-grand-amitabha', locale)
  const { video } = await getHighlightsShell(locale)

  if (!data) {
    return (
      <main className='p-10'>
        <p>コンテンツが見つかりません。</p>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-white overflow-x-hidden'>
      <section className='pb-10 text-[#2d261f] '>
        {/* <div className='mx-auto max-w-5xl'> */}
        {/* ── Static hero heading ─────────────────────────── */}
        <div className='mb-8 flex items-center gap-3 mx-auto max-w-6xl px-4 py-10'>
          <span className='text-4xl'>☘</span>
          <h2 className='text-3xl font-bold tracking-wide sm:text-4xl'>
            {data.title}
          </h2>
        </div>
        <div className='mx-auto max-w-5xl px-4 '>
          {video && (
            <VideoBlock
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
              posterUrl={video.posterUrl}
              locale={params.locale}
            />
          )}
        </div>
        {/* ── Dynamic sections ───────────────────────────── */}
        {data.sections?.map((section: any) => (
          <div key={section.id}>
            {/* top-level heading */}
            <SectionHeading
              title={section.section_title}
              bgClassName='mx-auto max-w-6xl bg-[#f6f3e7]/70'
            />
            {section.blocks?.map((b: any, idx: number) => (
              <div key={b.id ?? b.subtitle} className=''>
                <BlockRow
                  index={idx + 1}
                  title={b.title}
                  subtitle={b.subtitle}
                  imageUrl={b.image?.url}
                  body={b.intro ?? b.body ?? ''}
                  flip={idx % 2 === 1}
                  locale={locale} // ← add this
                />
              </div>
            ))}
          </div>
        ))}
        {/* </div> */}
      </section>
    </main>
  )
}
