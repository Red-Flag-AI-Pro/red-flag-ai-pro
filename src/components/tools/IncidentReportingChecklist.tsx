"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

type IncidentType = "data_breach" | "harmful_decision" | "safety_malfunction" | "security_breach";
type Jurisdiction = "uk" | "eu" | "us";

const INCIDENT_TYPES: { value: IncidentType; label: string; hint: string }[] = [
  { value: "data_breach", label: "Personal data breach", hint: "Data was lost, stolen, or exposed to people who shouldn't have it" },
  { value: "harmful_decision", label: "AI made a harmful or discriminatory decision", hint: "An automated decision caused real harm, unfair treatment, or a clearly wrong outcome" },
  { value: "safety_malfunction", label: "Safety or serious malfunction", hint: "The AI system malfunctioned in a way that risked health, safety, or critical operations" },
  { value: "security_breach", label: "Security breach of the AI system itself", hint: "The model, weights, prompts, or infrastructure were compromised" },
];

const JURISDICTIONS: { value: Jurisdiction; label: string }[] = [
  { value: "uk", label: "United Kingdom" },
  { value: "eu", label: "European Union" },
  { value: "us", label: "United States" },
];

interface Guidance {
  deadline: string;
  notify: string[];
  authority: string;
  citation: string;
}

const GUIDANCE: Record<Jurisdiction, Record<IncidentType, Guidance>> = {
  uk: {
    data_breach: {
      deadline: "Within 72 hours of becoming aware, if it's likely to risk people's rights and freedoms",
      notify: ["The ICO (Information Commissioner's Office)", "Affected individuals, without undue delay, if the risk is high"],
      authority: "ico.org.uk/for-organisations/report-a-breach",
      citation: "UK GDPR Article 33 (regulator) and Article 34 (individuals)",
    },
    harmful_decision: {
      deadline: "As soon as practicable — most sector regulators expect prompt disclosure, not a fixed statutory clock for this category alone",
      notify: ["Anyone directly harmed by the decision", "Your DPO or governance lead, immediately, to open an investigation", "The relevant sector regulator if the decision falls under their remit (FCA, EHRC, etc.)"],
      authority: "Depends on sector — start with your own governance/legal lead",
      citation: "UK GDPR Article 22 (automated decisions) and Equality Act 2010 where discrimination is involved",
    },
    safety_malfunction: {
      deadline: "Immediately internally; external reporting timeline depends on the sector regulator involved",
      notify: ["Internal safety/governance lead immediately", "Sector regulator if safety-critical (HSE, MHRA, CAA, etc. depending on domain)"],
      authority: "Sector-specific — identify your regulator before an incident happens, not during one",
      citation: "General product/consumer safety duties, plus any sector-specific safety regime that applies",
    },
    security_breach: {
      deadline: "Within 72 hours if any personal data was exposed as a result",
      notify: ["The ICO if personal data was involved", "NCSC for significant cyber incidents (voluntary but recommended)"],
      authority: "ico.org.uk/for-organisations/report-a-breach",
      citation: "UK GDPR Article 33 where personal data is affected",
    },
  },
  eu: {
    data_breach: {
      deadline: "Within 72 hours of becoming aware, if it's likely to risk people's rights and freedoms",
      notify: ["Your lead supervisory authority", "Affected individuals, without undue delay, if the risk is high"],
      authority: "Your national data protection authority",
      citation: "GDPR Article 33 (regulator) and Article 34 (individuals)",
    },
    harmful_decision: {
      deadline: "If it qualifies as a serious incident from a high-risk AI system: without undue delay, and no later than 15 days after becoming aware. Shorter windows apply for death or serious disruption to critical infrastructure.",
      notify: ["The market surveillance authority in the relevant member state", "Affected individuals where applicable"],
      authority: "Your national market surveillance authority for the EU AI Act",
      citation: "EU AI Act Article 73 (serious incident reporting) — confirm exact deadline for your specific case with counsel, the shortened windows are fact-specific",
    },
    safety_malfunction: {
      deadline: "Without undue delay, no later than 15 days after becoming aware for most serious incidents; as little as 2 days if there's widespread infringement or serious disruption to critical infrastructure",
      notify: ["The market surveillance authority in the relevant member state", "Affected users or the public if there's ongoing risk"],
      authority: "Your national market surveillance authority",
      citation: "EU AI Act Article 73",
    },
    security_breach: {
      deadline: "Within 72 hours if personal data was exposed; separately assess against Article 73 if the AI system itself is high-risk",
      notify: ["Your lead supervisory authority if personal data was involved", "Market surveillance authority if the compromised system is high-risk under the AI Act"],
      authority: "Your national data protection authority and/or market surveillance authority",
      citation: "GDPR Article 33 and, where applicable, EU AI Act Article 73",
    },
  },
  us: {
    data_breach: {
      deadline: "No single federal deadline — governed state by state, most require notification within 30 to 60 days, some sectors (health, finance) have their own federal rules",
      notify: ["Your state Attorney General, per your state's specific breach law", "Affected individuals, per your state's specific breach law", "HHS if HIPAA-covered health data (60 days), or your sector regulator if GLBA/other sector law applies"],
      authority: "Varies by state — check the specific state's breach notification statute",
      citation: "State breach notification laws (all 50 states have one, requirements differ), plus HIPAA/GLBA where applicable",
    },
    harmful_decision: {
      deadline: "No single federal statutory clock — the FTC treats unfair or deceptive AI-driven decisions as an enforcement matter, act as fast as you would for any consumer harm",
      notify: ["Anyone directly harmed by the decision", "Your legal/compliance lead immediately", "The FTC or relevant sector regulator if it affects consumers at scale"],
      authority: "FTC (ftc.gov) for consumer-facing harms, or your sector regulator",
      citation: "FTC Act Section 5 (unfair or deceptive practices), sector-specific rules (ECOA for credit, etc.) where they apply",
    },
    safety_malfunction: {
      deadline: "Depends entirely on sector — no single federal AI safety incident clock exists yet",
      notify: ["Internal safety/legal lead immediately", "Sector regulator (FDA, NHTSA, CPSC, etc.) if it falls under an existing safety regime"],
      authority: "Sector-specific — identify your regulator before an incident happens",
      citation: "General product liability duties, plus any sector-specific safety regime that applies",
    },
    security_breach: {
      deadline: "Governed by the same state breach laws as a data breach if personal data was exposed",
      notify: ["Your state Attorney General and affected individuals per state law, if personal data was involved", "CISA for significant cyber incidents (voluntary but recommended for critical infrastructure)"],
      authority: "Varies by state",
      citation: "State breach notification laws where personal data is involved",
    },
  },
};

