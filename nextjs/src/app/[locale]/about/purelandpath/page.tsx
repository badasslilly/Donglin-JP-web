/**
 * ------------------------------------------------------------------
 *
 * @format
 */

/*  app/[locale]/about/purelandpath/page.tsx  (or pureland-path)    */
/* ------------------------------------------------------------------ */
import Image from 'next/image'
import { BlocksContent } from '@strapi/blocks-react-renderer'

import SectionHeading from '@/components/ui/SectionHeading'
import BlockRendererClient from '@/components/BlockRendererClient'
import BorderBox from '@/components/ui/BorderBox'
import { getPurelandPathPage, mediaURL, type Locale } from '@/lib/strapi'
import clsx from 'clsx'
import type { WithAsyncRequest } from '@/utils/next-async-props'

type PagePropsSync = {
  params: { locale: Locale }
  // include if you ever read query string values on this page
  searchParams?: Record<string, string | string[] | undefined>
}
type PageProps = WithAsyncRequest<PagePropsSync>

export default async function PurelandPathPage(props: PageProps) {
  const { locale } = await props.params
  // const sp = props.searchParams ? await props.searchParams : undefined

  const { section_block } = await getPurelandPathPage(locale)

  return (
    <main className="mx-auto max-w-6xl space-y-24 px-4 py-16">
      {section_block.map((sec, secIdx) => (
        <section key={sec.id} className="space-y-10">
          {sec.headline && <SectionHeading title={sec.headline} />}

          <div className="grid grid-cols-1 gap-10 pt-10">
            {sec.content.map((item, idx) => (
              <BorderBox
                key={item.id}
                title={item.headline ?? ''}
                side={idx % 2 === 0 ? 'left' : 'right'}
                locale={locale}
              >
                {/* side-by-side wrapper – stacks on mobile, row on ≥ md */}
                <div
                  className={clsx(
                    'flex flex-col gap-6 md:flex-row',
                    idx % 2 === 1 && 'md:flex-row-reverse',
                  )}
                >
                  {/* image */}
                  {item.image?.url && (
                    <Image
                      src={mediaURL(item.image.url)}
                      alt={item.headline ?? ''}
                      width={800}
                      height={600}
                      className={clsx(
                        'h-auto w-full md:w-1/2 rounded-md object-cover',
                        secIdx === 1 && 'self-center',
                      )}
                    />
                  )}

                  {/* rich-text */}
                  <div
                    className={clsx(
                      'md:w-1/2',
                      'leading-6 space-y-4 tracking-wide p-7',
                      'flex flex-col justify-center',
                    )}
                  >
                    {typeof item.intro === 'string' ? (
                      <p className="whitespace-pre-wrap leading-8">{item.intro}</p>
                    ) : Array.isArray(item.intro) ? (
                      <BlockRendererClient content={item.intro as BlocksContent} />
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
