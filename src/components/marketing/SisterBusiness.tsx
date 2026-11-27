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
        {/* RecoverROI's own icon (logo B, 27 Nov 2026), as used on recoverroi.com */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="60" height="60" role="img" aria-label="RecoverROI" style={{ flexShrink: 0 }}>
          <defs>
            <radialGradient id="rroi-bg" cx="0.5" cy="0.38" r="0.7">
              <stop offset="0" stopColor="#3A1D66" />
              <stop offset="0.6" stopColor="#160C2A" />
              <stop offset="1" stopColor="#07050C" />
            </radialGradient>
            <linearGradient id="rroi-ink" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="210">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#E9E4F5" />
              <stop offset="1" stopColor="#B9B1CC" />
            </linearGradient>
            <linearGradient id="rroi-pu" gradientUnits="userSpaceOnUse" x1="70" y1="40" x2="185" y2="150">
              <stop offset="0" stopColor="#D8B4FE" />
              <stop offset="0.45" stopColor="#A855F7" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
            <filter id="rroi-gl" filterUnits="userSpaceOnUse" x="-200" y="-200" width="700" height="700">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <rect width="240" height="240" rx="52" fill="url(#rroi-bg)" />
          <g transform="translate(120 120) scale(0.92) translate(-125 -125)">
            <path d="M74 44 H134 A46 46 0 0 1 134 136 H112" fill="none" stroke="#A855F7" strokeWidth="30" strokeLinecap="round" opacity="0.55" filter="url(#rroi-gl)" />
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
              <path d="M74 204 V44" stroke="url(#rroi-ink)" />
              <path d="M74 44 H134 A46 46 0 0 1 134 136 H112" stroke="url(#rroi-pu)" />
              <path d="M122.3 156.1 L100 136 L122.3 115.9" stroke="url(#rroi-pu)" />
              <path d="M132 150 L176 204" stroke="url(#rroi-ink)" />
            </g>
            <path d="M80 50 H132 A40 40 0 0 1 168 72" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
          </g>
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
