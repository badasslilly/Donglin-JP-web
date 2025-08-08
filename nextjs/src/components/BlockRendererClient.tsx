'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';
import React from 'react';

interface Props {
  content: BlocksContent | null;
}

/* props from the renderer → children は optional */
type HeadingProps = {
  children?: ReactNode;
  level?: number;
};

const COLOR_HEADING_BG = '#e6e0c8'; // background for heading
const COLOR_BULLET = '#a54c0a';   
const COLOR_QUOTE_BG = '#f8f6ef';
const COLOR_QUOTE_BAR= '#a54c0a';

const sizeByLevel = [
  'text-3xl md:text-4xl font-bold',   // h1
  'text-2xl md:text-3xl font-bold',   // h2
  'text-xl  md:text-2xl font-semibold', // h3
  'text-lg  md:text-xl  font-semibold', // h4
  'text-base md:text-lg  font-medium',  // h5
  'text-base font-medium',              // h6
];

/* ------------------------------------------------------------ */
export default function BlockRendererClient({ content }: Props) {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        heading: ({ level = 1, children }) => {
          const cls = sizeByLevel[level - 1] || 'text-base font-medium';

          return (
            <div
              className="w-full flex items-center justify-between px-6 py-2 my-8 rounded"
              style={{ backgroundColor: `${COLOR_HEADING_BG}80` }} // semi-transparent
            >
              {/* bullet + text */}
              <div className="flex items-center">
                <span
                  className="mr-4 h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLOR_BULLET }}
                />
                <span className={`${cls} tracking-wide`}>{children}</span>
              </div>
            </div>
          );
        },

        image: ({ image }) => (
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
            className="mx-auto my-8 rounded-md"
          />
        ),

        list: ({ children }) => (
          <ul className="list-disc pl-6 space-y-1">{children}</ul>
        ),

        quote: ({ children }) => (
          <blockquote
            className="my-6 border-l-4 px-4 py-3 leading-8"
            style={{ background: COLOR_QUOTE_BG, borderColor: COLOR_QUOTE_BAR }}
          >
            {children}
          </blockquote>
        ),
      }}
    />
  );
}
