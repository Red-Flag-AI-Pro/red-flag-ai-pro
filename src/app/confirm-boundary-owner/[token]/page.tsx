"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";
import type { BoundaryOption, BoundaryRisk, BoundaryWarning, ExternalDependency, BoundaryFalsifier } from "@/types";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

// "naming someone without giving them anything to inspect makes them a
// scapegoat, not an accountable owner." Everything the owner is meant to be
// accountable for, not just the headline decision — see the GET handler in
// /api/boundary-records/confirm-owner/[token]/route.ts for the reasoning.
interface RecordPreview {
  decision: string;
  owner_name: string;
  owner_role: string;
  owner_confirmed_at: string | null;
  owner_confirmed_name: string | null;
  owner_reconfirmed_at: string | null;
  owner_reconfirmed_name: string | null;
  options_considered: BoundaryOption[];
  risks_accepted: BoundaryRisk[];
  warnings_overridden: BoundaryWarning[];
  external_dependencies: ExternalDependency[];
  expires_at: string | null;
  expiry_conditions: BoundaryFalsifier[];
  completion_condition: string | null;
  stop_authority_name: string | null;
  stop_authority_role: string | null;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ConfirmBoundaryOwnerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [record, setRecord] = useState<RecordPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ verify_url: string | null; reconfirmed: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/boundary-records/confirm-owner/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setRecord(data.record))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  // owner_confirmed_at already set is what makes this link a reconfirmation
  // rather than a first confirmation — the same signal the API routes use,
  // so the page can't drift out of sync with what the backend decided.
  const isReconfirm = Boolean(record?.owner_confirmed_at);
  const alreadyReconfirmed = Boolean(record?.owner_reconfirmed_at);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/boundary-records/confirm-owner/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setDone(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0F2138", border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.9)", ...syne, fontSize: "14px", padding: "12px 14px",
    outline: "none", borderRadius: "6px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
    padding: "1.5rem", marginBottom: "1.5rem",
  };
  const kickerStyle: React.CSSProperties = {
    ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem",
  };
  const bodyStyle: React.CSSProperties = { ...syne, fontSize: "0.9rem", color: "#F4F1EA", lineHeight: 1.6 };

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <section style={{ padding: "8rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            {isReconfirm ? "Seat reconfirmation" : "Seat confirmation"}
          </p>

          {loading && <p style={{ ...syne, color: "rgba(255,255,255,0.5)" }}>Loading…</p>}

          {notFound && (
            <p style={{ ...syne, color: "rgba(255,255,255,0.7)" }}>
              This confirmation link is invalid, or it has already been used.
            </p>
          )}

          {record && alreadyReconfirmed && !done && (
            <div>
              <h1 style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Already reconfirmed.</h1>
              <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                {record.owner_reconfirmed_name} reconfirmed this seat on {record.owner_reconfirmed_at ? fmtDate(record.owner_reconfirmed_at) : ""}. This link has done its job.
              </p>
            </div>
          )}

          {record && !alreadyReconfirmed && !done && (
            <>
              <h1 style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "1.5rem", lineHeight: 1.3 }}>
                {isReconfirm
                  ? "Please confirm you still hold this seat"
                  : "You have been named the accountable owner of a decision"}
              </h1>

              {isReconfirm && record.owner_confirmed_name && (
                <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {record.owner_confirmed_name} first confirmed holding this seat
                  {record.owner_confirmed_at ? ` on ${fmtDate(record.owner_confirmed_at)}` : ""}. Roles change — this asks whether that is still current, not whether it was ever true.
                </p>
              )}

              <div style={cardStyle}>
                <p style={kickerStyle}>What was approved</p>
                <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{record.decision}</p>
                <p style={kickerStyle}>Named owner</p>
                <p style={bodyStyle}>{record.owner_name} ({record.owner_role})</p>
              </div>

              {(record.options_considered.length > 0 || record.risks_accepted.length > 0) && (
                <div style={cardStyle}>
                  {record.options_considered.length > 0 && (
                    <>
                      <p style={kickerStyle}>Options considered</p>
                      <ul style={{ margin: "0 0 1.25rem", padding: 0, listStyle: "none" }}>
                        {record.options_considered.map((o, i) => (
                          <li key={i} style={{ ...bodyStyle, marginBottom: "0.3rem" }}>• {o.label}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {record.risks_accepted.length > 0 && (
                    <>
                      <p style={kickerStyle}>Risks accepted</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {record.risks_accepted.map((r, i) => (
                          <li key={i} style={{ ...bodyStyle, marginBottom: "0.3rem" }}>
                            • {r.risk}{r.mitigation ? ` — mitigated by ${r.mitigation}` : ""}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {record.warnings_overridden.length > 0 && (
                <div style={cardStyle}>
                  <p style={kickerStyle}>Warnings overridden</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {record.warnings_overridden.map((w, i) => (
                      <li key={i} style={{ ...bodyStyle, marginBottom: "0.6rem" }}>
                        • {w.warning_text}{w.source_name ? ` — raised by ${w.source_name}${w.source_role ? ` (${w.source_role})` : ""}` : ""}
                        <br />
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>Overridden because: {w.override_reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {record.external_dependencies.length > 0 && (
                <div style={cardStyle}>
                  <p style={kickerStyle}>External dependencies</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {record.external_dependencies.map((d, i) => (
                      <li key={i} style={{ ...bodyStyle, marginBottom: "0.3rem" }}>
                        • {d.name}{d.organisation ? ` (${d.organisation})` : ""} —{" "}
                        {d.fallback_tested ? "fallback tested" : "fallback not tested"}
                        {d.fallback_note ? `: ${d.fallback_note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(record.expires_at || record.expiry_conditions.length > 0 || record.completion_condition || record.stop_authority_name) && (
                <div style={cardStyle}>
                  {record.expires_at && (
                    <>
                      <p style={kickerStyle}>Authority expires</p>
                      <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{fmtDate(record.expires_at)}</p>
                    </>
                  )}
                  {record.expiry_conditions.length > 0 && (
                    <>
                      <p style={kickerStyle}>Stops being valid if</p>
                      <ul style={{ margin: "0 0 1.25rem", padding: 0, listStyle: "none" }}>
                        {record.expiry_conditions.map((c, i) => (
                          <li key={i} style={{ ...bodyStyle, marginBottom: "0.3rem" }}>• {c.condition}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {record.completion_condition && (
                    <>
                      <p style={kickerStyle}>Complete when</p>
                      <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{record.completion_condition}</p>
                    </>
                  )}
                  {record.stop_authority_name && (
                    <>
                      <p style={kickerStyle}>Can halt this before expiry</p>
                      <p style={bodyStyle}>{record.stop_authority_name}{record.stop_authority_role ? ` (${record.stop_authority_role})` : ""}</p>
                    </>
                  )}
                </div>
              )}

              <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {isReconfirm
                  ? "A seat confirmed once and never rechecked can look valid long after the person has moved on. Confirming here means you, today, still hold it and are still accountable for what it covers above."
                  : "A seat named in a record nobody circulated is not accountability, it is a document produced later at a worse moment. Confirming here means you know you hold this seat and, having actually seen what it covers above, what it makes you accountable for. If this is the first you are hearing of it, that is exactly why this link exists."}
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem", display: "block" }}>Your name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Your name" />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem", display: "block" }}>Your role</label>
                  <input value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle} placeholder="e.g. DPO, CRO, Legal Counsel" />
                </div>
                {!isReconfirm && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem", display: "block" }}>Your email (optional)</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@company.com" />
                  </div>
                )}
                {error && <p style={{ ...syne, fontSize: "13px", color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  style={{
                    background: submitting ? "rgba(229,72,77,0.5)" : "#E5484D", color: "white", ...syne,
                    fontSize: "0.9rem", fontWeight: 700, padding: "13px 26px", borderRadius: "9999px",
                    border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Confirming…" : isReconfirm ? "Confirm I still hold this seat" : "Confirm I hold this seat"}
                </button>
              </form>
            </>
          )}

          {done && (
            <div>
              <h1 style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Confirmed.</h1>
              <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "1rem" }}>
                This is now sealed as its own dated record, independently timestamped. Whoever named you can see it landed.
              </p>
              {done.verify_url && (
                <a href={done.verify_url} style={{ color: "#E5484D", ...syne, fontSize: "0.9rem" }}>Check the sealed record →</a>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
