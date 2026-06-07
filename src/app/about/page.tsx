import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "About — The Story Behind Red Flag AI Pro",
  description: "Red Flag AI Pro was built by James Stokes — a founder who went from prison, homelessness and a terminal diagnosis to building the world's only 5-jurisdiction marketing compliance scanner.",
  alternates: { canonical: "https://www.redflagaipro.com/about" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

import React from "react";

export default function AboutPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO — cinematic full-bleed */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "9rem 1.5rem 7rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Large red glow */}
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.18) 0%, transparent 65%)"
        }} />
        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px"
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>
              The story behind the tool
            </p>
          </div>

          {/* Headline */}
          <h1 style={{
            ...syne,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: 800, lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "white",
            marginBottom: "2rem"
          }}>
            This wasn&apos;t built<br />
            in a boardroom.<br />
            <span style={{
              background: "linear-gradient(90deg, #ef4444 0%, #cc0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              It was built from the bottom.
            </span>
          </h1>

          {/* Quote */}
          <p style={{
            ...syne, fontSize: "1.1rem", fontStyle: "italic",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.02em"
          }}>
            &ldquo;Within adversity hides unstoppable strength&rdquo;
          </p>

        </div>
      </section>

      {/* STAT BAR */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "#0a0a0a"
      }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          padding: "0"
        }}>
          {[
            { value: "5", label: "Jurisdictions" },
            { value: "24", label: "Risk categories" },
            { value: "60s", label: "To a result" },
            { value: "£0", label: "First scan" },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: "1.75rem 1.5rem",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              textAlign: "center"
            }}>
              <p style={{ ...mono, fontSize: "2rem", fontWeight: 700, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT I BUILT */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>What I built</p>

          <div style={{
            background: "#0f0505",
            border: "1px solid rgba(239,68,68,0.2)",
            padding: "2.5rem",
            marginBottom: "3rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute", top: 0, left: "2.5rem", right: "2.5rem",
              height: "1px",
              background: "linear-gradient(90deg, #cc0000, transparent)"
            }} />
            <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              A scanner that checks marketing copy against real advertising law. FTC, GDPR, ASA, ACCC, CASL and EU AI Act. In 60 seconds. In plain English. With exact rewrite suggestions. No lawyers. No jargon. Just clarity.
            </p>
            <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>24 risk categories</span> and growing. Earnings claims, fake scarcity, countdown timers, health claims, GDPR consent violations, AI content disclosure, FTC endorsement rules, greenwashing, financial promotions and more. Five jurisdictions simultaneously. No other tool on the planet does this.
            </p>
            <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              And Sentinel is now live. Compliance infrastructure built for agencies, legal teams and regulated businesses. Human review logs with legal timestamps. Signed compliance certificates. The audit trail your PI insurer needs.
            </p>
            <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", lineHeight: 1.9 }}>
              I built it alone. With help from Claude. From a laptop. Against all odds.
            </p>
          </div>

        </div>
      </section>

      {/* THE STORY — cinematic pull quotes */}
      <section style={{ padding: "0 1.5rem 6rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "3rem", paddingTop: "6rem" }}>Why I built it</p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            I&apos;ve lived on both sides of misleading marketing. As a buyer who got ripped off repeatedly. And as a seller who didn&apos;t always know where the line was.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            For most of my adult life I was privately fighting battles nobody around me could see. I&apos;ve been to the lowest places a person can reach and somehow come back from them. I&apos;ve lost people I loved. I&apos;ve been given timelines that should have ended this story before it began.
          </p>

          {/* Full bleed pull quote */}
          <div style={{
            margin: "4rem -1.5rem",
            padding: "4rem 3rem",
            background: "#0a0505",
            borderTop: "1px solid rgba(239,68,68,0.15)",
            borderBottom: "1px solid rgba(239,68,68,0.15)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
              background: "linear-gradient(180deg, #cc0000 0%, transparent 100%)"
            }} />
            <p style={{
              ...syne,
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.5,
              letterSpacing: "-0.02em"
            }}>
              And then I lost my daughter to cancer when she was just 9 years old.
            </p>
          </div>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            That broke something in me I couldn&apos;t put back together for a long time. And yet somewhere underneath everything I always knew there was something bigger. A calling. Something I was meant to do. I just couldn&apos;t get there.
          </p>

          {/* Another pull quote */}
          <div style={{
            margin: "4rem 0",
            padding: "2.5rem",
            background: "#0f0505",
            border: "1px solid rgba(239,68,68,0.2)",
            position: "relative"
          }}>
            <p style={{ ...mono, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem" }}>The diagnosis</p>
            <p style={{
              ...syne, fontSize: "1.4rem", fontWeight: 700, color: "white", lineHeight: 1.4, letterSpacing: "-0.02em"
            }}>
              Then I was diagnosed with two years to live.
            </p>
          </div>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            I was numb at first. It didn&apos;t sink in. And then I thought, at least I&apos;ll be with my daughter soon.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            But something shifted. I&apos;d always loved Eastern mysticism, Buddhism, Stoicism. I&apos;d studied it for years without being able to live it. I found a place in Indonesia — military grade, no hot water, three cold baths a day, a call to prayer five times a day including 4am. It was the hardest thing I&apos;ve ever done. And it saved my life.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            Something happened in Indonesia that I still can&apos;t fully explain. Too many coincidences to call coincidences. A spiritual awakening that felt completely natural, as if I was being guided toward something. For the first time in my life, I felt it.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            I came back to the UK quietly rebuilding. I fell in love with AI. Started learning, building things off the top of my head. And then I went to buy one last course and got burned. The terms and conditions bore no resemblance to what the advert had promised. I&apos;d been ripped off again. At a time when I couldn&apos;t afford it.
          </p>

          {/* Birth of RFAP */}
          <div style={{
            margin: "4rem -1.5rem",
            padding: "4rem 3rem",
            background: "linear-gradient(135deg, #0f0505 0%, #0a0a0a 100%)",
            borderTop: "1px solid rgba(239,68,68,0.15)",
            borderBottom: "1px solid rgba(239,68,68,0.15)",
          }}>
            <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "1rem" }}>
              I was furious. I started talking to AI about it.
            </p>
            <p style={{
              ...syne, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "white",
              lineHeight: 1.3, letterSpacing: "-0.02em"
            }}>
              And Red Flag AI Pro was born.
            </p>
          </div>

        </div>
      </section>

      {/* WHAT I WANT FOR YOU */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>What I want for you</p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            When you use Red Flag AI Pro, I want you to feel something most people never feel when they&apos;re buying or selling online:{" "}
            <span style={{ color: "white", fontWeight: 700 }}>genuine freedom and safety.</span>{" "}
            The confidence that what you&apos;re putting out into the world is clean, honest and legal. The confidence that what you&apos;re buying is what it says it is.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "2rem" }}>
            I want to empower people. Buyers and sellers alike.
          </p>

          <p style={{ ...syne, fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.9 }}>
            This is the beginning. There is so much more to come — tools, platforms, and projects all built around one simple idea:{" "}
            <span style={{ color: "white", fontWeight: 700 }}>using AI for good.</span>
          </p>

          {/* Signature */}
          <div style={{
            marginTop: "4rem",
            paddingTop: "3rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "flex-start", gap: "2rem"
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "linear-gradient(135deg, #cc0000, #0f0505)",
              border: "1px solid rgba(239,68,68,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <span style={{ ...syne, fontSize: "18px", fontWeight: 800, color: "white" }}>J</span>
            </div>
            <div>
              <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white" }}>James Stokes</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Founder, Red Flag AI Pro</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Bristol, UK</p>
            </div>
          </div>

        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section style={{
        padding: "6rem 1.5rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(204,0,0,0.06) 0%, transparent 60%)"
        }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{
            ...syne, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontStyle: "italic", fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6
          }}>
            &ldquo;What&apos;s normal for the spider is chaos for the fly.&rdquo;
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 1.5rem", background: "#0a0a0a" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Try it free</p>
          </div>
          <h2 style={{ ...syne, fontSize: "2.5rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            See what we find.
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            24 risk categories. 5 jurisdictions. 60 seconds. No credit card.
          </p>
          <a href="/#demo" style={{
            display: "inline-block",
            background: "#cc0000", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700,
            padding: "14px 36px", borderRadius: "9999px",
            boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
            textDecoration: "none", letterSpacing: "0.02em"
          }}>
            Start your free scan
          </a>
          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>The Red Flag — Weekly Compliance Briefing</p>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>Real violations. Real fines. Free every week.</p>
            <a href="https://the-red-flag.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block",
              border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444",
              ...syne, fontSize: "11px", fontWeight: 700,
              padding: "8px 20px", borderRadius: "9999px",
              textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" as const
            }}>
              Subscribe free
            </a>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/" style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>
              ← Back to Red Flag AI Pro
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
