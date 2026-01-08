'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

type AudioCtx = {
  isPlaying: boolean
  toggle: () => void
  play: () => Promise<void>
  pause: () => void
  setVolume: (v: number) => void
  volume: number
}

const Ctx = createContext<AudioCtx | null>(null)

const STORAGE_KEY_PLAYING = 'dl_audio_playing'
const STORAGE_KEY_VOLUME = 'dl_audio_volume'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.6)

  // 读取上次音量/播放状态（只在客户端）
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY_VOLUME)
      if (v) setVolumeState(Math.min(1, Math.max(0, Number(v))))
      const p = localStorage.getItem(STORAGE_KEY_PLAYING)
      if (p === '1') setIsPlaying(true)
    } catch {}
  }, [])

  // 初始化 audio（只创建一次）
  useEffect(() => {
    const el = new Audio('/audio/东林佛号欣赏版 - 宗铄法师.mp3')
    el.preload = 'none'          // 性能：不抢首屏
    el.loop = true
    el.volume = volume
    el.crossOrigin = 'anonymous'
    audioRef.current = el

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 同步音量到 audio + localStorage
  useEffect(() => {
    const el = audioRef.current
    if (el) el.volume = volume
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(volume))
    } catch {}
  }, [volume])

  // 如果用户上次是“播放”，页面载入后尝试自动播放（可能被浏览器拦）
  useEffect(() => {
    if (!isPlaying) {
      try {
        localStorage.setItem(STORAGE_KEY_PLAYING, '0')
      } catch {}
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY_PLAYING, '1')
    } catch {}
    // 不强行立刻播放，避免首屏干扰；等一下再试
    const t = setTimeout(() => {
      audioRef.current?.play().catch(() => {
        // 被自动播放策略拦截时，不报错；等用户点击 UI 再播放
        setIsPlaying(false)
        try {
          localStorage.setItem(STORAGE_KEY_PLAYING, '0')
        } catch {}
      })
    }, 250)
    return () => clearTimeout(t)
  }, [isPlaying])

  async function play() {
    const el = audioRef.current
    if (!el) return
    await el.play()
    setIsPlaying(true)
    try {
      localStorage.setItem(STORAGE_KEY_PLAYING, '1')
    } catch {}
  }

  function pause() {
    const el = audioRef.current
    if (!el) return
    el.pause()
    setIsPlaying(false)
    try {
      localStorage.setItem(STORAGE_KEY_PLAYING, '0')
    } catch {}
  }

  function toggle() {
    if (isPlaying) pause()
    else play().catch(() => {})
  }

  function setVolume(v: number) {
    setVolumeState(Math.min(1, Math.max(0, v)))
  }

  const value = useMemo<AudioCtx>(
    () => ({ isPlaying, toggle, play, pause, volume, setVolume }),
    [isPlaying, volume]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAudio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>')
  return ctx
}
