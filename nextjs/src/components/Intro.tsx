import { getStrapiURL } from '@/data/loaders';
import Image from 'next/image';


type Media = {
  data?: {
    attributes?: { url: string };
  };
};

type IntroProps = {
  data?: {
    crest?:          Media;
    kanji_vertical?: Media;
    title?:          string;
    description?:    string;
  };
};

export default function Intro({ data }: IntroProps) {
  if (!data) return null;                        // nothing to render

  const strapiURL = getStrapiURL();              // http://localhost:1337
  const crestUrl  = data.crest?.data?.attributes?.url;
  const kanjiUrl  = data.kanji_vertical?.data?.attributes?.url;

  return (
    <section className="mx-auto max-w-6xl py-20 flex flex-col md:flex-row gap-12">

      <div className="flex flex-col items-center md:w-1/3">
        {crestUrl && (
          <Image
            src={crestUrl.startsWith('http') ? crestUrl : strapiURL + crestUrl}
            alt="crest"
            width={120}
            height={120}
          />
        )}

        {kanjiUrl && (
          <Image
            className="mt-8"
            src={kanjiUrl.startsWith('http') ? kanjiUrl : strapiURL + kanjiUrl}
            alt={data.title ?? 'kanji vertical'}
            width={90}
            height={320}
          />
        )}
      </div>

      {data.description && (
        <article
          className="prose md:w-2/3"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      )}
    </section>
  );
}
