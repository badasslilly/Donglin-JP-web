/** @format */
'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  /** Absolute URL to the MP4/WebM from Strapi */
  src: string;
  /** Poster image path/URL (opt). Use a small JPEG/WebP. */
  poster?: string;
  /** Tailwind height classes for the section (e.g., "h-[50vh] md:h-[70vh] lg:h-[80vh]") */
  heightClasses?: string;
  /** Optional extra class on outer section */
  className?: string;
  /** Optional alt text for poster */
  alt?: string;
};

/**
 * Lazy hero video:
 * - Renders a poster <Image> for LCP
 * - Only mounts <video> when the section enters the viewport
 * - Switches preload from "none" to "auto" when visible
 */
export default function HeroVideoSmart({
  src,
  poster = '/videos/home-hero-poster.jpg',
  heightClasses = 'h-[50vh] md:h-[70vh] lg:h-[80vh]',
  className,
  alt = 'Hero background'
}: Props) {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Prefer a generous rootMargin so we start loading slightly before visible
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      {root: null, threshold: 0.1, rootMargin: '200px'}
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={clsx(
        'relative isolate flex flex-col justify-end overflow-hidden bg-black',
        heightClasses,
        className
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Poster for LCP */}
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={clsx(
          'object-cover object-center select-none pointer-events-none transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100'
        )}
      />

      {/* Lazy video: only mount when in view */}
      {inView && (
        <video
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          // Hint: start with none; the browser will ignore once we set src below,
          // but keeping it explicit avoids early buffering in some engines.
          preload="none"
          muted
          playsInline
          autoPlay
          loop
          onLoadedData={() => setLoaded(true)}
          // If you have both webm and mp4, prefer webm then mp4:
          // <source> tags give better type hints to the browser.
        >
          {/* If you have a WebM variant, add it above MP4 for better compression */}
          {/* <source src={src.replace(/\.mp4$/i, '.webm')} type="video/webm" /> */}
          <source src={src} type="video/mp4" />
        </video>
      )}
    </section>
  );
}

