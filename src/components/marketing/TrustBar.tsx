import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const JURISDICTIONS = [
  { name: "UK", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clipPath="url(#a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/></g></svg> },
  { name: "USA", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900"><rect width="7410" height="3900" fill="#B22234"/><path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" strokeWidth="300"/><rect width="2964" height="2100" fill="#3C3B6E"/><g fill="#fff"><g id="s"><g id="c"><g id="e"><g id="d"><path id="b" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"/></g><use href="#b" y="420"/><use href="#b" y="840"/><use href="#b" y="1260"/><use href="#b" y="1680"/></g><use href="#d" x="247" y="210"/><use href="#d" x="247" y="630"/><use href="#d" x="247" y="1050"/><use href="#d" x="247" y="1470"/></g><use href="#c" x="494"/><use href="#c" x="988"/><use href="#c" x="1482"/><use href="#c" x="1976"/></g><use href="#e" x="247" y="210"/><use href="#e" x="247" y="1050"/><use href="#e" x="247" y="1890"/><use href="#s" x="2470"/></g></svg> },
  { name: "EU", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#039"/><g fill="#FC0" id="s"><circle r=".115" cx="1.5" cy=".283"/><circle r=".115" cx="1.807" cy=".374"/><circle r=".115" cx="1.949" cy=".66"/><circle r=".115" cx="1.807" cy=".946"/><circle r=".115" cx="1.5" cy="1.038"/><circle r=".115" cx="1.193" cy=".946"/><circle r=".115" cx="1.051" cy=".66"/><circle r=".115" cx="1.193" cy=".374"/><circle r=".115" cx="1.5" cy="1.717"/></g></svg> },
  { name: "Canada", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><path fill="#f00" d="M0 0h100v200H0zm300 0h100v200H300z"/><path fill="#fff" d="M100 0h200v200H100z"/><path fill="#f00" d="M175 100l-37.5-25 12.5-5-25-37.5 37.5 12.5L175 25l12.5 20 37.5-12.5-25 37.5 12.5 5z"/><path fill="#f00" d="M163 100h74v12.5h-74z"/></svg> },
  { name: "Australia", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#00008B"/><path d="M0 0l600 300M600 0L0 300" stroke="#fff" strokeWidth="60"/><path d="M0 0l600 300M600 0L0 300" stroke="#f00" strokeWidth="40"/><path d="M300 0v300M0 150h600" stroke="#fff" strokeWidth="100"/><path d="M300 0v300M0 150h600" stroke="#f00" strokeWidth="60"/></svg> },
  { name: "Singapore", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 2"><rect width="4" height="1" fill="#EF3340"/><rect y="1" width="4" height="1" fill="#fff"/><circle cx=".8" cy="1" r=".4" fill="#fff"/><circle cx=".95" cy="1" r=".4" fill="#EF3340"/><g fill="#fff" transform="translate(.95,.72) scale(.18)"><polygon points="0,-1 .588,.809 -.951,-.309 .951,-.309 -.588,.809"/></g></svg> },
  { name: "UAE", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#fff"/><rect width="1200" height="200" fill="#00732F"/><rect y="400" width="1200" height="200" fill="#000"/><rect width="300" height="600" fill="#EF3340"/></svg> },
  { name: "S. Africa", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 4"><path d="M0 0h6v4H0z" fill="#007A4D"/><path d="M0 0l4 2-4 2z" fill="#FFB612"/><path d="M0 0l3.5 2-3.5 2z" fill="#000"/><path d="M0 1.25h3.8l.9.75-.9.75H0z" fill="#fff"/><path d="M0 1.5h3.6l.7.5-.7.5H0z" fill="#DE3831"/><path d="M3.8 2H6V1H3.8l.9 1z" fill="#000" opacity="0"/><rect y="0" width="6" height=".67" fill="#007A4D"/><rect y="3.33" width="6" height=".67" fill="#007A4D"/><rect y=".67" width="6" height=".66" fill="#FFB612"/><rect y="2.67" width="6" height=".66" fill="#FFB612"/><rect y="1.33" width="6" height="1.34" fill="#DE3831"/></svg> },
  { name: "India", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#138808"/><rect width="900" height="400" fill="#fff"/><rect width="900" height="200" fill="#FF9933"/><circle cx="450" cy="300" r="60" fill="none" stroke="#000080" strokeWidth="4"/><circle cx="450" cy="300" r="8" fill="#000080"/></svg> },
  { name: "Nigeria", svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect width="1" height="2" fill="#008751"/><rect x="2" width="1" height="2" fill="#008751"/></svg> },
];

const FRAMEWORKS = [
  "EU AI Act",
  "FTC",
  "DORA",
  "ASA",
  "NIST AI RMF",
  "ISO 42001",
  "SEC",
  "GDPR",
  "Munir v SSHD",
];

const ASSURANCES = [
  "Audit ready evidence on every assessment",
  "Your data is never stored or sold",
  "Mapped to real regulatory frameworks, not generic checklists",
];

/**
 * Institutional credibility band. Regulatory-framework mapping is the single
 * highest-impact trust signal for CFO / compliance / risk buyers — lead with it.
 */
export function TrustBar() {
  return (
    <section
      aria-label="Regulatory alignment"
      style={{
        background: "#0C1929",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px", justifyContent: "center", alignItems: "center", marginBottom: "1.75rem" }}>
          {JURISDICTIONS.map((j) => (
            <div key={j.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "36px", height: "24px", borderRadius: "3px", overflow: "hidden", display: "block", flexShrink: 0 }}>
                {React.cloneElement(j.svg, { width: "36", height: "24", style: { display: "block" } })}
              </div>
              <span style={{ ...syne, fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.4)", textTransform: "uppercase" }}>{j.name}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.5)" }} />
          <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)" }}>
            Aligned to the frameworks regulators examine
          </p>
          <span style={{ width: "24px", height: "1px", background: "rgba(229,72,77,0.5)" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", justifyContent: "center", alignItems: "center", marginBottom: "1.75rem" }}>
          {FRAMEWORKS.map((f, i) => (
            <React.Fragment key={f}>
              {i > 0 && <span aria-hidden style={{ color: "rgba(255,255,255,0.15)" }}>·</span>}
              <span style={{ ...mono, fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", color: "rgba(244,241,234,0.85)" }}>{f}</span>
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 32px", justifyContent: "center" }}>
          {ASSURANCES.map((a) => (
            <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...syne, fontSize: "12px", color: "rgba(244,241,234,0.5)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
