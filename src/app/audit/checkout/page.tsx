"use client";

// £449 audit checkout. Guest checkout since 27 Nov 2026: the done for you
// audit should never ask a buyer to create an account. The guarantee and the
// liability cap are shown here, before payment, and agreed with a tick (agree
// the cap before the work starts, not after the report lands).

import { useState } from "react";
import Link from "next/link";
import { AUDIT_PRICE } from "@/lib/constants";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const box = { borderRadius: "12px", padding: "1rem 1.1rem", marginBottom: "0.9rem" } as React.CSSProperties;
const small = { ...syne, fontSize: "13px", color: "rgba(244,241,234,0.75)", lineHeight: 1.6 } as React.CSSProperties;

export default function AuditCheckoutPage() {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedStart, setAgreedStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canContinue = agreedTerms && agreedStart && !isLoading;

  const handleContinue = async () => {
    if (!canContinue) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "audit",
          consent: { agreedTerms: true, agreedStart: true, timestamp: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong starting checkout. Please try again, or email support@redflagaipro.com.");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong starting checkout. Please try again, or email support@redflagaipro.com.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "clamp(1.5rem, 5vw, 2.5rem)" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>
            Before you pay
          </p>
          <h1 style={{ ...syne, fontSize: "1.55rem", fontWeight: 800, color: "#F4F1EA", lineHeight: 1.2, marginBottom: "0.4rem" }}>
            Your compliance and AI governance audit
          </h1>
          <p style={{ ...syne, fontSize: "1.05rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
            £{AUDIT_PRICE.amount}, one payment. No account needed.
          </p>

          <ul style={{ ...small, listStyle: "disc", paddingLeft: "1.1rem", marginBottom: "1.4rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <li>Your website checked against the UK advertising, privacy and AI rules.</li>
            <li>A one page front sheet: what passed, and what needs fixing.</li>
            <li>Every finding quoted from your own page, with the rule it breaks and how to fix it.</li>
            <li>Checked and signed by James Stokes.</li>
          </ul>

          <div style={{ ...box, background: "rgba(201,166,107,0.10)", border: "1px solid rgba(201,166,107,0.45)" }}>
            <p style={small}>
              <strong style={{ color: "#F4F1EA" }}>The guarantee.</strong>{" "}If we find nothing worth fixing, you get your £{AUDIT_PRICE.amount}{" "}back in full.{" "}
              &ldquo;Worth fixing&rdquo; means a finding that breaks a rule we name, quoted from your own page.
            </p>
          </div>
          <div style={{ ...box, background: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.14)", marginBottom: "1.4rem" }}>
            <p style={small}>
              <strong style={{ color: "#F4F1EA" }}>What it is, and isn&rsquo;t.</strong>{" "}A check, not legal advice, and it doesn&rsquo;t promise a regulator will agree with us.{" "}
              Our liability is capped at the £{AUDIT_PRICE.amount}{" "}you pay and doesn&rsquo;t cover fines or lost revenue. The report is written for your business only.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.4rem" }}>
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0, accentColor: "#E5484D" }} />
              <span style={small}>
                I agree to the{" "}
                <Link href="/terms" target="_blank" style={{ color: "#E5484D", textDecoration: "underline" }}>Terms</Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" style={{ color: "#E5484D", textDecoration: "underline" }}>Privacy Policy</Link>,
                including the guarantee and the £{AUDIT_PRICE.amount} cap above.
              </span>
            </label>
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={agreedStart} onChange={(e) => setAgreedStart(e.target.checked)}
                style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0, accentColor: "#E5484D" }} />
              <span style={small}>
                Please start my audit straight away. If I change my mind before work starts, I can email support@redflagaipro.com for a full refund.
              </span>
            </label>
          </div>

          {error && <p style={{ ...syne, fontSize: "13px", color: "#ff6b6b", marginBottom: "1rem" }}>{error}</p>}

          <button onClick={handleContinue} disabled={!canContinue} className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "0.95rem", opacity: canContinue ? 1 : 0.4, cursor: canContinue ? "pointer" : "not-allowed" }}>
            {isLoading ? "Taking you to payment…" : <>Pay £{AUDIT_PRICE.amount} <span className="arrow">→</span></>}
          </button>

          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "1rem" }}>
            Payment handled securely by Stripe. You&rsquo;ll be asked for your website address there.
          </p>
        </div>
        <p style={{ ...syne, fontSize: "12px", textAlign: "center", marginTop: "1rem" }}>
          <Link href="/audit" style={{ color: "rgba(244,241,234,0.5)", textDecoration: "none" }}>← Back to the audit</Link>
        </p>
      </div>
    </div>
  );
}
