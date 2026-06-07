import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { DisclosureGenerator } from "@/components/tools/DisclosureGenerator";
import React from "react";

export const metadata: Metadata = {
  title: "Free Affiliate Disclosure & Sponsorship Disclaimer Generator — Red Flag AI Pro",
  description: "Generate a compliant FTC and ASA affiliate disclosure, sponsorship disclaimer or income-claim notice for Instagram, TikTok, YouTube, email or your sales page — free, in seconds.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/disclosure-generator" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function DisclosureGeneratorPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "8rem 1.5rem 3rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.12) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Free Tool — No Signup</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
            Affiliate &amp; sponsorship<br />disclosure generator
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            &ldquo;#ad&rdquo; buried in a hashtag pile won&apos;t cut it. Pick your platform and relationship type, get FTC- and ASA-compliant wording you can paste straight in — free, no account needed.
          </p>
        </div>
      </section>

      {/* TOOL */}
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <DisclosureGenerator />
        </div>
      </section>
    </div>
  );
}
