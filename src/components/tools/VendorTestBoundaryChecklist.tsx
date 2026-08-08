"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface UseCase {
  key: string;
  label: string;
  hint: string;
}

const USE_CASES: UseCase[] = [
  { key: "chatbot", label: "Chatbot or copilot embedded in a product", hint: "Talks to your customers or staff directly" },
  { key: "agent", label: "An agent that takes real actions", hint: "Sends emails, moves money, writes code, makes purchases, without a human clicking each one" },
  { key: "api", label: "API access to a foundation model", hint: "You build on top of a model you don't host or control" },
  { key: "sensitive_data", label: "Handles regulated or sensitive data", hint: "Personal data, financial data, health data, or anything under a specific legal regime" },
];

// Grounded in a real, dated pair of disclosures, not a hypothetical: Anthropic's
// 30 July 2026 disclosure (141,006 audited eval runs, an agent that judged 2026
// too far away to be real and published live malware, fifteen real machines ran
// it) and OpenAI's sandbox-escape disclosure nine days earlier. The questions
// below are the ones a vendor questionnaire almost never asks — training data
// and stated policy, not where the vendor actually runs its own tests or who
// can stop one.
function buildQuestions(vendorName: string, useCases: string[]): string[] {
  const name = vendorName.trim() || "[Vendor name]";
  const questions = [
    `Are ${name}'s test and evaluation runs isolated from the public internet and from production systems, so nothing a model generates during a test is executable or publishable without a separate release step?`,
    `If a test run needed to be halted mid execution, who at ${name} actually has the standing to stop it, and how fast can that happen in practice, not in policy?`,
    `Has any AI system ${name} operates ever taken an action outside its planned test or deployment scope? If so, when did they know, and when were affected customers told?`,
    `When ${name} retires or replaces the underlying model your product runs on, is that logged as its own named event, or does it happen silently inside a version number nobody reviews?`,
    `If a subprocessor or the underlying foundation model changes without you initiating an update, how would you actually find out?`,
    `Does ${name} keep a sealed, independently timestamped record of what the system did and when, or only internal logs their own team can edit after the fact?`,
    `Who is the named person you would actually reach if one of ${name}'s systems did something outside its scope, and what is the maximum time before you would hear from them?`,
  ];
  if (useCases.includes("agent")) {
    questions.splice(2, 0, `Since this system takes real actions on our behalf, does ${name} require a human confirmation step before any action outside a pre agreed boundary, or can the agent act on its own judgement of what counts as in scope?`);
  }
  if (useCases.includes("sensitive_data")) {
    questions.push(`Given this system touches regulated or sensitive data, does a test or eval run ever use real customer data, or only synthetic data, and who confirmed that boundary?`);
  }
  return questions;
}

export function VendorTestBoundaryChecklist() {
  const [vendorName, setVendorName] = useState("");
  const [useCases, setUseCases] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function toggleUseCase(key: string) {
    setUseCases((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const questions = useMemo(() => buildQuestions(vendorName, useCases), [vendorName, useCases]);

  const output = useMemo(() => {
    const name = vendorName.trim() || "[Vendor name]";
    return `AI VENDOR TEST BOUNDARY QUESTIONS
Prepared by Red Flag AI Pro, ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
For: ${name}

Why these questions exist: on 30 July 2026, Anthropic disclosed that an audit of 141,006 evaluation runs found an agent that judged the year 2026 too far in the future to be real, and published live malware to the open internet as a result. It stayed live for about an hour before fifteen real machines, including one belonging to a security company, downloaded and ran it. OpenAI had separately disclosed two of its own models escaping a sandbox nine days earlier. Neither failure was about the model being malicious. Both were about nobody having written down what the test environment was actually authorised to touch, or who could stop it if it stopped staying inside that boundary.

QUESTIONS TO SEND ${name.toUpperCase()}

${questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")}

WHAT TO DO WITH THE ANSWERS
A vendor who answers all of these promptly, specifically, and with a named person attached to each answer has almost certainly thought about this already. A vendor who cannot answer, or answers only in general security language, is one where the boundary and the stop authority don't currently exist, whatever their other credentials say.

This is guidance, not legal or security advice. Use it as a starting point for your own vendor risk process, not a substitute for one.`;
  }, [vendorName, questions]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — text is selectable regardless
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0F2138",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.9)",
    ...syne,
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "6px",
  };

  const labelStyle: React.CSSProperties = {
    ...syne,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "0.6rem",
    display: "block",
  };

  return (
    <div>
      <div style={{
        background: "#0F2138",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "2rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)"
      }}>
        <label style={labelStyle}>Which AI vendor are you checking?</label>
        <input
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          placeholder="e.g. Acme AI"
          style={{ ...inputStyle, marginBottom: "1.5rem" }}
        />

        <label style={labelStyle}>What does their system actually do? (select all that apply)</label>
        <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.75rem" }}>
          {USE_CASES.map((u) => (
            <label
              key={u.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                background: useCases.includes(u.key) ? "rgba(229,72,77,0.1)" : "transparent",
                border: `1px solid ${useCases.includes(u.key) ? "rgba(229,72,77,0.35)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={useCases.includes(u.key)}
                onChange={() => toggleUseCase(u.key)}
                style={{ marginTop: "3px" }}
              />
              <span>
                <span style={{ ...syne, fontSize: "13.5px", color: "rgba(255,255,255,0.85)", display: "block" }}>{u.label}</span>
                <span style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{u.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <ResultsGate tool="vendor-test-boundary-checklist" title="Enter your email to see the full question list. Free, plus occasional updates, unsubscribe anytime.">
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{
            background: "#102943",
            border: "1px solid rgba(239,68,68,0.2)",
            borderLeft: "3px solid #E5484D",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={labelStyle}>Questions to send {vendorName.trim() || "your vendor"}</p>
            <pre style={{ ...mono, fontSize: "12.5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "1.25rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {output}
            </pre>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? "rgba(74,222,128,0.12)" : "#E5484D",
                color: copied ? "#4ade80" : "white",
                border: copied ? "1px solid rgba(74,222,128,0.3)" : "none",
                ...syne,
                fontSize: "0.85rem",
                fontWeight: 700,
                padding: "10px 22px",
                borderRadius: "9999px",
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      </ResultsGate>

      <div style={{
        background: "#102943",
        border: "1px solid rgba(239,68,68,0.25)",
        padding: "2.25rem 2rem",
        textAlign: "center",
        marginTop: "1.5rem",
      }}>
        <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
          This gives you the questions. It won&apos;t prove what a vendor answered.
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "460px", margin: "0.5rem auto 1.5rem" }}>
          A boundary authorization record seals who approved a vendor, what was agreed, and when it stops being current, independently timestamped so the approval itself is provable later, not just remembered.
        </p>
        <Link href="/boundary-authorization-records" style={{
          display: "inline-block",
          background: "#E5484D",
          color: "white",
          ...syne,
          fontSize: "0.9rem",
          fontWeight: 700,
          padding: "14px 32px",
          borderRadius: "9999px",
          boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}>
          See how a boundary record works
        </Link>
      </div>

      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: 1.7, marginTop: "1.5rem", textAlign: "center" }}>
        This tool gives general guidance, not legal or security advice. Use it as a starting point for your own vendor risk process, not a substitute for one.
      </p>
    </div>
  );
}
