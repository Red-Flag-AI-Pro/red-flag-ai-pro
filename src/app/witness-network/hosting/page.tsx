import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Hosted Witnessing — Installed and Run For You",
  description:
    "The raw witness endpoint is free and always will be. If your team can't self serve it, we install the connection, host the dashboard, and hand you a sealed quarterly compilation your board or insurer can actually read.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-network/hosting" },
  openGraph: {
    title: "Hosted Witnessing — Installed and Run For You",
    description: "For teams that know they need independent proof but can't implement it themselves.",
    url: "https://www.redflagaipro.com/witness-network/hosting",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>{eyebrow}</p>
        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem" }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.62)", lineHeight: 1.75, marginBottom: "1.1rem" }}>{children}</p>;
}

const CONTACT_HREF =
  "mailto:support@redflagaipro.com?subject=" +
  encodeURIComponent("Hosted witnessing enquiry") +
  "&body=" +
  encodeURIComponent(
    "Hi James,\n\nWe'd like to talk about hosted witnessing.\n\nCompany:\nWhat we'd want witnessed (decisions, records, something else):\nRoughly how often:\n\n"
  );

export default function WitnessHostingPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Open witness standard</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Everyone knows they need it. <span style={{ fontStyle: "italic", color: "#E5484D" }}>Almost nobody can build it.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            The witness endpoint is free, open, and always will be — see the <a href="/witness-standard/peer-agreement" style={{ color: "#E5484D" }}>peer agreement</a>. This page is for the team that read that and thought: right, and who on our side actually wires that up.
          </p>
        </div>
      </section>

      <Section eyebrow="The honest split" title="Two ways to be witnessed">
        <P>
          <strong style={{ color: "#F4F1EA" }}>Technical teams:</strong> the raw API costs nothing and needs nobody's permission. POST a tip to <span style={{ ...mono, color: "#C9A66B" }}>/api/witness/anchor</span>, get a sealed response and a verify link back in the same call. If that sentence made sense, you don't need this page.
        </P>
        <P>
          <strong style={{ color: "#F4F1EA" }}>Everyone else:</strong> knowing you need independent proof and having someone available to wire up an API integration are two different problems. This is the second one, solved.
        </P>
      </Section>

      <Section eyebrow="What's included" title="Installed, hosted, and reported">
        <P><strong style={{ color: "#F4F1EA" }}>Installation.</strong> We work out what actually needs witnessing in your business and how often, and wire the connection ourselves. Not a plugin install — real work, done once.</P>
        <P><strong style={{ color: "#F4F1EA" }}>A hosted dashboard.</strong> Your own submission history and status, matching the same vocabulary the standard already uses (accepted, unaccepted, pending, verification failed), plus an alert if your chain goes quiet.</P>
        <P><strong style={{ color: "#F4F1EA" }}>A quarterly compilation.</strong> A dated, sealed summary of what was witnessed that quarter — something physical to hand to a board or an insurer, instead of infrastructure that runs silently and proves nothing to anyone who never logs in.</P>
      </Section>

      <Section eyebrow="Pricing — first pass, negotiable" title="Set up once, billed quarterly">
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.5rem" }}>Installation, one time</p>
            <p style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "#F4F1EA" }}>£995–£1,495</p>
          </div>
          <div style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(201,166,107,0.3)", background: "rgba(201,166,107,0.05)" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "0.5rem" }}>Hosting + dashboard, per quarter</p>
            <p style={{ ...syne, fontSize: "1.6rem", fontWeight: 800, color: "#F4F1EA" }}>£450–£750</p>
            <p style={{ ...syne, fontSize: "11.5px", color: "rgba(244,241,234,0.5)", marginTop: "0.4rem" }}>or included at no extra charge inside <a href="/sentinel" style={{ color: "#C9A66B" }}>Sentinel</a></p>
          </div>
        </div>
        <P>
          These figures are a real starting point, not a fixed rate card, and haven&apos;t been tested against a real customer yet. If the number that fits your situation is different, say so — that&apos;s exactly what the conversation below is for.
        </P>
        <P>
          Want the chain to live on your own infrastructure instead of ours? See <a href="/witness-network/install" style={{ color: "#E5484D" }}>installing your own node</a>.
        </P>
      </Section>

      <section style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>Talk it through first</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            No checkout on this page on purpose. What gets witnessed and how often is specific to your business — that gets worked out in a real conversation, not a pricing table.
          </p>
          <a href={CONTACT_HREF} style={{
            display: "inline-block", background: "#E5484D", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px",
            borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none", letterSpacing: "0.02em",
          }}>
            Email support@redflagaipro.com →
          </a>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro.
        </p>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)", marginTop: "1rem" }}>
          See also <a href="/installations" style={{ color: "#C9A66B" }}>all installations & custom work</a>,{" "}
          <a href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</a>,{" "}
          <a href="/witness-standard/peer-agreement" style={{ color: "#C9A66B" }}>the peer agreement</a> and{" "}
          <a href="/witness-standard/proofs" style={{ color: "#C9A66B" }}>the proofs</a>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
