/**
 * ------------------------------------------------------------------
 *
 * @format
 */

/*  app/[locale]/about/pureland-path/page.tsx                         */
/* ------------------------------------------------------------------ */
import Image from 'next/image'
import { BlocksContent } from '@strapi/blocks-react-renderer'

import SectionHeading from '@/components/ui/SectionHeading'
import BlockRendererClient from '@/components/BlockRendererClient'
import BorderBox from '@/components/ui/BorderBox'
import { getPurelandPathPage, mediaURL, type Locale } from '@/lib/strapi'
import clsx from 'clsx'

type PageProps = { params: { locale: Locale } }

export default async function PurelandPathPage({ params }: PageProps) {
  const locale = params.locale ?? 'ja'

  /* fetch & flatten */
  const { section_block } = await getPurelandPathPage(locale)

  return (
    <main className='mx-auto max-w-6xl space-y-24 px-4 py-16'>
      {section_block.map((sec) => (
        <section key={sec.id} className='space-y-10'>
          {/* ── vertical bookmark headline for the whole section ───────── */}
          {sec.headline && <SectionHeading title={sec.headline} />}

          {/* ── grid of BorderBoxes ───────────────────────────────────── */}
          <div className='grid grid-cols-1 gap-10 pt-10'>
            {sec.content.map((item, idx) => (
              <BorderBox
                key={item.id}
                title={item.headline ?? ''}
                side={idx % 2 === 0 ? 'left' : 'right'}
              >
                {/* side-by-side wrapper – stacks on mobile, row on ≥ md  */}
                <div
                  className={clsx(
                    'flex flex-col gap-6 md:flex-row md:items-center',
                    idx % 2 === 1 && 'md:flex-row-reverse' // odd: image on the right
                  )}
                >
                  {/* image */}
                  {item.image?.url && (
                    <Image
                      src={mediaURL(item.image.url)}
                      alt={item.headline ?? ''}
                      width={800}
                      height={600}
                      className='h-auto w-full md:w-1/2 rounded-md object-cover'
                    />
                  )}

                  {/* rich-text */}
                  <div
                    className={clsx(
                      'md:w-1/2',
                      // 🔽 tweak the three dimensions here
                      'leading-6', // line-height 2rem (32 px)
                      'space-y-4', // 1 rem between <p>, <ul>, <h*> …
                      'tracking-wide',
                      'p-7',
                       // a little extra letter-spacing
                    )}
                  >
                    {typeof item.intro === 'string' ? (
                      <p className='whitespace-pre-wrap leading-8'>
                        {item.intro}
                      </p>
                    ) : Array.isArray(item.intro) ? (
                      <BlockRendererClient
                        content={item.intro as BlocksContent}
                      />
                    ) : null}
                  </div>
                </div>
              </BorderBox>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
