import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UrlExposureChecker } from "@/components/tools/UrlExposureChecker";
import React from "react";

export const metadata: Metadata = {
  title: "Free URL Compliance Exposure Checker — Scan Any Live Page | Red Flag AI Pro",
  description: "Paste any live URL and get an instant compliance exposure score — income claims, false urgency, missing disclosures and more, scanned straight from the page. Free.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/url-exposure-checker" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function UrlExposureCheckerPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Free Tool</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            URL Exposure <span style={{ fontStyle: "italic", color: "#E5484D" }}>Checker</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Paste any live URL — your landing page, a sales page, an ad page. We scan the actual page text for compliance red flags in seconds. No copy-paste needed.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <UrlExposureChecker />
        </div>
      </section>
      <Footer />
    </div>
  );
}
