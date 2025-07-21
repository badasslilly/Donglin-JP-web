/* components/Legend.tsx */
const ITEMS = [
  {
    label: 'おまいり',
    color: 'border-blue-600 text-blue-700',
    description: 'どなたでもご覧いただいたりおまいりしていただくことができます。',
  },
  {
    label: '体験型',
    color: 'border-yellow-500 text-yellow-500',
    description: 'ご一緒にお念仏をお称えしたり、行事を体験していただける行事です。どなたでもご参加いただけます。',
  },
  {
    label: '申込が必要',
    color: 'border-red-600 text-red-700',
    description: '事前のお申込みが必要です。担当の係にお問い合わせください。',
  },
]

export default function Legend() {
  return (
    <dl className="grid gap-3 lg:grid-cols-[10rem_1fr] mb-10">
      {ITEMS.map(item => (
        <div key={item.label} className="contents">
          <dt>
            <span
              className={`inline-block min-w-[7rem] px-6 py-2 border rounded font-medium text-sm text-center ${item.color}`}
            >
              {item.label}
            </span>
          </dt>
          <dd className="text-sm leading-6">{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}
