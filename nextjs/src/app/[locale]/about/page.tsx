/** @format */
import SectionHeading from '@/components/ui/SectionHeading'
import Table, { HistoryGroup } from '@/components/ui/Table'
import VerticalBookmark from '@/components/ui/VerticalBookmark'
import { getAboutPage, mediaURL, Locale } from '@/lib/strapi'

import Image from 'next/image'
import clsx from 'clsx'

/* ---------- helpers ------------------------------------------------ */
const hrefFor = (loc: Locale, p: string) =>
  p.startsWith('/') ? `/${loc}${p}`.replace('//', '/') : p

/** very small renderer – paragraph + text  */
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
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  /* 1. await params (Next 15) */
  const { locale } = await params
  const isEN = String(locale).startsWith('en')

  /* 2. fetch everything */
  const data = await getAboutPage(locale)
  const groups: HistoryGroup[] = (data.history_section ?? []).map(
    (sec: any) => ({
      title: sec.section_name ?? '',
      rows: (sec.content ?? []).map((it: any) => ({
        period: it.era ?? '',
        name: '', // schema has no person
        notes: it.brief ?? '',
      })),
    }),
  )

  /* 3. render -------------------------------------------------------------- */
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

          {/* ───── Paragraphs ───── */}
          <div className="space-y-6 leading-relaxed text-[1rem] sm:text-lg">
            <p>{data.intro_text}</p>
          </div>
        </div>
      </section>

      {/* content blocks */}
      <article className="mx-auto max-w-5xl space-y-14 px-4 pb-14">
        {(data.content ?? []).map((b: any, i: number) => {
          const bookmarkSide = i % 2 === 0 ? 'left' : 'right'
          const imgSide = bookmarkSide === 'left' ? 'right' : 'left'
          const headlineSide = imgSide === 'left' ? 'right' : 'left' // EN badge on opposite side

          /* indent body away from the floating image */
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
              {/* JA: vertical bookmark ribbon; EN: hidden (we overlay a badge) */}
              {b.headline && !isEN && (
                <div className="hidden sm:block">
                  <VerticalBookmark
                    text={b.headline}
                    align={bookmarkSide}
                    locale={locale}
                  />
                </div>
              )}

              {/* EN: headline badge on the OPPOSITE side of the image (above it) */}
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

              {/* illustration (desktop) */}
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

              {/* mobile heading & image */}
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

              {/* body */}
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

      {/* ─────────── history sections ─────────── */}
      {groups.length > 0 && (
        <section className="mx-auto max-w-5xl px-4">
          <SectionHeading
            title={
              isEN ? 'The History of Donglin Monastery' : '東林寺寺史'
            }
          />
          <Table groups={groups} locale={locale} />
        </section>
      )}
    </main>
  )
}
