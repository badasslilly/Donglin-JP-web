/* components/EventTabs.tsx */
const TABS = [
  { id: 'this',   label: '今月の行事',   href: '/events/this-month' },
  { id: 'next',   label: '来月の行事',   href: '/events/next-month' },
  { id: 'annual', label: '年間行事',     href: '/events/annual' },
]

export default function EventTabs({ active }: { active: 'this' | 'next' | 'annual' }) {
  return (
    <nav className="flex gap-2 mb-12">
      {TABS.map(tab => (
        <a
          key={tab.id}
          href={tab.href}
          data-active={tab.id === active}
          className="flex-1 text-center py-5 bg-gray-100 data-[active=true]:bg-white
                     data-[active=true]:border-b-4 data-[active=true]:border-purple-600
                     transition-colors"
        >
          {tab.label}
        </a>
      ))}
    </nav>
  )
}
