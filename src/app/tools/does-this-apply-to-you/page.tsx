import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoesThisApplyQuiz } from "@/components/tools/DoesThisApplyQuiz";
import React from "react";

export const metadata: Metadata = {
  title: "Does This Even Apply to You? Free 5 Question Check",
  description: "Not sure if AI governance or marketing compliance rules apply to your business yet? Five quick questions, an honest answer, no email required.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/does-this-apply-to-you" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function DoesThisApplyToYouPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>No email, no signup, no pressure</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Does this even <span style={{ fontStyle: "italic", color: "#E5484D" }}>apply to you?</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Most compliance and AI governance sites assume you're already worried. Five quick questions, an honest answer, including if the honest answer is that it isn't you. Yet.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <DoesThisApplyQuiz />
      </section>
      <Footer />
    </div>
  );
}
