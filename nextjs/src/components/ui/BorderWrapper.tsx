'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface BorderWrapperProps {
  children: ReactNode
  className?: string
}

export default function BorderWrapper({ children, className }: BorderWrapperProps) {
  return (
    <div className={clsx(
      'relative rounded-lg bg-black/20 p-[1px] overflow-hidden',
      className
    )}>
      <div className='relative h-full w-full bg-white rounded-xs p-[9px]'>
      {children}
      </div>
    </div>
  )
} 
