"use client";  
import { useEffect } from 'react'

const MONTHS = [...Array(12)].map((_, i) => i + 1) // 1-12 as numbers

type Props = {
  /** e.g. [1, 2, 5, 9] */
  activeMonths: number[]
}

export default function MonthMenu({ activeMonths }: Props) {
  /* optional: underline follows scroll -------------------------------- */
  useActiveMonthUnderline()

  return (
    <nav className="mb-6 overflow-x-auto">
      <ul className="flex gap-2 whitespace-nowrap text-base">
        {MONTHS.map(m => {
          const hasData = activeMonths.includes(m)
          return (
            <li key={m} className="relative flex">
              {hasData ? (
                <a
                  href={`#month${m}`}
                  className="block px-2.5 pb-2 hover:text-purple-700
                             data-[active=true]:border-b-2
                             data-[active=true]:border-purple-600"
                >
                  {m}月
                </a>
              ) : (
                /* grey, non-interactive */
                <span className="block px-2.5 pb-2 text-gray-400">
                  {m}月
                </span>
              )}

              {m !== 12 && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3/4 w-px bg-gray-300" />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------- */
/* tiny helper to move underline while scrolling (optional)      */
/* ------------------------------------------------------------- */
function useActiveMonthUnderline() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#month"]')
    const sections = [...links].map(l => document.querySelector(l.getAttribute('href')!))

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const link = document.querySelector(`a[href="#${entry.target!.id}"]`)
          link?.setAttribute('data-active', entry.isIntersecting ? 'true' : 'false')
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach(s => s && io.observe(s))
    return () => io.disconnect()
  }, [])
}
