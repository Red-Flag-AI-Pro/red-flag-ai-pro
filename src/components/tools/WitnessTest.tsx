"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";
import { QuizWizard, type QuizWizardQuestion } from "./QuizWizard";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

type ScoreValue = "0" | "1" | "2";

interface WitnessQuestion extends QuizWizardQuestion<ScoreValue> {
  breakdownTitle: string;
  // One note per score (index 0, 1, 2) shown in the gated breakdown.
  notes: [string, string, string];
}

const QUESTIONS: WitnessQuestion[] = [
  {
    id: "generation",
    question: "Who generates the evidence record when a decision or action happens?",
    help: "The evidence record is the log or receipt that says what happened and who approved it.",
    options: [
      { value: "0", label: "The same system that acts" },
      { value: "1", label: "A separate system run by the same company" },
      { value: "2", label: "An outside party" },
    ],
    breakdownTitle: "Who writes the record",
    notes: [
      "The system that acts also writes the account of what it did. That is testimony from the accused, kept by the accused.",
      "A separate recorder helps, but the same company runs both ends, so both ends can be changed together.",
      "An outside party sees the evidence at creation. The operator cannot invent history without the witness noticing.",
    ],
  },
  {
    id: "keys",
    question: "Who holds the signing key?",
    help: "The signing key is what makes a record count as official. Whoever holds it controls what the evidence says.",
    options: [
      { value: "0", label: "The vendor or operator" },
      { value: "1", label: "Split between vendor and customer" },
      { value: "2", label: "An independent third party, or keys plus an external anchor" },
    ],
    breakdownTitle: "Who holds the keys",
    notes: [
      "Whoever holds the key decides what counts as a valid record. Right now that is the party being judged.",
      "Splitting keys raises the bar, but the two holders can still agree to rewrite the past.",
      "Independent custody or an external anchor means no single party can quietly mint fresh history.",
    ],
  },
  {
    id: "rewrite",
    question: "If the operator wanted to quietly rewrite last year's records and sign them again, what stops them?",
    help: "A hash chain links each record to the one before it, so an edit inside the chain is detectable.",
    options: [
      { value: "0", label: "Nothing but policy and trust" },
      { value: "1", label: "Internal cryptography like hash chains or receipts" },
      { value: "2", label: "An external anchor: third party timestamps, an independent witness, or a public ledger recorded at the time" },
    ],
    breakdownTitle: "What stops a rewrite",
    notes: [
      "Policy is a promise. A promise from the party with the motive and the means is not a control.",
      "Hash chains prove the records agree with each other. They do not prove the whole chain was not rebuilt by whoever holds the keys.",
      "An anchor recorded outside the operator at the time is the one thing a later rewrite cannot fake.",
    ],
  },
  {
    id: "verification",
    question: "Can anyone outside the company verify a record without asking the company for access?",
    help: "Think of an auditor, an insurer or a court trying to check a record on their own.",
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "Yes, with an account or permission" },
      { value: "2", label: "Yes, publicly, without an account" },
    ],
    breakdownTitle: "Who can check it",
    notes: [
      "If verification requires the company's cooperation, the company controls what gets verified.",
      "Permissioned access is better than none, but the operator still sits between the record and the person checking it.",
      "Public verification means anyone can check the record without trusting the operator at all.",
    ],
  },
  {
    id: "authority",
    question: "When the authority behind a decision was granted, was it recorded with an expiry or the conditions that would void it?",
    help: "Authority means the mandate behind the decision. Who approved it, and what they were allowed to approve.",
    options: [
      { value: "0", label: "No, grants are open ended" },
      { value: "1", label: "Sometimes" },
      { value: "2", label: "Yes, expiry and voiding conditions are captured at signing" },
    ],
    breakdownTitle: "Whether authority expires",
    notes: [
      "A grant with no expiry cannot be audited against reality. Nobody can say when it stopped being valid.",
      "Some grants carry conditions, but an audit needs them on every grant, captured when the authority is given.",
      "Expiry and voiding conditions captured at signing mean every grant can be tested later against what actually happened.",
    ],
  },
];

const SCORE_COLOUR: Record<ScoreValue, string> = { "0": "#ef4444", "1": "#eab308", "2": "#22c55e" };

