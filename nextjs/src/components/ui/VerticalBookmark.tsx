interface Props {
  text: string;
  align?: "left" | "right";
}

export default function VerticalBookmark({ text, align = "left" }: Props) {
  const side = align === "left" ? "left-0" : "right-0";

  return (
    <div className={`absolute ${side} top-0 flex`} aria-hidden>
      {/* the strip hugs its content; no h-full */}
      <div className="bg-[#8c3b16] text-white rounded-b-md shadow-md">
        <span
          className="px-3 py-4 whitespace-pre leading-[1.2] text-[22px] font-bold"
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
