/** @format */
import HeroHeader from "@/components/ui/HeroHeader";

import { getOfferingItems } from "@/lib/offerings";
import { getDictionary, type Locale } from "@/i18n/get-dictionary";
import OfferingGrid from "@/components/ui/OfferingGrid";


// Added by fix-async-props codemod
type PageProps = {
  params: Promise<{ slug: string; locale: 'ja' | 'en' }>; // adjust keys as needed
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}



export default async function OfferingsPage(props: PageProps) {
  // Next 15 async request props shim (added by codemod)
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  const locale = params.locale;

  const items = await getOfferingItems(locale);

  return (
    <main className="bg-white">
      <HeroHeader
        bgSrc="/imgs/sub-pages/lotus.jpg"
        title="授与品のご案内"
        subtitle="Offerings"
      />

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        {/* Filters + Grid (client) */}
        <OfferingGrid items={items ?? []} locale={locale} />

        {/* FAQ */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3 text-sm leading-7">
            <h3 className="text-lg font-semibold">{locale === "ja" ? "受け取り方法" : "How to receive"}</h3>
            <ol className="list-decimal pl-6">
              <li>{locale === "ja" ? "現地での授与：引換コードを受付でご提示ください。" : "In person: show your redeem code at reception."}</li>
              <li>{locale === "ja" ? "海外郵送：送料実費にて、月1回まとめて発送します。" : "Mail: we ship monthly; postage at cost."}</li>
              <li>{locale === "ja" ? "デジタル結縁：PDFや壁紙、読誦音声を今すぐダウンロード。" : "Digital: download PDFs, wallpapers, and chants."}</li>
            </ol>
          </div>
          <aside className="text-xs text-gray-600">
            <h4 className="font-semibold mb-2">{locale === "ja" ? "ご案内" : "Notes"}</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>{locale === "ja" ? "結縁品は無料です。郵送をご希望の場合は送料のご負担にご協力ください。" : "Offerings are free. For mail, please cover postage at cost."}</li>
              <li>{locale === "ja" ? "在庫状況により代替のご提案となる場合があります。" : "Depending on stock, we may suggest alternatives."}</li>
              <li>{locale === "ja" ? "個人情報は申込の目的に限り取り扱います。" : "We only use your data to process your request."}</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}