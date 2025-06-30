import Image from 'next/image';
import Link from 'next/link';

export default function Promo({ p, reversed = false }: { p: any; reversed?: boolean }) {
  const images = p.images.data;
  return (
    <section className={`py-24 ${reversed ? 'bg-gray-50' : ''}`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className={reversed ? 'md:order-2' : ''}>
          <h2 className="text-2xl font-semibold mb-6">{p.heading}</h2>
          <article className="prose mb-6" dangerouslySetInnerHTML={{ __html: p.body }} />
          {p.cta_link && (
            <Link href={p.cta_link} className="inline-block mt-4 underline font-medium">
              {p.cta_label}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(0, 4).map((img: any) => (
            <Image
              key={img.id}
              src={img.attributes.url}
              alt={img.attributes.alternativeText || ''}
              width={400}
              height={260}
              className="aspect-[3/2] object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
