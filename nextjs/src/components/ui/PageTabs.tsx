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
  letterSpacingEm?: number; // same spacing for all labels (desktop)
}

export default function PageTabs({
  tabs,
  className = "",
  bgClass = "bg-[#e7e2d0]",
  letterSpacingEm = 0.2,
}: PageTabsProps) {
  const pathname = usePathname();

  return (
    <nav className={clsx(bgClass, className)}>
      <ul className="mx-auto flex max-w-5xl items-center justify-center gap-6 px-4 py-4 text-sm font-semibold text-stone-950">
        {tabs.map((t, idx) => (
          <li key={t.href} className="flex items-center gap-6">
            <Link
              href={t.href}
              style={{
                // mobile: no letter spacing, md+: apply letterSpacingEm
                letterSpacing: `clamp(0em, (100vw - 768px) * 9999, ${letterSpacingEm}em)`,
              }}
              className={clsx(
                pathname === t.href ? "text-stone-500" : "hover:text-stone-500",
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
