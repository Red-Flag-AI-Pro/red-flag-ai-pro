import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthorizationRecordDemo } from "@/components/tools/AuthorizationRecordDemo";
import React from "react";

export const metadata: Metadata = {
  title: "Try It: Seal a Boundary Authorization Record",
  description: "Free, no account needed. Answer three questions — who, what, and whether it still holds — and get one real, independently timestamped boundary authorization record, the shape behind Red Flag's who, when, whether framework.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/authorization-record-builder" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function AuthorizationRecordBuilderPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>Free, no account needed</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Who, when, <span style={{ fontStyle: "italic", color: "#E5484D" }}>whether.</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Three questions turn a vague permission into a record: who authorized it, what it authorizes, and what event makes it stop being valid. Answer them once here and get a real, sealed record, no account needed.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 3rem" }}>
        <AuthorizationRecordDemo />
      </section>

      <section style={{ padding: "3rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>Why the third question is the one everyone skips</p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75 }}>
            Most permissions get written down once and never revisited: who approved it and what it covers, but not what would make it stop being valid. An approval from March is still sitting in a document in November, and every control still lets it through, because nobody wrote down the condition that should have expired it. That gap is what &quot;whether&quot; exists to close.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
