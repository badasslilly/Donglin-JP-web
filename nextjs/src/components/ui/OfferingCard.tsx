/** @format */
"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Download, QrCode } from "lucide-react";


import { methodBadges } from "@/data/kinds"; // see robust version below
import { mediaURL } from "@/lib/strapi";
import RequestDialog from "../RequestDialog";

export default function OfferingCard({
  item,
  locale = "ja",
}: {
  item: any;
  locale?: "ja" | "en";
}) {
  // normalize Strapi shape or flattened
  const a = item?.attributes ?? item ?? {};

  const [open, setOpen] = useState(false);
  const [initialMethod, setInitialMethod] = useState<"in_person" | "mail">(
    a.has_mail ? "mail" : "in_person"
  );

  const badges = methodBadges(item, locale);

  // image src via your helper
  const rawImg =
    a.images?.data?.[0]?.attributes?.url ??
    a.images?.[0]?.url ??
    "";
  const img = mediaURL(rawImg) || "/no-img.svg";

  const title = a.title ?? "—";
  const desc = a.description_short ?? "";

  const hasInPerson = !!a.has_in_person;
  const hasMail = !!a.has_mail;
  const hasDigital = !!a.has_digital;

  const digital = a.digital_assets?.data ?? a.digital_assets ?? [];
  const firstDigitalUrl = mediaURL(
    digital[0]?.attributes?.url ?? digital[0]?.url ?? ""
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
        <p className="text-sm text-gray-600 min-h-10">{desc}</p>

        <div className="flex flex-wrap gap-2">
          {badges.map((b, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 text-xs rounded-full border ${b.color}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {hasInPerson && (
            <button
              onClick={() => {
                setInitialMethod("in_person");
                setOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm"
            >
              <QrCode className="w-4 h-4" />
              {locale === "ja" ? "引換コード" : "Redeem code"}
            </button>
          )}

          {hasMail && (
            <button
              onClick={() => {
                setInitialMethod("mail");
                setOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              {locale === "ja" ? "郵送申込" : "Mail request"}
            </button>
          )}

          {hasDigital && (
            <a
              href={firstDigitalUrl || "#"}
              target="_blank"
              className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm col-span-1"
            >
              <Download className="w-4 h-4" />
              {locale === "ja" ? "ダウンロード" : "Download"}
            </a>
          )}
        </div>
      </div>

      {open && (
        <RequestDialog
          item={{ id: item?.id ?? a.id, attributes: a }}
          initialMethod={initialMethod}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </article>
  );
}
