import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FineCalculator } from "@/components/tools/FineCalculator";
import React from "react";

export const metadata: Metadata = {
  title: "AI Compliance Fine Calculator — Your Maximum Regulatory Exposure | Red Flag AI Pro",
  description:
    "See your maximum regulatory exposure across the EU AI Act, GDPR, FTC and 10 jurisdictions in 10 seconds. Free, no signup. Built for CFOs, compliance and risk teams by Red Flag AI Pro.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/fine-calculator" },
  openGraph: {
    title: "What could AI non-compliance cost you? — Free Fine Calculator",
    description:
      "Your maximum statutory exposure across the EU AI Act, GDPR, FTC and 10 jurisdictions — in 10 seconds, free.",
    url: "https://www.redflagaipro.com/tools/fine-calculator",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function FineCalculatorPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Free tool</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            What could AI non-compliance <span style={{ fontStyle: "italic", color: "#E5484D" }}>actually cost you?</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Set your turnover and markets. See your maximum regulatory exposure across the EU AI Act, GDPR, FTC and 10 jurisdictions — in ten seconds. The numbers are statutory maximums, straight from each law.
          </p>
        </div>
      </section>

      {/* TOOL */}
      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <FineCalculator />
        </div>
      </section>
      <Footer />
    </div>
  );
}
