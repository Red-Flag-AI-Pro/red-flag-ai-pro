"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { JurisdictionPicker, JURISDICTIONS } from "@/components/ui/JurisdictionPicker";
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

Example: "Make £10,000 in your first 30 days — guaranteed. Limited spots available. Act now before the price goes up tonight at midnight."`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DemoScanner() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jurisdictions, setJurisdictions] = useState<JurisdictionCode[]>(
    JURISDICTIONS.map(j => j.code)
  );

  async function handleScan() {
    if (!content.trim()) return;

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address — each address gets one free scan.");
      return;
    }

    setLoading(true);
    setError(null);
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
    <section id="demo" style={{
      background: "linear-gradient(180deg, #0a0a0a 0%, #0f0505 50%, #0a0a0a 100%)",
      padding: "7rem 1.5rem",
      position: "relative",
      overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.04)"
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "350px", pointerEvents: "none",
        background: "radial-gradient(ellipse at center top, rgba(204,0,0,0.15) 0%, transparent 70%)"
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
              Try It Free — No Account Needed
            </p>
          </div>

          <h2 style={{
            ...syne,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            marginBottom: "1rem"
          }}>
            Paste Your Copy.<br />
            <span style={{
              background: "linear-gradient(90deg, #ef4444 0%, #cc0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Get Your Verdict.</span>
          </h2>

          <p style={{...syne, fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 0.75rem"}}>
            Buyers: paste any ad before you buy. Sellers: paste your copy before you publish. 60 seconds. No signup.
          </p>

          <p style={{...syne, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em"}}>
            No account. No card. Just your email — one free scan per address.
          </p>
        </div>

        {/* Founder quote */}
        <div style={{
          background: "#0f0505",
          border: "1px solid rgba(239,68,68,0.15)",
          padding: "1.75rem 2rem",
          marginBottom: "1.5rem",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", top: "-1px", left: "2rem",
            width: "3rem", height: "2px",
            background: "linear-gradient(90deg, #cc0000, transparent)"
          }} />
          <p style={{
            ...syne,
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.8,
            fontStyle: "italic",
            marginBottom: "1.25rem"
          }}>
            &ldquo;I spent years writing funnels and running ads{" "}
            <span style={{color: "#ef4444", fontStyle: "italic"}}>without knowing half of what I was doing was illegal.</span>{" "}
            Not because I was trying to break the law — because nobody told me where the line was.{" "}
            <span style={{color: "white", fontWeight: 700, fontStyle: "italic"}}>Check your copy before you spend a penny on ads or build another funnel.</span>{" "}
            Don&apos;t lose your money finding out the hard way. Sixty seconds. Free.&rdquo;
          </p>
          <p style={{...syne, fontSize: "11px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem"}}>
            — James, Founder
          </p>
          <div style={{borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem"}}>
            <p style={{
              ...syne,
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.9,
              fontStyle: "italic"
            }}>
              &ldquo;And if you are a buyer —{" "}
              <span style={{color: "#ef4444", fontStyle: "italic"}}>you have been mis-sold to more times than you know.</span>{" "}
              Income claims that break the law. Scarcity that was never real. Guarantees written to be impossible to claim.{" "}
              <span style={{color: "white", fontWeight: 700, fontStyle: "italic"}}>Paste the ad before you hand over your money.</span>{" "}
              It takes sixty seconds to know if someone is lying to you.&rdquo;
            </p>
          </div>
        </div>

        {/* Scanner box */}
        <div style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "2rem",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)"
        }}>
          <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem"}}>Your email — one free scan per address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              background: "#1a1a1a",
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
            onFocus={(e) => { e.target.style.borderColor = "rgba(204,0,0,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(204,0,0,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; }}
          />
          <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginTop: "-0.85rem", marginBottom: "1.25rem"}}>
            We&apos;ll only use this to send your results and one follow-up — no spam, unsubscribe anytime.
          </p>

          <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem"}}>Paste your copy here</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={8}
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.9)",
              ...syne,
              fontSize: "14px",
              lineHeight: 1.8,
              padding: "1.25rem 1.5rem",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(204,0,0,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(204,0,0,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; }}
          />

          {/* Jurisdiction picker */}
          <div style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
          }}>
            <JurisdictionPicker
              value={jurisdictions}
              onChange={setJurisdictions}
            />
          </div>

          {error && (
            <p style={{...syne, fontSize: "13px", color: "#ef4444", marginTop: "0.75rem"}}>{error}</p>
          )}

          <button
            onClick={handleScan}
            disabled={loading || !content.trim() || !email.trim() || jurisdictions.length === 0}
            style={{
              marginTop: "1rem",
              width: "100%",
              background: loading || !content.trim() || !email.trim() ? "rgba(204,0,0,0.3)" : "#cc0000",
              color: "white",
              ...syne,
              fontSize: "0.9rem",
              fontWeight: 700,
              padding: "14px 24px",
              border: "none",
              borderRadius: "9999px",
              cursor: loading || !content.trim() || !email.trim() ? "not-allowed" : "pointer",
              boxShadow: loading || !content.trim() || !email.trim() ? "none" : "0 8px 32px rgba(204,0,0,0.35)",
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
                Scanning...
              </span>
            ) : jurisdictions.length === 0
              ? "Select at least one jurisdiction"
              : jurisdictions.length === JURISDICTIONS.length
              ? "Scan Now — All 9 Jurisdictions"
              : `Scan Now — ${jurisdictions.length} Jurisdiction${jurisdictions.length > 1 ? "s" : ""}`
            }
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "2px"}}>

            {/* Score row */}
            <div style={{
              background: "#0f0505",
              border: "1px solid rgba(239,68,68,0.15)",
              padding: "1.75rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem"}}>Compliance Score</p>
                <p style={{...mono, fontSize: "3.5rem", fontWeight: 700, color: scoreColor, lineHeight: 1, letterSpacing: "-0.03em"}}>
                  {result.score}<span style={{fontSize: "1.25rem", color: "rgba(255,255,255,0.2)"}}>/ 100</span>
                </p>
              </div>
              <div style={{textAlign: "right"}}>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem"}}>Flags Found</p>
                <p style={{...mono, fontSize: "3.5rem", fontWeight: 700, color: result.totalFlags > 0 ? "#ef4444" : "#4ade80", lineHeight: 1, letterSpacing: "-0.03em"}}>{result.totalFlags}</p>
              </div>
            </div>

            {/* Flag cards */}
            {result.flags.map((flag, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "#0a0a0a" : "#0f0505",
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
                      Your copy contains a violation in this category that could trigger regulatory action. Sign up to see the exact line, the regulation it breaks, and the compliant rewrite.
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
                      }}>Show me what&apos;s wrong</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Founder reinforcement — sits right where trust is being decided */}
            {result.flags.some((f) => !f.unlocked) && (
              <div style={{
                background: "#0f0505",
                borderLeft: "3px solid #ef4444",
                padding: "1.25rem 1.75rem",
                marginTop: "2px"
              }}>
                <p style={{...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontStyle: "italic"}}>
                  &ldquo;This is exactly the blind spot I had —{" "}
                  <span style={{color: "white", fontWeight: 700, fontStyle: "italic"}}>here&apos;s what I built so you don&apos;t make the same mistake.</span>&rdquo;
                </p>
                <p style={{...syne, fontSize: "10px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.6rem"}}>
                  — James, Founder
                </p>
              </div>
            )}

            {/* CTA after flags */}
            {result.totalFlags > 0 && (
              <div style={{
                background: "#0f0505",
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
                  Sign up free to see exactly what&apos;s wrong, which regulation it breaks, and the compliant rewrite — ready to use immediately.
                </p>
                <Link href={`/signup${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`} style={{
                  display: "inline-block",
                  background: "#cc0000",
                  color: "white",
                  ...syne,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
                  textDecoration: "none",
                  letterSpacing: "0.02em"
                }}>
                  See Exactly What&apos;s Wrong — Free
                </Link>
                <p style={{...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem"}}>No credit card. No commitment. 30 seconds.</p>
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
                  background: "#cc0000",
                  color: "white",
                  ...syne,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
                  textDecoration: "none"
                }}>
                  Save My Results — Free
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Feedback link */}
        <div style={{textAlign: "center", marginTop: "3rem"}}>
          <p style={{...syne, fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem"}}>Tried the scanner? Let us know what you found.</p>
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
