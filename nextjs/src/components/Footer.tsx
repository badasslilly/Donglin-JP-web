/* ------------------------------------------------------------------
   components/Footer.tsx – layout matching the screenshot
-------------------------------------------------------------------*/
import Link from "next/link";
import Image from 'next/image'
import { Instagram, Facebook, X } from "lucide-react"; // any icon lib you prefer

export function Footer() {
  return (
    <footer className="bg-[#f5f5f3] py-20 text-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3 lg:gap-20">
        {/* ───────────────── left column: hours & contact ───────────────── */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="text-xl font-semibold tracking-wide">拝観時間　8:00 — 17:00</p>
            <p className="mt-6 text-sm leading-relaxed lg:text-base">
              お泊まり、念仏堂の使用、ロケーション撮影使用、写真利用、<br />
              拝観時間等のお問い合わせはお電話またはメールでご連絡ください。
            </p>
          </div>

          <div className="space-y-2 text-sm lg:text-base">
            <p>
              <span className="inline-block w-14">TEL</span>
              075‑781‑8025（8:00‑17:00）
            </p>
            {/* <p>
              <span className="inline-block w-14">FAX</span>
              075‑781‑8035
            </p> */}
            <p>
              <span className="inline-block w-14">MAIL</span>
              <Link href="mailto:pureland@donglin.cn" className="underline">
                pureland@donglin.cn
              </Link>
            </p>
          </div>

          {/* social icons */}
          <div className="flex items-center gap-6 pt-6">
            <Link href="#" aria-label="Instagram" className="hover:opacity-70">
              <Instagram className="h-6 w-6" strokeWidth={1.3} />
            </Link>
            <Link href="#" aria-label="Facebook" className="hover:opacity-70">
              <Facebook className="h-6 w-6" strokeWidth={1.3} />
            </Link>
          </div>

          <p className="pt-12 text-xs">© donglin monastery</p>
        </div>

        {/* ───────────────── right column: vertical info ──────────────── */}
        <div className="hidden lg:grid grid-cols-3 items-start gap-4">
          {/* Column 1: Map link vertical */}
          <Link
            href="https://maps.google.com/?q=35.06103,135.79658"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 hover:opacity-70"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current rotate-90"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
            <span className="[writing-mode:vertical-rl] text-sm leading-tight tracking-widest">
              アクセス地図を開く
            </span>
          </Link>

          {/* Column 2: Temple vertical image */}
          <div className="flex justify-center">
            <Image src="/imgs/seal.png" alt="中國廬山東林寺" width={550} height={550} className="h-auto w-32" />
          </div>

          {/* Column 3: Address vertical */}
          <p className="[writing-mode:vertical-rl] text-base tracking-widest">
            郵便番号三三二〇〇五<br />江西省九江市濂溪区赛阳镇東林寺
          </p>
        </div>
      </div>
    </footer>
  );
}
