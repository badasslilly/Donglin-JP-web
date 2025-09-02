// nextjs/app/api/offering-request/route.ts
import { NextResponse } from "next/server";

type Method = "in_person" | "mail";
type Lang = "ja" | "en";

type Payload = {
  item_id?: number | string;
  item_title?: string;
  method: Method;
  name?: string;
  email?: string;
  address?: string;
  note?: string;
  localization?: Lang;      // <— renamed field
  // (optional backwards compat)
  locale?: Lang;            // if older clients still send locale
};

function assertValid(p: Payload) {
  const errs: string[] = [];
  if (!p.method || !["in_person", "mail", "digital"].includes(p.method)) errs.push("Invalid method");
  if (p.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) errs.push("Invalid email");
  if (p.method === "mail" && !p.address) errs.push("Address required for mail");
  if (errs.length) throw new Error(errs.join("; "));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    assertValid(body);

    // fallback: if someone still sends `locale`, map it
    const localization = body.localization ?? body.locale ?? "ja";

    const ip = req.headers.get("x-forwarded-for") ?? "";
    const ua = req.headers.get("user-agent") ?? "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/offering-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          item_id: body.item_id,
          item_title: body.item_title,
          method: body.method,
          name: body.name,
          email: body.email,
          address: body.address,
          note: body.note,
          localization,   // <— store under the new field
          ip,
          ua,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    const json = await res.json();
    return NextResponse.json({ ok: true, id: json?.data?.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad request" }, { status: 400 });
  }
}
