"use client";

import { useState } from "react";
import PersonCard from "./PersonCard";
import SectionHeading from "./SectionHeading";

/* server sends already-resolved src */
export interface PersonFlat {
  id: number;
  name: string;
  brief?: string;
  order?: number | null;
  src: string;                // ✅ full image URL
}

interface Props {
  title: string;
  slug: string;
  people: PersonFlat[];
}

export default function CategorySection({ title, slug, people: list }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <section id={slug} className="mb-20">
      {/* banner --------------------------------------------------- */}
      <div className="flex w-full items-center justify-between  bg-[#f6f3e7]/90 px-6 py-4">
        {/* <div className="flex items-center">
          <span className="mr-4 h-3 w-3 rounded-full bg-[#a54c0a]" />
          <h2 className="text-xl md:text-2xl font-bold tracking-wide">{title}</h2>
        </div> */}
        <SectionHeading title={title} />

        {/* toggle ------------------------------------------------- */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "折りたたむ" : "展開"}
          className="relative flex h-6 w-6 items-center justify-center"
        >
          <span
            className={`absolute h-0.5 w-4 bg-[#004aad] transition-transform ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          />
          <span className="absolute h-0.5 w-4 bg-[#004aad]" />
        </button>
      </div>

      {/* grid ----------------------------------------------------- */}
      {open && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {list.map((p: PersonFlat) => (
            <PersonCard
              key={p.id}
              name={p.name}
              biography={p.brief}
              src={p.src}         
            />
          ))}
        </div>
      )}
    </section>
  );
}
