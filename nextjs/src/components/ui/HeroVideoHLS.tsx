/** @format */
'use client';

import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';

type HlsCtor = {
  isSupported(): boolean;
  new (config?: Record<string, unknown>): {
    loadSource(src: string): void;
    attachMedia(video: HTMLVideoElement): void;
    destroy(): void;
    on(event: string, cb: (...args: any[]) => void): void;
  };
};

type Props = {
  /** HLS master playlist path, e.g. /videos/hero/master.m3u8 */
  src: string;
  /** Poster path, e.g. /videos/home-hero-poster.jpg */
  poster?: string;
  /** Tailwind height classes (parent sets final height) */
  heightClasses?: string;
  /** Extra classes */
  className?: string;
  /** Alt-ish label for a11y (used as aria-label) */
  alt?: string;
};

export default function HeroVideoHLS({
  src,
  poster = '/videos/home-hero-poster.jpg',
  heightClasses = 'h-[50vh] md:h-[70vh] lg:h-[80vh]',
  className,
  alt = 'Hero background video'
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: { destroy(): void } | null = null;
    let cancelled = false;

    // ensure poster shows immediately while JS runs
    // (background image on wrapper handles first paint too)
    setIsReady(false);

    const canPlayNativeHls =
      video.canPlayType('application/vnd.apple.mpegurl') !== '' ||
      video.canPlayType('application/x-mpegURL') !== '';

    (async () => {
      if (cancelled) return;

      if (canPlayNativeHls) {
        video.src = src;
        // hint the browser to get media quickly
        video.preload = 'auto';
        try {
          video.load();
          await video.play();
        } catch {
          /* ignore autoplay rejection */
        }
        return;
      }

      // hls.js path (Chrome/Firefox/etc.)
      const mod = await import('hls.js');
      const Hls = (mod.default ?? mod) as unknown as HlsCtor;
      if (cancelled) return;

      if (typeof Hls.isSupported === 'function' && Hls.isSupported()) {
        const inst = new Hls({
          // faster startup / less buffering on hero loops
          startLevel: -1,         // auto
          maxBufferLength: 15,
          capLevelToPlayerSize: true,
          // low-latency not needed for VOD, keep defaults
        });
        hlsInstance = inst;
        inst.loadSource(src);
        inst.attachMedia(video);
        inst.on('MANIFEST_PARSED', async () => {
          try {
            await video.play();
          } catch {
            /* ignore */
          }
        });
      } else {
        // very old browsers: try direct (may still work)
        video.src = src;
        try {
          video.load();
          await video.play();
        } catch {
          /* ignore */
        }
      }
    })();

    return () => {
      cancelled = true;
      if (hlsInstance) {
        try { hlsInstance.destroy(); } catch { /* noop */ }
        hlsInstance = null;
      }
    };
  }, [src]);

  return (
    <div
      aria-label={alt}
      className={clsx(
        // poster as CSS background ensures NO black frame before video paints
        'relative w-full bg-center bg-cover',
        heightClasses,
        className
      )}
      style={{ backgroundImage: `url(${poster})` }}
    >
      <video
        ref={videoRef}
        className={clsx(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
          isReady ? 'opacity-100' : 'opacity-0'
        )}
        muted
        playsInline
        autoPlay
        loop
        // native poster also used by the video element
        poster={poster}
        // once first frame is decoded, fade in video (hides bg poster)
        onLoadedData={() => setIsReady(true)}
        preload="auto"
      />
    </div>
  );
}

