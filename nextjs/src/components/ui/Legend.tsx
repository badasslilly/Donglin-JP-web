/* components/Legend.tsx */

type Locale = 'ja' | 'en';

interface Item {
  label: string;
  color: string;
  description: string;
}

const ITEMS: Record<Locale, Item[]> = {
  ja: [
    {
      label: 'おまいり',
      color: 'border-blue-600 text-blue-700',
      description:
        'どなたでもご覧いただいたりおまいりしていただくことができます。',
    },
    {
      label: '体験型',
      color: 'border-yellow-500 text-yellow-500',
      description:
        'ご一緒にお念仏をお称えしたり、行事を体験していただける行事です。どなたでもご参加いただけます。',
    },
    {
      label: '申込が必要',
      color: 'border-red-600 text-red-700',
      description:
        '事前のお申込みが必要です。担当の係にお問い合わせください。',
    },
  ],
  en: [
    {
      label: 'Temple Visit',
      color: 'border-blue-600 text-blue-700',
      description:
        'Open to all: you are welcome to visit and offer prayers.',
    },
    {
      label: 'Experiential',
      color: 'border-yellow-500 text-yellow-500',
      description:
        'Participatory events—chant the nembutsu together or join temple activities. Open to all.',
    },
    {
      label: 'Registration required',
      color: 'border-red-600 text-red-700',
      description:
        'Advance registration is needed. Please contact the staff in charge.',
    },
  ],
};


export default function Legend({ locale = 'ja' }: { locale?: Locale }) {
  const items = ITEMS[locale] ?? ITEMS.ja;

  // wider first column for English; center items vertically
  const gridCols =
    locale === 'en' ? 'lg:grid-cols-[12rem_1fr]' : 'lg:grid-cols-[10rem_1fr]';

  // JP keeps your original pill
  const labelBaseJa =
    'inline-block min-w-[7rem] px-6 py-2 border rounded font-medium text-sm text-center whitespace-nowrap';

  // EN: slimmer padding + rounded-full; small font; wraps nicely
  const labelBaseEn =
    'inline-flex max-w-[12rem] px-3 py-2 border rounded font-medium text-sm leading-5 text-center whitespace-normal break-words justify-center';
  return (
    <dl className={`mb-10 grid items-center gap-3 ${gridCols}`}>
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="self-center">
            <span
              className={`${locale === 'en' ? labelBaseEn : labelBaseJa} ${item.color}`}
            >
              {item.label}
            </span>
          </dt>
          <dd className="self-center text-sm leading-6">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}