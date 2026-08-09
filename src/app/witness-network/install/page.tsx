"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>{eyebrow}</p>
        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem" }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.62)", lineHeight: 1.75, marginBottom: "1.1rem" }}>{children}</p>;
}

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

function InstallRequestForm() {
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
        body: JSON.stringify({ company, website, contactName, email, recordsKept, whyJoin, inquiryType: "install_node" }),
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

  if (submit.state === "ok") {
    return (
      <div style={{ borderRadius: "12px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "2rem", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "#4ade80", marginBottom: "0.6rem" }}>✓ Request received</p>
        <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.65)", lineHeight: 1.7 }}>
          Thank you. We reply personally to every request, usually within a couple of days. In the meantime the package itself
          is public — the code, the README, and the exact algorithm your chain would run are all in the repo already.
        </p>
      </div>
    );
  }

  return (
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
        <label style={labelStyle} htmlFor="recordsKept">What would you seal on your own node?</label>
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
        <label style={labelStyle} htmlFor="whyJoin">Anything else worth knowing? (optional)</label>
        <textarea
          id="whyJoin"
          style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
          value={whyJoin}
          onChange={(e) => setWhyJoin(e.target.value)}
          maxLength={2000}
          placeholder="Team size, existing infrastructure, timeline…"
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
        {submit.state === "sending" ? "Sending…" : "Request installation"}
      </button>

      {submit.state === "error" && (
        <div style={{ borderRadius: "10px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", padding: "1rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "13px", color: "#ef4444" }}>{submit.message}</p>
        </div>
      )}

      <p style={{ ...syne, fontSize: "0.75rem", color: "rgba(244,241,234,0.35)", textAlign: "center", lineHeight: 1.6 }}>
        We use these details only to reply to your request. No mailing lists, no resale.
      </p>
    </form>
  );
}

export default function WitnessInstallPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Open witness standard</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Run your own node. <span style={{ fontStyle: "italic", color: "#E5484D" }}>Trust nobody's infrastructure but yours.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            The <a href="/witness-network/hosting" style={{ color: "#E5484D" }}>hosted option</a> has Red Flag hold your chain for you. This is the other way: an
            installable, standalone package that runs on your own servers, seals your own events into your own chain, and
            anchors itself into the wider network as a genuine independent peer, not a customer we witness on your behalf.
          </p>
        </div>
      </section>

      <Section eyebrow="What it actually is" title="One file, no dependencies, nothing hidden">
        <P>
          <strong style={{ color: "#F4F1EA" }}>The package</strong> is a standalone Node.js server, dependency-free on
          purpose, that runs the exact same hashing algorithm the hosted Red Flag chain runs. Every hash it produces is
          independently recomputable from your own log file with nothing but SHA-256, a chain nobody has to trust
          because it can be checked by hand.
        </P>
        <P>
          <strong style={{ color: "#F4F1EA" }}>It stays on your infrastructure.</strong> Events you seal never leave your
          servers. If you choose to anchor into the Red Flag chain (or any other Open Witness Standard peer), only the
          tip hash goes out, on a schedule you set, nothing else.
        </P>
        <P>
          <strong style={{ color: "#F4F1EA" }}>It becomes a real peer, not a client.</strong> Your node has its own
          dashboard, its own verify endpoint, its own log — the same shape a company that built this in-house would
          have, because that is effectively what you now own.
        </P>
      </Section>

      <Section eyebrow="Who this is for" title="Data sovereignty, not convenience">
        <P>
          If your team can wire up the raw <span style={mono}>/api/witness/anchor</span> endpoint themselves, you
          probably don&apos;t need this either — see the <a href="/witness-network" style={{ color: "#E5484D" }}>free public network</a> directly.
          This is for a team that has already decided it wants the chain itself, not just the sealed proof, to live on
          infrastructure it controls. Regulated data, client records, or an internal policy that nothing sensitive
          touches a third party&apos;s servers, even hashed. That decision is the whole reason this option exists.
        </P>
      </Section>

      <Section eyebrow="Pricing — first pass, negotiable" title="A license and a support relationship, not a subscription">
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.5rem" }}>License, one time</p>
            <p style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "#F4F1EA" }}>£2,500–£4,000</p>
            <p style={{ ...syne, fontSize: "11.5px", color: "rgba(244,241,234,0.5)", marginTop: "0.4rem" }}>Setup on your infrastructure included</p>
          </div>
          <div style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(201,166,107,0.3)", background: "rgba(201,166,107,0.05)" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "0.5rem" }}>Support, per month (optional)</p>
            <p style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "#F4F1EA" }}>£250–£400</p>
            <p style={{ ...syne, fontSize: "11.5px", color: "rgba(244,241,234,0.5)", marginTop: "0.4rem" }}>Version updates and troubleshooting, not required to keep running</p>
          </div>
        </div>
        <P>
          Higher than the hosted install fee on purpose. Software that runs unattended on infrastructure we don&apos;t
          control carries more of our support burden across environments we&apos;ve never seen, and the price reflects
          that honestly rather than pretending it&apos;s the same job as hosting. These figures haven&apos;t been tested
          against a real customer yet — if the number that fits your situation is different, say so.
        </P>
      </Section>

      <section style={{ padding: "1.5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.5rem", textAlign: "center" }}>Request installation</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem", textAlign: "center" }}>
            Tell us about your setup and we&apos;ll reply with next steps, or read the package yourself first — it&apos;s
            public on GitHub, nothing about it is gated.
          </p>
          <InstallRequestForm />
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro.
        </p>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)", marginTop: "1rem" }}>
          See also <a href="/installations" style={{ color: "#C9A66B" }}>all installations & custom work</a>,{" "}
          <a href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</a>,{" "}
          <a href="/witness-network/hosting" style={{ color: "#C9A66B" }}>hosted witnessing</a> and{" "}
          <a href="/witness-standard/peer-agreement" style={{ color: "#C9A66B" }}>the peer agreement</a>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
