/* filled background for event_kind -------------------------------- */
export function kindColor(kind: string) {
  switch (kind) {
    case '法要・行事':
      return 'bg-yellow-400 text-black'          // gold
    case '法話':
      return 'bg-sky-300 text-black'             // light-blue
    case '講座':
      return 'bg-purple-300 text-black'
    case '修行':
      return 'bg-green-300 text-black'
    default:
      return 'bg-gray-300 text-black'
  }
}

/* outlined badge for participation_tag (was already here) --------- */
export function badgeColor(tag: string) {
  switch (tag) {
    case 'おまいり':
      return 'border-blue-600 text-blue-700'
    case '体験型':
      return 'border-orange-600 text-orange-700'
    case '申込が必要':
      return 'border-red-600 text-red-700'
    default:
      return 'border-gray-500 text-gray-700'
  }
}
