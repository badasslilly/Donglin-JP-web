"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export interface TabItem {
  href: string;
  label: string;
}

interface PageTabsProps {
  tabs: TabItem[];
  className?: string;
  bgClass?: string; // e.g., "bg-[#e6d6f1]"
}

/**
 * Horizontal tab navigation bar.
 * Usage:
 * ```tsx
 * <PageTabs tabs={[
 *   { href: '/about', label: '法然上人とお念仏' },
 *   { href: '/about/words', label: '法然上人のお言葉' },
 * ]}/>
 * ```
 */
export default function PageTabs({
  tabs,
  className = "",
  bgClass = "bg-[#e7e2d0]",
}: PageTabsProps) {
  const pathname = usePathname();
  return (
    <nav className={clsx(bgClass, className)}>
      <ul className="mx-auto flex max-w-5xl items-center justify-center gap-6 px-4 py-4 text-sm font-semibold tracking-wide text-stone-950">
        {tabs.map((t, idx) => (
          <li key={t.href} className="flex items-center gap-6">
            <Link
              href={t.href}
              className={clsx(
                pathname === t.href
                  ? "text-stone-500 decoration-1"
                  : "hover:text-stone-500",
                "transition-colors"
              )}
            >
              {t.label}
            </Link>
            {idx !== tabs.length - 1 && (
              <span className="h-4 w-px bg-gray-400/50" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
