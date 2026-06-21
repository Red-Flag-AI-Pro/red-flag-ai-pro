"use client";

import { useEffect, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

interface ToolEmailGateProps {
  tool: string;
  title: string;
  children: React.ReactNode;
}

export function ToolEmailGate({ tool, title, children }: ToolEmailGateProps) {
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
      // Non-fatal — still unlock the tool even if the lead-capture call fails.
    }
    window.localStorage.setItem(storageKey, email.trim());
    setUnlocked(true);
    setSubmitting(false);
  }

  // Avoid a flash of the gate before we've checked localStorage.
  if (!checkedStorage) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div style={{ maxWidth: "440px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
      <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2.5rem" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem", textAlign: "center" }}>
          Free tool
        </p>
        <h2 style={{ ...syne, fontSize: "1.3rem", fontWeight: 800, color: "white", textAlign: "center", marginBottom: "0.75rem", lineHeight: 1.3 }}>
          {title}
        </h2>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Enter your email to use this tool — free, no account, no spam.
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
            {submitting ? "Unlocking…" : "Unlock tool →"}
          </button>
        </form>
      </div>
    </div>
  );
}
