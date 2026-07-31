"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const inputStyle: React.CSSProperties = {
  ...syne,
  width: "100%",
  fontSize: "0.95rem",
  color: "#F4F1EA",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "14px 16px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  ...syne,
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(244,241,234,0.65)",
  marginBottom: "0.5rem",
};

type SubmitState =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "ok" }
  | { state: "error"; message: string };

export default function WitnessApplyPage() {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [recordsKept, setRecordsKept] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ state: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmit({ state: "sending" });
    try {
      const res = await fetch("/api/witness/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, website, contactName, email, recordsKept, whyJoin }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSubmit({ state: "ok" });
      } else {
        setSubmit({ state: "error", message: data.error ?? "Something went wrong. Try again." });
      }
    } catch {
      setSubmit({ state: "error", message: "Could not reach the server. Try again." });
    }
  }

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none",
            background: "radial-gradient(ellipse 640px 320px at 50% 0%, rgba(229,72,77,0.16), transparent 70%)",
          }}
        />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.75rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>
              Witness network
            </p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: "1.1rem" }}>
            Apply to <span style={{ fontStyle: "italic", color: "#E5484D" }}>join</span>.
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            The network is open to applications, but we are only taking a small number of companies at this
            stage, and joining will not stay free forever. If your business keeps records that matter,
            tell us who you are. We reply personally to every application.
          </p>
        </div>
      </section>

      <section style={{ padding: "1.5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          {submit.state === "ok" ? (
            <div style={{ borderRadius: "12px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "2rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.6rem" }}>✓ Application received</p>
              <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.65)", lineHeight: 1.7 }}>
                Thank you. We read every application ourselves and reply personally, usually within a couple of days.
                In the meantime, you can <a href="/witness-network" style={{ color: "#E5484D", textDecoration: "underline" }}>press the button</a> and
                watch the network work, or <a href="/witness-standard" style={{ color: "#E5484D", textDecoration: "underline" }}>read the open standard</a> your
                chain would implement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={labelStyle} htmlFor="company">Company</label>
                <input id="company" style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={200} placeholder="Company name" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="website">Website</label>
                <input id="website" style={inputStyle} value={website} onChange={(e) => setWebsite(e.target.value)} required maxLength={300} placeholder="https://…" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="contactName">Your name</label>
                <input id="contactName" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required maxLength={200} placeholder="Who are we talking to?" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Work email</label>
                <input id="email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} placeholder="you@company.com" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="recordsKept">What records does your company keep?</label>
                <textarea
                  id="recordsKept"
                  style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
                  value={recordsKept}
                  onChange={(e) => setRecordsKept(e.target.value)}
                  required
                  maxLength={2000}
                  placeholder="Audit trails, compliance evidence, AI decision logs, client records…"
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="whyJoin">Why do you want in? (optional)</label>
                <textarea
                  id="whyJoin"
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  maxLength={2000}
                  placeholder="What made you apply today?"
                />
              </div>

              <button
                type="submit"
                disabled={submit.state === "sending"}
                style={{
                  ...syne, fontSize: "15px", fontWeight: 700, padding: "16px 24px",
                  borderRadius: "10px", background: submit.state === "sending" ? "rgba(229,72,77,0.55)" : "#E5484D",
                  color: "white", border: "none", cursor: submit.state === "sending" ? "default" : "pointer",
                  boxShadow: submit.state === "sending" ? "none" : "0 10px 32px -8px rgba(229,72,77,0.55)",
                }}
              >
                {submit.state === "sending" ? "Sending…" : "Send application"}
              </button>

              {submit.state === "error" && (
                <div style={{ borderRadius: "10px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", padding: "1rem", textAlign: "center" }}>
                  <p style={{ ...syne, fontSize: "13px", color: "#ef4444" }}>{submit.message}</p>
                </div>
              )}

              <p style={{ ...syne, fontSize: "0.75rem", color: "rgba(244,241,234,0.35)", textAlign: "center", lineHeight: 1.6 }}>
                We use these details only to assess and reply to your application. No mailing lists, no resale.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
