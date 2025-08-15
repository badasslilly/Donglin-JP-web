'use client'

export type HistoryRow = {
  period?: string | null; // era
  name?: string | null;   // person
  notes?: string | null;  // brief
};

type Locale = 'ja' | 'en';

const HEADERS: Record<Locale, { era: string; person: string; event: string }> = {
  ja: { era: '年代', person: '人物', event: '事柄' },
  en: { era: 'Period', person: 'Person', event: 'Event' },
};

export default function HistoryTable({
  rows,
  locale = 'ja',
}: {
  rows: HistoryRow[];
  locale?: Locale;
}) {
  const h = HEADERS[locale] ?? HEADERS.ja;

  return (
    <div className="mx-auto max-w-5xl overflow-x-auto">
      <table className="w-full border-collapse text-base leading-relaxed text-gray-900 [font-feature-settings:'palt']">
        <thead>
          <tr className="border-b-3 border-[#d9d4c4] text-[#5a4b37]">
            <th className="w-60 py-4 px-2 text-left font-semibold">{h.era}</th>
            <th className="w-36 py-4 pl-4 pr-2 text-left font-semibold">{h.person}</th>
            <th className="py-4 px-2 text-left font-semibold">{h.event}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b-2 border-[#e3dfd0] align-top">
              <td className="whitespace-nowrap py-4 px-2">{r.period || '—'}</td>
              <td className="whitespace-nowrap py-4 pl-4 pr-2 font-semibold text-[#5a4b37]">
                {r.name || '—'}
              </td>
              <td className="whitespace-pre-line py-4 px-2">{r.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
