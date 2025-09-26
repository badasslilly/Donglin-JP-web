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
import { getWondersPage, mediaURL, type Locale } from '@/lib/strapi'
import clsx from 'clsx'

type PageProps = { params: { locale: Locale } }

export default async function WondersPage({ params }: PageProps) {
  const locale = params.locale ?? 'ja'

  /* fetch & flatten */
  const { page_headline, intro, content_block } = await getWondersPage(locale)

  return (
    <main className='mx-auto max-w-6xl space-y-14 px-4 py-16'>
      {page_headline && <SectionHeading title={page_headline} />}
      <div className='space-y-10'>
      {String(intro ?? '')
        .trim()
        .split(/\r?\n+/)
        .map((para, i) => (
          <p key={i} className='mb-4 leading-relaxed text-lg'>
            {para}
          </p>
        ))}
        </div>
        {content_block.map((sec, idx) => {
        const imageOnRight = idx % 2 === 0 // 0,2,4... right; 1,3,5... left

        return (
          <section key={sec.id} className="space-y-10">
            <div className="grid grid-cols-1 gap-10 pt-10">
              <BorderBox
                title={sec.headline ?? ''}
                side={imageOnRight ? 'right' : 'left'}
                locale={locale}  
              >
                {/* stack on mobile; row on ≥ md; alternate left/right */}
                <div
                  className={clsx(
                    'flex flex-col gap-6 md:items-center',
                    imageOnRight ? 'md:flex-row-reverse' : 'md:flex-row'
                  )}
                >
                  {/* image */}
                  {sec.image?.url && (
                    <Image
                      src={mediaURL(sec.image.url)}
                      alt={sec.headline ?? ''}
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-md object-cover md:w-1/2"
                    />
                  )}

                  {/* rich text */}
                  <div
                    className={clsx(
                      'md:w-1/2',
                      'leading-6 space-y-4 tracking-wide p-7',
                      imageOnRight ? 'md:pr-8 md:pl-0' : 'md:pl-8 md:pr-0'
                    )}
                  >
                    {typeof sec.intro === 'string' ? (
                      <p className="whitespace-pre-wrap leading-8">
                        {sec.intro}
                      </p>
                    ) : Array.isArray(sec.intro) ? (
                      <BlockRendererClient content={sec.intro as BlocksContent} />
                    ) : null}
                  </div>
                </div>
              </BorderBox>
            </div>
          </section>
        )
      })}
    </main>
  )
}
