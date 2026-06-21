import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIVisibilitySurvey } from "@/components/tools/AIVisibilitySurvey";
import React from "react";

export const metadata: Metadata = {
  title: "Free AI Visibility Checker — Will AI Assistants Recommend You? | Red Flag AI Pro",
  description: "AI assistants like ChatGPT recommend brands based on trust-signal density: reviews, recency, cross-platform mentions and structured data. 7-question self-assessment, free.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/ai-visibility-checker" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function AIVisibilityCheckerPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Free Tool</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            AI Visibility <span style={{ fontStyle: "italic", color: "#E5484D" }}>Checker</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            AI assistants recommend brands based on trust-signal density — reviews, recency, cross-platform presence, and structured data. 7 quick questions to find your gaps.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <AIVisibilitySurvey />
        </div>
      </section>
      <Footer />
    </div>
  );
}
