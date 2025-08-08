/** @format */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import SectionHeading from './SectionHeading'

interface VideoBlockProps {
  title: string // Big heading shown above
  description: string
  videoUrl: string // YouTube share URL or .mp4
  posterUrl: string
  flip?: boolean // image-right on desktop when true
}

export default function VideoBlock({
  title,
  description,
  videoUrl,
  posterUrl,
  flip = false,
}: VideoBlockProps) {
  const [open, setOpen] = useState(false)
  const isYouTube = /youtu\.?be/.test(videoUrl)

  const imgSide = flip ? 'lg:order-2' : 'lg:order-1'
  const textSide = flip ? 'lg:order-1' : 'lg:order-2'

  function toYouTubeEmbed(url: string): string {
    const idMatch =
      url.match(/youtu\.be\/([^?&]+)/)?.[1] ||
      url.match(/v=([^?&]+)/)?.[1];
    if (!idMatch) return url; // fallback (not YT)
    return `https://www.youtube.com/embed/${idMatch}`;
  }
  const embedSrc = toYouTubeEmbed(videoUrl) + '?autoplay=1'
  

  return (
    <>
      {/* ─── Title ─── */}
      {/* <h3 className='mb-3 text-lg font-bold'>{title}</h3> */}
      <SectionHeading title={title} titleClassName='text-xl font-bold' />
      {/* ─── Row ─── */}
      <div className='my-15 grid lg:grid-cols-2 lg:gap-x-16 gap-y-10'>
        {/* thumbnail */}
        <button
          onClick={() => setOpen(true)}
          className={clsx(
            imgSide,
            'group relative w-full aspect-video overflow-hidden rounded cursor-pointer'
          )}
        >
          {/* poster image fills the button */}
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className='object-cover'
            unoptimized
          />
          {/* play icon perfectly centred */}
          <span className='absolute inset-0 flex items-center justify-center'>
            <span className='grid h-16 w-16 place-items-center rounded-full bg-[#ede7d0]/85 text-black transition group-hover:scale-105 border border-black/80 lg:h-20 lg:w-20'>
              <svg viewBox='0 0 24 24' width='42' fill='currentColor'>
                <polygon points='9,7 19,12 9,17' />
              </svg>
            </span>
          </span>
        </button>
        {/* text */}
        <div className={clsx(textSide, 'flex flex-col justify-center px-1')}>
          <p className='mb-8 leading-relaxed'>{description}</p>
          <button
            onClick={() => setOpen(true)}
            className='inline-flex w-max items-center gap-4 rounded-full border-2 border-black px-8 py-3 text-sm font-bold bg-[#e7e2d0]/80 transition hover:bg-black hover:text-white cursor-pointer'
          >
            動画を見る
            <span className='inline-block transition group-hover:translate-x-1'>
              →
            </span>
          </button>
        </div>
      </div>
      {/* ─── Lightbox dialog (unchanged) ─── */}
      {open && (
        <dialog
          open
          className='fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-sm'
        >
          <div className='relative w-full max-w-5xl'>
          <button
              onClick={() => setOpen(false)}
              className="absolute -right-5 -top-5 grid h-10 w-10 place-items-center rounded-full bg-[#ede7d0] text-2xl font-semibold text-black hover:scale-110 lg:h-12 lg:w-12 cursor-pointer"
              aria-label="close video"
            >
              ×
            </button>
            <div className='bg-black p-2'>
              <iframe
                className='aspect-video w-full'
                src={embedSrc}
                allow='autoplay; encrypted-media'
                title={title}
              />
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}