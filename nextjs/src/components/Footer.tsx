/** @format */

import Image from 'next/image'
import Link from 'next/link'

import { shippori } from '@/styles/fonts/fonts'
import { Instagram, Facebook, XIcon } from 'lucide-react'
import { withLineBreaks } from '@/utils/text'
import { Locale } from '@/lib/strapi'

interface Social {
  platform: string
  url: string
}

interface Affiliate {
  label: string
  url: string
}

interface Props {
  locale: Locale
  opening: string
  inquiry: string
  tel: string
  email: string
  address: string
  copyright: string
  logoUrl: string | null
  socials: Social[]
  affiliates?: Affiliate[]
}

export function Footer(data: Props) {
  const rawLogo = (data.logoUrl ?? '').trim()
  const logoSrc = rawLogo.length > 0 ? rawLogo : null

  const affiliateLabel =
    data.locale === 'ja' ? '提携リンク' : 'Affiliate Links'

  return (
    <footer className={`bg-[#f5f5f3] py-20 text-black ${shippori.className}`}>
      <div className='mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3 lg:gap-20'>
        {/* LEFT / MAIN BLOCK */}
        <div className='lg:col-span-2 space-y-10'>
          {/* Opening & Inquiry */}
          <div>
            <p className='text-xl font-semibold tracking-wide'>
              {data.opening}
            </p>
            <p className='mt-6 whitespace-pre-line text-sm leading-relaxed lg:text-base'>
              {withLineBreaks(data.inquiry)}
            </p>
          </div>

          {/* TEL / MAIL */}
          <div className='space-y-2 text-sm lg:text-base'>
            <p>
              <span className='inline-block w-16'>TEL</span>
              {data.tel}
            </p>
            <p>
              <span className='inline-block w-16'>MAIL</span>
              <a href={`mailto:${data.email}`} className='underline'>
                {data.email}
              </a>
            </p>
          </div>

          {/* SNS ICONS */}
          <div className='flex items-center gap-6 pt-6'>
            {data.socials.map(({ platform, url }) => {
              /* Normalise platform name */
              const name = platform?.toLowerCase()

              let Icon: React.ElementType | null = null
              switch (name) {
                case 'instagram':
                  Icon = Instagram
                  break
                case 'facebook':
                  Icon = Facebook
                  break
                case 'x':
                case 'twitter':
                  Icon = XIcon
                  break
                default:
                  return null // skip unknown platform
              }

              return (
                <Link
                  key={url}
                  href={url}
                  aria-label={platform}
                  className='hover:opacity-70'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Icon className='h-6 w-6' />
                </Link>
              )
            })}
          </div>

          {/* 🔗 AFFILIATE LINKS BLOCK */}
          {data.affiliates?.length ? (
            <div className='mt-6 border-t border-black/20 pt-3'>
              <p className='mb-2 text-xs font-semibold tracking-wide'>
                {affiliateLabel}
              </p>
              <div className='flex flex-wrap items-center gap-3 text-xs lg:text-sm'>
                {data.affiliates.map(({ label, url }) => (
                  <Link
                    key={url}
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline underline-offset-4 hover:opacity-50'
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {/* COPYRIGHT */}
          <p className='pt-12 text-xs'>{data.copyright}</p>
        </div>

        {/* RIGHT / LOGO + ADDRESS (DESKTOP ONLY) */}
        <div className='hidden lg:grid grid-cols-2 items-start gap-4'>
          <div className='flex justify-center'>
            {logoSrc && (
              <Image
                src={logoSrc}
                alt='東林寺'
                width={140}
                height={140}
                className='h-auto w-32'
              />
            )}
          </div>

          <p className='[writing-mode:vertical-rl] whitespace-pre-line text-base tracking-widest'>
            {withLineBreaks(data.address)}
          </p>
        </div>
      </div>
    </footer>
  )
}
