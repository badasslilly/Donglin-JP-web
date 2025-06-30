// // app/[lang]/page.tsx
// import { getHomePage } from '@/data/loaders';
// import HeroCarousel from '@/components/HeroSection';
// import Intro from '@/components/Intro';
// import Promo from '@/components/Promo';

// export const revalidate = 60;            // ISR

// export default async function Home({                              // <-- DO 
// }: {
//   params: { lang: 'ja' | 'en' };
// }) {      // ✅ await once
//   const data = await getHomePage();    // lang is now 'ja' | 'en'

//   return (
//     <main>
//       <HeroCarousel slides={data.hero_slides ?? []} />
//       <Intro data={data.intro ?? {}} />
//       {Array.isArray(data.promos) &&
//         data.promos.map((p: any, i: number) => (
//           <Promo key={p.id} p={p} reversed={i % 2 === 1} />
//         ))}
//     </main>
//   );
// }
