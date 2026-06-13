﻿﻿﻿﻿import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { HeroNew } from "@/components/marketing/HeroNew";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { DemoScanner } from "@/components/marketing/DemoScanner";
import { ScanCounter } from "@/components/marketing/ScanCounter";
import { StickyCTA } from "@/components/marketing/StickyCTA";

export const metadata: Metadata = {
  title: "Red Flag AI Pro — Spot Illegal Ads. Scan Your Copy. Free in 60 Seconds.",
  description:
    "Buyers: paste any ad and find out in 60 seconds if it is breaking the law. Sellers: scan your copy for FTC, GDPR, ASA, ACCC, CASL, LGPD, DPDP, PDPA and UAE PDPL violations and get a plain English fix. Free. No account needed. The world's only 9-jurisdiction AI compliance scanner protecting both sides.",
  alternates: { canonical: "https://www.redflagaipro.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Red Flag AI Pro",
  url: "https://www.redflagaipro.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "The world's only compliance scanner that protects buyers and sellers across 9 jurisdictions. 28 risk categories including EU AI Act Article 50, FTC AI Guidelines and GDPR Article 22. Scan marketing copy for violations in 60 seconds.",
  offers: [
    {
      "@type": "Offer",
      name: "Free Demo",
      price: "0",
      priceCurrency: "GBP",
      description: "Try the demo scanner free, no signup required",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "29",
      priceCurrency: "GBP",
      description: "10 scans per month, 16 risk categories, PDF reports, scan history",
    },
    {
      "@type": "Offer",
      name: "Growth Plan",
      price: "199",
      priceCurrency: "GBP",
      description: "Unlimited scans, URL scanning, VSL script scanning, site audit, client workspaces",
    },
    {
      "@type": "Offer",
      name: "Sentinel Plan",
      price: "999",
      priceCurrency: "GBP",
      description: "All 28 categories, YouTube VSL scanning, audio transcription, team seats, white-label PDF reports, URL monitoring",
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StickyCTA />
      <ExitIntent />
      <Navbar />

      <HeroNew />
      <DemoScanner />


      {/* Who is this for — slim teaser */}
      <section style={{background: "#080808", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Who it is for</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>If you buy or sell online, this was built for you.</h2>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2rem"}}>
            {["Online Shoppers", "Course Buyers", "Anyone Who's Been Ripped Off", "Marketing Agencies", "Course Creators", "Coaches Running VSLs", "SaaS Founders", "Ecommerce Brands", "FCA-Regulated Businesses"].map((label) => (
              <span key={label} style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: "9999px"}}>{label}</span>
            ))}
          </div>
          <Link href="/features" style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "#ef4444", textDecoration: "none", letterSpacing: "0.04em"}}>
            See how it works for your use case →
          </Link>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section style={{background: "#050505", padding: "5rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>What people say</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>Real results from real scans.</h2>

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px"}}>
            {[
              {
                quote: "Scanned my sales page and found four things I didn't know were illegal. Fixed them all in 20 minutes before the campaign went live.",
                name: "Course creator",
                location: "Bristol, UK",
              },
              {
                quote: "We use it on every client campaign before it goes live. The signed certificate means we have a paper trail if anything ever comes back.",
                name: "Marketing agency owner",
                location: "London, UK",
              },
              {
                quote: "Checked a course I was about to buy for £2,000. It flagged three income claim violations. Saved me the money and the disappointment.",
                name: "Online buyer",
                location: "Manchester, UK",
              },
            ].map((t, i) => (
              <div key={t.name} style={{
                background: i % 2 === 0 ? "#0f0505" : "#0f0f0f",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)"}`,
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px"
              }}>
                {/* Large opening quote mark */}
                <div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "4rem",
                    color: "#ef4444",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                    opacity: 0.4
                  }}>&ldquo;</p>
                  <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.85)",
                    fontStyle: "italic",
                    marginBottom: "2rem"
                  }}>{t.quote}</p>
                </div>
                <div style={{borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem"}}>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "white"}}>{t.name}</p>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px"}}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "2rem"}}>Names withheld at request. Results typical of users who act on the suggested fixes.</p>
        </div>
      </section>

      {/* Founder story teaser — full width cinematic */}
      <section style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)",
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(239,68,68,0.1)",
        borderBottom: "1px solid rgba(239,68,68,0.1)"
      }}>
        {/* Background text */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", pointerEvents: "none"
        }}>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(4rem, 15vw, 14rem)",
            fontWeight: 800, color: "rgba(239,68,68,0.04)", letterSpacing: "-0.04em",
            whiteSpace: "nowrap", userSelect: "none"
          }}>BUILT FROM PAIN</p>
        </div>

        <div style={{maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1}}>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 700, color: "white",
            letterSpacing: "-0.02em", lineHeight: 1.3,
            marginBottom: "2rem"
          }}>
            Built alone, from a laptop,<br />
            <span style={{color: "#ef4444", fontStyle: "italic"}}>after a life that gave every reason not to.</span>
          </p>
          <Link href="/about" style={{
            fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)", textDecoration: "none",
            borderBottom: "1px solid rgba(239,68,68,0.4)",
            paddingBottom: "2px",
            transition: "color 0.2s"
          }}>
            Read the story
          </Link>
        </div>
      </section>

      {/* Either Way You Win + Final CTA — combined knockout closer */}
      <section style={{background: "#050505", padding: "4rem 1.5rem", position: "relative", overflow: "hidden"}}>

        {/* Massive background text */}
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(4rem, 18vw, 18rem)", fontWeight: 900, color: "rgba(239,68,68,0.03)", letterSpacing: "-0.04em", whiteSpace: "nowrap", userSelect: "none"}}>NO LOSE</p>
        </div>

        <div style={{maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Either way, you win</p>

          {/* Big statement + CTA first */}
          <div style={{textAlign: "center", marginBottom: "2.5rem"}}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800, color: "white",
              letterSpacing: "-0.03em", lineHeight: 1.1,
              marginBottom: "3rem"
            }}>
              There is no losing scenario.
            </p>
            <a href="/#demo" style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              background: "#cc0000", color: "white",
              fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700,
              padding: "16px 40px", borderRadius: "9999px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 16px 48px rgba(204,0,0,0.45)",
              textDecoration: "none"
            }}>
              Scan my copy free
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", fontSize: "14px"
              }}>→</span>
            </a>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>
              No signup · No credit card · Results in 60 seconds
            </p>
          </div>

          {/* Four statements — proof below */}
          <div style={{display: "flex", flexDirection: "column", gap: "0"}}>
            {[
              { who: "Buyer", outcome: "Scan comes back clean", result: "Buy with total confidence knowing the ad is legitimate." },
              { who: "Seller", outcome: "Scan finds nothing", result: "Launch with total confidence knowing your copy is clean." },
              { who: "Buyer", outcome: "Scan flags something", result: "You just saved yourself from losing money to an illegal ad." },
              { who: "Seller", outcome: "Scan finds something", result: "You just avoided a fine, a chargeback, or a takedown that could cost thousands." },
            ].map((item, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "160px 1fr",
                gap: "2rem", padding: "2rem 0",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                alignItems: "start"
              }}>
                <div>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ef4444", marginBottom: "4px"}}>{item.who}</p>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)"}}>{item.outcome}</p>
                </div>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "white", lineHeight: 1.5}}>{item.result}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Affiliate — full section */}
      <section style={{background: "#cc0000", padding: "5rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden"}}>
        <div style={{position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "900px", height: "400px", background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 65%)", pointerEvents: "none"}} />
        <div style={{maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 1}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "1.25rem"}}>Affiliate Programme</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem"}}>
            Get paid every month<br />for a link you share once.
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.7}}>
            25% recurring commission. One Sentinel referral = <strong style={{color: "white"}}>£250 every month</strong>. Free to join. No approval process.
          </p>
          <div style={{display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem"}}>
            {[["25%", "Recurring commission"], ["£250/mo", "Per Sentinel referral"], ["90 days", "Cookie window"], ["Free", "To join"]].map(([val, label]) => (
              <div key={label} style={{textAlign: "center"}}>
                <p style={{fontFamily: "'DM Mono', monospace", fontSize: "1.75rem", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: "4px"}}>{val}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.1em"}}>{label}</p>
              </div>
            ))}
          </div>
          <Link href="/affiliates" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "white", color: "#cc0000", fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, padding: "14px 40px", borderRadius: "9999px", textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.2)"}}>
            Join the programme →
          </Link>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "1rem"}}>Free to join · No monthly fee · Powered by Tolt</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4rem 1.5rem 3rem", textAlign: "center"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>

          {/* Newsletter footer signup */}
          <div style={{marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "0.5rem"}}>The Red Flag — Weekly Compliance Briefing</p>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "1rem"}}>Real violations. Real fines. Free every week.</p>
            <a href="https://the-red-flag.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block",
              border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444",
              fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700,
              padding: "8px 20px", borderRadius: "9999px",
              textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase"
            }}>
              Subscribe free
            </a>
          </div>

          {/* Badges */}
          <div style={{marginBottom: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", opacity: 0.7}}>
            <a href="https://www.producthunt.com/products/red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
              <img alt="Red Flag AI Pro on Product Hunt" width="200" height="44" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1151061&theme=dark&t=1779869402522" />
            </a>
            <a href="https://peerpush.net/p/red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
              <img src="https://peerpush.net/p/red-flag-ai-pro/badge.png" alt="Red Flag AI Pro on PeerPush" style={{width: "180px"}} />
            </a>
            <a href="https://peerpush.net/p/red-flag-ai-pro" target="_blank" rel="noopener noreferrer">
              <img src="https://peerpush.net/p/red-flag-ai-pro/rating-badge.png" alt="Red Flag AI Pro rating on PeerPush" style={{width: "280px"}} />
            </a>
          </div>

          {/* Nav links */}
          <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 32px", marginBottom: "2rem"}}>
            {[
              { label: "Pricing", href: "/pricing" },
              { label: "Log in", href: "/login" },
              { label: "Sign up", href: "/signup" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none"}}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.15)", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: "600px", margin: "0 auto 1.5rem"}}>
            FTC · CMA · ASA · ICO · ACCC · CASL · GDPR · UCPD compliance scanner for marketing funnels, sales pages, and email sequences.
          </p>

          <div style={{borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)"}}>
              © {new Date().getFullYear()} Red Flag AI Pro. All rights reserved.
            </p>
            <span style={{color: "rgba(255,255,255,0.1)", fontSize: "10px"}}>·</span>
            <a href="mailto:support@redflagaipro.com" style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "#ef4444", textDecoration: "none"}}>
              support@redflagaipro.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
