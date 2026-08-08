import Link from "next/link";
import Image from "next/image";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Compliance Assessment", href: "/compliance-assessment" },
      { label: "Governance Assessment", href: "/governance-audit" },
      { label: "Boundary Authorization Records", href: "/boundary-authorization-records" },
      { label: "Who, When, Whether", href: "/who-when-whether" },
      { label: "For law firms", href: "/law-firms" },
      { label: "Sentinel", href: "/sentinel" },
      { label: "Pricing", href: "/pricing" },
      { label: "Case study", href: "/case-study" },
      { label: "How we compare", href: "/compare" },
    ],
  },
  {
    heading: "Free tools",
    links: [
      // Curated picks only — the full, growing catalog (21+ tools) lives at
      // /tools, organized into groups. This column stays scannable rather
      // than becoming the same crowded list it was before 4 Aug.
      { label: "Compliance Checklist", href: "/tools/compliance-checklist" },
      { label: "Fine Calculator", href: "/tools/fine-calculator" },
      { label: "Disclosure Generator", href: "/tools/disclosure-generator" },
      { label: "DPIA Generator", href: "/tools/dpia-generator" },
      { label: "Documentation Assistant", href: "/tools/documentation-assistant" },
      { label: "Contract Red Flags", href: "/tools/contract-red-flags" },
      { label: "Accessibility Checker", href: "/tools/accessibility-checker" },
      { label: "All tools →", href: "/tools" },
    ],
  },
  {
    heading: "Witness network",
    links: [
      { label: "The Witness Test", href: "/witness-test" },
      { label: "How it works", href: "/witness-network" },
      { label: "Open Witness Standard", href: "/witness-standard" },
      { label: "Verify a record", href: "/verify" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Insights", href: "/blog" },
      { label: "Partners: earn 15%", href: "/affiliates" },
      { label: "Why compliance", href: "/why-compliance" },
      { label: "EU-KI-Verordnung (Deutsch)", href: "/de/eu-ai-act" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "mailto:support@redflagaipro.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#0C1929", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "4rem 1.5rem 2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr repeat(5, 1fr)", gap: "2rem", alignItems: "start" }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
              <Image src="/redflag-logo-full.png" alt="Red Flag AI Pro" width={120} height={95} className="object-contain" style={{ height: "auto" }} />
            </Link>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.5)", lineHeight: 1.6, maxWidth: "260px" }}>
              Catch compliance risk in your marketing copy, and prove your AI governance before regulators ask. For marketers, agencies, CFOs and compliance teams.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)", marginBottom: "1rem" }}>{col.heading}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link" style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.65)", textDecoration: "none" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "3rem", paddingTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)" }}>© {new Date().getFullYear()} Red Flag AI Pro. All rights reserved.</p>
          <p className="font-mono-fig" style={{ fontSize: "11px", color: "rgba(244,241,234,0.35)", letterSpacing: "0.02em" }}>
            EU AI Act · DORA · SEC · GDPR · NIST AI RMF · ISO 42001 · Munir v SSHD
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #F4F1EA; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 760px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 460px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
