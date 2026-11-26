"use client";

import React, { useId, useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

type Status = "idle" | "sending" | "done" | "error";

const field: React.CSSProperties = {
  ...syne,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
  color: "#F4F1EA",
  background: "#0A1628",
  border: "1px solid rgba(244,241,234,0.28)",
  borderRadius: "10px",
  padding: "14px 16px",
  outline: "none",
};

const label: React.CSSProperties = {
  ...syne,
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(244,241,234,0.7)",
  marginBottom: "8px",
};

const srOnly: React.CSSProperties = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

/**
 * The main action on the site: the visitor hands over a website and an email,
 * and we do the checking. Two required fields, nothing to paste or choose.
 *
 * `compact` is the two field version that sits in the homepage hero.
 * `full` adds an optional line about where they use AI.
 */
export function SiteCheckRequestForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const uid = useId();
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [aiUse, setAiUse] = useState("");
  const [trap, setTrap] = useState(""); // honeypot, hidden from people
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const compact = variant === "compact";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/site-check-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, email, aiUse, company_site: trap }),
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

  const panel: React.CSSProperties = compact
    ? { background: "rgba(10,22,40,0.82)", border: "1px solid rgba(229,72,77,0.45)", borderRadius: "14px", padding: "1.1rem", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }
    : { background: "#0D1B2E", border: "1px solid rgba(229,72,77,0.3)", borderRadius: "14px", padding: "2rem" };

  if (status === "done") {
    return (
      <div role="status" style={{ ...panel, borderColor: "rgba(201,166,107,0.5)", padding: compact ? "1.5rem 1.25rem" : "2.25rem 2rem", textAlign: "center" }}>
        <p className="font-display" style={{ fontSize: compact ? "1.35rem" : "1.6rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.6rem" }}>
          Got it. <span style={{ fontStyle: "italic", color: "#E5484D" }}>Leave it with us.</span>
        </p>
        <p style={{ ...syne, fontSize: "0.98rem", color: "rgba(244,241,234,0.78)", lineHeight: 1.7 }}>
          James will reply personally with your red flag, usually within one working day. If we find nothing, he will tell you that too.
        </p>
      </div>
    );
  }

  const honeypot = (
    <input
      type="text"
      name="company_site"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={trap}
      onChange={(e) => setTrap(e.target.value)}
      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
    />
  );

  const error = status === "error" && (
    <p role="alert" style={{ ...syne, fontSize: "13px", color: "#fca5a5", marginTop: "0.8rem", lineHeight: 1.6, textAlign: compact ? "center" : "left" }}>
      {message}
    </p>
  );

  if (compact) {
    return (
      <form onSubmit={submit} style={panel}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <label htmlFor={`${uid}-w`} style={srOnly}>Your website</label>
          <input
            id={`${uid}-w`}
            type="text"
            inputMode="url"
            required
            autoComplete="url"
            placeholder="yourcompany.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ ...field, flex: "1 1 190px", width: "auto", minWidth: 0 }}
          />
          <label htmlFor={`${uid}-e`} style={srOnly}>Your email</label>
          <input
            id={`${uid}-e`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...field, flex: "1 1 210px", width: "auto", minWidth: 0 }}
          />
          {honeypot}
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "sending"}
            style={{ flex: "1 1 220px", justifyContent: "center", fontSize: "1rem", padding: "14px 24px", opacity: status === "sending" ? 0.7 : 1 }}
          >
            {status === "sending" ? "Sending" : "Show me my red flag"} <span className="arrow">→</span>
          </button>
        </div>
        {error}
      </form>
    );
  }

  return (
    <form onSubmit={submit} style={panel}>
      <div style={{ marginBottom: "1.1rem" }}>
        <label htmlFor={`${uid}-w`} style={label}>Your website</label>
        <input
          id={`${uid}-w`}
          type="text"
          inputMode="url"
          required
          autoComplete="url"
          placeholder="yourcompany.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={field}
        />
      </div>
      <div style={{ marginBottom: "1.1rem" }}>
        <label htmlFor={`${uid}-e`} style={label}>Where to send your red flag</label>
        <input
          id={`${uid}-e`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={field}
        />
      </div>
      <div style={{ marginBottom: "1.4rem" }}>
        <label htmlFor={`${uid}-a`} style={label}>
          Where do you use AI? <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "rgba(244,241,234,0.45)" }}>(optional)</span>
        </label>
        <input
          id={`${uid}-a`}
          type="text"
          maxLength={300}
          placeholder="For example: a chatbot, AI written content, screening applicants"
          value={aiUse}
          onChange={(e) => setAiUse(e.target.value)}
          style={field}
        />
      </div>
      {honeypot}
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "15px 28px", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "Sending" : "Show me my red flag"} <span className="arrow">→</span>
      </button>
      {error}
      <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginTop: "1rem", textAlign: "center" }}>
        Free. No card, no account, no call unless you ask for one. We only use your email to reply about your site.
      </p>
    </form>
  );
}
