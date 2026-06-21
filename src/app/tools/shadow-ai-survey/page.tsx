import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShadowAISurvey } from "@/components/tools/ShadowAISurvey";
import React from "react";

export const metadata: Metadata = {
  title: "Free Shadow AI Audit — Find Out What Your Employees Aren't Telling IT | Red Flag AI Pro",
  description: "Over half of employees already use AI at work — under 40% of companies have a policy covering it. Run a 7-question Shadow AI Audit and get your Exposure Score. Free.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/shadow-ai-survey" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function ShadowAISurveyPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Free Tool</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Shadow AI <span style={{ fontStyle: "italic", color: "#E5484D" }}>Audit</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Over half of employees already use AI tools at work. Under 40% of companies have a policy covering it. Run the audit — 7 quick questions — and find out where you stand.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <ShadowAISurvey />
        </div>
      </section>
      <Footer />
    </div>
  );
}
