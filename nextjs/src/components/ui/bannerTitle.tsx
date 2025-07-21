import React from "react";

interface Props {
  title: string;
  href?: string;
  linkLabel?: string;
}

export default function BannerTitle({ title, href, linkLabel }: Props) {
  return (
    <div className="w-full flex items-center justify-between bg-[#e6e0c8]/50 px-6 py-2">
      {/* bullet + title */}
      <div className="flex items-center">
        <span className="mr-4 h-3 w-3 rounded-full bg-[#a54c0a]" />
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          {title}
        </h2>
      </div>
    </div>
  );
}
