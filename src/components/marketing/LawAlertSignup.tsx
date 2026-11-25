"use client";

import React, { useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

type Status = "idle" | "sending" | "done" | "error";

/**
 * One field, one promise: an email before each date in the law timeline
 * lands. The address goes on the alert list only, not the marketing list.
 */
export function LawAlertSignup() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot, hidden from people
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/law-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      style={{
        marginTop: "1.5rem",
        background: "#0D1B2E",
        border: "1px solid rgba(201,166,107,0.35)",
        borderRadius: "12px",
        padding: "1.5rem 1.75rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.25rem 2rem",
      }}
    >
      <div style={{ flex: "1 1 280px", minWidth: 0 }}>
        <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "0.5rem" }}>
          Law date alerts
        </p>
        <p className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.35rem" }}>
          Get an email before each date lands.
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6 }}>
          One short email per date. No newsletter. Unsubscribe any time.
        </p>
      </div>

      {status === "done" ? (
        <p role="status" style={{ ...syne, flex: "1 1 280px", fontSize: "0.95rem", fontWeight: 600, color: "#F4F1EA", lineHeight: 1.6 }}>
          <span style={{ color: "#C9A66B" }}>You&apos;re on the list.</span> Check your inbox for the dates coming next.
        </p>
      ) : (
        <form onSubmit={submit} style={{ flex: "1 1 320px", minWidth: 0 }} noValidate={false}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <label htmlFor="law-alert-email" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Email address
            </label>
            <input
              id="law-alert-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...syne,
                flex: "1 1 200px",
                minWidth: 0,
                fontSize: "0.95rem",
                color: "#F4F1EA",
                background: "#0A1628",
                border: "1px solid rgba(244,241,234,0.25)",
                borderRadius: "9999px",
                padding: "12px 18px",
                outline: "none",
              }}
            />
            {/* Honeypot. Hidden from people and from screen readers. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "sending"}
              style={{ fontSize: "0.9rem", padding: "12px 24px", opacity: status === "sending" ? 0.7 : 1 }}
            >
              {status === "sending" ? "Adding you" : "Email me"} <span className="arrow">→</span>
            </button>
          </div>
          {status === "error" && (
            <p role="alert" style={{ ...syne, fontSize: "13px", color: "#fca5a5", marginTop: "0.6rem" }}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
