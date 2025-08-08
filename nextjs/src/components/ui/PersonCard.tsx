// src/components/ui/PersonCard.tsx
import Image from "next/image";

interface Props {
  slug: string;
  name: string;
  brief?: string;
  src: string;
  onSelect: (slug: string) => void;
}

export default function PersonCard({ slug, name, brief, src, onSelect }: Props) {
  return (
    <button onClick={() => onSelect(slug)} className="group text-left focus:outline-none">
      <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ml-15 mr-15 md:ml-0 md:mr-0">
        {/* ---- IMAGE: keep whole artwork visible ---- */}
        <div className="relative w-full h-20vh md:h-30vh flex items-center justify-center">
          <Image
            src={src || "/no-img.svg"}
            alt={name}
            width={300}
            height={400}
            className="p-3"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            priority={false}
          />
        </div>

        {/* ---- TEXT ---- */}
        <div className="px-4 pb-4 text-[15px] leading-7">
          <h3 className="mb-2 text-center text-[16px] font-bold">{name}</h3>
          {brief && (
            <p className="text-sm whitespace-pre-line line-clamp-8">
              {brief}
            </p>
          )}
        </div>
      </article>
    </button>
  );
}
