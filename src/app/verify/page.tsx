"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "not-found" }
  | { state: "intact"; actionLabel: string; createdAt: string }
  | { state: "tampered"; actionLabel: string; createdAt: string };

function VerifyForm() {
  const searchParams = useSearchParams();
  const [id, setId] = useState(searchParams.get("id") ?? "");
  const [result, setResult] = useState<Result>({ state: "idle" });

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    setResult({ state: "loading" });
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(id.trim())}`);
      if (res.status === 404) {
        setResult({ state: "not-found" });
        return;
      }
      const data = await res.json();
      setResult({
        state: data.intact ? "intact" : "tampered",
        actionLabel: data.actionLabel ?? "Audit record",
        createdAt: data.createdAt,
      });
    } catch {
      setResult({ state: "not-found" });
    }
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "8rem 1.5rem 6rem" }}>
      <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>
        Public verification
      </p>
      <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem", textAlign: "center", color: "#F4F1EA" }}>
        Check any Red Flag report, untampered.
      </h1>
      <p style={{ ...syne, fontSize: "1.05rem", color: "rgba(244,241,234,0.5)", lineHeight: 1.7, marginBottom: "3rem", textAlign: "center" }}>
        Every Red Flag audit log entry is sealed with a cryptographic hash. Paste the verification ID printed on any report below to confirm, independently and without an account, that the record is exactly what was sealed.
      </p>

      <form onSubmit={handleVerify} style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Paste verification ID, e.g. a1b2c3d4-..."
          style={{
            flex: 1,
            ...mono,
            fontSize: "13px",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            color: "#F4F1EA",
          }}
        />
        <button
          type="submit"
          style={{
            ...syne,
            fontSize: "14px",
            fontWeight: 700,
            padding: "12px 24px",
            borderRadius: "8px",
            background: "#E5484D",
            color: "white",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Verify
        </button>
      </form>

      {result.state === "loading" && (
        <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.5)", textAlign: "center" }}>Checking…</p>
      )}

      {result.state === "not-found" && (
        <div style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", padding: "1.5rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.6)" }}>No record found for that ID. Double check it was copied exactly from the report.</p>
        </div>
      )}

      {result.state === "intact" && (
        <div style={{ borderRadius: "10px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "1.75rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>✓ Verified intact</p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.6)" }}>
            {result.actionLabel}, sealed {new Date(result.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}. This record matches its cryptographic seal exactly. It has not been edited, deleted, or backdated since.
          </p>
        </div>
      )}

      {result.state === "tampered" && (
        <div style={{ borderRadius: "10px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", padding: "1.75rem", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>✕ Seal broken</p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.6)" }}>
            This record does not match its original cryptographic seal. If you received this ID from a Red Flag report, contact support@redflagaipro.com immediately.
          </p>
        </div>
      )}

      <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.3)", textAlign: "center", marginTop: "3rem" }}>
        This page checks one record's integrity. It does not expose any other data from the account it belongs to.
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <div style={{ background: "#0A1628", minHeight: "100vh" }}>
        <Suspense>
          <VerifyForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
