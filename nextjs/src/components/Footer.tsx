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
interface Props {
  locale: Locale
  opening: string
  inquiry: string
  tel: string
  email: string
  address: string
  copyright: string
  mapLabel: string
  logoUrl: string | null
  socials: Social[]
}

export function Footer(data: Props) {
  const rawLogo = (data.logoUrl ?? '').trim()
  const logoSrc = rawLogo.length > 0 ? rawLogo : null
  return (
    <footer className={`bg-[#f5f5f3] py-20 text-black ${shippori.className}`}>
      <div className='mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3 lg:gap-20'>
        <div className='lg:col-span-2 space-y-10'>
          <div>
            <p className='text-xl font-semibold tracking-wide'>
              {data.opening}
            </p>
            <p className='mt-6 whitespace-pre-line text-sm leading-relaxed lg:text-base'>
              {withLineBreaks(data.inquiry)}
            </p>
          </div>

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

          <p className='pt-12 text-xs'>{data.copyright}</p>
        </div>

        <div className='hidden lg:grid grid-cols-3 items-start gap-4'>
          <Link
            href='https://maps.google.com/?q=29.4842,115.9966'
            target='_blank'
            className='flex flex-col items-center gap-2 hover:opacity-70'
          >
            <svg viewBox='0 0 24 24' className='h-6 w-6 fill-current rotate-90'>
              <path d='M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' />
            </svg>
            <span className='[writing-mode:vertical-rl] text-sm tracking-widest'>
              {data.mapLabel}
            </span>
          </Link>

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
