/** @format */
/* ------------------------------------------------------------------
   Pure Land Patriarchs – static JSON → responsive grid
   -----------------------------------------------------------------*/

   import Image from "next/image";

   /* -------- local seed data (replace URLs & intro later) ----------- */
   const patriarchs = [
    {
      id: 1,
      name: "慧遠大師",
      img: "/imgs/patriarchs/huiyuan.png",
      intro:
        "东晋僧，雁门楼烦人，创建庐山东林寺，结白莲社一百二十三人，倡导专修净土，晚年四次见佛，被尊为净土宗初祖。",
    },
    {
      id: 2,
      name: "善導大師",
      img: "/imgs/patriarchs/shandao.png",
      intro:
        "唐代弘福寺僧，作《观经四帖疏》，专阐“称名一行”往生之义，日本法然、亲鸾奉为高祖，净土二祖。",
    },
    {
      id: 3,
      name: "承遠大師",
      img: "/imgs/patriarchs/chengyuan.png",
      intro:
        "唐代终南山僧，继承善导而复兴白莲社，躬行昼夜念佛，净土三祖。",
    },
    {
      id: 4,
      name: "法照大師",
      img: "/imgs/patriarchs/fazhao.png",
      intro:
        "唐德宗时号清凉国师，五台山念佛见文殊示现，创“六时普光念佛道场”，净土四祖。",
    },
    {
      id: 5,
      name: "少康大師",
      img: "/imgs/patriarchs/shaokang.png",
      intro:
        "宋代僧，提倡昼夜六时念佛并重兴净土道场，著《净土十要》，被列为净土五祖。",
    },
    {
      id: 6,
      name: "延壽大師",
      img: "/imgs/patriarchs/yanshou.png",
      intro:
        "北宋永明寺住持，兼弘天台与净土，撰《万善同归集》，倡导“念佛圆顿”，尊为净土六祖。",
    },
    {
      id: 7,
      name: "省常大師",
      img: "/imgs/patriarchs/xingchang.png",
      intro:
        "南宋临安僧，一生昼夜念佛不辍，重振白莲社，净土七祖。",
    },
    {
      id: 8,
      name: "蓮池大師",
      img: "/imgs/patriarchs/lianchi.png",
      intro:
        "明代杭州云栖寺住持，力倡戒杀放生与念佛三事，撰《弥陀要解》，净土八祖。",
    },
    {
      id: 9,
      name: "藕益大師",
      img: "/imgs/patriarchs/ouyi.png",
      intro:
        "莲宗九祖靈峰藕益大師",
    },
    {
      id: 10,
      name: "行策大師",
      img: "/imgs/patriarchs/xingce.png",
      intro:
        "虞山行策大師不缓不急绵绵密密心中佛号明明历历行住坐卧不令间断犹如呼吸不没不散如是持名可谓精进",
    },
    {
      id: 11,
      name: "省庵大师",
      img: "/imgs/patriarchs/xingan.png",
      intro:
        "莲宗十一祖梵天省庵大师行在梵网志在西方持戒念佛教化弥广一句弥陀万法该彻静室掩关寸香会客至诚恳切圆成净业",
    },
    { 
      id: 12, 
      name: "彻悟大师", 
      img: "/imgs/patriarchs/chewu.png", 
      intro: "蓮宗十二祖紅螺徹悟大師真為生死發菩提心以深信願持佛名號具大慚愧攝心專念執持重戒折服煩惱種種苦行以為助道" },
    { 
      id: 13, 
      name: "印光大师", 
      img: "/imgs/patriarchs/yinguang.png", 
      intro: "莲宗十三祖灵严印光大师道成南海降迹秦中明弘净土密护诸宗力倡因果潜挽世风文钞一部法眼圆明蒙光护益累劫无穷" },
  ];

   /* -------- component --------------------------------------------- */
   export default function PureLandPatriarchs() {
     return (
       <section className="relative bg-[#d6bfa7] px-4 py-12">
         {/* left ribbon title */}
         <div className="absolute left-0 top-0 h-full w-12 bg-[#753819]" />
         <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-top-left">
           <span className="text-white tracking-widest text-2xl md:text-3xl">
             蓮宗十三祖
           </span>
         </div>
   
         {/* grid */}
         <div className="mx-auto max-w-7xl lg:pl-16">
           <ul className="grid gap-8
                           sm:grid-cols-2
                           md:grid-cols-3
                           xl:grid-cols-4">
             {patriarchs.map((p) => (
               <li key={p.id} className="text-center">
                 <div className="mx-auto h-44 w-44 md:h-48 md:w-48 relative">
                   <Image
                     src={p.img}
                     alt={p.name}
                     fill
                     sizes="176px"
                     priority
                     className="object-contain"
                   />
                 </div>
                 <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
                 <p className="mt-2 text-[13px] leading-6 max-w-xs mx-auto text-stone-700">
                   {p.intro}
                 </p>
               </li>
             ))}
           </ul>
         </div>
       </section>
     );
   }
   