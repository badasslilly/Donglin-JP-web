/** @format */
"use client";
import { useMemo, useState } from "react";
import OfferingFilters from "@/components/OfferingFilters";

import type { OfferingItem } from "@/lib/offerings";
import OfferingCard from "./OfferingCard";

type Locale = "ja" | "en";

// normalize helper: works for {id, attributes:{...}} and flattened items
const attrs = (it: any) => (it?.attributes ?? it ?? {});

export default function OfferingGrid({
  items,
  locale,
}: {
  items: OfferingItem[] | any[]; // tolerate mixed shapes
  locale: Locale;
}) {
  const [filter, setFilter] =
    useState<"all" | "in_person" | "mail" | "digital">("all");

  // ensure array and remove falsy entries
  const list = Array.isArray(items) ? items.filter(Boolean) : [];

  const visible = useMemo(() => {
    return list.filter((it) => {
      const a = attrs(it);
      if (!a) return false; // safety
      switch (filter) {
        case "in_person":
          return !!a.has_in_person;
        case "mail":
          return !!a.has_mail;
        case "digital":
          return !!a.has_digital;
        default:
          return true;
      }
    });
  }, [list, filter]);

  if (!list.length) {
    return (
      <div className="space-y-4">
        <OfferingFilters value={filter} onChange={setFilter} locale={locale} />
        <p className="text-sm text-gray-600">
          {locale === "ja" ? "現在、表示できる結縁品がありません。" : "No offerings to show right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OfferingFilters value={filter} onChange={setFilter} locale={locale} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((it) => (
          // OfferingCard already normalizes its props
          <OfferingCard key={it?.id ?? attrs(it).slug} item={it} locale={locale} />
        ))}
      </div>
    </div>
  );
}
