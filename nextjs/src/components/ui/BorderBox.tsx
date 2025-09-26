/*  BorderBox.tsx  */
import clsx from "clsx";

interface BorderBoxProps {
  title: string;
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
  locale?: "ja" | "en" | string;   // ← NEW
}

export default function BorderBox({
  title,
  side = "left",
  className = "",
  children,
  locale = "ja",
}: BorderBoxProps) {
  const isEN = String(locale).startsWith("en");

  return (
    <div
      className={clsx(
        "relative border border-black/80 bg-white p-10",
        className,
      )}
    >
      {/* title tag — vertical for JA, horizontal for EN */}
      <div
        className={clsx(
          "absolute font-bold tracking-widest bg-[#f4f1e8]",
          isEN
            ? "-top-6 px-3 py-2 rounded-md"                  // horizontal badge
            : "-top-6 px-2 py-1",                             // vertical strip
          side === "left" ? "left-6" : "right-6",
        )}
        style={
          isEN
            ? {
                // horizontal
                writingMode: "horizontal-tb",
                textOrientation: "mixed",
                fontSize: "1.125rem", // ≈ text-xl
                lineHeight: 1.2,
              }
            : {
                // vertical
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem", // ≈ text-3xl
                lineHeight: 1.1,
                minHeight: "9rem",
              }
        }
      >
        {title}
      </div>

      {/* box content */}
      {children}
    </div>
  );
}
