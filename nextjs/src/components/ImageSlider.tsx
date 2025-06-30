/* ------------------------------------------------------------------
   components/ImageSlider.tsx
   – full-width, cross-fade hero slider using SwiperJS
   – autoplay 5 s, fades smoothly, loops forever
------------------------------------------------------------------- */
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

/* ---------------------------------------------
   1)  Replace these paths with your own images
--------------------------------------------- */
const slides = [
  { src: "/imgs/slides/Amitabha-recitation.jpg",    alt: "Amitabha recitation hall at Donglin Monastery" },
  { src: "/imgs/slides/autumn.jpg",                 alt: "Donglin Monastery garden in autumn foliage" },
  { src: "/imgs/slides/big-buddha-in-snow.jpg",     alt: "Snow-covered Big Buddha statue at Donglin" },
  { src: "/imgs/slides/big-buddha-in-the-clouds.jpg", alt: "Big Buddha emerging through the morning clouds" },
  { src: "/imgs/slides/lifo.jpg",                   alt: "Scenic Lifo view near Donglin Temple" },
];


/* ---------------------------------------------
   2)  Component
--------------------------------------------- */
export default function ImageSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      slidesPerView={1}
      loop
      effect="fade"
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      className="h-[60vh] w-full lg:h-[55vh]"
    >
      {slides.map(({ src, alt }) => (
        <SwiperSlide key={src} className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className="object-cover object-center"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
