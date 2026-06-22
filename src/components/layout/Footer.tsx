import Link from "next/link";
import Image from "next/image";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Assessment", href: "/governance-audit" },
      { label: "Sentinel", href: "/sentinel" },
      { label: "Pricing", href: "/pricing" },
      { label: "Case study", href: "/case-study" },
    ],
  },
  {
    heading: "Free tools",
    links: [
      { label: "Fine Calculator", href: "/tools/fine-calculator" },
      { label: "Compliance Checklist", href: "/tools/compliance-checklist" },
      { label: "Disclosure Generator", href: "/tools/disclosure-generator" },
      { label: "Contract Red Flags", href: "/tools/contract-red-flags" },
      { label: "Accessibility Checker", href: "/tools/accessibility-checker" },
      { label: "Shadow AI Audit", href: "/tools/shadow-ai-survey" },
      { label: "URL Exposure Checker", href: "/tools/url-exposure-checker" },
      { label: "AI Visibility Checker", href: "/tools/ai-visibility-checker" },
      { label: "All tools", href: "/tools" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Insights", href: "/blog" },
      { label: "Partners: earn 15%", href: "/affiliates" },
      { label: "Why compliance", href: "/why-compliance" },
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
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: "2.5rem", alignItems: "start" }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
              <Image src="/redflag-logo-full.png" alt="Red Flag AI Pro" width={120} height={95} className="object-contain" style={{ height: "auto" }} />
            </Link>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.5)", lineHeight: 1.6, maxWidth: "260px" }}>
              Prove your AI governance before regulators ask. Audit ready evidence for CFOs, compliance and risk teams.
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
