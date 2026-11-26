import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";
import { JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Red Flag AI Pro: AI Governance Scoring and Compliance Platform",
  description:
    `Red Flag AI Pro was built to solve the gap between AI compliance and AI governance. Immutable audit trails, named human sign-off, and compliance checking across ${JURISDICTION_COUNT} jurisdictions. Built by James Stokes for CFOs, legal and risk teams.`,
  alternates: { canonical: "https://www.redflagaipro.com/about" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

export default function AboutPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "8rem 1.5rem 6rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "600px",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 65%)",
          }}
        />

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...syne,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E5484D",
              marginBottom: "1.5rem",
            }}
          >
            Why we exist
          </p>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              color: "#F4F1EA",
            }}
          >
            We started by catching risky copy.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>We ended up proving governance.</span>
          </h1>

          <p
            style={{
              ...syne,
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.01em",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Red Flag started as a checker that catches compliance risk in your marketing copy before it ships. The same gap shows up at the next level: every organization has governance policies, but when a regulator asks, "Can you prove governance happened?" most organizations can&apos;t. Red Flag now closes both gaps.
          </p>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                ...syne,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E5484D",
                marginBottom: "1rem",
              }}
            >
              The Gap
            </p>
            <h2
              style={{
                ...syne,
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "white",
              }}
            >
              Policy vs. Practice vs. Proof
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                title: "Every org has policy",
                desc: "Written AI governance frameworks exist. Board approved. Documented. But...",
              },
              {
                title: "Practice diverges silently",
                desc: "Teams don't follow it. Tools aren't approved. Data flows weren't checked. No one's monitoring.",
              },
              {
                title: "Proof doesn't exist",
                desc: "When regulators ask, 'prove governance happened?' most organizations can't. Munir v SSHD shows courts already sanctioning firms for unverified AI outputs, and the same exposure applies to ungoverned AI use anywhere in the business.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                  border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                  borderRadius: "12px",
                  padding: "2rem",
                }}
              >
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                <p
                  style={{
                    ...syne,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    ...syne,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "3rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "2.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                ...syne,
                fontSize: "12px",
                fontWeight: 700,
                color: "#E5484D",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Munir v SSHD (2026)
            </p>
            <p
              style={{
                ...syne,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              A tribunal sanctioned a firm for filing AI hallucinated case citations. Delegating to AI never removes the duty to verify and supervise.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT RED FLAG DOES */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                ...syne,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E5484D",
                marginBottom: "1rem",
              }}
            >
              What We Build
            </p>
            <h2
              style={{
                ...syne,
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "white",
              }}
            >
              Governance you can prove
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "",
                title: "Catch It Before It Ships",
                desc: `Real time check on marketing copy against ${RISK_CATEGORY_COUNT} risk categories across ${JURISDICTION_COUNT} jurisdictions. The original problem we solved, still running every day.`,
              },
              {
                icon: "",
                title: "See Reality",
                desc: "Assessment shows where governance actually is (not where you hope it is). 6-dimension audit reveals every gap.",
              },
              {
                icon: "",
                title: "Know What to Fix",
                desc: "Strategic roadmap prioritizes gaps by impact. Quick wins in 90 days. Medium term in 6 months. Transformation in 12.",
              },
              {
                icon: "",
                title: "Build Systems",
                desc: "Manual governance doesn't scale. We build monitoring, enforcement, and audit trails so proof is automatic.",
              },
              {
                icon: "",
                title: "Prove It Happened",
                desc: "Forensic logs. Evidence packages. Regulatory mapping. When auditors ask 'prove it', you have the answer.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                  border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.12)"}`,
                  borderRadius: "12px",
                  padding: "2rem",
                }}
              >
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                <p
                  style={{
                    ...syne,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    ...syne,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "#0D1B2E",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              ...syne,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E5484D",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Built by James Stokes
          </p>

          <div
            style={{
              background: "rgba(16,41,67,0.5)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <p
              style={{
                ...syne,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              Most tools in this space do one thing. The enterprise governance
              platforms, OneTrust, Credo AI, never touch the actual copy your
              team publishes. The compliance checkers that do check copy have
              no idea what AI governance even means. Red Flag does both,
              under one roof, built on the same regulatory research.
            </p>

            <p
              style={{
                ...syne,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
              }}
            >
              It catches the risk in your marketing copy before it publishes.
              And it makes AI governance visible to a regulator or board, what
              is broken, what to fix first, and proof that it actually
              happened. Nobody else on the market does both.
            </p>
          </div>

          {/* The other business James runs. Said plainly, because the same
              person may speak to a customer about both. */}
          <div
            style={{
              marginTop: "1.5rem",
              background: "rgba(16,41,67,0.5)",
              border: "1px solid rgba(201,166,107,0.3)",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.75rem" }}>
              Red Flag AI Pro is run by James Stokes and does two things: compliance and AI governance. It catches what a business says in public and proves how it uses AI.
            </p>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* RecoverROI's own mark, as used on recoverroi.com */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60" role="img" aria-label="RecoverROI" style={{ flexShrink: 0, borderRadius: "13px" }}>
                <rect width="64" height="64" rx="14" fill="#0b0912" />
                <path d="M16 50 V16 H32 a9 9 0 0 1 0 18 H16 M27 34 L38 50" fill="none" stroke="#f3f0fa" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 50 V24 H52 a7 7 0 0 1 0 14 H40 M50 38 L58 50" fill="none" stroke="#A855F7" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.1rem" }}>
                  James also runs <strong style={{ color: "#F4F1EA" }}>RecoverROI</strong>, which finds where small businesses are losing customers and fixes it: full websites built from scratch, pages that load fast, proper tracking of what the site brings in, and enquiries that get answered. Every website RecoverROI builds is checked by Red Flag before it goes live.
                </p>
                <a
                  href="https://www.recoverroi.com"
                  target="_blank"
                  rel="noopener"
                  style={{ ...syne, fontSize: "0.95rem", fontWeight: 700, color: "#C9A66B", textDecoration: "none" }}
                >
                  See what RecoverROI does at recoverroi.com →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* ── QUOTE BAND ── */}
      <section style={{ padding: "7rem 1.5rem", background: "linear-gradient(180deg, #0D1B2E 0%, #0A1628 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#F4F1EA",
            }}
          >
            We do the checking.
            <br />
            <span style={{ fontStyle: "italic", color: "#E5484D" }}>So you don&apos;t have to.</span>
          </h2>
        </div>
      </section>

      <section
        style={{
          padding: "6rem 1.5rem",
          background: "#0A1628",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              ...syne,
              fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              color: "white",
            }}
          >
            Ready to know where you actually stand?
          </h2>
          <p
            style={{
              ...syne,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Start with a free assessment. 2 minutes. See your governance
            maturity, gaps, and roadmap.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/get-checked"
              style={{
                ...syne,
                fontSize: "1rem",
                fontWeight: 700,
                background: "#E5484D",
                color: "white",
                padding: "14px 40px",
                borderRadius: "9999px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Show me my red flag
            </Link>
            <Link
              href="/audit"
              style={{
                ...syne,
                fontSize: "1rem",
                fontWeight: 700,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "14px 40px",
                borderRadius: "9999px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              See the full audit
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
