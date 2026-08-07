import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotarySeal } from "@/components/tools/NotarySeal";
import React from "react";

export const metadata: Metadata = {
  title: "Post Notary: Seal a Quote or Promise Before You Send It",
  description: "Free, no account needed. Seal the exact text of a quote, promise or agreed terms before you send it, independently timestamped, so a later dispute over what was actually said has a real answer.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/post-notary" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function PostNotaryPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>Free, no account needed</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Post <span style={{ fontStyle: "italic", color: "#E5484D" }}>Notary</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Seal the exact text of a quote, a promise, or agreed terms before you send it. Independently timestamped, so if someone later claims you said something different, there is a real answer, not just your word against theirs.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 3rem" }}>
        <NotarySeal
          placeholder="Paste the exact quote, promise or terms — e.g. 'We agreed a fixed price of £4,500 for the full kitchen fit, completion by 14 September.'"
          sealLabel="Seal this →"
          verifyHelp="Paste the text exactly as it should read, and the Seal ID you were given when it was sealed."
        />
      </section>

      <section style={{ padding: "3rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>How this actually works</p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75, marginBottom: "1rem" }}>
            Your browser hashes the text before anything is sent, so Red Flag never receives or stores what you actually wrote, only its fingerprint. That fingerprint is sent to an independent third party (an RFC 3161 Time Stamping Authority) that certifies it existed at a specific moment, not Red Flag on its own.
          </p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75 }}>
            To verify later, paste the same text back in with the Seal ID. If even one character has changed, it will not match.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
