'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function HeroCarousel({ slides }: { slides: any[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="relative h-[60vh] overflow-hidden">
      {slides.map((s, i) => (
        <Image
          key={s.id}
          src={s.image.data.attributes.url}
          alt={s.alt || ''}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {/* simple dot nav */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}
