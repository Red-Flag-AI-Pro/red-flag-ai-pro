"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";
import { APPLIES_QUESTIONS, scoreApplyQuiz, type AnswerValue } from "@/lib/does-this-apply-quiz";
import { QuizWizard } from "./QuizWizard";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const LEVEL_COLOUR: Record<string, string> = {
  applies: "#E5484D",
  watch: "#eab308",
  not_yet: "#22c55e",
};

// Deliberately ungated. The point of a "low fear" front door is that it costs
// nothing to find out, no email required, unlike every other tool on the site.
export function DoesThisApplyQuiz() {
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, AnswerValue> | null>(null);

  const result = submittedAnswers ? scoreApplyQuiz(submittedAnswers) : null;

  return (
    <div>
      {!submittedAnswers && (
        <QuizWizard
          questions={APPLIES_QUESTIONS}
          completeLabel="See my answer →"
          onComplete={(answers) => setSubmittedAnswers(answers as Record<string, AnswerValue>)}
        />
      )}

      {result && (
        <div style={{ marginTop: "1rem", maxWidth: "640px", margin: "1rem auto 0" }}>
          <div style={{
            background: "#0D1B2E",
            border: `1px solid ${LEVEL_COLOUR[result.level]}44`,
            borderRadius: "10px",
            padding: "2.25rem",
            textAlign: "center",
          }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Your answer</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 500, color: LEVEL_COLOUR[result.level], letterSpacing: "-0.015em", lineHeight: 1.2, marginBottom: "1rem" }}>
              {result.headline}
            </h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              {result.explanation}
            </p>
          </div>

          {result.reasons.length > 0 && (
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1px" }}>
              {result.reasons.map((r, i) => (
                <div key={i} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.1rem 1.4rem" }}>
                  <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{r}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            {result.level === "not_yet" ? (
              <>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                  Genuinely nothing to do here. Bookmark this and come back if that changes.
                </p>
                <Link href="/tools" style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  See all free tools →
                </Link>
              </>
            ) : (
              <>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                  This was five questions and a guess, not a real assessment. The free checks below take about a minute and tell you exactly what's live.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                  <Link href="/compliance-assessment" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 28px", borderRadius: "9999px", textDecoration: "none" }}>
                    Check my marketing copy →
                  </Link>
                  <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 28px", borderRadius: "9999px", textDecoration: "none" }}>
                    Check my AI governance →
                  </Link>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setSubmittedAnswers(null)}
              style={{ background: "transparent", border: "none", ...syne, fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}
            >
              ← Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
