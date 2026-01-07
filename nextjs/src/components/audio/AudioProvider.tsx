'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type Track = {
  id: string
  title: string
  artist?: string
  src: string
  cover?: string
}

type AudioCtx = {
  track: Track
  setTrack: (t: Track) => void
  isPlaying: boolean
  toggle: () => Promise<void>
  pause: () => void
  play: () => Promise<void>
  currentTime: number
  duration: number
  seek: (t: number) => void
  volume: number
  setVolume: (v: number) => void
}

const Ctx = createContext<AudioCtx | null>(null)

const DEFAULT_TRACK: Track = {
  id: 'nenbutsu',
  title: '念佛',
  artist: '東林寺',
  src: '/audio/nenbutsu.mp3',
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [track, setTrack] = useState<Track>(DEFAULT_TRACK)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)

  // init audio once
  useEffect(() => {
    if (audioRef.current) return
    const a = new Audio()
    a.preload = 'none' // 性能关键：不要首屏就拉音频
    a.src = track.src
    a.volume = volume
    a.crossOrigin = 'anonymous'
    audioRef.current = a

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTime = () => setCurrentTime(a.currentTime || 0)
    const onLoaded = () => setDuration(a.duration || 0)
    const onEnded = () => setIsPlaying(false)

    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnded)

    return () => {
      a.pause()
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  // when track changes: keep single audio, swap src
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const wasPlaying = !a.paused
    a.pause()
    a.src = track.src
    a.load()
    setCurrentTime(0)
    setDuration(0)
    if (wasPlaying) {
      // 需要用户手势的浏览器：这里可能会被拦截，但 toggle/play 会由按钮触发，通常没问题
      a.play().catch(() => {})
    }
  }, [track.src])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
  }, [volume])

  const api = useMemo<AudioCtx>(() => {
    async function play() {
      const a = audioRef.current
      if (!a) return
      // 触发播放前再决定 preload：允许更快起播
      if (a.preload !== 'auto') a.preload = 'auto'
      await a.play()
    }
    function pause() {
      audioRef.current?.pause()
    }
    async function toggle() {
      const a = audioRef.current
      if (!a) return
      if (a.paused) await play()
      else pause()
    }
    function seek(t: number) {
      const a = audioRef.current
      if (!a) return
      a.currentTime = Math.max(0, Math.min(t, a.duration || t))
    }
    function setVolume(v: number) {
      setVolumeState(Math.max(0, Math.min(1, v)))
    }

    return {
      track,
      setTrack,
      isPlaying,
      toggle,
      pause,
      play,
      currentTime,
      duration,
      seek,
      volume,
      setVolume,
    }
  }, [track, isPlaying, currentTime, duration, volume])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useAudio() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAudio must be used within AudioProvider')
  return v
}
