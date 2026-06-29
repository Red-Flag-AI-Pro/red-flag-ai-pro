"use client";

import { useState } from "react";
import type { JurisdictionCode } from "@/lib/analyzer";

export type { JurisdictionCode };

export const JURISDICTIONS: {
  code: JurisdictionCode;
  name: string;
  flag: string;
  laws: string;
}[] = [
  { code: "us", name: "USA",       flag: "us", laws: "FTC · FDA · TCPA" },
  { code: "gb", name: "UK",        flag: "gb", laws: "CMA · ASA · FCA" },
  { code: "eu", name: "EU",        flag: "eu", laws: "GDPR · DSA · AI Act" },
  { code: "au", name: "Australia", flag: "au", laws: "ACCC · TGA" },
  { code: "ca", name: "Canada",    flag: "ca", laws: "CASL · PIPEDA" },
  { code: "br", name: "Brazil",    flag: "br", laws: "LGPD" },
  { code: "in", name: "India",     flag: "in", laws: "DPDP 2023" },
  { code: "sg", name: "Singapore", flag: "sg", laws: "PDPA" },
  { code: "ae", name: "UAE",       flag: "ae", laws: "PDPL 2022" },
  { code: "ng", name: "Nigeria",   flag: "ng", laws: "NDPR · FCCPC" },
];

interface Props {
  value: JurisdictionCode[];
  onChange: (value: JurisdictionCode[]) => void;
  compact?: boolean;
}

export function JurisdictionPicker({ value, onChange, compact = false }: Props) {
  const [hovered, setHovered] = useState<JurisdictionCode | null>(null);
  const allSelected = value.length === JURISDICTIONS.length;

  function toggle(code: JurisdictionCode) {
    if (value.includes(code)) {
      onChange(value.filter(c => c !== code));
    } else {
      onChange([...value, code]);
    }
  }

  function toggleAll() {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(JURISDICTIONS.map(j => j.code));
    }
  }

  return (
    <div style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
      {/* Header row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: compact ? "10px" : "14px",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: value.length > 0 ? "#ef4444" : "rgba(255,255,255,0.2)",
            display: "inline-block",
            boxShadow: value.length > 0 ? "0 0 8px rgba(239,68,68,0.6)" : "none",
            transition: "all 0.3s",
          }} />
          <span style={{
            fontSize: compact ? "10px" : "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}>
            {value.length === 0
              ? "Select jurisdictions"
              : value.length === JURISDICTIONS.length
              ? "All 10 jurisdictions"
              : `${value.length} of 10 selected`}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: allSelected ? "#ef4444" : "rgba(255,255,255,0.4)",
            background: allSelected ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
            border: allSelected ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            padding: "4px 10px",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'Syne', system-ui, sans-serif",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = allSelected ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = allSelected ? "#ef4444" : "rgba(255,255,255,0.4)";
          }}
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>

      {/* Flag chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: compact ? "6px" : "8px",
      }}>
        {JURISDICTIONS.map(j => {
          const selected = value.includes(j.code);
          const isHovered = hovered === j.code;

          return (
            <button
              key={j.code}
              type="button"
              onClick={() => toggle(j.code)}
              onMouseEnter={() => setHovered(j.code)}
              onMouseLeave={() => setHovered(null)}
              title={`${j.name} — ${j.laws}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: compact ? "5px" : "7px",
                padding: compact ? "5px 8px" : "6px 11px",
                borderRadius: "8px",
                border: selected
                  ? "1px solid rgba(239,68,68,0.5)"
                  : isHovered
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: selected
                  ? "rgba(239,68,68,0.1)"
                  : isHovered
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: selected ? "translateY(-1px)" : "none",
                boxShadow: selected ? "0 2px 12px rgba(239,68,68,0.15)" : "none",
                fontFamily: "'Syne', system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Selected glow pulse */}
              {selected && (
                <span style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
              )}

              {/* Flag image */}
              <span style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                width: compact ? "18px" : "22px",
                height: compact ? "13px" : "16px",
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                opacity: selected ? 1 : 0.6,
                transition: "opacity 0.15s",
              }}>
                <img
                  src={`https://flagcdn.com/w40/${j.flag}.png`}
                  alt={j.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </span>

              {/* Country name */}
              <span style={{
                fontSize: compact ? "10px" : "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: selected ? "white" : "rgba(255,255,255,0.45)",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}>
                {j.name}
              </span>

              {/* Checkmark */}
              {selected && (
                <span style={{
                  width: compact ? "12px" : "14px",
                  height: compact ? "12px" : "14px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                    <path d="M1 2.5L2.8 4.2L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Laws hint */}
      {!compact && value.length > 0 && value.length < JURISDICTIONS.length && (
        <p style={{
          marginTop: "10px",
          fontSize: "10px",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.04em",
          lineHeight: 1.6,
        }}>
          Checking:{" "}
          {value.map(code => {
            const j = JURISDICTIONS.find(j => j.code === code)!;
            return j.laws;
          }).join(" · ")}
        </p>
      )}
    </div>
  );
}
