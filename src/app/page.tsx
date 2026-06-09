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
    "The world's only compliance scanner that protects buyers and sellers across 9 jurisdictions. 26 risk categories including EU AI Act Article 50, FTC AI Guidelines and GDPR Article 22. Scan marketing copy for violations in 60 seconds.",
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
      description: "10 scans per month, 26 risk categories, PDF reports, scan history",
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
      description: "All 26 categories, YouTube VSL scanning, audio transcription, team seats, white-label PDF reports, URL monitoring",
    },
  ],
};

const FEATURES = [
  // --- BUYER SIDE ---
  {
    icon: "🛡️",
    title: "Verify Before You Buy",
    description:
      "Paste any ad, sales page or VSL you are considering buying from. Know if the claims are legal before you hand over your money. Free — no signup needed.",
  },
  {
    icon: "🚨",
    title: "Spot Fake Urgency and Fake Scarcity",
    description:
      "That countdown timer and limited spots claim — find out if it is real or manufactured pressure. Fake urgency is specifically illegal under EU DSA and CMA rules.",
  },
  {
    icon: "📋",
    title: "Catch Contract Contradictions",
    description:
      "Spots the gap between what the sales page promises and what the Terms of Service actually delivers — before you screenshot it too late and lose your money.",
  },
  {
    icon: "📊",
    title: "0–100 Compliance Score",
    description:
      "One number tells you exactly how safe an offer is — or how safe your copy is to publish. Green means go. Red means stop. Every flag in plain English with a fix.",
  },
  // --- SELLER / FOUNDER / AGENCY SIDE ---
  {
    icon: "🚩",
    title: "Know Your Risk Before You Spend on Ads",
    description:
      "Stop paying to amplify illegal copy. Red Flag AI Pro surfaces income claims, health claims, fake urgency and FTC red flags before your campaign goes live.",
  },
  {
    icon: "💡",
    title: "Compliant Rewrites Included",
    description:
      "Every flag comes with a concrete, compliant rewrite. No lawyer, no guesswork, no waiting. Fix it in the same session you found it.",
  },
  {
    icon: "🌐",
    title: "Scan Any Live URL",
    description:
      "Paste a URL and we fetch the live page and scan what is actually published — not what you think is there. Works on sales pages, landing pages, product pages.",
  },
  {
    icon: "🎬",
    title: "YouTube VSL and Audio Scanning",
    description:
      "Paste a YouTube URL and we fetch the transcript automatically. Or upload an audio file and Whisper transcribes it first. Every word scanned against all 26 risk categories.",
  },
  {
    icon: "🔍",
    title: "Full Site Audit",
    description:
      "Enter a domain and we find the sitemap, scan every page, and rank them by risk. Audit a new client's entire website in under two minutes on day one.",
  },
  {
    icon: "📡",
    title: "Weekly Auto-Monitoring",
    description:
      "Add URLs to monitoring and we rescan them every Monday. Email digest lands in your inbox if anything changes. Know about new compliance issues before anyone complains.",
  },
  {
    icon: "🏢",
    title: "Client Workspaces and Auto-Reports",
    description:
      "Organise scans by client. Each workspace shows scan history, score trends and compliance records. Weekly reports sent automatically to your client contacts.",
  },
  {
    icon: "📥",
    title: "White-Label PDF Reports",
    description:
      "Download compliance reports under your agency name. Set it once in Settings — every PDF shows your branding. Clients see your name on the certificate, not ours.",
  },
  {
    icon: "⚡",
    title: "Zapier, Webhooks and REST API",
    description:
      "Every scan fires a webhook to any URL. Connect Zapier, Make, Slack or your own system in minutes. REST API with full docs at /docs lets you embed scanning in your own tools.",
  },
  {
    icon: "🧩",
    title: "Chrome Extension",
    description:
      "Scan any page without leaving your browser. Click the icon, see the score and top flags in seconds. No copy-paste, no tab-switching. Sentinel users only.",
  },
  {
    icon: "🔗",
    title: "Embeddable Compliance Badge and Sharing",
    description:
      "A live SVG badge agencies embed on client sites as verifiable proof of review. Share any scan with a public link — clients see the full report without an account.",
  },
  {
    icon: "🕓",
    title: "Compliance Changelog",
    description:
      "Compare any two scans side by side. Score delta, new flags, resolved flags, what still needs fixing — with the suggested rewrite for every issue.",
  },
];

