﻿﻿﻿﻿import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { HeroNew } from "@/components/marketing/HeroNew";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { RiskCalculator } from "@/components/marketing/RiskCalculator";
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

const FINES = [
  {
    country: "USA",
    body: "FTC",
    fine: "Up to $50,000",
    detail: "per violation — per day",
    colour: "border-blue-200 bg-blue-50",
    textColour: "text-blue-700",
  },
  {
    country: "UK",
    body: "CMA / ASA",
    fine: "Up to £300,000",
    detail: "plus full campaign takedown",
    colour: "border-red-200 bg-red-50",
    textColour: "text-red-700",
  },
  {
    country: "EU",
    body: "GDPR",
    fine: "Up to €20 million",
    detail: "or 4% of global turnover",
    colour: "border-yellow-200 bg-yellow-50",
    textColour: "text-yellow-700",
  },
  {
    country: "Australia",
    body: "ACCC",
    fine: "Up to $50M AUD",
    detail: "per breach under ACL",
    colour: "border-green-200 bg-green-50",
    textColour: "text-green-700",
  },
  {
    country: "Canada",
    body: "CASL",
    fine: "Up to $10M CAD",
    detail: "per violation for businesses",
    colour: "border-orange-200 bg-orange-50",
    textColour: "text-orange-700",
  },
];

