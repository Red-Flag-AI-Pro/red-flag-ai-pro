﻿"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Syne is now loaded globally via layout.tsx — no CDN import needed

export function HeroNew() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [rest, setRest] = useState(false);

  // Stacked headline reveal — each line phases in sequentially
  useEffect(() => {
    const t1 = setTimeout(() => setLine1(true), 300);
    const t2 = setTimeout(() => setLine2(true), 800);
    const t3 = setTimeout(() => setLine3(true), 1400);
    const t4 = setTimeout(() => setRest(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* ── Urgency bar ── */}
      <div style={{background: "#b91c1c", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
        <p className="py-2.5 px-4 text-center text-xs font-medium text-white/90 tracking-wide">
          EU AI Act Article 50 enforcement begins August 2026 — AI-generated marketing copy must be disclosed.{" "}
          <Link href="/blog/eu-ai-act-article-50-marketing-agencies" className="font-bold underline underline-offset-2 hover:no-underline">
            Learn more
          </Link>
        </p>
      </div>

      {/* ── Ticker ── */}
      <div style={{background: "#050505", borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", padding: "14px 0"}}>
        <div className="ticker-track">
          {["FTC","GDPR","ASA","CMA","ACCC","CASL","ICO","UCPD","DSA","PIPEDA","ACL","FDA","CAN-SPAM","EU AI Act","FCA","FSMA 2000","EU Green Claims","PECR","MHRA","TGA","ESMA","ASIC","FTC Negative Option Rule","CMA Green Claims Code","FTC Green Guides","BCAP Code",
            "FTC","GDPR","ASA","CMA","ACCC","CASL","ICO","UCPD","DSA","PIPEDA","ACL","FDA","CAN-SPAM","EU AI Act","FCA","FSMA 2000","EU Green Claims","PECR","MHRA","TGA","ESMA","ASIC","FTC Negative Option Rule","CMA Green Claims Code","FTC Green Guides","BCAP Code"].map((item, i) => (
            <span key={i} style={{color: "#ef4444", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 24px", fontFamily: "'Syne', sans-serif"}}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section" style={{
        background: "#050505",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}>

        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(185,28,28,0.35) 0%, transparent 65%)"
        }} />

        {/* Secondary glow */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: "40%", height: "50%", pointerEvents: "none",
          background: "radial-gradient(ellipse at 100% 100%, rgba(185,28,28,0.12) 0%, transparent 60%)"
        }} />

        {/* Grain — fixed overlay */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />

        <div style={{maxWidth: "1100px", margin: "0 auto", width: "100%", textAlign: "center", position: "relative", zIndex: 1}}>

          {/* Eyebrow */}
          <div className="animate-fade-in delay-1" style={{marginBottom: "2rem"}}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(185,28,28,0.1)", border: "1px solid rgba(185,28,28,0.25)",
              borderRadius: "9999px", padding: "8px 20px",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#fca5a5",
              fontFamily: "'Syne', sans-serif"
            }}>
              <span className="flag-wave" style={{display: "inline-block"}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                </svg>
              </span>
              Marketing Compliance · 9 Jurisdictions · 26 Risk Categories
            </span>
          </div>

          {/* Headline — sequential stacked reveal */}
          <h1 style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "2.5rem",
            fontFamily: "'Syne', system-ui, sans-serif"
          }}>
            <span style={{
              display: "block",
              color: "white",
              opacity: line1 ? 1 : 0,
              transform: line1 ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)"
            }}>
              Building it.
            </span>
            <span style={{
              display: "block",
              color: "rgba(255,255,255,0.85)",
              opacity: line2 ? 1 : 0,
              transform: line2 ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)"
            }}>
              Buying it.
            </span>
            <span style={{
              display: "block",
              background: "linear-gradient(135deg, #fca5a5 0%, #ef4444 45%, #b91c1c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
              opacity: line3 ? 1 : 0,
              transform: line3 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)"
            }}>
              Scan it!
            </span>
          </h1>

          {/* Everything below fades in after "Scan it." */}
          {/* Subheadline */}
          <p className="hero-subheadline" style={{
            opacity: rest ? 1 : 0,
            transform: rest ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            maxWidth: "560px", margin: "0 auto 2.5rem",
            fontSize: "1.25rem", lineHeight: 1.6, fontWeight: 500,
            fontFamily: "'Syne', system-ui, sans-serif",
            letterSpacing: "-0.01em"
          }}>
            <span style={{color: "rgba(255,255,255,0.8)"}}>26 risk categories. 9 jurisdictions.</span>
            <br />
            <span style={{color: "rgba(255,255,255,0.8)"}}>One paste box.</span>
            <br />
            <span style={{
              background: "linear-gradient(90deg, #fca5a5, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 600,
              fontSize: "1rem"
            }}>See exactly what regulators would flag — before they do.</span>
          </p>

          {/* CTAs */}
          <div style={{
            opacity: rest ? 1 : 0,
            transform: rest ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
            display: "flex", flexWrap: "wrap",
            gap: "14px", justifyContent: "center", marginBottom: "1.25rem"
          }}>
            <a href="#demo" className="btn-primary" style={{fontSize: "1rem", padding: "14px 32px", fontFamily: "'Syne', sans-serif", fontWeight: 600}}>
              Scan my copy free
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", fontSize: "14px"
              }}>↓</span>
            </a>
            <Link href="/signup" className="btn-secondary" style={{fontSize: "1rem", padding: "14px 32px", fontFamily: "'Syne', sans-serif", fontWeight: 500}}>
              Create free account
              <span>→</span>
            </Link>
          </div>

          {/* Fine print */}
          <p className="hero-fineprint" style={{
            opacity: rest ? 1 : 0,
            transition: "opacity 0.8s 0.2s",
            fontSize: "13px", color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em", marginBottom: "4rem",
            fontFamily: "'Syne', sans-serif"
          }}>
            No credit card · No signup needed · Results in 60 seconds · 14-day money-back guarantee
          </p>

          {/* Jurisdiction flags — hidden on mobile */}
          <div className="hero-flags-row" style={{
            opacity: rest ? 1 : 0,
            transition: "opacity 0.8s 0.3s",
            flexWrap: "wrap",
            gap: "48px", justifyContent: "center", marginBottom: "3rem"
          }}>
            {[
              { code: "us", country: "USA", regs: "FTC · FDA" },
              { code: "gb", country: "UK", regs: "CMA · ASA · FCA" },
              { code: "eu", country: "EU", regs: "GDPR · DSA" },
              { code: "au", country: "AUS", regs: "ACCC · TGA" },
              { code: "ca", country: "CAN", regs: "CASL · PIPEDA" },
              { code: "br", country: "BRA", regs: "LGPD" },
              { code: "in", country: "IND", regs: "DPDP 2023" },
              { code: "sg", country: "SGP", regs: "PDPA" },
              { code: "ae", country: "UAE", regs: "PDPL 2022" },
            ].map((j) => (
              <div key={j.country} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "10px",
                opacity: 1, transition: "opacity 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <div style={{width: "56px", height: "36px", overflow: "hidden", borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.6)"}}>
                  <img src={`https://flagcdn.com/w80/${j.code}.png`} alt={j.country} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
                <span style={{fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "white", fontFamily: "'Syne', system-ui, sans-serif"}}>{j.country}</span>
                <span style={{fontSize: "11px", color: "rgba(255,255,255,0.8)", fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.02em"}}>{j.regs}</span>
              </div>
            ))}
          </div>

          {/* Stats strip — hidden on mobile */}
          <div className="hero-stats-row" style={{
            opacity: rest ? 1 : 0,
            transition: "opacity 0.8s 0.4s",
            flexWrap: "wrap",
            gap: "8px 32px", justifyContent: "center", alignItems: "center"
          }}>
            {[
              "26 risk categories",
              "9 jurisdictions",
              "URL + VSL + site audit",
              "60 second results",
            ].map((s, i) => (
              <span key={s} style={{
                display: "flex", alignItems: "center", gap: "32px"
              }}>
                {i > 0 && <span style={{color: "rgba(255,255,255,0.15)", fontSize: "16px"}}>·</span>}
                <span style={{
                  fontSize: "14px", fontWeight: 500,
                  color: "#ef4444", fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.01em"
                }}>
                  {s}
                </span>
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── Trust bar ── */}
      <div style={{
        background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 16px"
      }}>
        <div style={{maxWidth: "900px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "8px 40px", justifyContent: "center", alignItems: "center"}}>
          {[
            "No data stored",
            "Results in 60 seconds",
            "FTC · GDPR · ASA · FCA · ACCC · CASL",
            "14-day money-back guarantee",
          ].map((t, i) => (
            <span key={t} style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "12px", fontWeight: 600,
              color: "#ef4444",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "0.04em", textTransform: "uppercase"
            }}>
              <span style={{width: "4px", height: "4px", borderRadius: "50%", background: "#ef4444", flexShrink: 0}} />
              {t}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
