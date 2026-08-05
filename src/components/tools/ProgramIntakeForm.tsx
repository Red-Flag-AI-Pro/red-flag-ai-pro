"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  PROGRAM_DATA_TYPES,
  PROGRAM_SAFEGUARDS,
  PROGRAM_ARCHITECTURE_TYPES,
  PROGRAM_JURISDICTIONS,
  PROGRAM_INTAKE_DEFAULTS,
  type ProgramIntake,
  type ProgramDataType,
  type ProgramSafeguard,
} from "@/lib/program-intake";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

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

const textareaStyle: React.CSSProperties = { ...inputStyle, resize: "vertical", fontFamily: "'Syne', system-ui, sans-serif" };

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "10px 0",
  cursor: "pointer",
};

function SectionPanel({ number, title, intro, children }: { number: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#0F2138",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "2rem",
      marginBottom: "1.5rem",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: intro ? "0.6rem" : "1.5rem" }}>
        <span style={{ ...mono, fontSize: "12px", color: "#E5484D", fontWeight: 700 }}>{number}</span>
        <h2 style={{ ...syne, fontSize: "1rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      {intro && (
        <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{intro}</p>
      )}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

interface ProgramIntakeFormProps {
  orderId: string;
  initialIntake?: Partial<ProgramIntake>;
}

