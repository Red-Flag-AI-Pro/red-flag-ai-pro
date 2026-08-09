import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Data Processing Agreement (Draft): Red Flag AI Pro",
  description: "Draft Data Processing Agreement for Red Flag AI Pro, structured to GDPR Article 28. Not yet reviewed by a solicitor and not in effect.",
  robots: { index: false, follow: false },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>{n}. {title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "0.75rem" }}>{children}</p>;
}

export default function DPAPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "7rem 1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D" }}>Legal</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", color: "#F4F1EA" }}>
            Data Processing Agreement
          </h1>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Draft, 9 August 2026</p>
        </div>
      </section>

      {/* DRAFT BANNER */}
      <section style={{ padding: "2rem 1.5rem 0" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: "12px", padding: "1.5rem 1.75rem" }}>
          <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#facc15", marginBottom: "0.5rem" }}>DRAFT — not yet reviewed by a solicitor, not in effect</p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            This page is structured to GDPR Article 28 and grounded in what Red Flag AI Pro actually does today, but it has not been reviewed by a solicitor and is not a binding agreement between Red Flag AI Pro and any customer. It is not linked from the site navigation or footer. If you are a customer who needs a DPA in place, contact <a href="mailto:support@redflagaipro.com" style={{ color: "#facc15" }}>support@redflagaipro.com</a> directly rather than relying on this page.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          <Section n="1" title="Parties and definitions">
            <P>This Data Processing Agreement (&quot;DPA&quot;) is between the customer (&quot;Controller&quot;) and Red Flag AI Pro, a trading name of James Stokes, a sole trader established in the United Kingdom (&quot;Processor&quot;). It supplements the Terms of Service and applies to the extent Red Flag AI Pro processes personal data on the Controller&apos;s behalf.</P>
            <P>&quot;Personal data&quot;, &quot;processing&quot;, &quot;data subject&quot;, &quot;controller&quot; and &quot;processor&quot; carry the meanings given in UK GDPR and, where applicable, EU GDPR.</P>
          </Section>

          <Section n="2" title="Subject matter and duration">
            <P>The Processor processes personal data on the Controller&apos;s behalf for the duration of the Controller&apos;s subscription to Red Flag AI Pro, for the purpose of providing the compliance checking and AI governance services described in the Terms of Service. Processing ends when the Controller&apos;s account is closed, subject to section 9 (deletion and return of data).</P>
          </Section>

          <Section n="3" title="Nature and purpose of processing">
            <P>The Processor processes personal data to: run compliance checks on content the Controller submits; generate and store the Controller&apos;s AI governance assessment results; provide account authentication and dashboard functionality; store governance records the Controller creates, including boundary authorization records; and deliver transactional and account-related communications.</P>
          </Section>

          <Section n="4" title="Categories of personal data">
            <P>Depending on which features the Controller uses, this may include: account holder name and email address; personal data contained within content submitted for compliance checking; names, roles and email addresses of the Controller&apos;s own personnel where the Controller records this in governance features such as boundary authorization records; and usage data associated with the Controller&apos;s account.</P>
            <P>The Processor does not require or request special category data. If the Controller submits special category data within content it checks, the Processor processes it only as an incidental part of running the check, for the duration described in section 2, and never for any other purpose.</P>
          </Section>

          <Section n="5" title="Categories of data subjects">
            <P>The Controller&apos;s own personnel and authorised users; personnel of the Controller named within governance records the Controller creates; and any individuals whose personal data appears within content the Controller submits for checking.</P>
          </Section>

          <Section n="6" title="Processor obligations">
            <P>The Processor shall: process personal data only on the Controller&apos;s documented instructions, including as set out in this DPA and the Terms of Service; ensure persons authorised to process the data are subject to confidentiality obligations; implement the security measures described in section 8; assist the Controller in responding to data subject rights requests and in meeting its own obligations under UK/EU GDPR, taking into account the nature of processing and the information available to the Processor; notify the Controller of a personal data breach without undue delay as described in section 10; and make available information reasonably necessary to demonstrate compliance with this DPA.</P>
          </Section>

          <Section n="7" title="Sub-processors">
            <P>The Controller authorises the Processor to engage the following sub-processors, each bound by its own data processing terms:</P>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                ["Supabase", "Database and authentication, data stored in the EU region"],
                ["Stripe", "Payment processing, PCI DSS compliant"],
                ["Vercel", "Website and application hosting"],
                ["OpenAI / Anthropic", "AI processing of check requests and the site assistant"],
                ["DigiCert / freeTSA", "Independent timestamping of a record's content hash only, for Sentinel customers who use sealed governance records"],
                ["Loops", "Transactional and account-related email delivery"],
              ].map(([label, text]) => (
                <li key={label as string} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  <strong style={{ color: "white" }}>{label}:</strong> {text}
                </li>
              ))}
            </ul>
            <P>The Processor will give the Controller reasonable notice before adding or replacing a sub-processor that handles personal data, so the Controller has an opportunity to object.</P>
          </Section>

          <Section n="8" title="Security measures">
            <P>The Processor implements encrypted data storage, HTTPS in transit, and access controls restricting who can view account and check data. Submitted content used to generate a compliance check is not retained beyond delivering the result unless the Controller chooses to keep check history, and is never used to train AI models. No human at Red Flag AI Pro reviews submitted content as a matter of course.</P>
          </Section>

          <Section n="9" title="Deletion and return of data">
            <P>On termination of the Controller&apos;s account, account data is retained for 30 days to allow for accidental-deletion recovery, then permanently deleted, except billing records which are retained for 7 years as required by UK law. The Controller may request deletion or export of its data at any point before then by contacting support.</P>
          </Section>

          <Section n="10" title="Breach notification">
            <P>The Processor will notify the Controller without undue delay after becoming aware of a personal data breach affecting the Controller&apos;s data, providing the information reasonably available at the time and updating it as the investigation progresses.</P>
          </Section>

          <Section n="11" title="International transfers">
            <P>Where a sub-processor listed in section 7 processes data outside the UK or EEA, that transfer is made under that provider&apos;s own published safeguards (such as Standard Contractual Clauses or an adequacy decision). The Processor will provide further detail on request.</P>
          </Section>

          <Section n="12" title="Contact">
            <P>Questions about this DPA, or a request for a signed version once solicitor-reviewed: <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>.</P>
          </Section>

        </div>

        <div style={{ maxWidth: "720px", margin: "4rem auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", gap: "2rem" }}>
          <Link href="/terms" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/privacy" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/" style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
