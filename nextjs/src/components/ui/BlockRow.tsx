import { mediaURL } from '@/lib/strapi'
import Image from 'next/image'
import clsx from 'clsx'
import BorderWrapper from './BorderWrapper'

interface Props {
  index: number
  title: string
  subtitle: string
  imageUrl?: string
  body: string
  /** image right / text left when true */
  flip?: boolean
}

export default function BlockRow({
  index,
  title,
  subtitle,
  imageUrl,
  body,
  flip = false,
}: Props) {
  const src = mediaURL(imageUrl)

  /* column ordering for ≥lg */
  const imgOrder  = flip ? 'lg:order-1' : 'lg:order-2'
  const textOrder = flip ? 'lg:order-2 pl-15' : 'lg:order-1 pl-10'

  /* wrapper padding: keep 6vw on the “inner” side, 0 on the edge side */
  const wrapperPad = flip
    ? 'pr-[20vw] ml-[-6vw]'  /* stick LEFT edge, keep right padding */
    : 'pl-[20vw] mr-[-6vw]'  /* stick RIGHT edge, keep left padding */

  return (
    <div className={clsx('mt-20 mb-15 ', wrapperPad)}>
<div className='bg-black/65'>
        <BorderWrapper>
        <div className="lg:grid lg:grid-cols-2">
      {/* image */}
      {src && (
        <div className={clsx('mb-8 lg:mb-0', imgOrder)}>
          <Image
            src={src}
            width={1200}
            height={800}
            className="h-full object-cover"
            alt={title || subtitle || `image-${index}`}
            unoptimized
          />
        </div>
      )}

      {/* text */}
      <div className={clsx('flex flex-col justify-center p-10', textOrder)}>
        <h3 className="mb-4 text-xl font-semibold tracking-widest">
          {index.toString().padStart(2, '0')}.&nbsp;{subtitle}
        </h3>
        <h2 className="mb-6 font-serif text-xl font-bold">{title}</h2>
        <p className="whitespace-pre-wrap leading-8 text-lg px-10">{body}</p>
      </div>
    </div>
        </BorderWrapper>
        </div>
        </div>
  )
}
