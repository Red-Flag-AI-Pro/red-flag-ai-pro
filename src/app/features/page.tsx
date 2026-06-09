import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Features — Red Flag AI Pro",
  description: "26 risk categories, 9 jurisdictions, AI-powered rewrites, URL scanning, VSL transcription, site audit, weekly monitoring and more. Everything included in Red Flag AI Pro.",
  alternates: { canonical: "https://www.redflagaipro.com/features" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const FEATURES = [
  { icon: "🛡️", title: "Verify Before You Buy", description: "Paste any ad, sales page or VSL you are considering buying from. Know if the claims are legal before you hand over your money. Free — no signup needed.", tag: "Buyers" },
  { icon: "🚨", title: "Spot Fake Urgency and Fake Scarcity", description: "That countdown timer and limited spots claim — find out if it is real or manufactured pressure. Fake urgency is specifically illegal under EU DSA and CMA rules.", tag: "Buyers" },
  { icon: "📋", title: "Catch Contract Contradictions", description: "Spots the gap between what the sales page promises and what the Terms of Service actually delivers — before you screenshot it too late and lose your money.", tag: "Buyers" },
  { icon: "📊", title: "0–100 Compliance Score", description: "One number tells you exactly how safe an offer is — or how safe your copy is to publish. Green means go. Red means stop. Every flag in plain English with a fix.", tag: "Both" },
  { icon: "🚩", title: "Know Your Risk Before You Spend on Ads", description: "Stop paying to amplify illegal copy. Red Flag AI Pro surfaces income claims, health claims, fake urgency and FTC red flags before your campaign goes live.", tag: "Sellers" },
  { icon: "💡", title: "Compliant Rewrites Included", description: "Every flag comes with a concrete, compliant rewrite. No lawyer, no guesswork, no waiting. Fix it in the same session you found it.", tag: "Sellers" },
  { icon: "🌐", title: "Scan Any Live URL", description: "Paste a URL and we fetch the live page and scan what is actually published — not what you think is there. Works on sales pages, landing pages, product pages.", tag: "Sellers" },
  { icon: "🎬", title: "YouTube VSL and Audio Scanning", description: "Paste a YouTube URL and we fetch the transcript automatically. Or upload an audio file and Whisper transcribes it first. Every word scanned against all 26 risk categories.", tag: "Sellers" },
  { icon: "🔍", title: "Full Site Audit", description: "Enter a domain and we find the sitemap, scan every page, and rank them by risk. Audit a new client's entire website in under two minutes on day one.", tag: "Agencies" },
  { icon: "📡", title: "Weekly Auto-Monitoring", description: "Add URLs to monitoring and we rescan them every Monday. Email digest lands in your inbox if anything changes. Know about new compliance issues before anyone complains.", tag: "Agencies" },
  { icon: "🏢", title: "Client Workspaces and Auto-Reports", description: "Organise scans by client. Each workspace shows scan history, score trends and compliance records. Weekly reports sent automatically to your client contacts.", tag: "Agencies" },
  { icon: "📥", title: "White-Label PDF Reports", description: "Download compliance reports under your agency name. Set it once in Settings — every PDF shows your branding. Clients see your name on the certificate, not ours.", tag: "Agencies" },
  { icon: "⚡", title: "Zapier, Webhooks and REST API", description: "Every scan fires a webhook to any URL. Connect Zapier, Make, Slack or your own system in minutes. REST API with full docs at /docs lets you embed scanning in your own tools.", tag: "Agencies" },
  { icon: "🧩", title: "Chrome Extension", description: "Scan any page without leaving your browser. Click the icon, see the score and top flags in seconds. No copy-paste, no tab-switching. Sentinel users only.", tag: "Sentinel" },
  { icon: "🔗", title: "Embeddable Compliance Badge", description: "A live SVG badge agencies embed on client sites as verifiable proof of review. Share any scan with a public link — clients see the full report without an account.", tag: "Agencies" },
  { icon: "🕓", title: "Compliance Changelog", description: "Compare any two scans side by side. Score delta, new flags, resolved flags, what still needs fixing — with the suggested rewrite for every issue.", tag: "Agencies" },
];

const SCAN_CATEGORIES = [
  "Income Claims", "Health Claims", "Fake Urgency", "Dark Patterns", "Hidden Fees",
  "Fake Reviews", "Data Privacy", "Email Compliance", "Comparative Advertising",
  "Contract Contradictions", "Missing Disclaimers", "Unverified Testimonials",
  "AI Content Disclosure", "AI Endorsement Violations", "Automated Decisions",
  "FCA Financial Promotions", "Greenwashing", "Subscription Traps",
  "Influencer Disclosure", "Misleading Guarantees", "GDPR & Data Law",
];

const AI_CATEGORIES = [
  { label: "AI Content Disclosure", tag: "EU AI Act Art. 50" },
  { label: "AI Endorsement Violations", tag: "FTC AI Guidelines" },
  { label: "Automated Decision Making", tag: "GDPR Article 22" },
];

const JURISDICTIONS = [
  { code: "us", country: "USA", regs: "FTC Act · FDA · CAN-SPAM · FTC Green Guides · FTC Negative Option Rule" },
  { code: "gb", country: "UK", regs: "CMA · ASA CAP Code · BCAP Code · FCA · FSMA 2000 · PECR · ICO · DSA" },
  { code: "eu", country: "EU", regs: "GDPR · EU AI Act · UCPD · DSA · EU Green Claims Directive" },
  { code: "au", country: "AUS", regs: "ACCC · ACL · TGA · ASIC · ESMA" },
  { code: "ca", country: "CAN", regs: "CASL · PIPEDA · OSC" },
  { code: "br", country: "BRA", regs: "LGPD" },
  { code: "in", country: "IND", regs: "DPDP Act 2023 · MHRA" },
  { code: "sg", country: "SGP", regs: "PDPA" },
  { code: "ae", country: "UAE", regs: "PDPL 2022" },
];

const tagColor = (tag: string) => {
  if (tag === "Buyers") return { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#93c5fd" };
  if (tag === "Sellers") return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#fca5a5" };
  if (tag === "Agencies") return { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#d8b4fe" };
  if (tag === "Sentinel") return { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", text: "#fde047" };
  return { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#86efac" };
};

export default function FeaturesPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Everything included</p>
        <h1 style={{ ...syne, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
          26 categories. 9 jurisdictions.<br />
          <span style={{ color: "#ef4444", fontStyle: "italic" }}>One scan.</span>
        </h1>
        <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", maxWidth: "560px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
          Every feature built for both sides of the deal — whether you are checking copy before you publish, or an offer before you buy.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none" }}>
            Start free
          </Link>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", ...syne, fontSize: "0.9rem", fontWeight: 600, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
            See pricing →
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ padding: "4rem 1.5rem 8rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2px" }}>
            {FEATURES.map((f) => {
              const tc = tagColor(f.tag);
              return (
                <div key={f.title} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ fontSize: "1.75rem" }}>{f.icon}</span>
                    <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`, padding: "3px 10px", borderRadius: "9999px", flexShrink: 0 }}>{f.tag}</span>
                  </div>
                  <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white" }}>{f.title}</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#080808", padding: "5rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>How it works</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "4rem" }}>Three steps. 60 seconds.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            {[
              { step: "01", title: "Paste your copy", desc: "Sales page, VSL script, email sequence, ad copy — anything you are about to buy from or publish." },
              { step: "02", title: "26 categories scanned", desc: "Income claims, fake urgency, dark patterns, GDPR, FCA, greenwashing, SMS marketing, online safety — across all 9 jurisdictions simultaneously." },
              { step: "03", title: "Truth or fix. Instantly.", desc: "Every flag explained in plain English with a compliant rewrite. Know before you spend. Launch with confidence." },
            ].map((s) => (
              <div key={s.step} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                <p style={{ ...syne, fontSize: "3.5rem", fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>{s.step}</p>
                <p style={{ ...syne, fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{s.title}</p>
                <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The problem */}
      <section style={{ background: "#050505", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>The problem</p>
          <h2 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "white", marginBottom: "1.5rem" }}>
            The ad that just convinced you to buy could be breaking the law.
            <span style={{ color: "#ef4444", fontStyle: "italic", display: "block" }}>So could the one you just wrote.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: "640px", marginBottom: "4rem" }}>
            Most people who get ripped off online are not stupid. Most sellers who break the rules are not scammers. Nobody tells you where the line is. Until you cross it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { claim: "That limited time offer", detail: "Countdown timers that reset are specifically illegal in the UK and EU." },
              { claim: "That six figure income claim", detail: "It can trigger a government fine even if it is true." },
              { claim: "That money back guarantee", detail: "If it contradicts the terms and conditions, it is a contract violation." },
              { claim: "That email list", detail: "Collecting emails without the right consent wording breaks Canadian and EU law." },
              { claim: "That number one claim", detail: "Without proof, it breaks advertising rules in every country we cover." },
            ].map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                <p style={{ ...syne, fontSize: "1.3rem", fontWeight: 700, color: "white", lineHeight: 1.2, letterSpacing: "-0.02em" }}>{item.claim}</p>
                <p style={{ ...syne, fontSize: "1.15rem", lineHeight: 1.6, color: "#fca5a5", borderLeft: "3px solid #ef4444", paddingLeft: "1.25rem", fontWeight: 500 }}>{item.detail}</p>
              </div>
            ))}
            <div style={{ padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 600, color: "#ef4444" }}>Nobody needs intent. Regulators do not care if you did not know.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section style={{ background: "#080808", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Real examples</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem" }}>Before you buy it. Before you build it.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem" }}>Real flags. Both sides. See exactly what we find.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "2px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", flex: 1 }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>For Sellers — Flagged Copy</p>
                <p style={{ ...syne, fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  &ldquo;Join thousands of members who are making £5,000–£10,000 per month using our proven system. Results guaranteed or your money back — no questions asked.&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem" }}>Flags triggered</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.75rem" }}>
                    {["Income claim without disclaimer", "Unsubstantiated earnings", "Guarantee contradiction"].map((f) => (
                      <span key={f} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 12px", fontSize: "11px", fontWeight: 600, color: "#fca5a5", ...syne }}>{f}</span>
                    ))}
                  </div>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(239,68,68,0.6)", fontWeight: 600 }}>FTC · ASA · ACCC</p>
                </div>
              </div>
              <div style={{ background: "#0a1a0a", border: "1px solid rgba(34,197,94,0.12)", padding: "2rem", flex: 1 }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80", marginBottom: "1.5rem" }}>Compliant Rewrite</p>
                <p style={{ ...syne, fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  &ldquo;Our members report a wide range of results. Some earn £5,000+ per month — individual results vary based on effort, experience, and market conditions. See our income disclaimer for full details.&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(34,197,94,0.1)", paddingTop: "1.25rem" }}>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(74,222,128,0.7)", fontWeight: 600 }}>Now compliant with FTC · CMA · ASA · ACCC · CASL</p>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", flex: 1 }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>For Buyers — Looks Legitimate</p>
                <p style={{ ...syne, fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  &ldquo;Over 2,400 students have completed this programme. Our top performers report life-changing results. Enrol today and get our 30-day satisfaction guarantee — full refund if you do not see results within the first month.&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#fbbf24" }}>Passed your gut check. Failed ours.</p>
                </div>
              </div>
              <div style={{ background: "#110808", border: "1px solid rgba(239,68,68,0.12)", padding: "2rem", flex: 1 }}>
                <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>What We Found</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { flag: "Unverified social proof", detail: "2,400 students — no independent verification", reg: "FTC violation" },
                    { flag: "Vague results claim", detail: '"Life-changing results" — no data or disclaimer', reg: "ASA violation" },
                    { flag: "Conditional guarantee", detail: "Refund tied to results — contradicts UK statutory consumer rights", reg: "CMA violation" },
                    { flag: "Missing income disclaimer", detail: "Implied financial outcomes without mandatory disclosure", reg: "ACCC violation" },
                  ].map((item) => (
                    <div key={item.flag} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>✕</span>
                      <div>
                        <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{item.flag}</p>
                        <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>{item.detail}</p>
                        <p style={{ ...syne, fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>{item.reg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fines & Penalties */}
      <section style={{ background: "#050505", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>The cost of getting it wrong</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem" }}>Real fines. Real losses. Both sides.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem" }}>All from the same illegal marketing copy.</p>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>What buyers lose</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px", marginBottom: "4rem" }}>
            {[
              { label: "Ecommerce", sub: "Misleading product claims", amount: "£200–£800", detail: "average loss per purchase" },
              { label: "Course buyers", sub: "Fake income claims", amount: "£500–£5k", detail: "average loss per course" },
              { label: "Health products", sub: "Unsubstantiated claims", amount: "£100–£2k", detail: "average loss per product" },
              { label: "Subscriptions", sub: "Hidden recurring charges", amount: "£300–£1.2k", detail: "average annual loss" },
            ].map((item) => (
              <div key={item.label} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{item.label}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>{item.sub}</p>
                <p style={{ ...mono, fontSize: "2.25rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px" }}>{item.amount}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>What sellers face</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", marginBottom: "2rem" }}>
            {[
              { country: "USA (FTC)", body: "False advertising, income claims", fine: "$50k+", detail: "per violation" },
              { country: "UK (CMA/ASA)", body: "Misleading commercial practices", fine: "£300k+", detail: "unlimited in court" },
              { country: "EU (GDPR)", body: "Data privacy violations", fine: "€20M", detail: "or 4% global turnover" },
              { country: "Australia (ACCC)", body: "Misleading conduct", fine: "A$50M", detail: "per violation" },
              { country: "Canada (CASL)", body: "Spam and consent violations", fine: "C$10M", detail: "per violation" },
            ].map((f) => (
              <div key={f.country} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{f.country}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>{f.body}</p>
                <p style={{ ...mono, fontSize: "2rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px" }}>{f.fine}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{f.detail}</p>
              </div>
            ))}
            <div style={{ background: "#1a0505", border: "1px solid rgba(239,68,68,0.2)", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ ...mono, fontSize: "3rem", fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: "8px" }}>$6B+</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>in marketing compliance fines globally in the last 3 years</p>
            </div>
          </div>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>Fine amounts based on published maximum penalties. Individual penalties vary. Not legal advice.</p>
        </div>
      </section>

      {/* AI Liability */}
      <section style={{ background: "#080808", padding: "5rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse at center, rgba(185,28,28,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>New threat — 2026</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "0.75rem", lineHeight: 1.2 }}>
            AI generated it. That does not make it legal.
            <span style={{ display: "block", color: "#ef4444", fontStyle: "italic" }}>Or safe to buy.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", marginBottom: "4rem", maxWidth: "600px", lineHeight: 1.7 }}>
            From January 2026, major insurers began adding AI exclusions to Professional Indemnity policies. AI-generated copy that breaches advertising law is now an <span style={{ color: "white", fontWeight: 600 }}>uninsured liability</span>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            {[
              { title: "Berkley Insurance", body: "Introduced an absolute AI exclusion on D&O, E&O and Fiduciary Liability policies — covering all AI use, not just generative." },
              { title: "EU AI Act — Aug 2026", body: "Article 50(4) requires AI-assisted marketing content to carry disclosure or documented human review. Non-compliance triggers regulatory action." },
              { title: "RSA (UK)", body: "RSA's UK Head of PI confirmed they are \"assuming but not yet pricing\" AI exposures — meaning exclusions are coming at next renewal." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginBottom: "1.25rem" }} />
                <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 26 categories */}
      <section style={{ background: "#080808", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>What we scan for</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>26 categories. One scan.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem" }}>Every category checked against all 9 jurisdictions simultaneously.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", marginBottom: "2px" }}>
            {SCAN_CATEGORIES.map((c) => (
              <div key={c} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /><path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444" /></svg>
                <span style={{ ...syne, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{c}</span>
              </div>
            ))}
          </div>

          {/* AI Law */}
          <div style={{ borderTop: "2px solid #ef4444" }}>
            <div style={{ background: "#0a0505", padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /><path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444" /></svg>
              <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>New — AI Law Compliance</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
              {AI_CATEGORIES.map((c) => (
                <div key={c.label} style={{ background: "#0a0505", border: "1px solid rgba(239,68,68,0.1)", padding: "1.25rem 1.5rem" }}>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "4px" }}>{c.label}</p>
                  <p style={{ ...syne, fontSize: "11px", color: "#ef4444", letterSpacing: "0.04em" }}>{c.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 jurisdictions */}
      <section style={{ background: "#050505", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Global coverage</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>9 jurisdictions. Every scan.</h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "4rem" }}>All checked simultaneously — you never have to pick one.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
            {JURISDICTIONS.map((j) => (
              <div key={j.country} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <img src={`https://flagcdn.com/w40/${j.code}.png`} alt={j.country} style={{ width: "40px", height: "26px", objectFit: "cover", borderRadius: "3px", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "6px" }}>{j.country}</p>
                  <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{j.regs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#080808", padding: "8rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "1rem" }}>Start free. No credit card.</h2>
        <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem" }}>Free account includes your first scan and full access to the compliance toolkit.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", ...syne, fontSize: "1rem", fontWeight: 700, padding: "14px 40px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none" }}>
            Create free account →
          </Link>
          <Link href="/tools/compliance-checklist" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", ...syne, fontSize: "1rem", fontWeight: 600, padding: "14px 32px", borderRadius: "9999px", textDecoration: "none" }}>
            Free compliance checklist →
          </Link>
        </div>
      </section>
    </div>
  );
}
