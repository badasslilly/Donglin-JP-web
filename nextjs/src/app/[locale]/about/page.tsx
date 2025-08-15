/** @format */
import SectionHeading from '@/components/ui/SectionHeading';
import Table, { HistoryRow } from '@/components/ui/Table';
import VerticalBookmark from '@/components/ui/VerticalBookmark'
import { getAboutPage, mediaURL } from '@/lib/strapi'
import type { Locale } from '@/lib/strapi'
import Image from "next/image";

/* ---------- helpers ------------------------------------------------ */
const hrefFor = (loc: Locale, p: string) =>
  p.startsWith('/') ? `/${loc}${p}`.replace('//', '/') : p

/** very small renderer – paragraph + text  */
function renderBlocks(blocks: any[]) {
  return blocks.map((n, i) =>
    n.type === 'paragraph' ? (
      <p key={i} className='mb-4 text-[15px] leading-8'>
        {n.children?.map((c: any, j: number) =>
          c.type === 'text' ? <span key={j}>{c.text}</span> : null
        )}
      </p>
    ) : null
  )
}


/* ---------- page component ---------------------------------------- */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  /* 1. await params (RSC rule) */
  const { locale } = await params

  /* 2. fetch everything – deep,4 */
  const data = await getAboutPage(locale)
  const rows: HistoryRow[] = (data.history ?? []).map(h => ({
    period: h.era ?? '',
    name:   h.person ?? '',
    notes:  h.brief ?? '',
  }));
  /* 5. render -------------------------------------------------------------- */
  return (
    <main
      className={`min-h-screen bg-white text-gray-900`}
    >
      
      <section className='px-4 pb-10 text-[#2d261f]'>
        <div className='mx-auto max-w-5xl'>
          {/* ───── Heading with icon ───── */}
          <div className='mb-8 flex items-center gap-3'>
            <span className='text-4xl'>☘</span>
            <h2 className='text-3xl font-bold tracking-wide sm:text-4xl'>
              {data.page_title}
            </h2>
          </div>

          {/* ───── Paragraphs ───── */}
          <div className='space-y-6 leading-relaxed text-[1rem] sm:text-lg'>
            <p>
              {data.intro_text}
            </p>
          </div>
        </div>
      </section>
      {/* ─────────── history section ─────────── */}
      <SectionHeading title={data.history_headline ?? ''} />
      <Table rows={rows} locale={locale} />
      {/* content blocks */}
      <article className='mx-auto max-w-5xl px-4 pb-24 space-y-14'>
      {(data.content ?? []).map((b, i) => {
  /* pick sides */
  const bookmarkSide = i % 2 === 0 ? "left" : "right";
  const imgSide      = bookmarkSide === "left" ? "right" : "left";

  /* indent body away from the floating image */
  const bodyPad =
    b.image?.url
      ? imgSide === "left"
        ? "md:pl-56 sm:pr-20"
        : "md:pr-56 sm:pl-20"
      : "sm:px-0";

  return (
    <section
      key={i}
      className="relative mt-14 rounded-lg border border-[#e5e2d3]
                bg-[#f6f3e7]/60 p-5 md:p-6 lg:p-12"
    >
      {/* bookmark (desktop) */}
      {b.headline && (
        <div className="hidden sm:block">
          <VerticalBookmark text={b.headline} align={bookmarkSide} />
        </div>
      )}

      {/* illustration (desktop) */}
      {b.image?.url && (
        <Image
          src={mediaURL(b.image.url)}
          alt=""
          width={340}
          height={460}
          className={`absolute top-6 hidden md:block rounded-md
                      ${imgSide === "left" ? "-left-34" : "-right-34"}`}
        />
      )}

      {/* mobile heading & image */}
      <div className="sm:hidden mb-4">
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

        {typeof b.intro === "string" ? (
          <p className="mb-4 whitespace-pre-wrap text-[15px] leading-8">
            {b.intro}
          </p>
        ) : Array.isArray(b.intro) ? (
          renderBlocks(b.intro)
        ) : null}
      </div>
    </section>
  );
})}


      </article>
    </main>
  )
}
