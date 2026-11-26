import type { CSSProperties } from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as CSSProperties;

/**
 * Who runs Red Flag, and the other business he runs. Said plainly, because the
 * same person may speak to a customer about both. Shown on the About page and
 * at the foot of the homepage, mirroring the Red Flag panel on recoverroi.com.
 */
export function SisterBusiness() {
  return (
    <div
      style={{
        background: "rgba(16,41,67,0.5)",
        border: "1px solid rgba(201,166,107,0.3)",
        borderRadius: "12px",
        padding: "2.5rem",
        textAlign: "left",
      }}
    >
      <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.75rem" }}>
        Red Flag AI Pro is run by James Stokes and does two things: compliance and AI governance. It catches what a business says in public and proves how it uses AI.
      </p>

      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* RecoverROI's own mark, as used on recoverroi.com */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60" role="img" aria-label="RecoverROI" style={{ flexShrink: 0, borderRadius: "13px" }}>
          <rect width="64" height="64" rx="14" fill="#0b0912" />
          <path d="M16 50 V16 H32 a9 9 0 0 1 0 18 H16 M27 34 L38 50" fill="none" stroke="#f3f0fa" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 50 V24 H52 a7 7 0 0 1 0 14 H40 M50 38 L58 50" fill="none" stroke="#A855F7" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.1rem" }}>
            James also runs <strong style={{ color: "#F4F1EA" }}>RecoverROI</strong>, which finds where small businesses are losing customers and fixes it: full websites built from scratch, pages that load fast, proper tracking of what the site brings in, and enquiries that get answered. Every website RecoverROI builds is checked by Red Flag before it goes live.
          </p>
          <a
            href="https://www.recoverroi.com"
            target="_blank"
            rel="noopener"
            style={{ ...syne, fontSize: "0.95rem", fontWeight: 700, color: "#C9A66B", textDecoration: "none" }}
          >
            See what RecoverROI does at recoverroi.com →
          </a>
        </div>
      </div>
    </div>
  );
}
