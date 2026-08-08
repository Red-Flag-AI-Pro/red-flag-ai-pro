"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface ReviewRecord {
  id: string;
  ruleset_version: string;
  reviewed_by: string;
  reviewer_role: string;
  context_note: string | null;
  next_review_due: string | null;
  created_at: string;
}

interface StatusResponse {
  current_ruleset_version: string;
  latest_review: ReviewRecord | null;
  stale: boolean;
  stale_reason: "never_reviewed" | "ruleset_changed_since_review" | "review_overdue" | null;
}

const STALE_LABEL: Record<string, string> = {
  never_reviewed: "This ruleset has never been reviewed",
  ruleset_changed_since_review: "The rules changed after the last review",
  review_overdue: "The scheduled review date has passed",
};

export default function RulesetIntegrityPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ruleset-review")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "clamp(6rem, 12vw, 8rem) 1.5rem 4rem", maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
          Ruleset Integrity
        </p>
        <h1 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: "white", marginBottom: "1.25rem" }}>
          A sealed record proves what the scanner checked against. This proves whether anyone has looked at it since.
        </h1>
        <p style={{ ...syne, fontSize: "1rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Every decision our scanner makes is tied to an exact, hashed version of the rules in force at that moment,
          so nobody can quietly change the rules and claim they always said this. That proves consistency. It does
          not prove the rules were ever right, or that anyone has checked lately. This page is the answer to that
          second question: who reviewed the current ruleset, and when.
        </p>

        {loading ? (
          <p style={{ ...syne, color: "rgba(244,241,234,0.5)" }}>Loading…</p>
        ) : !status ? (
          <p style={{ ...syne, color: "rgba(244,241,234,0.5)" }}>Could not load status right now.</p>
        ) : (
          <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: status.stale ? "#E5484D" : "#4ADE80",
                  flexShrink: 0,
                }}
              />
              <p style={{ ...syne, fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: status.stale ? "#E5484D" : "#4ADE80" }}>
                {status.stale ? (STALE_LABEL[status.stale_reason ?? ""] ?? "Stale") : "Current — reviewed and unchanged since"}
              </p>
            </div>

            <p style={{ ...mono, fontSize: "13px", color: "rgba(244,241,234,0.5)", marginBottom: "1.5rem" }}>
              Current ruleset version: <span style={{ color: "rgba(244,241,234,0.85)" }}>{status.current_ruleset_version}</span>
            </p>

            {status.latest_review ? (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                <p style={{ ...syne, fontSize: "0.95rem", color: "#F4F1EA", marginBottom: "0.4rem" }}>
                  Last reviewed by <strong>{status.latest_review.reviewed_by}</strong> ({status.latest_review.reviewer_role})
                </p>
                <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.6)", marginBottom: "0.4rem" }}>
                  {new Date(status.latest_review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                {status.latest_review.next_review_due && (
                  <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.6)", marginBottom: "0.4rem" }}>
                    Next review due: {status.latest_review.next_review_due}
                  </p>
                )}
                {status.latest_review.context_note && (
                  <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.5)", fontStyle: "italic", marginTop: "0.75rem" }}>
                    "{status.latest_review.context_note}"
                  </p>
                )}
              </div>
            ) : (
              <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)" }}>No review has ever been logged for this ruleset.</p>
            )}
          </div>
        )}

        <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.4)", marginTop: "2rem", lineHeight: 1.7 }}>
          This is a narrow claim, deliberately. It does not certify the rules are correct, only that a named person
          has looked at this exact version and can be asked why it's still current. See{" "}
          <a href="/boundary-authorization-records" style={{ color: "#E5484D", textDecoration: "underline" }}>
            boundary authorization records
          </a>{" "}
          for the same idea applied to individual decisions rather than the rule set itself.
        </p>
      </section>

      <Footer />
    </div>
  );
}
