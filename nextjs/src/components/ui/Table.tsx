'use client';

import { Fragment } from 'react';

export type HistoryRow = {
  period?: string | null; // era
  notes?: string | null;  // brief
};

export type HistoryGroup = {
  title?: string | null;  // section_name
  rows: HistoryRow[];
};

type Locale = 'ja' | 'en';

const HEADERS: Record<Locale, { era: string; event: string }> = {
  ja: { era: '年代', event: '事柄' },
  en: { era: 'Period', event: 'Event' },
};

export default function HistoryTable({
  groups,
  locale = 'ja',
}: {
  groups: HistoryGroup[];
  locale?: Locale;
}) {
  const h = HEADERS[locale] ?? HEADERS.ja;

  return (
    <div className="mx-auto max-w-5xl overflow-x-auto">
      <table className="w-full table-auto border-collapse text-base leading-relaxed text-gray-900 [font-feature-settings:'palt']">
        {/* First column fixed, second fills remaining space */}
        <colgroup>
          <col className="w-56 sm:w-64" />
          <col />
        </colgroup>

        <thead>
          <tr className="border-b-2 border-[#d9d4c4] text-[#5a4b37]">
            <th scope="col" className="py-4 px-2 text-left font-semibold">{h.era}</th>
            <th scope="col" className="py-4 px-2 text-left font-semibold">{h.event}</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((g, gi) => (
            <Fragment key={gi}>
              {g.title ? (
                <tr className="bg-[#f6f3e7]">
                  <th colSpan={2} className="py-3 px-2 text-left font-semibold text-[#5a4b37]">
                    {g.title}
                  </th>
                </tr>
              ) : null}

              {g.rows.map((r, i) => (
                <tr key={`${gi}-${i}`} className="border-b-2 border-[#e3dfd0] align-top">
                  <td className="whitespace-nowrap py-4 px-4">{r.period || '—'}</td>
                  <td className="whitespace-pre-line py-4 px-4">{r.notes || '—'}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
