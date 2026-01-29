/** @format */
import SectionHeading from '@/components/ui/SectionHeading'
import Table, { HistoryGroup } from '@/components/ui/Table'
import VerticalBookmark from '@/components/ui/VerticalBookmark'
import VideoBlock from '@/components/ui/VideoBlock'
import { getAboutShell, mediaURL, Locale } from '@/lib/strapi'

import Image from 'next/image'
import clsx from 'clsx'

// Added by fix-async-props codemod
type PageProps = {
  params: Promise<{ locale: 'ja' | 'en' }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/* ---------- helpers ------------------------------------------------ */
function renderBlocks(blocks: any[]) {
  return blocks.map((n, i) =>
    n.type === 'paragraph' ? (
      <p key={i} className="mb-4 text-[15px] leading-8">
        {n.children?.map((c: any, j: number) =>
          c.type === 'text' ? <span key={j}>{c.text}</span> : null,
        )}
      </p>
    ) : null,
  )
}

/* ---------- page component ---------------------------------------- */
export default async function AboutPage(props: PageProps) {
  const params = await props.params
  const locale: Locale = params.locale
  const isEN = String(locale).startsWith('en')

  // ✅ use a shell to get both page content + optional video
  const { page: data, video } = await getAboutShell(locale)

  const groups: HistoryGroup[] = (data.history_section ?? []).map((sec: any) => ({
    title: sec.section_name ?? '',
    rows: (sec.content ?? []).map((it: any) => ({
      period: it.era ?? '',
      name: '',
      notes: it.brief ?? '',
    })),
  }))

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="px-4 pb-10 text-[#2d261f]">
        <div className="mx-auto max-w-5xl">
          {/* ───── Heading with icon ───── */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-4xl">☘</span>
            <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">
              {data.page_title}
            </h2>
          </div>

          {/* ───── Intro ───── */}
          <div className="space-y-6 leading-relaxed text-[1rem] sm:text-lg">
            <p>{data.intro_text}</p>
          </div>
        </div>
      </section>

      {/* ✅ Video block (same style as highlights) */}
      {video && (
        <section className="mx-auto max-w-5xl px-4 pb-10">
          <VideoBlock
            title={video.title}
            description={video.description}
            videoUrl={video.videoUrl}
            posterUrl={video.posterUrl}
            locale={locale}
          />
        </section>
      )}

      {/* content blocks */}
      <article className="mx-auto max-w-5xl space-y-14 px-4 pb-14">
        {(data.content ?? []).map((b: any, i: number) => {
          const bookmarkSide = i % 2 === 0 ? 'left' : 'right'
          const imgSide = bookmarkSide === 'left' ? 'right' : 'left'
          const headlineSide = imgSide === 'left' ? 'right' : 'left'

          const bodyPad = b.image?.url
            ? imgSide === 'left'
              ? 'md:pl-56 sm:pr-20'
              : 'md:pr-56 sm:pl-20'
            : 'sm:px-0'

          return (
            <section
              key={i}
              className="relative isolate mt-14 rounded-lg border border-[#e5e2d3] bg-[#f6f3e7]/60 p-5 md:p-6 lg:p-12"
            >
              {!isEN && b.headline && (
                <div className="hidden sm:block">
                  <VerticalBookmark text={b.headline} align={bookmarkSide} locale={locale} />
                </div>
              )}

              {isEN && b.headline && (
                <div
                  className={clsx(
                    'absolute z-30 -top-2 hidden md:block',
                    headlineSide === 'left' ? 'left-6' : 'right-6',
                  )}
                >
                  <span className="inline-flex items-center justify-center rounded-md bg-[#8c3b16] px-4 py-2 text-[18px] font-bold leading-tight tracking-widest text-white shadow-lg">
                    {b.headline}
                  </span>
                </div>
              )}

              {b.image?.url && (
                <Image
                  src={mediaURL(b.image.url)}
                  alt=""
                  width={340}
                  height={460}
                  className={clsx(
                    'absolute top-6 z-10 hidden rounded-md md:block',
                    imgSide === 'left' ? '-left-34' : '-right-34',
                  )}
                />
              )}

              <div className="mb-4 sm:hidden">
                {b.headline && (
                  <h2 className="mb-3 text-xl font-bold tracking-widest text-[#8c3b16]">
                    {b.headline}
                  </h2>
                )}
                {b.image?.url && (
                  <Image
                    src={mediaURL(b.image.url)}
                    alt=""
                    width={640}
                    height={460}
                    className="w-full rounded-md"
                  />
                )}
              </div>

              <div className={bodyPad}>
                {b.headline && <h2 className="sr-only">{b.headline}</h2>}
                {typeof b.intro === 'string' ? (
                  <p className="mb-4 whitespace-pre-wrap text-[15px] leading-8">
                    {b.intro}
                  </p>
                ) : Array.isArray(b.intro) ? (
                  renderBlocks(b.intro)
                ) : null}
              </div>
            </section>
          )
        })}
      </article>

      {groups.length > 0 && (
        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading title={isEN ? 'The History of Donglin Monastery' : '東林寺寺史'} />
          <Table groups={groups} locale={locale} />
        </section>
      )}
    </main>
  )
}
