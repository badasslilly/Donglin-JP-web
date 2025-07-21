/*  BorderBox.tsx  */
import clsx from "clsx";

interface BorderBoxProps {
  title: string;
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export default function BorderBox({
  title,
  side = "left",
  className = "",
  children,
}: BorderBoxProps) {
  return (
    <div
      className={clsx(
        "relative border border-black/80 bg-white p-10",
        className,
      )}
    >
      {/* title tag — vertical writing */}
      <div
        className={clsx(
          "absolute -top-6 bg-[#f4f1e8] px-2 py-1 font-bold tracking-widest",
          side === "left" ? "left-6" : "right-6",
        )}
        /* vertical‐rl gives top→bottom, Japanese style  */
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",    // keep punctuation upright
          // fixed height so the box won’t stretch vertically

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",          // ≈ text-3xl
          lineHeight: 1.1,
          minHeight: "9rem",   
        }}
      >
        {title}
      </div>

      {/* box content */}
      {children}
    </div>
  );
}
