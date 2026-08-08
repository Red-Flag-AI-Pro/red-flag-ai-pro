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

interface MissExample {
  name: string;
  ruling_url: string;
  gap: string;
}

interface BacktestRecord {
  id: string;
  ruleset_version: string;
  sample_source: string;
  sample_size: number;
  catches: number;
  misses: number;
  miss_examples: MissExample[];
  performed_by: string;
  created_at: string;
}

interface BacktestResponse {
  current_ruleset_version: string;
  latest_backtest: BacktestRecord | null;
  miss_rate: number | null;
  is_current: boolean | null;
}

const STALE_LABEL: Record<string, string> = {
  never_reviewed: "This ruleset has never been reviewed",
  ruleset_changed_since_review: "The rules changed after the last review",
  review_overdue: "The scheduled review date has passed",
};

export default function RulesetIntegrityPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [backtest, setBacktest] = useState<BacktestResponse | null>(null);
  const [backtestLoading, setBacktestLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ruleset-review")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch("/api/admin/ruleset-backtest")
      .then((r) => r.json())
      .then(setBacktest)
      .catch(() => {})
      .finally(() => setBacktestLoading(false));
  }, []);

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "clamp(6rem, 12vw, 8rem) 1.5rem 4rem", maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
          Ruleset Integrity
        </p>
        <h1 style={{ ...syne, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: "white", marginBottom: "1.25rem" }}>
          A sealed record proves what a check was judged against. This proves whether anyone has looked at it since.
        </h1>
        <p style={{ ...syne, fontSize: "1rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Every check we run is tied to an exact, hashed version of the rules in force at that moment,
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

        <h2 style={{ ...syne, fontSize: "1.5rem", fontWeight: 800, color: "white", marginTop: "3.5rem", marginBottom: "1rem" }}>
          Firing rate is not the same evidence as miss rate.
        </h2>
        <p style={{ ...syne, fontSize: "1rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.75, marginBottom: "2rem" }}>
          A review above answers whether someone looked at the rules again. It doesn't answer whether the rules were
          ever the right rules. That can't be tested by writing a condition in the rules' own vocabulary, since a
          category list can only recognise the cases it already has a category for. The only real test is a
          back-test: take incidents from a source we don't control, regulator rulings, not our own results, and
          check how many the current category list would actually have caught.
        </p>

        {backtestLoading ? (
          <p style={{ ...syne, color: "rgba(244,241,234,0.5)" }}>Loading…</p>
        ) : !backtest || !backtest.latest_backtest ? (
          <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)" }}>No back-test has ever been run against this ruleset.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
            {backtest.is_current === false && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E5484D", flexShrink: 0 }} />
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D" }}>
                  Rules changed since this back-test ran — these numbers are no longer against the current ruleset
                </p>
              </div>
            )}
            <p style={{ ...syne, fontSize: "0.95rem", color: "#F4F1EA", marginBottom: "0.75rem" }}>
              <strong>{backtest.latest_backtest.sample_size}</strong> real regulator rulings checked against the category list in force at the time,
              source: {backtest.latest_backtest.sample_source}.
            </p>
            <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.5)", marginBottom: "1rem" }}>
              Run directly against the plain keyword engine, the same detection layer a demo scan or a signed out
              request gets. Every paid account also runs a further AI enhancement pass after the keywords, which this
              test did not exercise. So this is that engine&apos;s miss rate on a path no paying customer is actually
              on, not the product&apos;s.
            </p>
            <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
              <span style={{ color: "#4ADE80" }}>{backtest.latest_backtest.catches} caught</span>
              {" · "}
              <span style={{ color: backtest.latest_backtest.misses > 0 ? "#E5484D" : "#4ADE80" }}>
                {backtest.latest_backtest.misses} missed
              </span>
              {backtest.miss_rate !== null && (
                <span style={{ color: "rgba(244,241,234,0.5)", fontWeight: 400 }}> — {(backtest.miss_rate * 100).toFixed(1)}% miss rate</span>
              )}
            </p>
            {backtest.latest_backtest.miss_examples.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
                <p style={{ ...syne, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(244,241,234,0.5)", marginBottom: "0.75rem" }}>
                  What we missed, named honestly
                </p>
                {backtest.latest_backtest.miss_examples.map((m, i) => (
                  <div key={i} style={{ marginBottom: "1rem" }}>
                    <p style={{ ...syne, fontSize: "0.9rem", color: "#F4F1EA" }}>
                      <a href={m.ruling_url} style={{ color: "#F4F1EA", textDecoration: "underline" }}>{m.name}</a>
                    </p>
                    <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.6)" }}>{m.gap}</p>
                  </div>
                ))}
              </div>
            )}
            <p style={{ ...syne, fontSize: "0.8rem", color: "rgba(244,241,234,0.4)", marginTop: "1rem" }}>
              Performed by {backtest.latest_backtest.performed_by} · {new Date(backtest.latest_backtest.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
