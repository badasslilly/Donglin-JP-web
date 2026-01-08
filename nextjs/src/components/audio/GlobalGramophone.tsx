/** @format */

'use client'

import { useAudio } from './AudioProvider'

export default function GlobalGramophone() {
  const { isPlaying, toggle } = useAudio()

  return (
    <div className='fixed bottom-3 md:bottom-12 right-2 md:right-6 z-[9999] pointer-events-auto'>
      <button
        type='button'
        onClick={() => toggle()}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className='group relative h-[120px] w-[140px] select-none cursor-pointer pointer-events-auto'
      >
        {/* 内凹阴影（让底座更“有厚度”） */}
        <div className='absolute inset-[10px] rounded-[18px] shadow-[inset_0_10px_18px_rgba(255,255,255,0.18),inset_0_-18px_28px_rgba(0,0,0,0.25)]pointer-events-none' />

        {/* 唱片区域 */}
        <div className='absolute left-[16px] top-[18px] h-[92px] w-[92px] pointer-events-none'>
          {/* 唱片（带槽纹+高光） */}
          <div
            className={`absolute inset-0 rounded-full ring-1 ring-black/20 ${
              isPlaying ? 'dl-vinyl-spin' : ''
            }`}
            style={{
              background:
                'radial-gradient(circle at 35% 28%, rgba(255,255,255,.22), rgba(0,0,0,0) 42%),' +
                'repeating-radial-gradient(circle at center, rgba(255,255,255,.08) 0 1px, rgba(0,0,0,0) 1px 4px),' +
                'radial-gradient(circle at center, rgba(10,10,12,.96), rgba(10,10,12,.86) 58%, rgba(0,0,0,.98) 100%)',
            }}
          >
            {/* 唱片 label（红色，贴近你图的感觉） */}
            <div className='absolute left-1/2 top-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/20 bg-[#c63b2b] shadow-[inset_0_2px_6px_rgba(255,255,255,0.18)]' />
            <div className='absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8e1d6] ring-1 ring-black/15' />
          </div>

          {/* 唱片外圈小高光 */}
          <div className='absolute inset-[-2px] rounded-full pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]' />
        </div>

        {/* 唱臂底座（右上金属圆） */}
        <div
          className='absolute right-[6px] top-[22px] h-[22px] w-[22px] rounded-full ring-1 ring-black/20 pointer-events-none'
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,.8), rgba(255,255,255,0) 45%),' +
              'radial-gradient(circle at 70% 80%, rgba(0,0,0,.35), rgba(0,0,0,0) 55%),' +
              'linear-gradient(180deg, #d9d9d9 0%, #bdbdbd 45%, #9e9e9e 100%)',
          }}
        />

        {/* 弯曲唱臂 */}
        <div
          className={`absolute right-[-2px] top-[6px] h-[112px] w-[126px] ${
            isPlaying ? 'dl-arm-on' : 'dl-arm-off'
          }`}
          style={{
            // 支点靠近右上金属旋钮中心
            transformOrigin: '96px 20px',
          }}
        >
          {/* ✅ 内层只负责“轻微抖动”，不干扰外层的 transition */}
          <div
            className={isPlaying ? 'dl-arm-wobble' : ''}
            style={{ transformOrigin: '96px 20px' }}
          >
            <svg viewBox='0 0 126 112' className='h-full w-full'>
              <defs>
                {/* 白色杆子的轻微立体感 */}
                <linearGradient id='needleWhite' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0' stopColor='#ffffff' stopOpacity='0.95' />
                  <stop offset='1' stopColor='#d9d9d9' stopOpacity='0.95' />
                </linearGradient>

                {/* 唱头灰色块 */}
                <linearGradient id='headGray' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0' stopColor='#8a8a8a' />
                  <stop offset='1' stopColor='#5e5e5e' />
                </linearGradient>

                {/* 旋钮圆：深灰 */}
                <radialGradient id='knobDark' cx='35%' cy='30%' r='70%'>
                  <stop offset='0' stopColor='#3b3b3b' />
                  <stop offset='1' stopColor='#1a1a1a' />
                </radialGradient>
              </defs>

              {/* 右上旋钮（深灰圆） */}
              <circle
                cx='104'
                cy='24'
                r='13'
                fill='url(#knobDark)'
                opacity='0.95'
              />
              {/* 旋钮高光 */}
              <circle cx='100' cy='20' r='4' fill='rgba(255,255,255,0.18)' />
              {/* 斜杆（白色） */}
              <path
                d='M 104 26 L 74 72'
                stroke='url(#needleWhite)'
                strokeWidth='7'
                strokeLinecap='round'
              />

              {/* 阴影（同步短杆） */}
              <path
                d='M 106 28 L 75 74'
                stroke='rgba(0,0,0,0.18)'
                strokeWidth='7'
                strokeLinecap='round'
              />
              {/* 唱头（灰色小块）——更小更贴图 */}
              <g transform='translate(65 76) rotate(-22)'>
                <rect
                  x='0'
                  y='-4'
                  width='16'
                  height='10'
                  rx='2.5'
                  fill='url(#headGray)'
                  stroke='rgba(0,0,0,0.18)'
                />
                {/* 唱头底部暗边 */}
                <rect
                  x='1.5'
                  y='2.2'
                  width='13'
                  height='2.4'
                  rx='1.2'
                  fill='rgba(0,0,0,0.18)'
                />
              </g>
            </svg>
          </div>
        </div>
        {/* Hover：轻微抬起，增强“可点” */}
        <div className='absolute inset-0 rounded-[26px] transition-transform duration-150 group-hover:-translate-y-[1px] group-active:translate-y-[0px]' />
        {/* 动画（仅 CSS，性能稳） */}
        <style jsx>{`
          .dl-vinyl-spin {
            animation: dlspin 1.85s linear infinite;
            will-change: transform;
          }
          @keyframes dlspin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* 播放中：落针（顺时针，朝唱片） */
          .dl-arm-on {
            transform: rotate(1deg);
            transition: transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1);
            will-change: transform;
          }

          /* 默认：停靠（逆时针，离开唱片，往右上） */
          .dl-arm-off {
            transform: rotate(-42deg); /* ✅ 关键：负号 */
            transition: transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1);
            will-change: transform;
          }

          /* 内层负责轻微抖动（不覆盖外层 transition） */
          .dl-arm-wobble {
            animation: armwobble 1.4s ease-in-out infinite;
            will-change: transform;
          }

          @keyframes armwobble {
            0%,
            100% {
              transform: rotate(0deg) translateY(0);
            }
            50% {
              transform: rotate(0.35deg) translateY(0.15px);
            }
          }
        `}</style>
      </button>
    </div>
  )
}
