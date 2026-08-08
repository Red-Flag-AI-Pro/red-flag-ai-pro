import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VendorTestBoundaryChecklist } from "@/components/tools/VendorTestBoundaryChecklist";
import React from "react";

export const metadata: Metadata = {
  title: "Free AI Vendor Test Boundary Checklist | Red Flag AI Pro",
  description:
    "Get the questions almost no vendor questionnaire asks: is your AI vendor's test environment isolated from production, and who can actually stop a run that breaks scope. Free, personalized to your vendor.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/vendor-test-boundary-checklist" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function VendorTestBoundaryChecklistPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{
        padding: "8rem 1.5rem 3rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.12) 0%, transparent 65%)"
        }} />
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
            AI vendor test<br />boundary checklist
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Name a vendor, get the exact questions to send them about test environment isolation and stop authority, the ones almost no vendor questionnaire asks. Free, personalized to your vendor.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <VendorTestBoundaryChecklist />
        </div>
      </section>
      <Footer />
    </div>
  );
}
