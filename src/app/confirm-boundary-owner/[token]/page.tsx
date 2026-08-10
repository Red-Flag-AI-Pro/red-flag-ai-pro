"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

interface RecordPreview {
  decision: string;
  owner_name: string;
  owner_role: string;
  owner_confirmed_at: string | null;
  owner_confirmed_name: string | null;
}

export default function ConfirmBoundaryOwnerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [record, setRecord] = useState<RecordPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ verify_url: string | null } | null>(null);

  useEffect(() => {
    fetch(`/api/boundary-records/confirm-owner/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setRecord(data.record))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/boundary-records/confirm-owner/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
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

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <section style={{ padding: "8rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            Seat confirmation
          </p>

          {loading && <p style={{ ...syne, color: "rgba(255,255,255,0.5)" }}>Loading…</p>}

          {notFound && (
            <p style={{ ...syne, color: "rgba(255,255,255,0.7)" }}>
              This confirmation link is invalid, or it has already been used.
            </p>
          )}

          {record && !done && (
            <>
              <h1 style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "1.5rem", lineHeight: 1.3 }}>
                You have been named the accountable owner of a decision
              </h1>

              <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
                  What was approved
                </p>
                <p style={{ ...syne, fontSize: "0.95rem", color: "#F4F1EA", marginBottom: "1.25rem", lineHeight: 1.6 }}>{record.decision}</p>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
                  Named owner
                </p>
                <p style={{ ...syne, fontSize: "0.95rem", color: "#F4F1EA" }}>{record.owner_name} ({record.owner_role})</p>
              </div>

              <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                A seat named in a record nobody circulated is not accountability, it is a document produced later at a worse moment. Confirming here means you know you hold this seat and what it makes you accountable for. If this is the first you are hearing of it, that is exactly why this link exists.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem", display: "block" }}>Your name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Your name" />
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem", display: "block" }}>Your email (optional)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@company.com" />
                </div>
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
                  {submitting ? "Confirming…" : "Confirm I hold this seat"}
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