const FAQS = [
  {
    q: "Can I use this to check something before I buy it?",
    a: "Yes. Paste any sales page, ad or VSL you are considering. If it flags illegal claims, walk away. If it comes back clean, buy with confidence.",
  },
  {
    q: "I have been ripped off by misleading marketing before. Would this have caught it?",
    a: "In most cases yes. Fake scarcity, guaranteed results, income claims without proof — these are exactly what we scan for.",
  },
  {
    q: "Is this just another AI gimmick?",
    a: "Red Flag AI Pro is trained specifically on FTC enforcement actions, GDPR guidelines, and real compliance cases. Not generic marketing advice.",
  },
  {
    q: "What if my copy is already compliant?",
    a: "Then you get a green score and launch with total confidence. Either way you win.",
  },
  {
    q: "Do I need to know anything about compliance law?",
    a: "Zero. Every flag is explained in plain English with a suggested fix. No legal degree required.",
  },
  {
    q: "Why is there a free scan?",
    a: "Because once you see what it finds — whether in your own copy or in an ad you were about to buy from — you will never skip it again.",
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }) }}
      />
      <StickyCTA />
      <ExitIntent />
      <Navbar />

      <HeroNew />

      {/* Demo Scanner */}
      <DemoScanner />


      {/* Newsletter CTA */}
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

      {/* Pain section */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>

          {/* Section label */}
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#ef4444", marginBottom: "2rem"
          }}>
            The problem
          </p>

          {/* Main statement */}
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "white", marginBottom: "1.5rem"
          }}>
            The ad that just convinced you to buy
            <br />could be breaking the law.
            <br />
            <span style={{color: "#ef4444", fontStyle: "italic"}}>So could the one you just wrote.</span>
          </h2>

          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.1rem", lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "640px", marginBottom: "4rem"
          }}>
            Most people who get ripped off online are not stupid. Most sellers who break the rules are not scammers. Nobody tells you where the line is. Until you cross it.
          </p>

          {/* Violations — each as a bold statement */}
          <div style={{display: "flex", flexDirection: "column", gap: "0"}}>
            {[
              { claim: "That limited time offer", detail: "Countdown timers that reset are specifically illegal in the UK and EU." },
              { claim: "That six figure income claim", detail: "It can trigger a government fine even if it is true." },
              { claim: "That money back guarantee", detail: "If it contradicts the terms and conditions, it is a contract violation." },
              { claim: "That email list", detail: "Collecting emails without the right consent wording breaks Canadian and EU law." },
              { claim: "That number one claim", detail: "Without proof, it breaks advertising rules in every country we cover." },
            ].map((item, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                padding: "2rem 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                alignItems: "start"
              }}>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.3rem", fontWeight: 700,
                  color: "white", lineHeight: 1.2,
                  letterSpacing: "-0.02em"
                }}>
                  {item.claim}
                </p>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.15rem", lineHeight: 1.6,
                  color: "#fca5a5",
                  borderLeft: "3px solid #ef4444",
                  paddingLeft: "1.25rem",
                  fontWeight: 500
                }}>
                  {item.detail}
                </p>
              </div>
            ))}
            <div style={{
              padding: "2rem 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "1px solid rgba(255,255,255,0.06)"
            }}>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.1rem", fontWeight: 600,
                color: "#ef4444", letterSpacing: "0.01em"
              }}>
                Nobody needs intent. Regulators do not care if you did not know.
              </p>
            </div>
          </div>

          {/* Closing statement */}
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.5rem", fontWeight: 700,
            color: "white", marginTop: "3rem",
            letterSpacing: "-0.02em", lineHeight: 1.3
          }}>
            Red Flag AI Pro catches all of it before it costs you.
            <span style={{color: "rgba(255,255,255,0.4)", fontWeight: 400, display: "block", fontSize: "1rem", marginTop: "0.5rem"}}>
              In plain English. With exactly what to fix. In 60 seconds.
            </span>
          </p>

        </div>
      </section>

      {/* Before vs After */}
      <section style={{background: "#050505", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>

          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Real examples</p>

          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem"}}>
            Before you buy it. Before you build it.
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem"}}>
            Real flags. Both sides. See exactly what we find.
          </p>

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "2px"}}>

            {/* SELLER */}
            <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
              <div style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", flex: 1}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>For Sellers — Flagged Copy</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem"}}>
                  &ldquo;Join thousands of members who are making £5,000–£10,000 per month using our proven system. Results guaranteed or your money back — no questions asked.&rdquo;
                </p>
                <div style={{borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem"}}>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem"}}>Flags triggered</p>
                  <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.75rem"}}>
                    {["Income claim without disclaimer", "Unsubstantiated earnings", "Guarantee contradiction"].map((f) => (
                      <span key={f} style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 12px", fontSize: "11px", fontWeight: 600, color: "#fca5a5", fontFamily: "'Syne', sans-serif"}}>{f}</span>
                    ))}
                  </div>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(239,68,68,0.6)", fontWeight: 600}}>FTC · ASA · ACCC</p>
                </div>
              </div>

              <div style={{background: "#0a1a0a", border: "1px solid rgba(34,197,94,0.12)", padding: "2rem", flex: 1}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80", marginBottom: "1.5rem"}}>Compliant Rewrite</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem"}}>
                  &ldquo;Our members report a wide range of results. Some earn £5,000+ per month — individual results vary based on effort, experience, and market conditions. See our income disclaimer for full details.&rdquo;
                </p>
                <div style={{borderTop: "1px solid rgba(34,197,94,0.1)", paddingTop: "1.25rem"}}>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "rgba(74,222,128,0.7)", fontWeight: 600}}>Now compliant with FTC · CMA · ASA · ACCC · CASL</p>
                </div>
              </div>
            </div>

            {/* BUYER */}
            <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
              <div style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", flex: 1}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem"}}>For Buyers — Looks Legitimate</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem"}}>
                  &ldquo;Over 2,400 students have completed this programme. Our top performers report life-changing results. Enrol today and get our 30-day satisfaction guarantee — full refund if you do not see results within the first month.&rdquo;
                </p>
                <div style={{borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem"}}>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "#fbbf24"}}>Passed your gut check. Failed ours.</p>
                </div>
              </div>

              <div style={{background: "#110808", border: "1px solid rgba(239,68,68,0.12)", padding: "2rem", flex: 1}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>What We Found</p>
                <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                  {[
                    { flag: "Unverified social proof", detail: "2,400 students — no independent verification", reg: "FTC violation" },
                    { flag: "Vague results claim", detail: '"Life-changing results" — no data or disclaimer', reg: "ASA violation" },
                    { flag: "Conditional guarantee", detail: "Refund tied to results — contradicts UK statutory consumer rights", reg: "CMA violation" },
                    { flag: "Missing income disclaimer", detail: "Implied financial outcomes without mandatory disclosure", reg: "ACCC violation" },
                  ].map((item) => (
                    <div key={item.flag} style={{display: "flex", gap: "12px", alignItems: "flex-start"}}>
                      <span style={{color: "#ef4444", fontWeight: 700, fontSize: "14px", flexShrink: 0, marginTop: "2px"}}>✕</span>
                      <div>
                        <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "2px"}}>{item.flag}</p>
                        <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "2px"}}>{item.detail}</p>
                        <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "#ef4444", fontWeight: 600}}>{item.reg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div style={{textAlign: "center", marginTop: "3rem"}}>
            <Link href="/signup" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#cc0000", color: "white",
              fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700,
              padding: "14px 36px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
              transition: "all 0.2s"
            }}>
              Scan your copy free
            </Link>
          </div>

        </div>
      </section>

      {/* Fines & Penalties */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>The cost of getting it wrong</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem"}}>Real fines. Real losses. Both sides.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem"}}>All from the same illegal marketing copy.</p>

          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem"}}>What buyers lose</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px", marginBottom: "4rem"}}>
            {[
              { label: "Ecommerce", sub: "Misleading product claims", amount: "£200–£800", detail: "average loss per purchase" },
              { label: "Course buyers", sub: "Fake income claims", amount: "£500–£5k", detail: "average loss per course" },
              { label: "Health products", sub: "Unsubstantiated claims", amount: "£100–£2k", detail: "average loss per product" },
              { label: "Subscriptions", sub: "Hidden recurring charges", amount: "£300–£1.2k", detail: "average annual loss" },
            ].map((item) => (
              <div key={item.label} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem"}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px"}}>{item.label}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem"}}>{item.sub}</p>
                <p style={{fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "2.25rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px"}}>{item.amount}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)"}}>{item.detail}</p>
              </div>
            ))}
          </div>

          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem"}}>What sellers face</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", marginBottom: "2rem"}}>
            {FINES.map((f) => (
              <div key={f.country} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem"}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px"}}>{f.country}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem"}}>{f.body}</p>
                <p style={{fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "2rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px"}}>{f.fine}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)"}}>{f.detail}</p>
              </div>
            ))}
            <div style={{background: "#1a0505", border: "1px solid rgba(239,68,68,0.2)", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center"}}>
              <p style={{fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: "3rem", fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: "8px"}}>$6B+</p>
              <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)"}}>in marketing compliance fines globally in the last 3 years</p>
            </div>
          </div>

          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center"}}>Fine amounts based on published maximum penalties. Individual penalties vary. Not legal advice.</p>
        </div>
      </section>

      {/* AI Liability */}
      <section style={{background: "#050505", padding: "8rem 1.5rem", position: "relative", overflow: "hidden"}}>
        <div style={{position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse at center, rgba(185,28,28,0.15), transparent 70%)", pointerEvents: "none"}} />
        <div style={{maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>New threat — 2026</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem", lineHeight: 1.2}}>
            AI generated it.<br />That does not make it legal.
            <span style={{display: "block", color: "#ef4444", fontStyle: "italic"}}>Or safe to buy.</span>
          </h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", marginBottom: "4rem", maxWidth: "600px", lineHeight: 1.7}}>
            From January 2026, major insurers began adding AI exclusions to Professional Indemnity policies. AI-generated copy that breaches advertising law is now an <span style={{color: "white", fontWeight: 600}}>uninsured liability</span>.
          </p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", marginBottom: "3rem"}}>
            {[
              { title: "Berkley Insurance", body: "Introduced an absolute AI exclusion on D&O, E&O and Fiduciary Liability policies — covering all AI use, not just generative." },
              { title: "EU AI Act — Aug 2026", body: "Article 50(4) requires AI-assisted marketing content to carry disclosure or documented human review. Non-compliance triggers regulatory action." },
              { title: "RSA (UK)", body: 'RSA\'s UK Head of PI confirmed they are "assuming but not yet pricing" AI exposures — meaning exclusions are coming at next renewal.' },
            ].map((item) => (
              <div key={item.title} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem"}}>
                <div style={{width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginBottom: "1.25rem"}} />
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem"}}>{item.title}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7}}>{item.body}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign: "center"}}>
            <Link href="/signup" style={{display: "inline-flex", alignItems: "center", gap: "10px", background: "#cc0000", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, padding: "14px 36px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)"}}>
              Scan your copy free
            </Link>
          </div>
        </div>
      </section>

      {/* Value stack */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "800px", margin: "0 auto", textAlign: "center"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>The maths</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "3rem"}}>For both sides.</h2>
          <div style={{display: "flex", flexDirection: "column", gap: "0", marginBottom: "3rem", textAlign: "left"}}>
            {[
              { label: "Compliance lawyer", value: "£400 per hour" },
              { label: "Full funnel audit", value: "£2,400 minimum" },
              { label: "Average buyer loss", value: "£500–£2,000" },
              { label: "Red Flag AI Pro", value: "Free. 60 seconds.", highlight: true },
            ].map((item, i) => (
              <div key={i} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: item.highlight ? "white" : "rgba(255,255,255,0.7)", fontWeight: item.highlight ? 700 : 500}}>{item.label}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: item.highlight ? "#ef4444" : "rgba(255,255,255,0.7)", textAlign: "right"}}>{item.value}</p>
              </div>
            ))}
          </div>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7}}>
            If it catches one thing, it has paid for itself a thousand times over.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{background: "#050505", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1000px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>How it works</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "4rem"}}>Three steps. 60 seconds.</h2>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px"}}>
            {[
              { step: "01", title: "Paste your copy", desc: "Sales page, VSL script, email sequence, ad copy — anything you are about to buy from or publish." },
              { step: "02", title: "26 categories scanned", desc: "Income claims, fake urgency, dark patterns, GDPR, FCA, greenwashing, SMS marketing, online safety — across all 9 jurisdictions simultaneously." },
              { step: "03", title: "Truth or fix. Instantly.", desc: "Every flag explained in plain English with a compliant rewrite. Know before you spend. Launch with confidence." },
            ].map((s) => (
              <div key={s.step} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem"}}>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: "1.5rem", letterSpacing: "-0.03em"}}>{s.step}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.75rem"}}>{s.title}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* closing */}
        </div>
      </section>

      {/* Who is this for */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Who it is for</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem"}}>If you buy or sell online, this was built for you.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem"}}>Whichever side of the deal you're on, the same five minutes of checking can save you five figures.</p>

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px"}}>
            {PERSONAS.map((p) => (
              <div key={p.label} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", transition: "border-color 0.2s"}}
              >
                <span className="flag-wave" style={{display: "inline-block", flexShrink: 0, marginBottom: "1.25rem"}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/></svg></span>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem"}}>{p.label}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we scan for */}
      <section style={{background: "#050505", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>What we scan for</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem"}}>26 categories. One scan.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem"}}>Every category checked against all 9 jurisdictions simultaneously.</p>

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px"}}>
            {SCAN_CATEGORIES.map((c) => (
              <div key={c.label} style={{background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "10px"}}
              >
                <span className="flag-wave" style={{display: "inline-block", flexShrink: 0}}><svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/></svg></span>
                <span style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)"}}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* AI Law Categories */}
          <div style={{marginTop: "2px", borderTop: "2px solid #ef4444"}}>
            <div style={{background: "#0a0505", padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
              <span className="flag-wave">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                </svg>
              </span>
              <span style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444"}}>New — AI Law Compliance</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px"}}>
              {AI_CATEGORIES.map((c) => (
                <div key={c.label} style={{background: "#0a0505", border: "1px solid rgba(239,68,68,0.1)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "12px"}}>
                  <span className="flag-wave" style={{marginTop: "2px"}}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                    </svg>
                  </span>
                  <div>
                    <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "4px"}}>{c.label}</p>
                    <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", color: "#ef4444", letterSpacing: "0.04em"}}>{c.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credibility block */}
          <div style={{marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem"}}>
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem", textAlign: "center"}}>Trained on real compliance sources</p>
            <div style={{display: "flex", flexWrap: "wrap", gap: "8px 40px", justifyContent: "center"}}>
              {["FTC Enforcement Actions", "GDPR Guidelines & Rulings", "ASA & CMA Case Library", "ACCC & CASL Decisions"].map((item) => (
                <span key={item} style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "8px"}}>
                  <span style={{width: "4px", height: "4px", borderRadius: "50%", background: "#ef4444", flexShrink: 0}} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features — Asymmetric Bento */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Everything included</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem"}}>Buy or launch without fear.</h2>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem"}}>Every tool you need. Both sides protected.</p>

          {/* Buyer features — first 4, with one spanning wide */}
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem"}}>For buyers</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", marginBottom: "2px"}}>
            {FEATURES.slice(0, 4).map((f, i) => (
              <div key={f.title} style={{
                background: i % 2 === 0 ? "#0f0505" : "#0f0f0f",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                padding: "2rem",
                gridColumn: i === 0 ? "span 2" : "span 1"
              }}>
                <p style={{fontFamily: "'DM Mono', monospace", fontSize: "2.5rem", fontWeight: 700, color: i % 2 === 0 ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.25)", lineHeight: 1, marginBottom: "1.5rem", letterSpacing: "-0.03em"}}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: i === 0 ? "1.2rem" : "1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem"}}>{f.title}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7}}>{f.description}</p>
              </div>
            ))}
          </div>

          {/* Seller/Agency features — next 12 */}
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ef4444", margin: "3rem 0 1rem"}}>For sellers and agencies</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px"}}>
            {FEATURES.slice(4).map((f, i) => (
              <div key={f.title} style={{
                background: i % 2 === 0 ? "#0f0505" : "#0f0f0f",
                border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                padding: "2rem"
              }}>
                <p style={{fontFamily: "'DM Mono', monospace", fontSize: "1.75rem", fontWeight: 700, color: i % 2 === 0 ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.25)", lineHeight: 1, marginBottom: "1.25rem", letterSpacing: "-0.03em"}}>
                  {String(i + 5).padStart(2, "0")}
                </p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem"}}>{f.title}</p>
                <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7}}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials placeholder */}
      <section style={{background: "#050505", padding: "8rem 1.5rem"}}>
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

      {/* Risk Calculator */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto"}}>
          <RiskCalculator />
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
      <section style={{background: "#050505", padding: "8rem 1.5rem"}}>
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

      {/* FAQ — Editorial luxury style */}
      <section style={{background: "#080808", padding: "8rem 1.5rem"}}>
        <div style={{maxWidth: "900px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Questions</p>
          <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "5rem"}}>Still on the fence?</h2>

          <div>
            {FAQS.map((faq, i) => (
              <div key={faq.q} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
                padding: "2.5rem 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                alignItems: "start"
              }}>
                {/* Question — large, bold */}
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em"
                }}>
                  {faq.q}
                </p>
                {/* Answer — smaller, muted, red left border */}
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "#fca5a5",
                  borderLeft: "2px solid #ef4444",
                  paddingLeft: "1.5rem"
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Either Way You Win + Final CTA — combined knockout closer */}
      <section style={{background: "#050505", padding: "8rem 1.5rem", position: "relative", overflow: "hidden"}}>

        {/* Massive background text */}
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "clamp(4rem, 18vw, 18rem)", fontWeight: 900, color: "rgba(239,68,68,0.03)", letterSpacing: "-0.04em", whiteSpace: "nowrap", userSelect: "none"}}>NO LOSE</p>
        </div>

        <div style={{maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem"}}>Either way, you win</p>

          {/* Big statement + CTA first */}
          <div style={{textAlign: "center", marginBottom: "5rem"}}>
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


      {/* Sentinel Section — premium dark cinematic */}
      <section style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0010 50%, #0a0a0a 100%)",
        padding: "8rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Top glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "300px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center top, rgba(139,0,255,0.12) 0%, transparent 70%)"
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div style={{maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1}}>

          {/* Header */}
          <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "3rem"}}>
            <span style={{width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", animation: "pulseRed 2s ease-in-out infinite"}} />
            <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444"}}>Sentinel — enterprise compliance</p>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start"}}>

            {/* Left */}
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 800, lineHeight: 0.95,
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1.5rem"
              }}>
                Sentinel
              </h2>

              <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: "1rem"}}>
                Compliance infrastructure for agencies, legal teams and regulated businesses.
              </p>

              <p style={{fontFamily: "'Syne', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "2.5rem"}}>
                Red Flag AI Pro scans copy. Sentinel does everything beyond that — human review logs, legal timestamps, signed PDF certificates, FCA financial promotions, greenwashing checks and a full 3-year audit trail. Built for the teams where a compliance failure is a regulatory event, not just an embarrassment.
              </p>

              {/* Feature pills */}
              <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2.5rem"}}>
                {["Human Review Log", "Legal Timestamps", "FCA Promotions", "Greenwashing Scanner", "Signed Certificates", "3-Year Retention", "API Access"].map((f) => (
                  <span key={f} style={{
                    fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "5px 12px", borderRadius: "9999px"
                  }}>{f}</span>
                ))}
              </div>

              <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
                <Link href="/sentinel" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#cc0000", color: "white",
                  fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 700,
                  padding: "12px 28px", borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
                  textDecoration: "none"
                }}>
                  Learn about Sentinel
                </Link>
                <a href="mailto:support@redflagaipro.com?subject=Sentinel Enquiry" style={{
                  display: "inline-flex", alignItems: "center",
                  fontFamily: "'Syne', sans-serif", fontSize: "0.875rem", fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "12px 28px", borderRadius: "9999px",
                  textDecoration: "none"
                }}>
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right — feature grid with animated flags */}
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px"}}>
              {[
                { title: "Human Review Log", desc: "Every review logged and timestamped" },
                { title: "Legal Timestamps", desc: "Cryptographic proof of when you checked" },
                { title: "Signed Certificates", desc: "PDF certificates for every campaign" },
                { title: "FCA Promotions", desc: "Financial promotions checked at source" },
                { title: "Greenwashing", desc: "EU Green Claims Directive compliance" },
                { title: "API Access", desc: "Plug into your existing workflow" },
              ].map((item, i) => (
                <div key={item.title} style={{
                  background: i % 2 === 0 ? "#0f0505" : "#0a0010",
                  border: `1px solid ${i % 2 === 0 ? "rgba(239,68,68,0.12)" : "rgba(139,0,255,0.08)"}`,
                  padding: "1.5rem"
                }}>
                  <span className="flag-wave" style={{display: "inline-block", marginBottom: "0.75rem"}}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                    </svg>
                  </span>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 700, color: "white", marginBottom: "4px"}}>{item.title}</p>
                  <p style={{fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6}}>{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
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
