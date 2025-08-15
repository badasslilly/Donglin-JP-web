// src/lib/offerings.ts
import qs from "qs";
import { strapiFetch } from "@/lib/strapi"; // you already have a helper; adapt if different

export type StockStatus = "in_stock" | "low" | "out";

export interface OfferingItem {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description_short?: string;
    description_long?: string;
    has_in_person: boolean;
    has_mail: boolean;
    has_digital: boolean;
    mail_available_regions?: string[] | null;
    shipping_note?: string | null;
    stock_status: StockStatus;
    order_limit_per_person?: number | null;
    display_order?: number | null;
    images?: { data: { attributes: { url: string; alternativeText?: string } }[] };
    digital_assets?: { data: { attributes: { url: string; name?: string } }[] };
  }
}

export async function getOfferingItems(locale: string) {
  const query = qs.stringify({
    locale,
    sort: ["display_order:asc", "title:asc"],
    populate: {
      images: { fields: ["url", "alternativeText"] },
      digital_assets: { fields: ["url", "name"] },
    },
  });
  return strapiFetch<OfferingItem[]>(`/api/offering-items?${query}`);
}