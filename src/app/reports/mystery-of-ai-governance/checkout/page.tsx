"use client";

import { useState } from "react";
import Link from "next/link";
import { REPORT_PRICE } from "@/lib/constants";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function ReportCheckoutPage() {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedImmediateDelivery, setAgreedImmediateDelivery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canContinue = agreedTerms && agreedImmediateDelivery && !isLoading;

  const handleContinue = async () => {
    if (!canContinue) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "report",
          consent: {
            agreedTerms: true,
            agreedImmediateDelivery: true,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong starting checkout. Please try again.");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2.5rem" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem" }}>
            Before you pay
          </p>
          <h1 style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "#F4F1EA", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            {REPORT_PRICE.label}
          </h1>
          <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>
            £{REPORT_PRICE.amount.toFixed(2)}, one off, delivered as a PDF
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0, accentColor: "#E5484D" }}
              />
              <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                I agree to the{" "}
                <Link href="/terms" target="_blank" style={{ color: "#E5484D", textDecoration: "underline" }}>Terms of Service</Link>{" "}
                and the{" "}
                <Link href="/privacy" target="_blank" style={{ color: "#E5484D", textDecoration: "underline" }}>Privacy Policy</Link>.
              </span>
            </label>

            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreedImmediateDelivery}
                onChange={(e) => setAgreedImmediateDelivery(e.target.checked)}
                style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0, accentColor: "#E5484D" }}
              />
              <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                I want this report delivered to me immediately, and I understand that once my download begins I lose my 14 day right to cancel this purchase.
              </span>
            </label>
          </div>

          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            If you would rather keep your full 14 day cancellation right, you can still buy the report, just do not open the download link until you are sure. Email{" "}
            <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>{" "}
            within 14 days for a full refund in that case.
          </p>

          {error && (
            <p style={{ ...syne, fontSize: "13px", color: "#ff6b6b", marginBottom: "1rem" }}>{error}</p>
          )}

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              fontSize: "0.95rem",
              opacity: canContinue ? 1 : 0.4,
              cursor: canContinue ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? "Taking you to payment…" : (
              <>Continue to payment <span className="arrow">→</span></>
            )}
          </button>

          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "1rem" }}>
            Payment handled securely by Stripe. No account required.
          </p>
        </div>
      </div>
    </div>
  );
}