export function IncidentReportingChecklist() {
  const [incidentType, setIncidentType] = useState<IncidentType>("data_breach");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("uk");
  const [copied, setCopied] = useState(false);

  const guidance = GUIDANCE[jurisdiction][incidentType];

  const output = useMemo(() => {
    const incidentLabel = INCIDENT_TYPES.find((t) => t.value === incidentType)?.label ?? "";
    const jurisdictionLabel = JURISDICTIONS.find((j) => j.value === jurisdiction)?.label ?? "";
    return `INCIDENT REPORTING CHECKLIST
Generated by Red Flag AI Pro, ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

INCIDENT TYPE: ${incidentLabel}
JURISDICTION: ${jurisdictionLabel}

DEADLINE
${guidance.deadline}

WHO TO NOTIFY
${guidance.notify.map((n) => `- ${n}`).join("\n")}

REPORT TO
${guidance.authority}

LEGAL BASIS
${guidance.citation}

BEFORE YOU REPORT, RECORD:
- What happened and when you first became aware of it (the clock starts from awareness, not from when the incident occurred)
- Who is affected, and how many people
- What data or decision was involved
- What you've already done to contain it
- Who inside your organization is accountable for the response

This is guidance, not legal advice, and deadlines above are general figures that can shift based on the specific facts of an incident. Confirm the exact deadline and notification requirements with legal counsel before your clock runs out.`;
  }, [incidentType, jurisdiction, guidance]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — text is selectable regardless
    }
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    background: "#0F2138",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.9)",
    ...syne,
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "6px",
    appearance: "none",
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
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={labelStyle}>What happened?</label>
            <select value={incidentType} onChange={(e) => setIncidentType(e.target.value as IncidentType)} style={selectStyle}>
              {INCIDENT_TYPES.map((t) => (
                <option key={t.value} value={t.value} style={{ background: "#0F2138" }}>{t.label}</option>
              ))}
            </select>
            <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
              {INCIDENT_TYPES.find((t) => t.value === incidentType)?.hint}
            </p>
          </div>

          <div>
            <label style={labelStyle}>Which jurisdiction applies?</label>
            <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)} style={selectStyle}>
              {JURISDICTIONS.map((j) => (
                <option key={j.value} value={j.value} style={{ background: "#0F2138" }}>{j.label}</option>
              ))}
            </select>
            <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
              Pick where the affected people or system are, not just where you're based.
            </p>
          </div>
        </div>
      </div>

      <ResultsGate tool="incident-reporting-checklist" title="Enter your email to see your reporting checklist. Free, plus occasional updates, unsubscribe anytime.">
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1px",
          }}>
            <p style={{ ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f87171", marginBottom: "0.4rem" }}>
              Deadline
            </p>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              {guidance.deadline}
            </p>
          </div>

          <div style={{
            background: "#102943",
            border: "1px solid rgba(239,68,68,0.2)",
            borderLeft: "3px solid #E5484D",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={labelStyle}>Your reporting checklist</p>
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
          This checklist tells you the deadline. It won&apos;t prove you met it.
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "460px", margin: "0.5rem auto 1.5rem" }}>
          Sentinel seals the moment you became aware, the moment you acted, and the moment you reported, each with an independent timestamp, so the timeline itself is provable, not just remembered.
        </p>
        <Link href="/sentinel" style={{
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
          See how Sentinel seals a timeline
        </Link>
      </div>

      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: 1.7, marginTop: "1.5rem", textAlign: "center" }}>
        This tool gives general guidance, not legal advice. Deadlines and requirements are fact-specific and change with regulatory updates. Confirm the exact requirements for your incident with legal counsel before you rely on any figure above.
      </p>
    </div>
  );
}
