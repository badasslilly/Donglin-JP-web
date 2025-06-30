"use client";

import Link from "next/link";
import { ArrowButton } from "./ui/Button";

import { ExternalLink } from "lucide-react";
import SectionTitle from "./ui/SectionTitle";

/* Dummy data (replace with CMS fetch) */
const newsData = [
  {
    href: "/news/20250617-176",
    date: "2025.06.17",
    title: "廬山東林寺第22回「極楽浄土への旅・サマーキャンプ」参加者募集中",
  },
  {
    href: "/news/20250609-171",
    date: "2025.06.09",
    title: "第55回「彼岸行・体験の旅」、いよいよスタート！",
  },
  {
    href: "/news/20250503-166",
    date: "2025.05.03",
    title: "東林寺浄土苑の光寿関房、洒浄・啓用法会が無事に執り行われました。",
  },
];

export default function NewsSection() {
  return (
    <section
      id="news"
      className="bg-stone-50 bg-repeat py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* ————————————————————————————————————— Two‑column layout */}
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          {/* Left : vertical title */}
          <SectionTitle
            jp="新着情報"
            en="News"
            className="justify-self-center md:justify-self-start"
          />

          {/* Right : news list + button */}
          <div className="w-full max-w-3xl">
            {newsData.map((n) => (
              <div key={n.href}>
                <article className="grid grid-cols-[110px_1fr_auto] items-start gap-4 text-sm md:text-base">
                  {/* date */}
                  <time className="font-medium text-gray-700">{n.date}</time>

                  {/* title link */}
                  <Link
                    href={n.href}
                    className="pb-0.5 text-gray-900 transition-colors hover:text-indigo-600"
                  >
                    {n.title}
                  </Link>

                  {/* external icon link */}
                  <Link
                    href={n.href}
                    className="ml-auto shrink-0 p-1 text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    <ExternalLink strokeWidth={1.5} size={18} />
                  </Link>
                </article>
                {/* divider under every item, including the 3rd */}
                <hr className="my-6 border-t border-stone-300/70" />
              </div>
            ))}

            {/* Action button – centered relative to list width */}
            <div className="mt-14 text-center">
              <ArrowButton href="/news" className="inline-flex">
                お知らせ一覧
              </ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
