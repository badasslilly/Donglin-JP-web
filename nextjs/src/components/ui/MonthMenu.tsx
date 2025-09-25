"use client"
import { useEffect } from "react"

const EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

type Props = {
  activeMonths: number[]
  locale: "ja" | "en"
}

export default function MonthMenu({ activeMonths, locale }: Props) {
  useActiveMonthUnderline()
  const isEN = locale === "en"

  return (
    <nav className="mb-6 overflow-x-auto">
      <ul className="flex gap-2 whitespace-nowrap text-base">
        {MONTHS.map((m) => {
          const hasData = activeMonths.includes(m)
          const label = isEN ? EN[m - 1] : `${m}月`
          return (
            <li key={m} className="relative flex">
              {hasData ? (
                <a
                  href={`#month${m}`}
                  className="block px-2.5 pb-2 hover:text-purple-700
                             data-[active=true]:border-b-2 data-[active=true]:border-purple-600"
                >
                  {label}
                </a>
              ) : (
                <span className="block px-2.5 pb-2 text-gray-400">{label}</span>
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

function useActiveMonthUnderline() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#month"]')
    const sections = [...links].map((l) => document.querySelector(l.getAttribute('href')!))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = document.querySelector(`a[href="#${entry.target!.id}"]`)
          link?.setAttribute("data-active", entry.isIntersecting ? "true" : "false")
        })
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    )
    sections.forEach((s) => s && io.observe(s))
    return () => io.disconnect()
  }, [])
}
