/** @format */

export const KIND_LABEL = {
  Ceremonies_Events: '法要・行事',
  Courses_Lecture:   '講座',
  Spiritual_Practice:'修行',
} as const

export const TAG_LABEL = {
  temple_visit:        'おまいり',
  reservation_required:'申込が必要',
  experiential:        '体験型',
} as const

/* ──────────── 1-A. カラー辞書 ──────────── */
const KIND_COLOR: Record<keyof typeof KIND_LABEL, string> = {
  Ceremonies_Events:  'bg-yellow-400 text-black',
  Courses_Lecture:    'bg-purple-300 text-black',
  Spiritual_Practice: 'bg-green-300 text-black',
}

const TAG_COLOR: Record<keyof typeof TAG_LABEL, string> = {
  temple_visit:         'border-blue-600 text-blue-700',
  reservation_required: 'border-orange-600 text-orange-700',
  experiential:         'border-red-600 text-red-700',
}

/* ──────────── 1-B. ラベル取得 ──────────── */
/** locale === 'ja' なら日本語ラベル, それ以外は key を空白区切りで表示 */
export function kindLabel(key: string, locale: string) {
  if (locale === 'ja')
    return KIND_LABEL[key as keyof typeof KIND_LABEL] ?? key
  return key.replace(/_/g, ' ')
}

export function tagLabel(key: string, locale: string) {
  if (locale === 'ja')
    return TAG_LABEL[key as keyof typeof TAG_LABEL] ?? key
  return key.replace(/_/g, ' ')
}

/* ──────────── 1-C. 色クラス取得 ──────────── */
export function kindColor(key: string) {
  return KIND_COLOR[key as keyof typeof KIND_COLOR] ?? 'bg-gray-300 text-black'
}

export function badgeColor(key: string) {
  return TAG_COLOR[key as keyof typeof TAG_COLOR] ?? 'border-gray-500 text-gray-700'
}
