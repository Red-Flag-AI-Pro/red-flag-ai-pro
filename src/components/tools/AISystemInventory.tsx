"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

interface SystemRow {
  name: string;
  owner: string;
  sensitiveData: boolean;
  autonomousAction: boolean;
  shadow: boolean;
}

function emptyRow(): SystemRow {
  return { name: "", owner: "", sensitiveData: false, autonomousAction: false, shadow: false };
}

// Alex Miguel Meyer, LinkedIn 24 Aug 2026: an AI System Inventory names every
// tool in use, with an owner and a risk tier, including the AI quietly added
// to software you already pay for. Tier is derived, not typed in, so two
// people describing the same tool land on the same answer. Shadow AI counts
// on its own: a tool nobody deliberately chose is a real risk even with no
// sensitive data and no autonomy, because nobody was ever in a position to
// say no to it in the first place.
function riskTier(row: SystemRow): "High" | "Medium" | "Low" {
  const score = Number(row.sensitiveData) + Number(row.autonomousAction) + Number(row.shadow);
  if (score >= 2) return "High";
  if (score === 1) return "Medium";
  return "Low";
}

export function AISystemInventory() {
  const [rows, setRows] = useState<SystemRow[]>([emptyRow()]);
  const [copied, setCopied] = useState(false);

  function updateRow(index: number, patch: Partial<SystemRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  const namedRows = useMemo(() => rows.filter((r) => r.name.trim()), [rows]);
  const highCount = namedRows.filter((r) => riskTier(r) === "High").length;
  const shadowCount = namedRows.filter((r) => r.shadow).length;
  const unownedCount = namedRows.filter((r) => !r.owner.trim()).length;

  const output = useMemo(() => {
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const list = namedRows.length
      ? namedRows
          .map((r, i) => {
            const tier = riskTier(r);
            return `${i + 1}. ${r.name.trim()}
   Owner: ${r.owner.trim() || "Not yet named"}
   Risk tier: ${tier}
   Handles sensitive or regulated data: ${r.sensitiveData ? "Yes" : "No"}
   Takes action without a human clicking each one: ${r.autonomousAction ? "Yes" : "No"}
   Found in use, not deliberately adopted: ${r.shadow ? "Yes" : "No"}`;
          })
          .join("\n\n")
      : "No systems added yet.";

    return `AI SYSTEM INVENTORY
Prepared by Red Flag AI Pro, ${date}

${list}

SUMMARY
${namedRows.length} system${namedRows.length === 1 ? "" : "s"} listed. ${highCount} at high risk tier. ${shadowCount} found in use rather than deliberately adopted. ${unownedCount} with no owner named yet.

WHAT TO DO WITH THIS
Every system with no owner named is the first thing to fix, not the risk tier. A high risk tool with a named owner is being managed. A tool of any tier with nobody's name on it is not, whatever the rest of this list says.

This is guidance, not legal advice. It is a starting inventory, not a substitute for reviewing it with whoever actually holds authority over each system.`;
  }, [namedRows, highCount, shadowCount, unownedCount]);

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
    fontSize: "13.5px",
    padding: "10px 12px",
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

  const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    ...syne,
    fontSize: "12.5px",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
  };

  return (
    <div>
      <div style={{
        background: "#0F2138",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "2rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)"
      }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gap: "0.75rem",
              paddingBottom: "1.25rem",
              marginBottom: "1.25rem",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={labelStyle}>AI tool or system</label>
                <input
                  value={row.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                  placeholder="e.g. ChatGPT, an embedded copilot, an internal agent"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Owner</label>
                <input
                  value={row.owner}
                  onChange={(e) => updateRow(i, { owner: e.target.value })}
                  placeholder="Who's accountable for this one"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "0.25rem" }}>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={row.sensitiveData} onChange={(e) => updateRow(i, { sensitiveData: e.target.checked })} style={{ marginTop: "2px" }} />
                Handles sensitive or regulated data
              </label>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={row.autonomousAction} onChange={(e) => updateRow(i, { autonomousAction: e.target.checked })} style={{ marginTop: "2px" }} />
                Takes action without a human clicking each one
              </label>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={row.shadow} onChange={(e) => updateRow(i, { shadow: e.target.checked })} style={{ marginTop: "2px" }} />
                Found in use, nobody deliberately adopted it
              </label>
            </div>

            {rows.length > 1 && (
              <button
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", justifySelf: "start" }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
          style={{
            ...syne,
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#E5484D",
            background: "none",
            border: "1px solid rgba(229,72,77,0.35)",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          + Add another system
        </button>
      </div>

      <ResultsGate tool="ai-system-inventory" title="Enter your email to see the full inventory. Free, plus occasional updates, unsubscribe anytime.">
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{
            background: "#102943",
            border: "1px solid rgba(239,68,68,0.2)",
            borderLeft: "3px solid #E5484D",
            padding: "1.5rem 1.75rem",
          }}>
            <p style={labelStyle}>Your inventory</p>
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
          This tells you what exists. It won&apos;t prove who approved it.
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "460px", margin: "0.5rem auto 1.5rem" }}>
          A boundary authorization record seals who owns a system, what it&apos;s allowed to do, and when that authority stops being current, independently timestamped so the record holds up later, not just while someone remembers it.
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
        This tool gives general guidance, not legal advice. It is a starting inventory, not a substitute for reviewing it with whoever actually holds authority over each system.
      </p>
    </div>
  );
}
