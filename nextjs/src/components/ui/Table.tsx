'use client'

/* ------------------------------------------------------------------ */
/*  Records (static for now - replace with CMS fetch when ready)      */
/* ------------------------------------------------------------------ */
interface LordRecord {
  name: string
  period: string
  notes: string
}

const records: LordRecord[] = [
  {
    name: '慧永大師',
    period: '東晉太元十一年（386年）',
    notes: '慧永請江州刺史桓伊為慧遠所建東林寺竣工。慧遠迎文殊菩薩金像於東林寺，並作《文殊菩薩瑞像贊》。',
  },
  {
    name: '道生法師',
    period: '南北朝（430年）',
    notes:
      '蓮社道生法師自吳郡返東林，於廬山精舍講《大般涅槃經》。',
  },
  {
    name: '智顗大師',
    period: '隋朝（592年）',
    notes:
      '天台宗智顗大師息跡東林，應寺僧之情，作書隋煬帝，請永禁公私停泊以利僧眾靜修，楊廣如其請。',
  }
]

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function Table() {
  return (
    <div className="mx-auto max-w-5xl overflow-x-auto">
      <table className="w-full border-collapse text-base leading-relaxed text-gray-900 [font-feature-settings:'palt']">
        {/* ───── Header ───── */}
        <thead>
          <tr className="border-b-3 border-[#d9d4c4] text-[#5a4b37]">
            <th className="w-60 py-4 px-2 text-left font-semibold">年代</th>
            <th className="w-36 py-4 pl-4 pr-2 text-left font-semibold">人物</th>
            <th className="py-4 px-2 text-left font-semibold">事柄</th>
          </tr>
        </thead>

        {/* ───── Body ───── */}
        <tbody>
          {records.map((r, i) => (
            <tr
              key={i}
              className="border-b-2 border-[#e3dfd0]  align-top"
            >
              <td className="whitespace-nowrap py-4 px-2">{r.period}</td>
              <td className="whitespace-nowrap py-4 pl-4 pr-2 font-semibold text-[#5a4b37]">
                {r.name}
              </td>
              <td className="whitespace-pre-line py-4 px-2">{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
