import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Master Service Agreement (Draft): Red Flag AI Pro",
  description: "Draft Master Service Agreement skeleton for Red Flag AI Pro enterprise engagements. Not yet reviewed by a solicitor and not in effect.",
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

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "rgba(250,204,21,0.12)", color: "#facc15", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
      [{children} — negotiated per Order Form]
    </span>
  );
}

export default function MSAPage() {
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
            Master Service Agreement
          </h1>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Draft skeleton, 9 August 2026</p>
        </div>
      </section>

      {/* DRAFT BANNER */}
      <section style={{ padding: "2rem 1.5rem 0" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: "12px", padding: "1.5rem 1.75rem" }}>
          <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#facc15", marginBottom: "0.5rem" }}>DRAFT — not yet reviewed by a solicitor, not in effect</p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            This is a skeleton, not a finished agreement. It restructures what the existing <Link href="/terms" style={{ color: "#facc15" }}>Terms of Service</Link> already covers into the shape enterprise procurement teams look for (parties, fees, term, liability, an Order Form structure), but the terms that actually matter in an enterprise deal — liability caps, uptime commitments, indemnification — are marked below as negotiated per deal, not invented here. It has not been reviewed by a solicitor and is not a binding document. It is not linked from the site navigation or footer. Built ahead of any real enterprise prospect asking for one, so a starting point exists rather than a blank page.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          <Section n="1" title="Parties and structure">
            <P>This Master Service Agreement (&quot;MSA&quot;) is between the customer (&quot;Customer&quot;) and Red Flag AI Pro, a trading name of James Stokes, a sole trader established in the United Kingdom (&quot;Provider&quot;). This MSA sets out the terms that apply across all engagements between the parties. Specific services, fees, and any <Placeholder>deal-specific terms</Placeholder> for a given engagement are set out in a separate Order Form, which incorporates this MSA by reference. Where an Order Form conflicts with this MSA, the Order Form governs for that engagement only.</P>
          </Section>

          <Section n="2" title="Services">
            <P>Provider will supply the compliance checking, AI governance assessment, and related services described in the applicable Order Form, consistent with the general product descriptions published at redflagaipro.com. Provider is not a firm of solicitors, is not authorised or regulated by the Solicitors Regulation Authority, and the services do not constitute legal advice.</P>
          </Section>

          <Section n="3" title="Fees and payment">
            <P>Fees, billing frequency, and payment terms are set out in the applicable Order Form. Unless the Order Form states otherwise, invoices are payable within <Placeholder>net payment term, e.g. 30 days</Placeholder> of the invoice date. Late payment may be subject to statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998.</P>
          </Section>

          <Section n="4" title="Term and termination">
            <P>This MSA remains in effect for as long as an Order Form referencing it is active. Either party may terminate an Order Form for material breach not cured within <Placeholder>cure period, e.g. 30 days</Placeholder> of written notice. Provider may suspend the service for non-payment after reasonable notice. On termination, Customer&apos;s account data is handled as described in the <Link href="/dpa" style={{ color: "#E5484D" }}>Data Processing Agreement</Link>.</P>
          </Section>

          <Section n="5" title="Service levels">
            <P>Any uptime commitment, support response times, or service credits for an engagement are set out in the applicable Order Form as a Service Level Schedule. No uptime or availability commitment applies except where stated in an Order Form. <Placeholder>Specific SLA percentage and remedy structure</Placeholder> to be agreed per engagement, not assumed here.</P>
          </Section>

          <Section n="6" title="Confidentiality">
            <P>Each party will protect the other&apos;s confidential information with reasonable care and use it only to perform this MSA. This does not limit either party&apos;s obligations under the Data Processing Agreement with respect to personal data specifically.</P>
          </Section>

          <Section n="7" title="Intellectual property">
            <P>Provider retains ownership of its platform, software, and branding. Customer retains ownership of content it submits and data it enters. Full detail of what is retained, for how long, and how submitted content is handled is in the <Link href="/privacy" style={{ color: "#E5484D" }}>Privacy Policy</Link>.</P>
          </Section>

          <Section n="8" title="Data protection">
            <P>Where Provider processes personal data on Customer&apos;s behalf, the parties&apos; obligations are set out in the <Link href="/dpa" style={{ color: "#E5484D" }}>Data Processing Agreement</Link>, incorporated into this MSA by reference.</P>
          </Section>

          <Section n="9" title="Warranties and disclaimers">
            <P>Provider warrants it will perform the services with reasonable skill and care. Except as expressly stated, the services are provided &quot;as is&quot;. Provider does not warrant that check results are error-free or constitute legal compliance advice; see the disclaimer in the Terms of Service.</P>
          </Section>

          <Section n="10" title="Limitation of liability">
            <P>Subject to section 11, each party&apos;s total liability arising out of this MSA and any Order Form is capped at <Placeholder>liability cap, e.g. fees paid in the preceding 12 months</Placeholder>. Neither party is liable for indirect, incidental, or consequential loss.</P>
          </Section>

          <Section n="11" title="Liability that cannot be limited">
            <P>Nothing in this MSA excludes or limits either party&apos;s liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot lawfully be excluded or limited.</P>
          </Section>

          <Section n="12" title="Indemnification">
            <P><Placeholder>Mutual or one-directional indemnification terms, scope of IP infringement and data breach indemnities</Placeholder> to be agreed per engagement based on the actual risk allocation both parties accept, not set generically here.</P>
          </Section>

          <Section n="13" title="Governing law and notices">
            <P>This MSA is governed by the laws of England and Wales, with the courts of England and Wales having exclusive jurisdiction. Notices under this MSA should be sent to <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a> and to the address Customer provides in its Order Form.</P>
          </Section>

          <Section n="14" title="Entire agreement">
            <P>This MSA, together with any Order Form and the Data Processing Agreement, constitutes the entire agreement between the parties for the services described, superseding the general Terms of Service to the extent of any conflict for that Customer&apos;s engagement.</P>
          </Section>

          <Section n="15" title="Contact">
            <P>To discuss an enterprise engagement or request this document once solicitor-reviewed: <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>.</P>
          </Section>

        </div>

        <div style={{ maxWidth: "720px", margin: "4rem auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <Link href="/terms" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/dpa" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Data Processing Agreement</Link>
          <Link href="/privacy" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/" style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
