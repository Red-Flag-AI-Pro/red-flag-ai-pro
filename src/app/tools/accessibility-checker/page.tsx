import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityChecker } from "@/components/tools/AccessibilityChecker";
import { ToolEmailGate } from "@/components/tools/ToolEmailGate";
import React from "react";

export const metadata: Metadata = {
  title: "Free Website Accessibility Score Checker — ADA / WCAG Risk | Red Flag AI Pro",
  description: "Enter your URL and get an instant accessibility score — missing alt text, unlabeled forms, broken heading structure and more. ADA, EAA and Equality Act demand letters are rising fast. Free.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/accessibility-checker" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function AccessibilityCheckerPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Free Tool</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Accessibility Score <span style={{ fontStyle: "italic", color: "#E5484D" }}>Checker</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Enter any URL. We check the page for the structural accessibility issues most commonly cited in ADA, EAA and Equality Act demand letters — in seconds.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <ToolEmailGate tool="accessibility-checker" title="Unlock the Accessibility Checker">
            <AccessibilityChecker />
          </ToolEmailGate>
        </div>
      </section>
      <Footer />
    </div>
  );
}