const SCAN_CATEGORIES = [
  { icon: "💰", label: "Income Claims" },
  { icon: "❤️", label: "Health Claims" },
  { icon: "⏱️", label: "Fake Urgency" },
  { icon: "🎭", label: "Dark Patterns" },
  { icon: "🕵️", label: "Hidden Fees" },
  { icon: "⭐", label: "Fake Reviews" },
  { icon: "🔒", label: "Data Privacy" },
  { icon: "📧", label: "Email Compliance" },
  { icon: "⚖️", label: "Comparative Advertising" },
  { icon: "📋", label: "Contract Contradictions" },
  { icon: "🛡️", label: "Missing Disclaimers" },
  { icon: "🤝", label: "Unverified Testimonials" },
  { icon: "🤖", label: "AI Content Disclosure" },
  { icon: "📢", label: "AI Endorsement Violations" },
  { icon: "⚙️", label: "Automated Decisions" },
  { icon: "🏦", label: "FCA Financial Promotions" },
  { icon: "🌿", label: "Greenwashing" },
  { icon: "🔄", label: "Subscription Traps" },
  { icon: "📣", label: "Influencer Disclosure" },
  { icon: "💳", label: "Misleading Guarantees" },
  { icon: "🌍", label: "GDPR & Data Law" },
];

const AI_CATEGORIES = [
  { icon: "🤖", label: "AI Content Disclosure", tag: "EU AI Act Art. 50" },
  { icon: "📢", label: "AI Endorsement Violations", tag: "FTC AI Guidelines" },
  { icon: "⚙️", label: "Automated Decision Making", tag: "GDPR Article 22" },
];

const PERSONAS = [
  // Buyers
  { icon: "🛡️", label: "Online Shoppers", desc: "Checking if an offer is legitimate before buying. Paste any ad — know in 60 seconds if the claims are legal." },
  { icon: "📚", label: "Course Buyers", desc: "Verifying income claims and guarantees before investing in a programme. Free, no account needed." },
  { icon: "💸", label: "Anyone Who's Been Ripped Off Before", desc: "Paste any sales page you are unsure about. We flag exactly what is illegal and why." },
  // Sellers and founders
  { icon: "🏢", label: "Marketing Agencies", desc: "Client workspaces, team seats, white-label PDFs, auto-monitoring and Zapier — compliance as a service." },
  { icon: "🎓", label: "Course Creators", desc: "Income claims, testimonials and guarantees checked across FTC, ASA, ACCC and CASL before you spend on ads." },
  { icon: "🎯", label: "Coaches Running VSLs", desc: "YouTube transcript fetching and audio transcription. Scan every word of your VSL before it goes live." },
  { icon: "💻", label: "SaaS Founders", desc: "Free trial terms, subscription language, data collection and pricing claims — all checked before ads run." },
  { icon: "🛒", label: "Ecommerce Brands", desc: "Product claims, sustainability assertions and pricing language checked across 9 jurisdictions simultaneously." },
  { icon: "🏦", label: "FCA-Regulated Businesses", desc: "Financial promotions checked against FCA rules before publication. Signed PDF certificates as audit evidence." },
];

