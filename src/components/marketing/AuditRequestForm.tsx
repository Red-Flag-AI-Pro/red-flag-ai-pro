"use client";

import React, { useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const labelStyle: React.CSSProperties = {
  ...syne,
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  ...syne,
  width: "100%",
  background: "#0A1628",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "13px 15px",
  fontSize: "14px",
  color: "#F4F1EA",
  outline: "none",
  boxSizing: "border-box",
};

export function AuditRequestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email) {
      setError("Please add your name and email so I can get back to you.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        style={{
          background: "#0D1B2E",
          border: "1px solid rgba(22,163,74,0.3)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center",
          maxWidth: "560px",
          margin: "0 auto",
          boxShadow: "0 0 40px rgba(22,163,74,0.08)",
        }}
      >
        <div style={{ fontSize: "34px", marginBottom: "1rem" }}>✓</div>
        <h3 style={{ ...syne, fontSize: "1.4rem", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          Request received.
        </h3>
        <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
          Thank you. I have your details and I will reply personally within one working day with the next steps and a
          secure payment link. If it is urgent, email me at{" "}
          <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "underline" }}>
            support@redflagaipro.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#0D1B2E",
        border: "1px solid rgba(239,68,68,0.15)",
        borderRadius: "16px",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        maxWidth: "620px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <p style={{ ...mono, fontSize: "10px", color: "#ef4444", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
          ONE TIME · £179 · COMPLIANCE + GOVERNANCE
        </p>
        <h3 style={{ ...syne, fontSize: "clamp(1.3rem, 3.5vw, 1.7rem)", fontWeight: 800, color: "#F4F1EA", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          Request your audit
        </h3>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginTop: "0.6rem", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
          Tell me where to look and what is on your mind. I will reply personally within one working day with next steps
          and a secure payment link.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.1rem" }}>
        <div>
          <label style={labelStyle} htmlFor="af-name">Your name *</label>
          <input style={inputStyle} id="af-name" name="name" type="text" autoComplete="name" required placeholder="Jane Smith" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="af-email">Email *</label>
          <input style={inputStyle} id="af-email" name="email" type="email" autoComplete="email" required placeholder="jane@company.com" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="af-phone">Phone</label>
          <input style={inputStyle} id="af-phone" name="phone" type="tel" autoComplete="tel" placeholder="07700 900000" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="af-company">Company name</label>
          <input style={inputStyle} id="af-company" name="company" type="text" autoComplete="organization" placeholder="Company Ltd" />
        </div>
      </div>

      <div style={{ marginTop: "1.1rem" }}>
        <label style={labelStyle} htmlFor="af-website">Website or funnel to check</label>
        <input style={inputStyle} id="af-website" name="website" type="text" inputMode="url" placeholder="https://yoursite.com" />
      </div>

      <div style={{ marginTop: "1.1rem" }}>
        <label style={labelStyle} htmlFor="af-message">Anything specific you want me to look at?</label>
        <textarea
          style={{ ...inputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }}
          id="af-message"
          name="message"
          placeholder="A page, an ad, an AI tool you have deployed, a claim you are unsure about, or anything that is worrying you."
        />
      </div>

      {status === "error" && (
        <p style={{ ...syne, fontSize: "13px", color: "#ef4444", marginTop: "1rem", textAlign: "center" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          ...syne,
          width: "100%",
          marginTop: "1.5rem",
          background: status === "sending" ? "rgba(229,72,77,0.6)" : "#E5484D",
          color: "white",
          fontSize: "0.95rem",
          fontWeight: 700,
          padding: "15px 24px",
          borderRadius: "9999px",
          border: "none",
          cursor: status === "sending" ? "default" : "pointer",
          letterSpacing: "0.02em",
          boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
        }}
      >
        {status === "sending" ? "Sending…" : "Request my audit — £179"}
      </button>

      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
        No payment taken here. One time, covers both compliance and governance, delivered within 48 hours of payment.
        Your details go straight to the founder and are never shared.
      </p>
    </form>
  );
}