export function ProgramIntakeForm({ orderId, initialIntake }: ProgramIntakeFormProps) {
  const router = useRouter();
  const [intake, setIntake] = useState<ProgramIntake>({ ...PROGRAM_INTAKE_DEFAULTS, ...initialIntake });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProgramIntake>(key: K, value: ProgramIntake[K]) {
    setIntake((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDataType(value: ProgramDataType) {
    const next = new Set(intake.dataTypes);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    set("dataTypes", [...next]);
  }

  function toggleSafeguard(value: ProgramSafeguard) {
    const next = new Set(intake.safeguards);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    set("safeguards", [...next]);
  }

  const canSubmit = intake.companyName.trim().length > 0 && intake.systemName.trim().length > 0 && intake.purpose.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/program/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, intake }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push(`/audit/program/${orderId}`);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(239,68,68,0.2)", borderTopColor: "#E5484D", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.5rem" }} />
        <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
          Generating your six documents…
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", maxWidth: "420px", margin: "0 auto" }}>
          This takes under a minute. Do not close this tab — you will be taken straight to your results.
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionPanel
        number="01"
        title="Your business and the system itself"
        intro="This feeds all six documents, so it only needs answering once."
      >
        <Field label="Company name">
          <input type="text" value={intake.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="e.g. Acme Ltd" style={inputStyle} required />
        </Field>
        <Field label="System or process name">
          <input type="text" value={intake.systemName} onChange={(e) => set("systemName", e.target.value)} placeholder="e.g. Customer support triage AI" style={inputStyle} required />
        </Field>
        <Field label="What does it do, and why?">
          <textarea value={intake.purpose} onChange={(e) => set("purpose", e.target.value)} rows={3} placeholder="e.g. Reads incoming support tickets and assigns a priority score to route them to the right team" style={textareaStyle} required />
        </Field>
        <Field label="How is the AI system built?">
          <select value={intake.architecture} onChange={(e) => set("architecture", e.target.value as ProgramIntake["architecture"])} style={{ ...inputStyle, appearance: "none" }}>
            {PROGRAM_ARCHITECTURE_TYPES.map((a) => (
              <option key={a.value} value={a.value} style={{ background: "#0F2138" }}>{a.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Primary jurisdiction">
          <select value={intake.primaryJurisdiction} onChange={(e) => set("primaryJurisdiction", e.target.value as ProgramIntake["primaryJurisdiction"])} style={{ ...inputStyle, appearance: "none" }}>
            {PROGRAM_JURISDICTIONS.map((j) => (
              <option key={j.value} value={j.value} style={{ background: "#0F2138" }}>{j.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Annual turnover (GBP) — used only for your financial exposure snapshot, leave at 0 to skip">
          <input
            type="number"
            min={0}
            step={1000}
            value={intake.annualTurnoverGBP || ""}
            onChange={(e) => set("annualTurnoverGBP", Number(e.target.value) || 0)}
            placeholder="e.g. 2000000"
            style={inputStyle}
          />
        </Field>
      </SectionPanel>

      <SectionPanel number="02" title="Data and risk profile" intro="Feeds the DPIA, FRIA and Annex IV documentation.">
        <Field label="What data does it process? Select all that apply">
          {PROGRAM_DATA_TYPES.map((d) => (
            <label key={d.value} style={checkboxRowStyle}>
              <input type="checkbox" checked={intake.dataTypes.includes(d.value)} onChange={() => toggleDataType(d.value)} style={{ marginTop: "3px" }} />
              <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{d.label}</span>
            </label>
          ))}
        </Field>
        <Field label="Where does the data come from?">
          <textarea value={intake.dataSources} onChange={(e) => set("dataSources", e.target.value)} rows={2} placeholder="e.g. CRM records, uploaded documents, third party API" style={textareaStyle} />
        </Field>
        <Field label="Does the system do any of the following?">
          <label style={checkboxRowStyle}>
            <input type="checkbox" checked={intake.automatedDecision} onChange={() => set("automatedDecision", !intake.automatedDecision)} style={{ marginTop: "3px" }} />
            <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>Make an automated decision with a legal or similarly significant effect (e.g. pricing, eligibility, hiring, credit) without meaningful human input</span>
          </label>
          <label style={checkboxRowStyle}>
            <input type="checkbox" checked={intake.systematicMonitoring} onChange={() => set("systematicMonitoring", !intake.systematicMonitoring)} style={{ marginTop: "3px" }} />
            <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>Systematically monitor individuals (e.g. tracking behavior, profiling, continuous surveillance)</span>
          </label>
          <label style={checkboxRowStyle}>
            <input type="checkbox" checked={intake.largeScale} onChange={() => set("largeScale", !intake.largeScale)} style={{ marginTop: "3px" }} />
            <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>Process data at large scale (many individuals, or a wide geographic reach)</span>
          </label>
        </Field>
      </SectionPanel>

      <SectionPanel number="03" title="Safeguards and oversight" intro="Feeds the DPIA, FRIA, AI use policy and documentation.">
        <Field label="Safeguards already in place, select all that apply">
          {PROGRAM_SAFEGUARDS.map((s) => (
            <label key={s.value} style={checkboxRowStyle}>
              <input type="checkbox" checked={intake.safeguards.includes(s.value)} onChange={() => toggleSafeguard(s.value)} style={{ marginTop: "3px" }} />
              <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{s.label}</span>
            </label>
          ))}
        </Field>
        <Field label="Human oversight measures">
          <textarea value={intake.oversightMeasures} onChange={(e) => set("oversightMeasures", e.target.value)} rows={2} placeholder="How can a human intervene before a decision takes effect?" style={textareaStyle} />
        </Field>
        <Field label="Risk mitigation measures">
          <textarea value={intake.mitigationMeasures} onChange={(e) => set("mitigationMeasures", e.target.value)} rows={2} placeholder="What happens if a risk described below actually materializes?" style={textareaStyle} />
        </Field>
        <Field label="Testing and validation">
          <textarea value={intake.testing} onChange={(e) => set("testing", e.target.value)} rows={2} placeholder="How was it tested before deployment, and what did testing show?" style={textareaStyle} />
        </Field>
        <Field label="Known limitations">
          <textarea value={intake.limitations} onChange={(e) => set("limitations", e.target.value)} rows={2} placeholder="What is it not designed to do? How could it be misused?" style={textareaStyle} />
        </Field>
      </SectionPanel>

      <SectionPanel number="04" title="Who it affects" intro="Feeds the Fundamental Rights Impact Assessment.">
        <Field label="Affected persons and groups">
          <textarea value={intake.affectedParties} onChange={(e) => set("affectedParties", e.target.value)} rows={2} placeholder="Which categories of people are likely to be affected by its use?" style={textareaStyle} />
        </Field>
        <Field label="Period and frequency of use">
          <textarea value={intake.usagePeriod} onChange={(e) => set("usagePeriod", e.target.value)} rows={2} placeholder="How long, and how often, is this system intended to be used?" style={textareaStyle} />
        </Field>
        <Field label="Specific risks of harm">
          <textarea value={intake.specificRisks} onChange={(e) => set("specificRisks", e.target.value)} rows={3} placeholder="For each affected group above, what specific risk of harm does this pose?" style={textareaStyle} />
        </Field>
      </SectionPanel>

      <SectionPanel number="05" title="Ongoing monitoring" intro="Feeds the post market monitoring plan.">
        <Field label="Performance metrics and baselines">
          <textarea value={intake.metrics} onChange={(e) => set("metrics", e.target.value)} rows={2} placeholder="What will you track — accuracy, error rate, complaint volume, override rate?" style={textareaStyle} />
        </Field>
        <Field label="Review cadence — how often, by whom?">
          <textarea value={intake.reviewCadence} onChange={(e) => set("reviewCadence", e.target.value)} rows={2} style={textareaStyle} />
        </Field>
        <Field label="Escalation thresholds">
          <textarea value={intake.thresholds} onChange={(e) => set("thresholds", e.target.value)} rows={2} placeholder="What values or changes trigger escalation?" style={textareaStyle} />
        </Field>
        <Field label="Corrective action procedure">
          <textarea value={intake.correctiveAction} onChange={(e) => set("correctiveAction", e.target.value)} rows={2} style={textareaStyle} />
        </Field>
        <Field label="Record keeping format">
          <textarea value={intake.recordKeeping} onChange={(e) => set("recordKeeping", e.target.value)} rows={2} placeholder="How is monitoring data kept, in a form a regulator could later verify?" style={textareaStyle} />
        </Field>
      </SectionPanel>

      <SectionPanel number="06" title="Staff AI use policy" intro="Company wide, not specific to the system above — feeds the AI Acceptable Use Policy.">
        <Field label="Prohibited uses">
          <textarea value={intake.prohibitedUses} onChange={(e) => set("prohibitedUses", e.target.value)} rows={2} placeholder="e.g. entering client confidential data into a public AI tool" style={textareaStyle} />
        </Field>
        <Field label="Data handling rules">
          <textarea value={intake.dataRules} onChange={(e) => set("dataRules", e.target.value)} rows={2} placeholder="What data can and can't be entered into an AI tool?" style={textareaStyle} />
        </Field>
        <Field label="Approval process for new tools">
          <textarea value={intake.approvalProcess} onChange={(e) => set("approvalProcess", e.target.value)} rows={2} style={textareaStyle} />
        </Field>
        <Field label="Reporting and escalation channel">
          <textarea value={intake.reportingChannel} onChange={(e) => set("reportingChannel", e.target.value)} rows={2} style={textareaStyle} />
        </Field>
      </SectionPanel>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ ...syne, fontSize: "13px", color: "#f87171" }}>{error}</p>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          style={{
            background: !canSubmit ? "rgba(229,72,77,0.35)" : "#E5484D",
            color: "white",
            ...syne,
            fontSize: "0.95rem",
            fontWeight: 700,
            padding: "16px 40px",
            borderRadius: "9999px",
            border: "none",
            cursor: !canSubmit ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
            boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
          }}
        >
          Generate my six documents →
        </button>
        {!canSubmit && (
          <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem" }}>
            Company name, system name, and what it does are required — everything else can be left blank and revisited later.
          </p>
        )}
      </div>
    </form>
  );
}
