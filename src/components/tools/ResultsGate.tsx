"use client";

import { useEffect, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

interface ResultsGateProps {
  tool: string;
  title?: string;
  children: React.ReactNode;
}

export function ResultsGate({ tool, title = "Enter your email to see your results — free, no spam.", children }: ResultsGateProps) {
  const storageKey = `rfap_tool_lead_${tool}`;
  const [unlocked, setUnlocked] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem(storageKey)) {
      setUnlocked(true);
    }
    setCheckedStorage(true);
  }, [storageKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/tool-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), tool }),
      });
    } catch {
      // Non-fatal — still unlock even if the lead-capture call fails.
    }
    window.localStorage.setItem(storageKey, email.trim());
    setUnlocked(true);
    setSubmitting(false);
  }

  if (!checkedStorage) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none" }} aria-hidden="true">
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.9) 35%, rgba(10,22,40,0.97) 100%)",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "380px", width: "100%", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "2rem", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem", textAlign: "center" }}>
            Unlock your results
          </p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {title}
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: "100%",
                background: "#0A1628",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "white",
                fontSize: "14px",
                marginBottom: "0.75rem",
              }}
            />
            {error && <p style={{ ...syne, fontSize: "12px", color: "#ef4444", marginBottom: "0.75rem" }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "rgba(229,72,77,0.5)" : "#E5484D",
                color: "white",
                ...syne,
                fontSize: "0.9rem",
                fontWeight: 700,
                padding: "13px",
                borderRadius: "9999px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Unlocking…" : "Show my results →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
