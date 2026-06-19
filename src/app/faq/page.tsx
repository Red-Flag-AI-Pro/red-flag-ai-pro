import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "FAQ — Red Flag AI Pro",
  description: "Everything you need to know about Red Flag AI Pro — how it works, what it scans, who it's for, and how to get started free.",
  alternates: { canonical: "https://www.redflagaipro.com/faq" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;

const FAQS = [
  { category: "Getting started", q: "Can I use this to check something before I buy it?", a: "Yes. Paste any sales page, ad or VSL you are considering. If it flags illegal claims, walk away. If it comes back clean, buy with confidence." },
  { category: "Getting started", q: "Do I need to create an account to use it?", a: "No. The demo scanner is completely free and requires only your email address — no account, no credit card, no signup. One free scan per email." },
  { category: "Getting started", q: "How long does a scan take?", a: "Under 60 seconds for most copy. URL scans and VSL transcriptions may take slightly longer depending on content length." },
  { category: "Getting started", q: "Do I need to know anything about compliance law?", a: "Zero. Every flag is explained in plain English with a suggested fix. No legal degree required." },
  { category: "For buyers", q: "I have been ripped off by misleading marketing before. Would this have caught it?", a: "In most cases yes. Fake scarcity, guaranteed results, income claims without proof — these are exactly what we scan for." },
  { category: "For buyers", q: "What types of ads and offers can I check?", a: "Any text-based content — sales pages, landing pages, ads, VSL scripts, email sequences, social media copy. Paste it or give us a URL." },
  { category: "For buyers", q: "Is this just another AI gimmick?", a: "Red Flag AI Pro is trained specifically on FTC enforcement actions, GDPR guidelines, and real compliance cases. Not generic marketing advice." },
  { category: "For sellers", q: "What if my copy is already compliant?", a: "Then you get a green score and launch with total confidence. Either way you win." },
  { category: "For sellers", q: "Which jurisdictions do you cover?", a: "USA (FTC, FDA, CAN-SPAM), UK (CMA, ASA, FCA, ICO), EU (GDPR, EU AI Act, DSA), Australia (ACCC, TGA), Canada (CASL, PIPEDA), Brazil (LGPD), India (DPDP Act), Singapore (PDPA) and UAE (PDPL 2022)." },
  { category: "For sellers", q: "Can I scan a live URL instead of pasting copy?", a: "Yes. On Pro and above, paste any URL and we fetch and scan the live page. Works on sales pages, landing pages, product pages and full websites." },
  { category: "For sellers", q: "Can I scan YouTube VSLs?", a: "Yes. Paste a YouTube URL and we automatically fetch the transcript. You can also upload audio files for Whisper transcription. Both are then scanned against all 29 categories." },
  { category: "For agencies", q: "Can I use this for client work?", a: "Absolutely. Growth and Sentinel plans include client workspaces, white-label PDF reports, team seats, and weekly monitoring. Manage compliance for every client from one dashboard." },
  { category: "For agencies", q: "Does it integrate with Zapier or my existing tools?", a: "Yes. Every scan fires a webhook to any URL. There is also a REST API with full documentation at /docs. Connect to Zapier, Make, Slack, or any custom system." },
  { category: "Pricing", q: "Why is there a free scan?", a: "Because once you see what it finds — whether in your own copy or in an ad you were about to buy from — you will never skip it again." },
  { category: "Pricing", q: "What is included in the free plan?", a: "One scan per month, access to 16 of our 29 risk categories across 9 jurisdictions, plus the full compliance toolkit (calculators and tools) inside your dashboard." },
  { category: "Pricing", q: "Is there a money-back guarantee?", a: "Yes. All paid plans come with a 14-day money-back guarantee. No questions asked." },
];

const categories = [...new Set(FAQS.map((f) => f.category))];

export default function FAQPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Questions</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Everything you need to know.</h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto" }}>Can't find what you need? <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "none" }}>Email us</a>.</p>
      </section>

      <section style={{ padding: "2rem 1.5rem 10rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: "5rem" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "2rem" }}>{cat}</p>
              {FAQS.filter((f) => f.category === cat).map((faq, i) => (
                <div key={faq.q} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", padding: "2.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                  <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{faq.q}</p>
                  <p style={{ ...syne, fontSize: "1rem", lineHeight: 1.7, color: "#fca5a5", borderLeft: "2px solid #ef4444", paddingLeft: "1.5rem" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          ))}

          <div style={{ textAlign: "center", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>Still have a question?</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:support@redflagaipro.com" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", ...syne, fontSize: "0.9rem", fontWeight: 600, padding: "12px 28px", borderRadius: "9999px", textDecoration: "none" }}>
                Email support
              </a>
              <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "12px 28px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none" }}>
                Start free →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
