// components/ArrowButton.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils"; // your Tailwind clsx helper (replace if different path)

/**
 * A pill‑shaped button that matches the design in the reference screenshots.
 * – Beige fill (#e7e2d0), dark outline, subtle hover scale.
 * – Shows a right‑arrow icon.  If `children` is provided we render text + arrow; if not we render icon‑only (small pill).
 *
 * Usage:
 * ```tsx
 * <ArrowButton href="/news">お知らせ一覧</ArrowButton>
 * <ArrowButton href="/next" iconOnly />
 * ```
 */
export const ArrowButton = forwardRef<HTMLAnchorElement, LinkProps & {
  className?: string;
  /** render only the arrow (small pill) */
  iconOnly?: boolean;
  children?: React.ReactNode;
}>(({ className, iconOnly, children, ...linkProps }, ref) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-4 rounded-full border-2 border-[#262626] bg-[#e7e2d0] text-[#262626] font-bold transition-transform hover:scale-[1.03] active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#262626]";

  const sizeStyle = iconOnly
    ? "h-12 w-20" // smaller pill when only icon
    : "px-10 py-4 text-lg";

  return (
    <Link
      ref={ref}
      {...linkProps}
      className={cn(baseStyle, sizeStyle, className)}
    >
      {!iconOnly && children}
      {/* Arrow – keep it simple, avoids extra deps */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M13.22 5.47a.75.75 0 011.06 0l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25a.75.75 0 11-1.06-1.06l4.72-4.72H3.75a.75.75 0 010-1.5h14.19l-4.72-4.72a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
});
ArrowButton.displayName = "ArrowButton";

