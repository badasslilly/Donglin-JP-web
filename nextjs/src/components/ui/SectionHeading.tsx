/* ------------------------------------------------------------------ */
/*  <SectionHeading> – banner-style header with dot + title           */
/* ------------------------------------------------------------------ */
import clsx from "clsx";

interface SectionHeadingProps {
  /** Main text shown in the banner */
  title: string;
  /** Tailwind class to colour the dot (default: #a54c0a) */
  dotColorClass?: string;
  /** Extra Tailwind classes for the <h2> element         */
  titleClassName?: string;
  /** Banner background (default soft beige)              */
  bgClassName?: string;
}

export default function SectionHeading({
  title,
  dotColorClass = "bg-[#a54c0a]",
  titleClassName = "text-xl md:text-2xl font-bold tracking-wide",
  bgClassName = "bg-[#f6f3e7]/90",
}: SectionHeadingProps) {
  return (
    <div
      /* full-width banner */
      className={clsx(
        "flex w-full items-center px-6 py-3",
        bgClassName,
      )}
    >
      <span className={clsx("mr-4 h-3 w-3 rounded-full", dotColorClass)} />
      <h2 className={titleClassName}>{title}</h2>
    </div>
  );
}
