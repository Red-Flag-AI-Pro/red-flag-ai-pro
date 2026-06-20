import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Case Study — What Red Flag AI Pro Found on a Real Agency Campaign",
  description: "Six real compliance violations found on live agency campaigns. FCA criminal liability, CASL, drip pricing, influencer disclosure, EU AI Act and greenwashing. None obvious. All fixable.",
  alternates: { canonical: "https://www.redflagaipro.com/case-study" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const FLAGS = [
  {
    category: "FCA Financial Promotion — Criminal Liability",
    severity: "HIGH",
    context: "A digital agency wrote landing page copy for a fintech client offering a savings product. The copy looked professional and compliant to everyone who reviewed it.",
    excerpt: "Start growing your money today. Our members earn an average of 4.2% annually. Low risk, high reward. Open your account in minutes.",
    description: "This is an unapproved financial promotion under Section 21 of the Financial Services and Markets Act 2000. Communicating a financial promotion without FCA authorisation is a criminal offence — not a civil fine. A criminal offence. The agency that wrote this copy, not just the client, is exposed. The '4.2% annually' figure is a specific return claim that requires FCA approval before publication. The 'low risk' claim is false — all investment carries risk and this wording is specifically prohibited.",
    fix: "Any copy that invites someone to invest, save or engage with a financial product must be approved by an FCA-authorised person before publication. The agency should have flagged this before writing a word. Without that sign-off, neither the client nor the agency should publish.",
    impact: "Criminal prosecution of the person who communicated the promotion. FCA public censure. Campaign takedown. PI insurance may not respond.",
    regulations: ["FSMA 2000 Section 21 (UK)", "FCA Financial Promotions Rules (UK)", "FCA Compliance Sourcebook (UK)"],
  },
  {
    category: "CASL Consent Violation — $10M CAD Per Breach",
    severity: "HIGH",
    context: "An ecommerce brand's email capture form had been running for two years. The agency built it. It had 40,000 subscribers on the list, including Canadian recipients.",
    excerpt: "Enter your email to receive exclusive offers and our weekly newsletter. By signing up you agree to receive marketing communications from us.",
    description: "Canada's Anti-Spam Legislation (CASL) requires express consent before sending commercial electronic messages. 'By signing up you agree to receive marketing' is not express consent — it is implied consent. Under CASL, every email sent to a Canadian recipient without proper express consent is a separate violation carrying fines up to $10 million CAD per violation for businesses. With 40,000 subscribers, this list has been accumulating liability for two years.",
    fix: "Add an unchecked checkbox with explicit language: 'I agree to receive marketing emails from [Brand]. I can unsubscribe at any time.' This must be a separate, affirmative action — not bundled with terms acceptance. All existing Canadian subscribers without proper consent should be suppressed.",
    impact: "Potential fines of millions per violation. CRTC enforcement. List destruction. Campaign suspension.",
    regulations: ["CASL + CRTC (Canada)", "PECR + ICO (UK)", "GDPR (EU)", "CAN-SPAM (US)"],
  },
  {
    category: "Drip Pricing — CMA Enforcement Priority",
    severity: "HIGH",
    context: "A SaaS client's pricing page was written and managed by the agency. It had been running for eight months generating significant paid traffic.",
    excerpt: "Start for just £29/month. Join over 5,000 businesses already growing with our platform.",
    description: "The £29 figure appears in the hero, the ads and the Google Shopping feed. The actual first month cost is £29 plus a mandatory £49 onboarding fee plus VAT — a total of £92.80 for month one. This is drip pricing. The CMA has made drip pricing one of its top enforcement priorities under the Digital Markets Competition and Consumers Act 2024. The agency that wrote and managed this campaign is in the chain of liability.",
    fix: "The advertised price must represent the total mandatory cost from the first point of contact. Either include all fees in the headline price, or clearly state 'from £29/month + £49 setup fee' in every placement. This must be updated in ads, landing page and comparison sites simultaneously.",
    impact: "CMA enforcement notice. Fines without court order under DMCC Act 2024. Ad account suspension. Chargeback wave from existing customers.",
    regulations: ["CMA + DMCC Act 2024 (UK)", "ACCC (Australia)", "FTC (US)", "UCPD (EU)"],
  },
  {
    category: "EU AI Act Article 50 — Undisclosed AI Copy, August 2026",
    severity: "HIGH",
    context: "A content agency used ChatGPT to write blog posts, email sequences and ad copy for twelve clients. The content was edited and published without any disclosure that AI was used in its creation.",
    excerpt: "Our team of experts has crafted this guide to help you navigate the landscape. We believe in putting people first — which is why every piece of content we create comes from genuine human expertise.",
    description: "EU AI Act Article 50(4) comes into force on 2 August 2026. It requires that AI-generated content intended for public audiences is clearly disclosed. This copy was written by ChatGPT, edited by a human, and then published with the claim that it comes from 'genuine human expertise.' That is not disclosure — it is the opposite. The agency is producing this content for twelve clients across the EU market. Every piece of undisclosed AI content published after 2 August 2026 is a violation. Fines reach €15 million or 3% of global annual turnover.",
    fix: "Add disclosure language to all AI-assisted content: 'This content was created with the assistance of AI writing tools and reviewed by [Name] on [Date].' Document your human editorial review process. Update all client contracts to include AI tool usage clauses.",
    impact: "Fines up to €15 million or 3% of global annual turnover. ICO investigation. PI insurance exclusions may apply to AI-generated content claims.",
    regulations: ["EU AI Act Article 50(4) — effective 2 August 2026", "UK ICO AI Transparency Guidance (UK)", "FTC AI Endorsement Guidelines (US)"],
  },
  {
    category: "Greenwashing — EU Green Claims Directive and CMA Enforcement",
    severity: "HIGH",
    context: "A fashion brand client briefed the agency to write copy positioning their new product line as sustainable. The agency wrote the copy based on information provided by the client's marketing team.",
    excerpt: "Our new collection is made from eco-friendly materials and is carbon neutral from production to delivery. We are committed to a sustainable future and are proud to offer products that are kind to the planet.",
    description: "Every environmental claim in this copy requires substantiation under the EU Green Claims Directive, the CMA Green Claims Code and the FTC Green Guides. 'Eco-friendly' is a vague claim with no legal definition. 'Carbon neutral' requires independently verified offsets under a recognised standard. 'Kind to the planet' is meaningless under any regulatory framework. The agency wrote and published this copy without asking the client for substantiation.",
    fix: "Never write environmental claims without first obtaining documented substantiation from the client. 'Carbon neutral' requires a specific offsetting certificate. 'Eco-friendly' must be replaced with a specific, verifiable claim. Add a clause to your agency agreement requiring clients to provide evidence before you write sustainability claims.",
    impact: "CMA enforcement notice and public censure. EU Commission investigation. Product withdrawal from EU market. Agency named in proceedings.",
    regulations: ["EU Green Claims Directive (EU)", "CMA Green Claims Code (UK)", "ASA CAP Code (UK)", "FTC Green Guides (US)", "ACCC (Australia)"],
  },
  {
    category: "Affiliate Non-Disclosure — FTC Criminal Referral Territory",
    severity: "MEDIUM",
    context: "An agency managed an influencer campaign for a supplement brand. Twenty influencers posted content. The agency briefed them, managed the contracts and approved the content.",
    excerpt: "Honestly the best thing I have tried this year. I have been using this for three months and the results speak for themselves. Link in bio.",
    description: "Twenty influencers posted variations of this without any disclosure. No #ad. No #sponsored. No 'paid partnership.' The agency briefed them, paid them and approved the content. Under FTC Endorsement Guides 2023, the agency that organises and manages an influencer campaign bears direct responsibility for disclosure failures. The FTC has issued civil investigative demands to agencies, not just brands, for exactly this pattern. Each post is a separate violation.",
    fix: "Every piece of paid, gifted or incentivised influencer content must include clear, prominent disclosure before any promotional content. '#Ad' or 'Paid partnership with [Brand]' must appear at the start of the caption. The agency's influencer brief must include mandatory disclosure language and the contract must require it.",
    impact: "FTC civil investigative demand. ASA public ruling. CMA enforcement notice. Agency named publicly.",
    regulations: ["FTC Endorsement Guides 2023 (US)", "ASA CAP/BCAP Code (UK)", "CMA Influencer Guidance (UK)", "UCPD (EU)"],
  },
];

const SCORE_BEFORE = 31;
const SCORE_AFTER = 91;

export default function CaseStudyPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: "8rem 1.5rem 6rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 65%)"
        }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Case Study</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Six violations.<br />None of them obvious.<br />
            All happening right now.
          </h1>
          <p style={{ ...syne, fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: "600px" }}>
            This is a composite of real violations found across real agency campaigns. The copy looked professional. It had been reviewed internally. It went live. Here is what a compliance scanner found that nobody else did.
          </p>
        </div>
      </section>

      {/* SCORE STRIP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ background: "#102943", border: "1px solid rgba(239,68,68,0.15)", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Score before</p>
          <p style={{ ...mono, fontSize: "3.5rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.04em", lineHeight: 1 }}>{SCORE_BEFORE}</p>
          <p style={{ ...syne, fontSize: "11px", color: "#ef4444", marginTop: "0.5rem", fontWeight: 600 }}>High risk — do not publish</p>
        </div>
        <div style={{ background: "#0D1B2E", borderLeft: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Violations found</p>
          <p style={{ ...mono, fontSize: "3.5rem", fontWeight: 700, color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>6</p>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>5 high · 1 medium</p>
        </div>
        <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Score after fixes</p>
          <p style={{ ...mono, fontSize: "3.5rem", fontWeight: 700, color: "#4ade80", letterSpacing: "-0.04em", lineHeight: 1 }}>{SCORE_AFTER}</p>
          <p style={{ ...syne, fontSize: "11px", color: "#4ade80", marginTop: "0.5rem", fontWeight: 600 }}>Low risk — safe to publish</p>
        </div>
      </div>

      {/* WARNING */}
      <div style={{
        background: "#102943",
        border: "none",
        borderBottom: "1px solid rgba(251,191,36,0.15)",
        padding: "1.25rem 1.5rem"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(251,191,36,0.8)", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700 }}>Before you read this:</span>{" "}
            If your agency writes copy for financial services clients, manages influencer campaigns, runs email capture or manages paid ads with headline pricing — at least one of these violations is almost certainly present in live campaigns right now.
          </p>
        </div>
      </div>

      {/* FLAGS */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {FLAGS.map((flag, i) => (
            <div key={flag.category} style={{
              background: i % 2 === 0 ? "#0D1B2E" : "#102943",
              border: `1px solid ${flag.severity === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.12)"}`,
              overflow: "hidden"
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                padding: "1.75rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                gap: "1rem"
              }}>
                <div>
                  <p style={{ ...syne, fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Violation #{i + 1}</p>
                  <h3 style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", lineHeight: 1.3 }}>{flag.category}</h3>
                </div>
                <span style={{
                  ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: flag.severity === "HIGH" ? "#ef4444" : "#fbbf24",
                  background: flag.severity === "HIGH" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                  border: `1px solid ${flag.severity === "HIGH" ? "rgba(239,68,68,0.25)" : "rgba(251,191,36,0.25)"}`,
                  padding: "4px 12px", borderRadius: "9999px", flexShrink: 0
                }}>{flag.severity}</span>
              </div>

              <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Context */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem" }}>The context</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{flag.context}</p>
                </div>

                {/* Excerpt */}
                <blockquote style={{
                  background: "#102943",
                  borderLeft: "3px solid #fbbf24",
                  padding: "1.25rem 1.5rem",
                  margin: 0
                }}>
                  <p style={{ ...syne, fontSize: "13px", fontStyle: "italic", color: "rgba(251,191,36,0.8)", lineHeight: 1.7 }}>
                    &ldquo;{flag.excerpt}&rdquo;
                  </p>
                </blockquote>

                {/* What we found */}
                <div>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>What the scanner found</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{flag.description}</p>
                </div>

                {/* Fix */}
                <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)", padding: "1.25rem 1.5rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: "0.5rem" }}>The fix</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(134,239,172,0.7)", lineHeight: 1.8 }}>{flag.fix}</p>
                </div>

                {/* If not fixed */}
                <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", padding: "1.25rem 1.5rem" }}>
                  <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.5rem" }}>If not fixed</p>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(252,165,165,0.7)", lineHeight: 1.7 }}>{flag.impact}</p>
                </div>

                {/* Regulations */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {flag.regulations.map((r) => (
                    <span key={r} style={{
                      ...syne, fontSize: "10px", fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "3px 10px", borderRadius: "9999px"
                    }}>{r}</span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE POINT */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            background: "#102943",
            border: "1px solid rgba(239,68,68,0.2)",
            padding: "3rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute", top: 0, left: "3rem", right: "3rem",
              height: "2px", background: "linear-gradient(90deg, #E5484D, transparent)"
            }} />
            <h2 style={{ ...syne, fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.5rem", letterSpacing: "-0.02em", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              The point of this case study
            </h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "1rem" }}>
              None of these violations were caught in internal review. None of them looked wrong to the people who wrote, approved and published them. All of them were found in 60 seconds by a compliance scanner.
            </p>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              The FCA violation could result in criminal prosecution. The CASL violation had been running for two years building liability on every send. The drip pricing was being amplified by paid ads the agency was managing. The influencer campaign had twenty posts live without a single disclosure.
            </p>
            <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", lineHeight: 1.7 }}>
              The question is not whether your campaigns have violations. The question is whether you find them before a regulator does.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Sentinel plan includes unlimited scanning, signed PDF certificates, client workspaces and weekly monitoring of live campaigns.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sentinel" style={{
              display: "inline-block",
              background: "#E5484D", color: "white",
              ...syne, fontSize: "0.875rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
              textDecoration: "none"
            }}>
              See Sentinel for agencies
            </Link>
            <a href="/#demo" style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              ...syne, fontSize: "0.875rem", fontWeight: 600,
              padding: "13px 28px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              Try a free scan
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
