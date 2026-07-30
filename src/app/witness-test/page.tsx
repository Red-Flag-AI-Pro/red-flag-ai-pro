import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WitnessTest } from "@/components/tools/WitnessTest";
import React from "react";

export const metadata: Metadata = {
  title: "The Witness Test | Who witnesses your evidence?",
  description:
    "Five questions on how your AI governance evidence is produced. Find out whether your records are independently witnessed or whether your evidence trusts itself. Free, takes two minutes.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-test" },
  openGraph: {
    title: "The Witness Test | Who witnesses your evidence?",
    description:
      "Five questions reveal whether your AI governance records are independently witnessed or whether your evidence trusts itself.",
    url: "https://www.redflagaipro.com/witness-test",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function WitnessTestPage() {
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
            Who witnesses <span style={{ fontStyle: "italic", color: "#E5484D" }}>the witness?</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Your AI governance vendor produces logs, receipts and attestations. Five questions reveal whether anything outside the operator ever saw that evidence, or whether the record keeper is grading its own homework.
          </p>
        </div>
      </section>

      {/* TOOL */}
      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <WitnessTest />
        </div>
      </section>
      <Footer />
    </div>
  );
}
