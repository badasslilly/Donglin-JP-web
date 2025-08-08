import Image from "next/image";
import Link  from "next/link";
import { getPersonBySlug, mediaURL, Locale } from "@/lib/strapi";

const unwrap = <T extends Record<string, any>>(x: any): T =>
  ("attributes" in x ? { id: x.id, ...x.attributes } : x) as T;

/* -------------------------------------------------------------- */
/*  Individual profile                                             */
/* -------------------------------------------------------------- */
interface PageProps {
  params:       { slug: string };
  searchParams?: { locale?: Locale };
}

export default async function PersonPage(props: PageProps) {
  
  const locale = (props.searchParams?.locale as Locale) ?? "ja";
  const raw    = await getPersonBySlug(props.params.slug, locale);
  const p      = unwrap(raw);

  return (
    <article className="prose mx-auto px-4 py-10 lg:prose-lg">
      <h1>{p.name}</h1>

      <Image
        src={mediaURL(p.portrait?.data?.attributes?.url ?? p.portrait?.url) || "/no-img.svg"}
        alt={p.name}
        width={400}
        height={400}
        className="rounded-xl mx-auto"
      />

      {p.era && (
        <p>
          <strong>時代:</strong> {p.era}
        </p>
      )}

      {p.biography && (
        <section dangerouslySetInnerHTML={{ __html: p.biography }} />
      )}

      {/* Categories */}
      {(p.categories?.data ?? p.categories)?.length ? (
        <>
          <h2>分類</h2>
          <ul>
            {(p.categories?.data ?? p.categories).map((c: any) => {
              const cat = unwrap<{ id: number; title: string; slug: string }>(c);
              return (
                <li key={cat.id}>
                  <Link href={`/people?category=${cat.slug}`} className="underline">
                    {cat.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {/* Related people */}
      {(p.related_people?.data ?? p.related_people)?.length ? (
        <>
          <h2>関連人物</h2>
          <ul>
            {(p.related_people?.data ?? p.related_people).map((rp: any) => {
              const r = unwrap<{ id: number; name: string; slug: string }>(rp);
              return (
                <li key={r.id}>
                  <Link href={`/people/${r.slug}`} className="underline">
                    {r.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      <div className="mt-10">
        <Link href="/people" className="underline">
          ← 図鑑トップへ戻る
        </Link>
      </div>
    </article>
  );
}
