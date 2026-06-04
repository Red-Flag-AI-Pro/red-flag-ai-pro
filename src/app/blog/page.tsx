import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BLOG_POSTS } from "@/lib/blog";
import React from "react";

export const metadata: Metadata = {
  title: "Blog — Marketing Compliance Guides & Updates",
  description: "Expert guides on FTC compliance, GDPR email marketing, ASA CAP Code violations, EU AI Act requirements and marketing compliance best practices for 2026.",
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
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

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
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.12) 0%, transparent 65%)"
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
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Know the rules.<br />Before they cost you.
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Plain-English guides to FTC, ASA, GDPR, EU AI Act and global marketing compliance law — written for marketers, not lawyers.
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
                background: i % 2 === 0 ? "#0a0a0a" : "#0f0505",
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
          <h2 style={{ ...syne, fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Stop reading about compliance.<br />Start scanning.
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Red Flag AI Pro checks your copy against 24 risk categories across 5 jurisdictions in 60 seconds.
          </p>
          <Link href="/signup" style={{
            display: "inline-block",
            background: "#cc0000", color: "white",
            ...syne, fontSize: "0.875rem", fontWeight: 700,
            padding: "13px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 24px rgba(204,0,0,0.3)",
            textDecoration: "none"
          }}>
            Scan Your Copy Free
          </Link>
        </div>
      </section>

    </div>
  );
}
