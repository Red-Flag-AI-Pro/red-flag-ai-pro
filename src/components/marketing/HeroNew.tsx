﻿"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// Syne is now loaded globally via layout.tsx — no CDN import needed

export function HeroNew() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      <div className="urgency-bar" style={{background: "#b91c1c", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
        <p className="py-2.5 px-4 text-center text-xs font-medium text-white/90 tracking-wide">
          <span className="urgency-text-full">
            EU AI Act Article 50 enforcement begins August 2026. AI generated marketing copy must be disclosed.{" "}
          </span>
          <span className="urgency-text-short">EU AI Act enforcement begins Aug 2026.{" "}</span>
          <Link href="/blog/eu-ai-act-article-50-marketing-agencies" className="font-bold underline underline-offset-2 hover:no-underline">
            Learn more
          </Link>
        </p>
      </div>

      {/* ── Ticker — decorative, hidden on mobile to save fold space ── */}
      <div className="hero-ticker-wrap" style={{background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", padding: "14px 0"}}>
        <div className="ticker-track">
          {["FTC","GDPR","ASA","CMA","ACCC","CASL","ICO","UCPD","DSA","PIPEDA","ACL","FDA","CAN SPAM","EU AI Act","FCA","FSMA 2000","EU Green Claims","PECR","MHRA","TGA","ESMA","ASIC","FTC Negative Option Rule","CMA Green Claims Code","FTC Green Guides","BCAP Code",
            "FTC","GDPR","ASA","CMA","ACCC","CASL","ICO","UCPD","DSA","PIPEDA","ACL","FDA","CAN SPAM","EU AI Act","FCA","FSMA 2000","EU Green Claims","PECR","MHRA","TGA","ESMA","ASIC","FTC Negative Option Rule","CMA Green Claims Code","FTC Green Guides","BCAP Code"].map((item, i) => (
            <span key={i} style={{color: "#ef4444", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 24px", fontFamily: "'Syne', sans-serif"}}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section" style={{
        background: "#0A1628",
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
          <div className="hero-eyebrow animate-fade-in delay-1" style={{marginBottom: "2rem"}}>
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
              <span className="hero-eyebrow-text-full">Marketing Compliance · 9 Jurisdictions · 30 Risk Categories</span>
              <span className="hero-eyebrow-text-short">9 Jurisdictions · 30 Risk Categories</span>
            </span>
          </div>

          {/* Headline — sequential stacked reveal */}
          <h1 className="hero-headline" style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "2.5rem",
            fontFamily: "'Syne', system-ui, sans-serif"
          }}>
            <span className="hero-line-1" style={{
              display: "block",
              color: "white"
            }}>
              Building it.
            </span>
            <span className="hero-line-2" style={{
              display: "block",
              color: "rgba(255,255,255,0.85)"
            }}>
              Buying it.
            </span>
            <span className="hero-line-3" style={{
              display: "block",
              background: "linear-gradient(135deg, #fca5a5 0%, #ef4444 45%, #b91c1c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic"
            }}>
              Scan it!
            </span>
          </h1>

          {/* Everything below fades in after "Scan it." */}
          {/* Subheadline */}
          <p className="hero-subheadline hero-rest" style={{
            maxWidth: "560px", margin: "0 auto 2.5rem",
            fontSize: "1.25rem", lineHeight: 1.6, fontWeight: 500,
            fontFamily: "'Syne', system-ui, sans-serif",
            letterSpacing: "-0.01em"
          }}>
            <span style={{color: "rgba(255,255,255,0.8)"}}>30 risk categories. 9 jurisdictions.</span>
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
            }}>See exactly what regulators would flag, before they do.</span>
          </p>

          {/* CTA — single primary action; everything else demoted below the fold */}
          <div className="hero-rest-1" style={{
            display: "flex", flexWrap: "wrap",
            gap: "14px", justifyContent: "center", marginBottom: "1rem"
          }}>
            <a href="#demo" className="btn-primary" style={{fontSize: "1rem", padding: "14px 32px", fontFamily: "'Syne', sans-serif", fontWeight: 600}}>
              Scan my copy free
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", fontSize: "14px"
              }}>↓</span>
            </a>
          </div>

          {/* Secondary action — demoted to a plain text link */}
          <div className="hero-rest-2" style={{
            display: "flex", justifyContent: "center", marginBottom: "1.5rem"
          }}>
            <Link href="/signup" style={{
              fontSize: "13px", fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Syne', sans-serif",
              textDecoration: "none",
              letterSpacing: "0.02em"
            }}>
              Already know what you need? Create a free account →
            </Link>
          </div>

          {/* Fine print */}
          <p className="hero-fineprint hero-rest-3" style={{
            fontSize: "13px", color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em", marginBottom: "4rem",
            fontFamily: "'Syne', sans-serif"
          }}>
            No credit card · No signup needed · Results in 60 seconds · 14 day money back guarantee
          </p>

          {/* Jurisdiction flags — hidden on mobile */}
          <div className="hero-flags-row hero-rest-4" style={{
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
          <div className="hero-stats-row hero-rest-5" style={{
            flexWrap: "wrap",
            gap: "8px 32px", justifyContent: "center", alignItems: "center"
          }}>
            {[
              "30 risk categories",
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
        background: "#0D1B2E", borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 16px"
      }}>
        <div style={{maxWidth: "900px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "8px 40px", justifyContent: "center", alignItems: "center"}}>
          {[
            "No data stored",
            "Results in 60 seconds",
            "FTC · GDPR · ASA · FCA · ACCC · CASL",
            "14 day money back guarantee",
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

      {/* ── Done-for-you audit — demoted secondary CTA ── */}
      <div style={{background: "#0C1929", padding: "12px 16px", textAlign: "center"}}>
        <Link href="/audit" style={{
          fontSize: "12px", fontWeight: 600,
          color: "rgba(251,191,36,0.7)",
          fontFamily: "'Syne', sans-serif",
          textDecoration: "none",
          letterSpacing: "0.02em"
        }}>
          Rather have a human do it? Done For You Audit: £97 →
        </Link>
      </div>

    </div>
  );
}
