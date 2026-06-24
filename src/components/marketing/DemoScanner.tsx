"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { JurisdictionPicker, JURISDICTIONS } from "@/components/ui/JurisdictionPicker";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SCANNER_SALE_ACTIVE } from "@/lib/constants";
import type { JurisdictionCode } from "@/lib/analyzer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" };
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" };

const CATEGORY_LABELS: Record<string, string> = {
  income_claim: "Income Claim",
  urgency: "Fake Urgency",
  scarcity: "Fake Scarcity",
  testimonial: "Testimonial",
  guarantee: "Guarantee",
  health_claim: "Health Claim",
  legal_disclaimer: "Legal Disclaimer",
  contract_contradiction: "Contract Contradiction",
  claims_policy_mismatch: "Claims vs. Policy Mismatch",
  data_privacy: "Data Privacy",
  hidden_fees: "Hidden Fees",
  fake_reviews: "Fake Reviews",
  comparative_advertising: "Comparative Advertising",
  email_compliance: "Email Compliance",
  ai_disclosure: "AI Disclosure",
  ai_endorsement: "AI Endorsement",
  automated_decisions: "Automated Decisions",
  dark_patterns: "Dark Patterns",
  financial_promotion: "FCA Financial Promotion",
  greenwashing: "Greenwashing",
  subscription_trap: "Subscription Trap",
  influencer_disclosure: "Influencer Disclosure",
  sms_marketing: "SMS Marketing Consent",
  online_safety: "Online Safety / UGC",
  fake_discounts: "Fake / Reference Discount",
  cookie_consent: "Cookie Consent",
  crypto_promotion: "Crypto Promotion",
  country_of_origin: "Country of Origin Claim",
};

interface Flag {
  category: string;
  severity: string;
  unlocked?: boolean;
  text_excerpt?: string;
  flag_description?: string;
  suggestion?: string;
}

interface DemoResult {
  score: number;
  totalFlags: number;
  hiddenCount: number;
  flags: Flag[];
}

