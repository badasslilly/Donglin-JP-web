"use client";

import clsx from "clsx";
import { aiharaKaisho } from '@/styles/fonts/fonts';

interface SectionTitleProps {
  /** Japanese title shown vertically */
  jp: string;
  /** Optional English subtitle shown rotated */
  en?: string;
  /** Additional class names passed to the root container */
  className?: string;
}

/**
 * Vertical section heading that mimics the reference design:
 * ──── jp (vertical) │ en (rotated)  ────
 *
 * ```tsx
 * <SectionTitle jp="新着情報" en="Information" />
 * ```
 */
export default function SectionTitle({ jp, en, className }: SectionTitleProps) {
  return (
    <div className={clsx("flex items-center gap-3 md:gap-6", className)}>
      <h2
        className={clsx(
          aiharaKaisho.className,  // apply font directly to heading
          "text-3xl sm:text-4xl leading-none  md:text-5xl"
        )}
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
      >
        {jp}
      </h2>

      <div className="h-32 w-px  bg-neutral-700" />

      {en && (
        <span className="-rotate-90 origin-left whitespace-nowrap text-sm tracking-wider md:text-base">
          {en}
        </span>
      )}
    </div>
  );
}
