/** @format */

// app/layout.tsx


import SiteNav from '@/components/SiteNav'
import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '東林寺',
  description: 'Zen temple website powered by Strapi & Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja'>
      {/* - The [lang]/layout will add its own `lang` attr on <body> */}
      <body className='antialiased'>
      <SiteNav />
        {children}
      </body>
    </html>
  )
}