const PLACEHOLDER = `Paste any ad, sales page, email or VSL script here...

Example: "Make £10,000 in your first 30 days, guaranteed. Limited spots available. Act now before the price goes up tonight at midnight."`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DemoScanner() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  // Default to UK + EU — most traffic is UK-based, and these two jurisdictions
  // cover the regulations (CMA/ASA/FCA, GDPR/DSA/AI Act) most relevant to them.
  const [jurisdictions, setJurisdictions] = useState<JurisdictionCode[]>(["gb", "eu"]);
  const [jurisdictionPickerOpen, setJurisdictionPickerOpen] = useState(false);

  async function handleScan() {
    if (!content.trim()) return;

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address. Each address gets one free check.");
      return;
    }

    setLoading(true);
    setError(null);
    setAlreadyUsed(false);
    setResult(null);

    try {
      const res = await fetch("/api/demo-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          email: email.trim(),
          jurisdictions: jurisdictions.length === JURISDICTIONS.length ? [] : jurisdictions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setAlreadyUsed(true);
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
      track("demo_scan_completed", { score: data.score, flags: data.totalFlags });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    !result ? "#ef4444"
    : result.score >= 80 ? "#4ade80"
    : result.score >= 50 ? "#fbbf24"
    : "#ef4444";

  return (
    <section id="demo" className="demo-scanner-section" style={{
      background: "linear-gradient(180deg, #0D1B2E 0%, #102943 50%, #0D1B2E 100%)",
      padding: "7rem 1.5rem",
      position: "relative",
      overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.04)"
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "350px", pointerEvents: "none",
        background: "radial-gradient(ellipse at center top, rgba(229,72,77,0.08) 0%, transparent 70%)"
      }} />

      <div style={{maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1}}>

        {/* Header */}
        <div style={{textAlign: "center", marginBottom: "3.5rem"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem"}}>
            <span className="flag-wave" style={{display: "inline-block"}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444"}}>
              Try It Free: No Account Needed
            </p>
          </div>

          <h2 style={{
            ...syne,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Paste Your Copy.<br />
            <span>Get Your Verdict.</span>
          </h2>

          <p style={{...syne, fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 0.75rem"}}>
            Buyers: paste any ad before you buy. Sellers: paste your copy before you publish. 60 seconds. No signup.
          </p>

          <p style={{...syne, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em"}}>
            No account. No card. Just your email, one free check per address.
          </p>
        </div>

        {/* Why we built this */}
        <div style={{
          background: "#102943",
          border: "1px solid rgba(239,68,68,0.15)",
          padding: "1.75rem 2rem",
          marginBottom: "1.5rem",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", top: "-1px", left: "2rem",
            width: "3rem", height: "2px",
            background: "linear-gradient(90deg, #E5484D, transparent)"
          }} />

          <p style={{...syne, fontSize: "11px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem"}}>
            Why We Built This
          </p>

          <p style={{
            ...syne,
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.8,
            marginBottom: "1.25rem"
          }}>
            I've watched <span style={{color: "#ef4444", fontWeight: 700}}>creators get destroyed by false income claims they didn't know were illegal.</span> I've seen <span style={{color: "#ef4444", fontWeight: 700}}>agencies lose clients to compliance fines</span> that could have been prevented in 60 seconds. And I've watched <span style={{color: "#ef4444", fontWeight: 700}}>buyers lose thousands to ads that broke every rule in the book.</span>
          </p>

          <p style={{
            ...syne,
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.8,
            marginBottom: "1.25rem"
          }}>
            <span style={{color: "white", fontWeight: 700}}>Red Flag covers everyone.</span> If you're a buyer, you get protection before you hand over money. If you're a creator or agency, you get certainty before you publish. If you're a compliance team, you get audit ready proof that you did your due diligence.
          </p>

          <p style={{
            ...syne,
            fontSize: "14px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8,
            fontWeight: 700
          }}>
            We're the only place that covers <span style={{color: "#ef4444"}}>all</span> of you. 100%.
          </p>
        </div>

        {/* Trust banner */}
        <div style={{
          background: "rgba(34,197,94,0.05)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "8px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <span style={{marginTop: "2px"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#C9A66B" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#C9A66B" strokeWidth="2"/></svg></span>
          <div>
            <p style={{...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "0.25rem"}}>
              Private & Secure
            </p>
            <p style={{...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5}}>
              Your copy is checked in your browser only. We never store, sell, or see your data.
            </p>
          </div>
        </div>

        {/* Examples section */}
        <details style={{marginBottom: "1.5rem"}}>
          <summary style={{
            ...syne,
            fontSize: "13px",
            fontWeight: 700,
            color: "#ef4444",
            cursor: "pointer",
            padding: "0.75rem 1rem",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px",
            userSelect: "none"
          }}>
            See examples of violations we catch →
          </summary>
          <div style={{marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem"}}>
            <div style={{
              background: "#102943",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "6px",
              padding: "1rem 1.25rem"
            }}>
              <p style={{...syne, fontSize: "10px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem"}}>High Severity: Income Claim</p>
              <p style={{...mono, fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontStyle: "italic"}}>
                "Make £10,000 in your first 30 days, guaranteed."
              </p>
              <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "0.75rem"}}>
                Breaks FTC/ASA rules. No earnings guarantee can be absolute.
              </p>
            </div>
            <div style={{
              background: "#102943",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: "6px",
              padding: "1rem 1.25rem"
            }}>
              <p style={{...syne, fontSize: "10px", fontWeight: 700, color: "#fbbf24", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem"}}>Medium Severity: Fake Scarcity</p>
              <p style={{...mono, fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontStyle: "italic"}}>
                "Only 3 spots left. Price goes up tomorrow at midnight."
              </p>
              <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "0.75rem"}}>
                Scarcity claims must be time bound and genuine.
              </p>
            </div>
          </div>
        </details>

        {/* Scanner box */}
        <div style={{
          background: "#0F2138",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "2rem",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
          borderRadius: "8px"
        }}>
          <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem"}}>Your email: one free check per address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              background: "#0F2138",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.9)",
              ...syne,
              fontSize: "14px",
              padding: "14px 18px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "1.25rem",
              borderRadius: "6px",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(229,72,77,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(229,72,77,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; }}
          />
          <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginTop: "-0.85rem", marginBottom: "1.25rem"}}>
            We&apos;ll only use this to send your results and one follow up. No spam, unsubscribe anytime.
          </p>

          <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem"}}>Paste your copy here</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
            style={{
              width: "100%",
              background: "#0F2138",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.9)",
              ...syne,
              fontSize: "clamp(13px, 4vw, 14px)",
              lineHeight: 1.8,
              padding: "1.5rem",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
              minHeight: "280px",
              WebkitAppearance: "none"
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(229,72,77,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(229,72,77,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; }}
          />

          {/* Jurisdiction picker — defaults to UK + EU, collapsible for everyone else */}
          <div style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
          }}>
            {jurisdictionPickerOpen ? (
              <>
                <p style={{
                  ...syne,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "10px",
                }}>
                  Builders: pick the markets you sell into.&nbsp;&nbsp;Buyers: pick where you are.
                </p>
                <JurisdictionPicker
                  value={jurisdictions}
                  onChange={setJurisdictions}
                />
                <button
                  type="button"
                  onClick={() => setJurisdictionPickerOpen(false)}
                  style={{
                    ...syne,
                    marginTop: "10px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Done
                </button>
              </>
            ) : (
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px"}}>
                <p style={{...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)"}}>
                  Checking for{" "}
                  <span style={{color: "white", fontWeight: 700}}>
                    {jurisdictions.length === JURISDICTIONS.length
                      ? "all 9 jurisdictions"
                      : jurisdictions.map(c => JURISDICTIONS.find(j => j.code === c)?.name).join(" + ")}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setJurisdictionPickerOpen(true)}
                  style={{
                    ...syne,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#ef4444",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Change markets
                </button>
              </div>
            )}
          </div>

          {error && (
            <p style={{...syne, fontSize: "13px", color: "#ef4444", marginTop: "0.75rem"}}>{error}</p>
          )}

          {alreadyUsed && (
            <div style={{
              marginTop: "1.25rem",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <p style={{...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.4rem"}}>
                You&apos;ve already used your free check
              </p>
              <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.25rem"}}>
                {email.trim()} has already claimed its one free check. Create a free account to check this copy and keep checking more.
              </p>
              <Link href={`/signup${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`} style={{
                display: "inline-block",
                background: "#E5484D",
                color: "white",
                ...syne,
                fontSize: "0.9rem",
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: "9999px",
                boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
                textDecoration: "none",
                letterSpacing: "0.02em"
              }}>
                Create Free Account
              </Link>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading || !content.trim() || !email.trim() || jurisdictions.length === 0}
            style={{
              marginTop: "1rem",
              width: "100%",
              background: loading || !content.trim() || !email.trim() ? "rgba(229,72,77,0.3)" : "#E5484D",
              color: "white",
              ...syne,
              fontSize: "0.9rem",
              fontWeight: 700,
              padding: "14px 24px",
              border: "none",
              borderRadius: "9999px",
              cursor: loading || !content.trim() || !email.trim() ? "not-allowed" : "pointer",
              boxShadow: loading || !content.trim() || !email.trim() ? "none" : "0 8px 32px rgba(229,72,77,0.18)",
              transition: "all 0.2s",
              letterSpacing: "0.02em"
            }}
          >
            {loading ? (
              <span style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite"
                }} />
                Checking...
              </span>
            ) : jurisdictions.length === 0
              ? "Select at least one jurisdiction"
              : jurisdictions.length === JURISDICTIONS.length
              ? "Check Now: All 9 Jurisdictions"
              : `Check Now: ${jurisdictions.length} Jurisdiction${jurisdictions.length > 1 ? "s" : ""}`
            }
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "2px"}}>

            {/* Score row */}
            <div style={{
              background: "#102943",
              border: "1px solid rgba(239,68,68,0.15)",
              padding: "1.75rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem"}}>Compliance Score</p>
                <p className="font-display" style={{fontSize: "3.5rem", fontWeight: 500, lineHeight: 1}}>
                  <AnimatedNumber value={result.score} style={{color: scoreColor}} />
                  <span style={{fontSize: "1.25rem", color: "rgba(255,255,255,0.2)"}}>/ 100</span>
                </p>
              </div>
              <div style={{textAlign: "right"}}>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem"}}>Flags Found</p>
                <p className="font-display" style={{fontSize: "3.5rem", fontWeight: 500, lineHeight: 1}}>
                  <AnimatedNumber value={result.totalFlags} style={{color: result.totalFlags > 0 ? "#ef4444" : "#4ade80"}} />
                </p>
              </div>
            </div>

            {/* Flag cards */}
            {result.flags.map((flag, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                border: `1px solid ${flag.severity === "high" ? "rgba(239,68,68,0.2)" : flag.severity === "medium" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)"}`,
                padding: "1.5rem 2rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem"}}>
                  <span style={{
                    ...syne,
                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: flag.severity === "high" ? "#ef4444" : flag.severity === "medium" ? "#fbbf24" : "#60a5fa",
                    background: flag.severity === "high" ? "rgba(239,68,68,0.1)" : flag.severity === "medium" ? "rgba(251,191,36,0.1)" : "rgba(96,165,250,0.1)",
                    border: `1px solid ${flag.severity === "high" ? "rgba(239,68,68,0.25)" : flag.severity === "medium" ? "rgba(251,191,36,0.2)" : "rgba(96,165,250,0.2)"}`,
                    padding: "3px 10px",
                    borderRadius: "9999px"
                  }}>{flag.severity}</span>
                  <span style={{...syne, fontSize: "13px", fontWeight: 700, color: "white"}}>
                    {CATEGORY_LABELS[flag.category] ?? flag.category}
                  </span>
                  {flag.unlocked && (
                    <span style={{
                      ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                      textTransform: "uppercase", color: "#4ade80",
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.25)",
                      padding: "3px 10px", borderRadius: "9999px"
                    }}>Full preview</span>
                  )}
                </div>

                {flag.unlocked ? (
                  <div style={{display: "flex", flexDirection: "column", gap: "0.85rem"}}>
                    {flag.text_excerpt && (
                      <div style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderLeft: "3px solid #ef4444",
                        padding: "0.85rem 1.1rem",
                      }}>
                        <p style={{...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem"}}>Flagged text</p>
                        <p style={{...mono, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontStyle: "italic"}}>
                          &ldquo;{flag.text_excerpt}&rdquo;
                        </p>
                      </div>
                    )}
                    {flag.flag_description && (
                      <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7}}>
                        {flag.flag_description}
                      </p>
                    )}
                    {flag.suggestion && (
                      <div style={{
                        background: "rgba(74,222,128,0.05)",
                        border: "1px solid rgba(74,222,128,0.15)",
                        padding: "0.85rem 1.1rem",
                      }}>
                        <p style={{...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: "0.4rem"}}>Suggested fix</p>
                        <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7}}>
                          {flag.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{position: "relative"}}>
                    <p style={{
                      ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7,
                      filter: "blur(4px)", userSelect: "none"
                    }}>
                      Your copy contains a violation in this category that could trigger regulatory action. Upgrade to Pro to see the exact line, the regulation it breaks, and the compliant rewrite.
                    </p>
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span style={{
                        ...syne, fontSize: "11px", fontWeight: 700, color: "#ef4444",
                        background: "rgba(10,10,10,0.95)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        padding: "5px 14px", borderRadius: "9999px"
                      }}>Locked: Pro only</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Founder reinforcement — sits right where trust is being decided */}
            {result.flags.some((f) => !f.unlocked) && (
              <div style={{
                background: "#102943",
                borderLeft: "3px solid #ef4444",
                padding: "1.25rem 1.75rem",
                marginTop: "2px"
              }}>
                <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontStyle: "italic"}}>
                  &ldquo;This is exactly the blind spot I had.{" "}
                  <span style={{color: "white", fontWeight: 700, fontStyle: "italic"}}>here&apos;s what I built so you don&apos;t make the same mistake.</span>&rdquo;
                </p>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.6rem"}}>
                  James, Founder
                </p>
              </div>
            )}

            {/* CTA after flags */}
            {result.totalFlags > 0 && (
              <div style={{
                background: "#102943",
                border: "1px solid rgba(239,68,68,0.25)",
                padding: "2.5rem 2rem",
                textAlign: "center",
                marginTop: "2px"
              }}>
                <div style={{display: "flex", justifyContent: "center", marginBottom: "1rem"}}>
                  <span className="flag-wave" style={{display: "inline-block"}}>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
                    </svg>
                  </span>
                </div>
                <p style={{...syne, fontSize: "1.4rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "0.5rem"}}>
                  {result.totalFlags} violation{result.totalFlags !== 1 ? "s" : ""} found.
                </p>
                <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: "420px", margin: "0.5rem auto 1.75rem"}}>
                  You&apos;ve seen 1 of {result.totalFlags}. Upgrade to Pro to unlock every flag, the exact regulation it breaks, and a compliant rewrite for each one.
                </p>
                <Link href={`/signup?plan=scanner${email.trim() ? `&email=${encodeURIComponent(email.trim())}` : ""}`} style={{
                  display: "inline-block",
                  background: "#E5484D",
                  color: "white",
                  ...syne,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
                  textDecoration: "none",
                  letterSpacing: "0.02em"
                }}>
                  Unlock With Pro: {SCANNER_SALE_ACTIVE ? "£149/mo (birthday sale)" : "£350/mo"}
                </Link>
                <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>Cancel anytime. 5 checks a month, every flag fully unlocked.</p>
              </div>
            )}

            {result.totalFlags === 0 && (
              <div style={{
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.15)",
                padding: "2.5rem 2rem",
                textAlign: "center",
                marginTop: "2px"
              }}>
                <p style={{...syne, fontSize: "1.25rem", fontWeight: 800, color: "white", marginBottom: "0.5rem"}}>Your copy looks clean.</p>
                <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem"}}>
                  Save this result. A free account lets you track compliance over time and download a PDF certificate.
                </p>
                <Link href={`/signup${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`} style={{
                  display: "inline-block",
                  background: "#E5484D",
                  color: "white",
                  ...syne,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
                  textDecoration: "none"
                }}>
                  Save My Results: Free
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Feedback link */}
        <div style={{textAlign: "center", marginTop: "3rem"}}>
          <p style={{...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem"}}>Tried it? Let us know what you found.</p>
          <Link href="/feedback" style={{
            ...syne, fontSize: "12px", fontWeight: 700,
            color: "rgba(239,68,68,0.6)",
            textDecoration: "none",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
            Leave Feedback →
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: rgba(255,255,255,0.5); font-style: italic; }
      `}</style>
    </section>
  );
}