const TICKER_ITEMS = [
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
  "EU AI Act", "FCA", "FSMA 2000", "EU Green Claims", "PECR", "MHRA", "TGA", "ESMA", "ASIC",
  "FTC Negative Option Rule", "CMA Green Claims Code", "FTC Green Guides", "BCAP Code", "OSC",
  "FTC", "GDPR", "ASA", "CMA", "ACCC", "CASL", "ICO", "UCPD", "DSA", "PIPEDA", "ACL", "FDA", "CAN-SPAM",
  "EU AI Act", "FCA", "FSMA 2000", "EU Green Claims", "PECR", "MHRA", "TGA", "ESMA", "ASIC",
  "FTC Negative Option Rule", "CMA Green Claims Code", "FTC Green Guides", "BCAP Code", "OSC",
];

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


      {/* ── Newsletter CTA ── */}
      <section style={{
        background: "#0f0505",
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
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem"}}>
            Weekly compliance updates.<br />Free. In plain English.
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "2rem"}}>
            Real violations. Real fines. What&apos;s changing in advertising law and what it means for your copy. Every week.
          </p>
          <a href="https://the-red-flag.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block",
            background: "#cc0000", color: "white",
            fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700,
            padding: "13px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 24px rgba(204,0,0,0.3)",
            textDecoration: "none", letterSpacing: "0.02em"
          }}>
            Subscribe free
          </a>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>One email a week. Real cases, real fines, no fluff — unsubscribe in one click.</p>
        </div>
      </section>

      {/* Who is this for — slim teaser */}
      <section style={{background: "#080808", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Who it is for</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "1rem"}}>If you buy or sell online, this was built for you.</h2>
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

      {/* Features + scan categories teaser */}
      <section style={{background: "#050505", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>What we scan for</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "1rem"}}>26 categories. 9 jurisdictions. Both sides.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "2rem", lineHeight: 1.7}}>Income claims, fake urgency, health claims, GDPR, FCA, greenwashing, influencer disclosure, AI law — scanned simultaneously against every major market.</p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2rem"}}>
            {["Income Claims", "Fake Urgency", "Health Claims", "Testimonial Law", "GDPR", "FCA Compliance", "Greenwashing", "Influencer Disclosure", "EU AI Act", "VSL Scanning", "URL Scanning", "26 total categories"].map((label) => (
              <span key={label} style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 600, color: label === "26 total categories" ? "#ef4444" : "rgba(255,255,255,0.5)", border: `1px solid ${label === "26 total categories" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`, padding: "6px 14px", borderRadius: "9999px"}}>{label}</span>
            ))}
          </div>
          <div style={{display: "flex", gap: "2rem", flexWrap: "wrap"}}>
            <Link href="/features" style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "#ef4444", textDecoration: "none", letterSpacing: "0.04em"}}>
              Explore all features and categories →
            </Link>
            <Link href="/tools/compliance-checklist" style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.04em"}}>
              Free compliance checklist →
            </Link>
          </div>
        </div>
      </section>



      {/* Testimonials placeholder */}
      <section style={{background: "#050505", padding: "5rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>What people say</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "4rem"}}>Real results from real scans.</h2>

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

      {/* Toolkit teaser — replaces full calculator */}
      <section style={{background: "#080808", padding: "6rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem"}}>Free with every account</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "1rem"}}>Your compliance toolkit. Included free.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem"}}>
            Sign up free and unlock 9 compliance tools — risk calculators, disclaimer generator, testimonial checker, email compliance, refund rights checker and more. No scan credits used. Always free.
          </p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2.5rem"}}>
            {["Risk Calculator", "Disclaimer Generator", "Testimonial Checker", "Email Compliance", "Urgency Validator", "Health Claim Rater", "Red Flag Checklist", "Refund Rights", "Influencer Disclosure"].map((t) => (
              <span key={t} style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: "9999px"}}>
                {t}
              </span>
            ))}
          </div>
          <Link href="/signup" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none"}}>
            Create free account — unlock toolkit →
          </Link>
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

      {/* Email lead magnet — premium dark */}
      <section style={{background: "#050505", padding: "4rem 1.5rem"}}>
        <div style={{maxWidth: "700px", margin: "0 auto", textAlign: "center"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Free download</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "1rem"}}>
            The 16-Point Marketing Compliance Checklist
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "500px", margin: "0 auto 2.5rem"}}>
            Every compliance check you need before you launch. Every red flag to look for before you buy. Free. No spam.
          </p>
          <Link href="/blog/marketing-compliance-checklist-2026" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "#cc0000", color: "white",
            fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700,
            padding: "14px 32px", borderRadius: "9999px",
            boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
            textDecoration: "none"
          }}>
            Get the free checklist
          </Link>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>No account needed. Instant access.</p>
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


      {/* Sentinel teaser — slim */}
      <section style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0010 50%, #0a0a0a 100%)",
        padding: "6rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{maxWidth: "600px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem"}}>Sentinel — enterprise compliance</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "1rem"}}>Built for agencies and regulated businesses.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem"}}>Human review logs, legal timestamps, signed PDF certificates, FCA financial promotions, greenwashing checks and a 3-year audit trail.</p>
          <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
            <Link href="/sentinel" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 700, padding: "12px 28px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none"}}>Learn about Sentinel</Link>
            <a href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry" style={{display: "inline-flex", alignItems: "center", fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 28px", borderRadius: "9999px", textDecoration: "none"}}>Get in touch</a>
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
