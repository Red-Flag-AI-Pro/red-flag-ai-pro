import type { Metadata } from "next";

// Internal WIP preview, never meant to be public or indexed.
// The scale animation work is parked. The previous version of this page
// (git history, ca7e7f6) imported the uncommitted ScaleMark component,
// which broke production builds. This stub keeps the route buildable
// until that work resumes.
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
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'Syne', system-ui, sans-serif",
        fontSize: "14px",
      }}
    >
      Internal preview parked. The scale mark work resumes on request.
    </div>
  );
}
