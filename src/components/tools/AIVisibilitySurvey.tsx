"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";
import { AI_VISIBILITY_QUESTIONS, scoreAIVisibilitySurvey, type AnswerValue } from "@/lib/ai-visibility-survey";
import { ResultsGate } from "./ResultsGate";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const SEVERITY_COLOUR: Record<string, string> = { high: "#ef4444", medium: "#f97316" };
const SEVERITY_LABEL: Record<string, string> = { high: "High", medium: "Medium" };

function scoreColor(score: number) {
  if (score >= 75) return "#22c55e";
  if (score >= 45) return "#eab308";
  return "#ef4444";
}

export function AIVisibilitySurvey() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = AI_VISIBILITY_QUESTIONS.every((q) => answers[q.id]);
  const result = submitted ? scoreAIVisibilitySurvey(answers) : null;

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {AI_VISIBILITY_QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Question {i + 1} of {AI_VISIBILITY_QUESTIONS.length}</p>
            <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: q.help ? "0.4rem" : "1rem" }}>{q.question}</p>
            {q.help && <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>{q.help}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswer(q.id, opt.value)}
                    style={{
                      textAlign: "left",
                      background: selected ? "rgba(229,72,77,0.12)" : "#0A1628",
                      border: selected ? "1px solid rgba(229,72,77,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      color: selected ? "white" : "rgba(255,255,255,0.65)",
                      ...syne,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          style={{
            background: !allAnswered ? "rgba(229,72,77,0.3)" : "#E5484D",
            color: "white",
            ...syne,
            fontSize: "0.9rem",
            fontWeight: 700,
            padding: "13px 32px",
            borderRadius: "9999px",
            border: "none",
            cursor: !allAnswered ? "not-allowed" : "pointer",
          }}
        >
          See my AI Visibility Score →
        </button>
      </div>

      {result && (
        <ResultsGate tool="ai-visibility-survey" title="Enter your email to see your AI Visibility Score — free, no spam.">
          <div style={{ marginTop: "3rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>AI Visibility Score</p>
              <p className="font-mono-fig" style={{ fontSize: "4rem", fontWeight: 700, color: scoreColor(result.score), letterSpacing: "-0.03em", lineHeight: 1 }}>{result.score}</p>
            </div>

            {result.flags.length === 0 ? (
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "2rem", textAlign: "center" }}>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#22c55e" }}>Strong trust-signal presence — no major gaps flagged.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {result.flags.map((flag) => (
                  <div key={flag.questionId} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "1rem" }}>
                      <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white" }}>{flag.title}</p>
                      <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: SEVERITY_COLOUR[flag.severity], flexShrink: 0 }}>
                        {SEVERITY_LABEL[flag.severity]}
                      </span>
                    </div>
                    <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{flag.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                This is a self-assessment based on your own answers — not a live scan of external review platforms. It tells you where to look first.
              </p>
              <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
                See your full governance risk →
              </Link>
            </div>
          </div>
        </ResultsGate>
      )}
    </div>
  );
}
