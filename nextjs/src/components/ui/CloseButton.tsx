'use client'

import { MouseEventHandler } from 'react'
import clsx from 'clsx'

interface CloseButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
  label?: string
}

export default function CloseButton({
  onClick,
  className,
  label = 'CLOSE',
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx('group cursor-pointer', className)}
    >
      <div className='relative flex items-center justify-center w-15 h-15'>
                      {/* Circle animation */}
                      <div className='absolute inset-0 rounded-full border border-black/60 scale-0 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100' />

                      {/* Cross and text */}
                      <div className='flex flex-col items-center text-[11px] font-light'>
                        <svg
                          viewBox='0 0 24 24'
                          className='h-6 w-6 stroke-[1]'
                        >
                          <path
                            d='M6 6 18 18M6 18 18 6'
                            stroke='currentColor'
                            strokeLinecap='round'
                          />
                        </svg>
                        <span className='mt-[1px] text-[11px] tracking-widest uppercase'>
                          {label}
                        </span>
                      </div>
                    </div>
    </button>
  )
}
