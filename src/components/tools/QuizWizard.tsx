"use client";

import { useState } from "react";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export interface QuizWizardQuestion<V extends string = string> {
  id: string;
  question: string;
  help?: string;
  options: { value: V; label: string }[];
}

interface QuizWizardProps<V extends string = string> {
  questions: QuizWizardQuestion<V>[];
  onComplete: (answers: Record<string, V>) => void;
  completeLabel: string;
}

// One-question-at-a-time quiz wizard shared by every short free-tool survey
// (Shadow AI, AI Visibility, etc). Auto-advances on answer select, supports
// Back, shows a progress bar. The flagship governance audit form uses the
// same one-at-a-time pattern; this brings the shorter tools in line with it.
export function QuizWizard<V extends string = string>({ questions, onComplete, completeLabel }: QuizWizardProps<V>) {
  const [answers, setAnswers] = useState<Record<string, V>>({});
  const [index, setIndex] = useState(0);

  const question = questions[index];
  const progressPercent = ((index + 1) / questions.length) * 100;
  const selected = answers[question.id];

  function selectAnswer(value: V) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {/* Progress bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
            Question {index + 1} of {questions.length}
          </p>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
            {questions.length - index - 1} remaining
          </p>
        </div>
        <div style={{ width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: "9999px", height: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: "#E5484D", transition: "width 250ms ease" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.75rem" }}>
        <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: question.help ? "0.4rem" : "1.1rem" }}>
          {question.question}
        </p>
        {question.help && (
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "1.1rem" }}>{question.help}</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectAnswer(opt.value)}
                style={{
                  textAlign: "left",
                  background: isSelected ? "rgba(229,72,77,0.12)" : "#0A1628",
                  border: isSelected ? "1px solid rgba(229,72,77,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  color: isSelected ? "white" : "rgba(255,255,255,0.65)",
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

      {/* Back */}
      <div style={{ marginTop: "1rem" }}>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{
            background: "transparent",
            border: "none",
            ...syne,
            fontSize: "12px",
            fontWeight: 600,
            color: index === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
            cursor: index === 0 ? "not-allowed" : "pointer",
            padding: 0,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
