interface Props {
  text: string
  align?: 'left' | 'right'
  locale?: 'ja' | 'en' | string   // ← NEW
}

export default function VerticalBookmark({
  text,
  align = 'left',
  locale = 'ja',
}: Props) {
  const isEN = String(locale).startsWith('en')
  const sideClass = align === 'left' ? 'left-0' : 'right-0'

  return (
    <div
      className={`absolute ${sideClass} top-0 flex`}
      aria-hidden
    >
      {/* JA: vertical ribbon / EN: horizontal badge */}
      <div
        className={
          isEN
            ? 'bg-[#8c3b16] text-white rounded-md shadow-md'
            : 'bg-[#8c3b16] text-white rounded-b-md shadow-md'
        }
      >
        <span
          className={
            isEN
              ? // horizontal: center text, single line
                'inline-flex items-center justify-center px-4 py-2 leading-tight text-[18px] font-bold tracking-widest whitespace-nowrap'
              : // vertical: keep current look
                'px-3 py-4 whitespace-pre leading-[1.2] text-[22px] font-bold'
          }
          style={
            isEN
              ? { writingMode: 'horizontal-tb', textOrientation: 'mixed' }
              : { writingMode: 'vertical-rl', textOrientation: 'upright' }
          }
        >
          {text}
        </span>
      </div>
    </div>
  )
}
