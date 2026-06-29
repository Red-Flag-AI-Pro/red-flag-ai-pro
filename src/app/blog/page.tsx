import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/lib/blog";
import React from "react";

export const metadata: Metadata = {
  title: "AI Governance & Compliance Blog | Red Flag AI Pro",
  description: "Plain English guides on AI governance, EU AI Act compliance, audit trails, and regulatory requirements across 10 jurisdictions. Written for compliance, legal and risk teams.",
  alternates: { canonical: "https://www.redflagaipro.com/blog" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const CATEGORY_STYLES: Record<string, React.CSSProperties> = {
  "EU AI Act":    { color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" },
  "FTC":          { color: "#60a5fa", background: "rgba(96,165,250,0.1)",  border: "1px solid rgba(96,165,250,0.2)" },
  "ASA / UK":     { color: "#ef4444", background: "rgba(239,68,68,0.1)",   border: "1px solid rgba(239,68,68,0.2)" },
  "GDPR":         { color: "#4ade80", background: "rgba(74,222,128,0.1)",  border: "1px solid rgba(74,222,128,0.2)" },
  "Compliance":   { color: "#fbbf24", background: "rgba(251,191,36,0.1)",  border: "1px solid rgba(251,191,36,0.2)" },
  "For Buyers":   { color: "#34d399", background: "rgba(52,211,153,0.1)",  border: "1px solid rgba(52,211,153,0.2)" },
  "For Sellers":  { color: "#fb923c", background: "rgba(251,146,60,0.1)",  border: "1px solid rgba(251,146,60,0.2)" },
};

export default function BlogPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Newsletter CTA ── */}
      <section style={{
        background: "#102943",
        borderTop: "1px solid rgba(239,68,68,0.15)",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
        padding: "5rem 1.5rem",
        textAlign: "center"
      }}>
        <div style={{maxWidth: "560px", margin: "0 auto"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.25rem"}}>
            <span className="flag-wave" style={{display: "inline-block"}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444"}}>The Red Flag Newsletter</p>
          </div>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>
            Weekly compliance updates.<br />Free. In plain English.
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "2rem"}}>
            Real violations. Real fines. What&apos;s changing in advertising law and what it means for your copy. Every week.
          </p>
          <a href="https://the-red-flag.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block",
            background: "#E5484D", color: "white",
            fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700,
            padding: "13px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
            textDecoration: "none", letterSpacing: "0.02em"
          }}>
            Subscribe free
          </a>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>One email a week. Real cases, real fines, no fluff. Unsubscribe in one click.</p>
        </div>
      </section>

      {/* Email lead magnet — premium dark */}
      <section style={{background: "#0A1628", padding: "4rem 1.5rem"}}>
        <div style={{maxWidth: "700px", margin: "0 auto", textAlign: "center"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Free download</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>
            The 30 Category Marketing Compliance Checklist
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "500px", margin: "0 auto 2.5rem"}}>
            Every compliance check you need before you launch. Every red flag to look for before you buy. Free. No spam.
          </p>
          <Link href="/blog/marketing-compliance-checklist-2026" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "#E5484D", color: "white",
            fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700,
            padding: "14px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none"
          }}>
            Get the free checklist
          </Link>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>No account needed. Instant access.</p>
        </div>
      </section>

      {/* HERO */}
      <section style={{
        padding: "8rem 1.5rem 5rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.12) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Compliance Guides</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Know the rules.<br />Before they cost you.
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Plain English guides to FTC, ASA, GDPR, EU AI Act and global marketing compliance law, written for marketers, not lawyers.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: "block",
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.1)"}`,
                padding: "2rem",
                textDecoration: "none",
                transition: "border-color 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.875rem", flexWrap: "wrap" }}>
                <span style={{
                  ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "3px 10px", borderRadius: "9999px",
                  ...(CATEGORY_STYLES[post.category] ?? { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" })
                }}>
                  {post.category}
                </span>
                <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{post.readTime}</span>
                <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                {post.title}
              </h2>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1rem" }}>
                {post.description}
              </p>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.06em" }}>
                Read article →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ ...syne, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Stop reading about compliance.<br />Start scanning.
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Red Flag AI Pro checks your copy against 30 risk categories across 10 jurisdictions in 60 seconds.
          </p>
          <Link href="/signup" style={{
            display: "inline-block",
            background: "#E5484D", color: "white",
            ...syne, fontSize: "0.875rem", fontWeight: 700,
            padding: "13px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
            textDecoration: "none"
          }}>
            Scan Your Copy Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
