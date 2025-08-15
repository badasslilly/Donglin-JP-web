/** @format */
"use client";
import clsx from "clsx";

export type FilterKey = "all" | "in_person" | "mail" | "digital";

const FILTERS: { key: FilterKey; ja: string; en: string }[] = [
  { key: "all", ja: "すべて", en: "All" },
  { key: "in_person", ja: "現地のみ", en: "In person" },
  { key: "mail", ja: "海外郵送可", en: "Mail" },
  { key: "digital", ja: "デジタル", en: "Digital" },
];

export default function OfferingFilters({
  value,
  onChange,
  locale = "ja",
}: {
  value: FilterKey;
  onChange: (v: FilterKey) => void;
  locale?: "ja" | "en";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={clsx(
            "px-3 py-1 rounded-full border text-sm",
            value === f.key ? "bg-black text-white border-black" : "bg-white"
          )}
        >
          {locale === "ja" ? f.ja : f.en}
        </button>
      ))}
    </div>
  );
}