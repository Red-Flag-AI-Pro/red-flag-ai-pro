import type { Metadata } from "next";
import { ScaleMark } from "@/components/marketing/ScaleMark";

// Internal WIP preview, never meant to be public or indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewScalePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A1628",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ScaleMark size={420} />
    </div>
  );
}