interface Verdict {
  min: number;
  label: string;
  colour: string;
  line: string;
}

const VERDICTS: Verdict[] = [
  {
    min: 8,
    label: "Independently witnessed",
    colour: "#22c55e",
    line: "Something outside the operator's control saw the evidence when it was created. That is what turns a record into proof.",
  },
  {
    min: 4,
    label: "Partially witnessed: internally consistent, externally unproven",
    colour: "#eab308",
    line: "Your records agree with each other. Nothing outside the operator can confirm they were not rebuilt.",
  },
  {
    min: 0,
    label: "Self referential: your evidence trusts itself",
    colour: "#ef4444",
    line: "The operator generates, signs and stores its own receipts. Everything checks out because the same party controls every check.",
  },
];

export function WitnessTest() {
  const [answers, setAnswers] = useState<Record<string, ScoreValue> | null>(null);

  const total = answers
    ? QUESTIONS.reduce((sum, q) => sum + Number(answers[q.id] ?? "0"), 0)
    : 0;
  const verdict = VERDICTS.find((v) => total >= v.min) ?? VERDICTS[VERDICTS.length - 1];

  return (
    <div>
      {!answers && (
        <QuizWizard<ScoreValue>
          questions={QUESTIONS}
          completeLabel="See my verdict →"
          onComplete={(a) => setAnswers(a)}
        />
      )}

      {answers && (
        <div>
          {/* ── Verdict, ungated ── */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>
              Your witness score
            </p>
            <p className="font-mono-fig" style={{ fontSize: "4rem", fontWeight: 700, color: verdict.colour, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {total}<span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.35)" }}> of 10</span>
            </p>
            <p className="font-display" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.7rem)", fontWeight: 500, color: verdict.colour, lineHeight: 1.3, maxWidth: "540px", margin: "1.25rem auto 0" }}>
              {verdict.label}
            </p>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: "520px", margin: "1rem auto 0" }}>
              {verdict.line}
            </p>
          </div>

          <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1.5rem 1.75rem", marginBottom: "2.5rem" }}>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
              Internal consistency proves one part of a record matches another. It does not prove the party holding the keys could not have rebuilt the whole record. Only something outside the operator, a third party timestamp, an independent witness, an external anchor, turns consistency into proof.
            </p>
          </div>

          {/* ── Breakdown and recommendations, gated ── */}
          <ResultsGate tool="witness-test" title="Enter your email to see the full question by question breakdown. Free, plus occasional updates, unsubscribe anytime.">
            <div>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
                Where your answers landed
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {QUESTIONS.map((q) => {
                  const value = answers[q.id] ?? "0";
                  const chosen = q.options.find((o) => o.value === value);
                  return (
                    <div key={q.id} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "1rem" }}>
                        <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white" }}>{q.breakdownTitle}</p>
                        <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: SCORE_COLOUR[value], flexShrink: 0 }}>
                          {value} of 2
                        </span>
                      </div>
                      <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "0.6rem" }}>
                        Your answer: {chosen ? chosen.label : "Not answered"}
                      </p>
                      <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                        {q.notes[Number(value)]}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "2.5rem" }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
                  What to do next
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                    <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                      Ask your vendor who holds the signing key and what stops them rewriting history. If the answer is a policy document, you have a promise, not proof.
                    </p>
                  </div>
                  <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                    <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                      Add an external anchor. Third party timestamps and public anchoring exist today, cost little, and turn your internal chain into evidence someone else can vouch for.
                    </p>
                  </div>
                  <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                    <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                      Record authority with an expiry and the conditions that void it, captured at signing. A grant that never ends cannot be audited against reality.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  The full argument, every claim dated and cited, is in{" "}
                  <a href="https://www.redflagaipro.com/reports/mystery-of-ai-governance" style={{ color: "#F4F1EA", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    The Mystery of AI Governance
                  </a>.
                </p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
                  Next step: see where the rest of your governance evidence stands.
                </p>
                <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", textDecoration: "none" }}>
                  Run the free governance assessment →
                </Link>
              </div>
            </div>
          </ResultsGate>
        </div>
      )}
    </div>
  );
}
