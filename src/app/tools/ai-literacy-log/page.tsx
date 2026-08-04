import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AILiteracyLog } from "@/components/tools/AILiteracyLog";
import React from "react";

export const metadata: Metadata = {
  title: "Free AI Literacy Measures Log | Red Flag AI Pro",
  description:
    "Record the AI literacy training and measures you've given staff, per EU AI Act Article 4. Applies to every AI deployer, not just high-risk systems. Free.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/ai-literacy-log" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function AILiteracyLogPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(229,72,77,0.12) 0%, transparent 65%)" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D" }}>Free Tool</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
            AI literacy<br />measures log
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Record what AI literacy measures you've actually given staff. Applies to every AI deployer, not just high-risk systems. Free.
          </p>
        </div>
      </section>
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <AILiteracyLog />
        </div>
      </section>
      <Footer />
    </div>
  );
}
