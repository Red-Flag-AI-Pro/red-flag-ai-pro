"use client";

import React, { useState } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

type Status = "idle" | "sending" | "done" | "error";

const field: React.CSSProperties = {
  ...syne,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem",
  color: "#F4F1EA",
  background: "#0A1628",
  border: "1px solid rgba(244,241,234,0.25)",
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

/**
 * The main action on the site: the visitor hands over a website and an email,
 * and we do the checking. Two required fields, nothing to paste or choose.
 */
export function SiteCheckRequestForm() {
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [aiUse, setAiUse] = useState("");
  const [trap, setTrap] = useState(""); // honeypot, hidden from people
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

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

  if (status === "done") {
    return (
      <div role="status" style={{ background: "#0D1B2E", border: "1px solid rgba(201,166,107,0.45)", borderRadius: "14px", padding: "2.25rem 2rem", textAlign: "center" }}>
        <p className="font-display" style={{ fontSize: "1.6rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>
          Got it. <span style={{ fontStyle: "italic", color: "#E5484D" }}>Leave it with us.</span>
        </p>
        <p style={{ ...syne, fontSize: "0.98rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.7 }}>
          James will reply personally with the worst thing we find on your site, usually within one working day. If we find nothing, he will tell you that too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ background: "#0D1B2E", border: "1px solid rgba(229,72,77,0.3)", borderRadius: "14px", padding: "2rem" }}>
      <div style={{ marginBottom: "1.1rem" }}>
        <label htmlFor="site-check-website" style={label}>Your website</label>
        <input
          id="site-check-website"
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
        <label htmlFor="site-check-email" style={label}>Where to send what we find</label>
        <input
          id="site-check-email"
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
        <label htmlFor="site-check-ai" style={label}>
          Where do you use AI? <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "rgba(244,241,234,0.45)" }}>(optional)</span>
        </label>
        <input
          id="site-check-ai"
          type="text"
          maxLength={300}
          placeholder="For example: a chatbot, AI written content, screening applicants"
          value={aiUse}
          onChange={(e) => setAiUse(e.target.value)}
          style={field}
        />
      </div>
      {/* Honeypot. Hidden from people and from screen readers. */}
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
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "15px 28px", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "Sending" : "Check my site"} <span className="arrow">→</span>
      </button>
      {status === "error" && (
        <p role="alert" style={{ ...syne, fontSize: "13px", color: "#fca5a5", marginTop: "0.8rem", lineHeight: 1.6 }}>
          {message}
        </p>
      )}
      <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginTop: "1rem", textAlign: "center" }}>
        Free. No card, no account, no call unless you ask for one. We only use your email to reply about your site.
      </p>
    </form>
  );
}
