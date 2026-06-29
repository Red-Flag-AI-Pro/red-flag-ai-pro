import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

// Governance-relevant regulators per jurisdiction (CFO/compliance framing).
const JURISDICTIONS = [
  { code: "us", name: "United States", regs: "SEC · FTC" },
  { code: "gb", name: "United Kingdom", regs: "FCA · ICO · Munir" },
  { code: "eu", name: "European Union", regs: "EU AI Act · DORA · GDPR" },
  { code: "au", name: "Australia", regs: "ASIC · OAIC" },
  { code: "ca", name: "Canada", regs: "OSFI · PIPEDA" },
  { code: "br", name: "Brazil", regs: "LGPD · ANPD" },
  { code: "in", name: "India", regs: "DPDP 2023" },
  { code: "sg", name: "Singapore", regs: "PDPA · MAS" },
  { code: "ae", name: "United Arab Emirates", regs: "PDPL 2022" },
  { code: "ng", name: "Nigeria", regs: "NDPR · FCCPC · NCC" },
];

export function JurisdictionStrip() {
  return (
    <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>Global coverage</p>
            <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.6)" }} />
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.12 }}>
            Mapped across <span style={{ fontStyle: "italic", color: "#E5484D" }}>10 jurisdictions</span>
          </h2>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, maxWidth: "560px", margin: "1rem auto 0" }}>
            Your assessment is benchmarked against the regulators that examine AI governance in each market you operate in.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          {JURISDICTIONS.map((j) => (
            <div
              key={j.code}
              className="jx-cell"
              style={{ background: "var(--navy-raised, #102943)", padding: "1.5rem 1.25rem", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.7rem" }}
            >
              <img
                src={`https://flagcdn.com/w160/${j.code}.png`}
                srcSet={`https://flagcdn.com/w160/${j.code}.png 1x, https://flagcdn.com/w320/${j.code}.png 2x`}
                alt={`${j.name} flag`}
                width={44}
                height={29}
                loading="lazy"
                style={{ width: "44px", height: "29px", objectFit: "cover", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
              />
              <div>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#F4F1EA", marginBottom: "2px" }}>{j.name}</p>
                <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.5)", letterSpacing: "0.02em" }}>{j.regs}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
