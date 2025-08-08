// src/components/ui/PersonCard.tsx
import Image from "next/image";

interface Props {
  slug : string,  
  name: string;
  brief?: string;
  src: string;
  onSelect: (slug: string) => void;           // ✅ pre-resolved URL or fallback
}

export default function PersonCard({ slug, name, brief, src, onSelect  }: Props) {
  return (
    <button
      onClick={() => onSelect(slug)}
      className="group text-left focus:outline-none"
    >
    <article className="h-full flex flex-col rounded-lg bg-white shadow-sm overflow-hidden">
      <Image
        src={src || "/no-img.svg"}
        alt={name}
        width={360}
        height={560}
        className="h-75 w-full object-cover"
      />

      <div className="p-4 text-[15px] leading-7">
        <h3 className="mb-2 text-center text-[16px] font-bold">{name}</h3>
        {brief && (
          <p className="text-sm whitespace-pre-line line-clamp-[15]">
            {brief}
          </p>
        )}
      </div>
    </article>
    </button>
  );
}
