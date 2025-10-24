/** @format */

import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { badgeColor, kindColor, kindLabel, tagLabel } from '@/data/kinds'

export interface AnnualEvent {
  id: number | string
  month: number // 1-12
  date_start: string // ISO
  date_end?: string | null
  event_kind: string
  participation_tag: string
  title: string
  location?: string | null
}

/* -------------------------- helpers -------------------------- */
const EN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const monthLabel = (m: number, locale: string) =>
  locale?.startsWith('en') ? EN_MONTHS[m - 1] : `${m}月`

function formatDate(ev: AnnualEvent, locale = 'ja') {
  const s = dayjs(ev.date_start)
  const e = ev.date_end ? dayjs(ev.date_end) : null

  if (!e || e.isSame(s, 'day'))
    return locale === 'ja' ? s.format('D日') : s.format('D')

  const endLabel = !e.isSame(s, 'year')
    ? locale === 'ja'
      ? e.format('YYYY年M月D日')
      : e.format('YYYY MMM D')
    : !e.isSame(s, 'month')
      ? locale === 'ja'
        ? e.format('M月D日')
        : e.format('MMM D')
      : locale === 'ja'
        ? e.format('D日')
        : e.format('D')

  const startLabel = locale === 'ja' ? s.format('D日') : s.format('D')
  const sep = locale === 'ja' ? '〜' : '–'
  return `${startLabel}${sep}${endLabel}`
}
const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1))

/* ------------------------- component ------------------------- */
export default function AnnualTimeline({
  events,
  locale,
}: {
  events: AnnualEvent[]
  locale: string
}) {
  const isEN = locale?.startsWith('en')

  const byMonth = events.reduce<Record<number, AnnualEvent[]>>((acc, ev) => {
    ;(acc[ev.month] ||= []).push(ev)
    return acc
  }, {})

  return (
    <section className='space-y-6'>
      {Object.entries(byMonth).map(([m, list]) => {
        const month = Number(m)
        return (
          <article
            id={`month${month}`}
            key={month}
            className={clsx(
              'mb-4 grid grid-cols-1 gap-x-2',
              // month label column width (left, sticky)
              isEN ? 'md:grid-cols-[4rem_1fr]' : 'md:grid-cols-[5rem_1fr]'
            )}
          >
            {/* Mobile month bar */}
            <div className='md:hidden mb-3'>
              <div className='w-full bg-gray-100 px-4 py-3 text-xl font-semibold'>
                {monthLabel(month, locale)}
              </div>
            </div>

            {/* Desktop month bar */}
            <div className='relative hidden bg-gray-50 md:block'>
              <div className='absolute right-0 top-0 h-full w-px bg-gray-300' />
              <h3 className='sticky top-[88px] py-1 pl-4 text-xl font-semibold'>
                {monthLabel(month, locale)}
              </h3>
            </div>

            {/* Events */}
            <ul className='relative'>
              <span
                aria-hidden
                className='absolute left-4 top-0 bottom-0 w-px bg-gray-300 md:hidden'
              />
              {list.map((ev) => (
                <li
                  key={ev.id}
                  className='relative transition-colors hover:bg-[#f8f6fd] pl-10 md:pl-0'
                >
                  {/* bullet */}
                  <span
                    aria-hidden
                    className='absolute left-4 md:left-[-8px] top-6 md:top-10 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-600'
                  />

                  <Link
                    href={`/${locale}/events/${ev.id}`}
                    className={clsx(
                      'grid grid-cols-1 items-stretch',
                      // ↓↓↓ tighter vertical & horizontal spacing for EN
                      isEN
                        ? 'gap-y-2.5 gap-x-6 py-3 md:grid-cols-[6.25rem_1fr_auto]'
                        : 'gap-y-3   gap-x-8 py-4 md:grid-cols-[10.5rem_1fr_auto]'
                    )}
                  >
                    {/* date column */}
                    <div
                      className={clsx(
                        'flex items-center whitespace-nowrap',
                        isEN ? 'md:pl-2' : 'md:pl-5'
                      )}
                    >
                      <time className='text-base text-gray-900'>
                        {formatDate(ev, locale)}
                      </time>
                    </div>

                    {/* info block */}
                    <div className='grid grid-cols-1 gap-y-2 gap-x-6 md:grid-cols-[9rem_minmax(0,1fr)]'>
                      {/* chips */}
                      <div
                        className='flex gap-2 md:block md:space-y-2 md:border-l md:border-r md:border-gray-300 md:text-center'
                        style={{
                          paddingLeft: isEN ? '1.5rem' : '2rem',
                          paddingRight: isEN ? '1.5rem' : '2rem',
                        }}
                      >
                        <span
                          className={clsx(
                            // EN: allow wrap; JA: no wrap but centered
                            isEN
                              ? 'inline-flex items-center justify-center text-center'
                              : 'inline-flex items-center justify-center text-center whitespace-nowrap',
                            'rounded py-1 tracking-widest text-[11px] md:text-[12px] font-semibold md:w-full',
                            isEN ? 'px-3.5' : 'px-3',
                            kindColor(ev.event_kind)
                          )}
                        >
                          {kindLabel(ev.event_kind, locale)}
                        </span>

                        <span
                          className={clsx(
                            isEN
                              ? 'inline-flex items-center justify-center text-center'
                              : 'inline-flex items-center justify-center text-center whitespace-nowrap',
                            'rounded border py-1 tracking-widest text-[10px] md:text-[11px] font-medium md:w-full',
                            isEN ? 'px-3.5' : 'px-3',
                            badgeColor(ev.participation_tag)
                          )}
                        >
                          {isEN
                            ? titleCase(tagLabel(ev.participation_tag, locale))
                            : tagLabel(ev.participation_tag, locale)}
                        </span>
                      </div>

                      {/* title + place */}
                      <div
                        className={clsx(
                          'h-full flex flex-col justify-center space-y-1',
                          isEN ? 'md:pl-3' : 'md:pl-5'
                        )}
                      >
                        <h4 className='text-[15px] font-medium leading-7 md:leading-8'>
                          {ev.title}
                        </h4>
                        {ev.location && (
                          <p className='flex items-center gap-3 text-xs text-gray-900'>
                            <span className='inline-block bg-gray-100 px-3 py-1 tracking-widest font-semibold'>
                              {locale === 'ja' ? '場所' : 'Place'}
                            </span>
                            <span>{ev.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* chevron */}
                    <div className='flex items-center pr-4 absolute right-2 top-1/2 -translate-y-1/2'>
                      <ChevronRight className='h-4 w-4 text-purple-600' />
                    </div>
                  </Link>

                  {/* divider */}
                  <span
                    aria-hidden
                    className='pointer-events-none absolute bottom-0 right-0 h-px bg-gray-200 left-10 md:left-0'
                  />
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </section>
  )
}
