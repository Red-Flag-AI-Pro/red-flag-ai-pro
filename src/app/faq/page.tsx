import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ: Red Flag AI Pro",
  description: "Everything you need to know about Red Flag AI Pro: your free red flag, the full audit, Sentinel, the Witness Network, and how we check compliance and AI governance for you.",
  alternates: { canonical: "https://www.redflagaipro.com/faq" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;

const FAQS = [
  { category: "Getting started", q: "What do I get for free?", a: "Your red flag. You give us your website and we tell you the one problem most likely to cost you, the rule it breaks, and how many more we found. From James, personally." },
  { category: "Getting started", q: "Do I need an account or a card?", a: "No. Just your website and an email address to send it to. No account, no card, nothing to install or learn." },
  { category: "Getting started", q: "How long until I hear back?", a: "Your red flag usually arrives within one working day. The full audit is delivered within 48 hours of payment." },
  { category: "Getting started", q: "Do I need to know anything about the law?", a: "No. Everything is explained in plain English: what we found, where it is, and why it matters." },
  { category: "What we check", q: "What do you actually check?", a: "Both halves of the risk. Compliance: what your website, ads and offers say in public. AI governance: how your business uses AI, who signed it off, and whether you could prove it." },
  { category: "What we check", q: "Which rules do you check against?", a: `UK (CMA, ASA, ICO, FCA), EU (GDPR, EU AI Act, DSA), USA (FTC, FDA, CAN SPAM), Australia, Canada, Brazil, India, Singapore, UAE, Nigeria and China. ${JURISDICTION_COUNT} jurisdictions and ${RISK_CATEGORY_COUNT} risk categories, based on the rules behind real published rulings.` },
  { category: "What we check", q: "Is this legal advice?", a: "No. It is a professional check of what your business says and how it uses AI, against the rules regulators apply. Where something needs a lawyer, we will tell you." },
  { category: "The full audit", q: "What is in the full audit?", a: "Every red flag on your site and in how you use AI, where each one is, why it matters, and exactly how to clear it. On video and in writing, with a reviewed badge for your site. £449, paid once." },
  { category: "The full audit", q: "What if you find nothing?", a: "Then you pay nothing. If the full audit finds nothing worth fixing, we refund the full price and you keep the clean report and the badge." },
  { category: "The full audit", q: "How do I pay?", a: "Up front, by card, through a secure payment link. The work starts as soon as payment is through." },
  { category: "Sentinel", q: "What is Sentinel?", a: "The monthly step after the audit. We check your site every month, tell you when the law changes, keep your reviewed badge live, and seal every check on the record. You also get your own private record page with your audit, every monthly note and the proof for every check, ready to show anyone who asks. £199 a month at the founding price." },
  { category: "Sentinel", q: "Do I need the audit first?", a: "Yes. Sentinel keeps a clear site clear, so it starts once your audit is done." },
  { category: "Sentinel", q: "Is there a contract?", a: "No. It is monthly and you can stop any time. If you are within 14 days of your first payment, email support@redflagaipro.com and we refund it in full." },
  { category: "Sentinel", q: "What is the Witness Network?", a: "Every check we do is sealed on our record, and the fingerprint of that record goes out every hour to independent witnesses we do not control. So if anyone asks what was checked and when, the answer cannot be changed or backdated. Sentinel clients are added automatically." },
  { category: "AI governance", q: "What is the Governance Maturity Index?", a: "A free self assessment: 12 questions that score your AI governance across 6 dimensions, with your biggest gaps shown on screen. The full audit covers the rest." },
  { category: "AI governance", q: "Who is it for?", a: "Any business that uses AI, from a chatbot on the website to software that helps make decisions about customers or staff." },
  { category: "For agencies", q: "I run an agency. Can you check my clients?", a: "Yes. Send us the sites and we will tell you what we find. Email support@redflagaipro.com to talk it through." },
];

const categories = [...new Set(FAQS.map((f) => f.category))];

export default function FAQPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>Questions every buyer asks. Straight answers. No marketing language.</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem", color: "#F4F1EA" }}>Everything you need to know.</h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto" }}>Can't find what you need? <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>Email us</a>.</p>
      </section>

      <section style={{ padding: "2rem 1.5rem 10rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: "5rem" }}>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "2rem" }}>{cat}</p>
              {FAQS.filter((f) => f.category === cat).map((faq, i) => (
                <div key={faq.q} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", padding: "2.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                  <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{faq.q}</p>
                  <p style={{ ...syne, fontSize: "1rem", lineHeight: 1.7, color: "#fca5a5", borderLeft: "2px solid #E5484D", paddingLeft: "1.5rem" }}>{faq.a}</p>
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
              <Link href="/get-checked" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "12px 28px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none" }}>
                Show me my red flag →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
