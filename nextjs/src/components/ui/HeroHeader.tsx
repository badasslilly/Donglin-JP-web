"use client";

import Image from "next/image";
import clsx from "clsx";

interface HeroHeaderProps {
  /** Background image path or URL */
  bgSrc: string;
  /** Main JP heading */
  title: string;
  /** Optional EN subtitle */
  subtitle?: string;
  /** Tailwind height classes, default h-[50vh] */
  className?: string;
}

/**
 * Reusable hero header: background image + framed translucent heading.
 *
 * ```tsx
 * <HeroHeader
 *   bgSrc="/imgs/donglin_draw.png"
 *   title="東林寺について"
 *   subtitle="About"
 * />
 * ```
 */
export default function HeroHeader({
  bgSrc,
  title,
  subtitle,
  className = "",
}: HeroHeaderProps) {
  return (
    <section data-hero
      className={clsx(
        "relative h-[50vh] min-h-[320px] w-full overflow-hidden",
        className
      )}
    >
      {/* Background image */}
      <Image
        src={bgSrc}
        alt={subtitle ? `${subtitle} background` : title}
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />

      {/* Framed title block */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="border border-white/60 px-12 py-8 text-center backdrop-blur-sm">
          <h1 className="mb-3 font-hannari text-3xl tracking-widest text-white sm:text-4xl md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <span className="text-sm uppercase tracking-[0.2em] text-white/80">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
