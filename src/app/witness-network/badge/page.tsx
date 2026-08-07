import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "The Witness Badge",
  description:
    "A badge that shows its own status honestly — live if the chain is actively being witnessed right now, amber if syncing has stopped. Not a static claim, a checkable one.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-network/badge" },
  openGraph: {
    title: "The Witness Badge",
    description: "Live if actively witnessed right now, amber if not. Checkable, not just claimed.",
    url: "https://www.redflagaipro.com/witness-network/badge",
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      ...mono, fontSize: "12px", color: "#C9A66B", background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "1rem",
      overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all",
    }}>{children}</pre>
  );
}

export default function WitnessBadgePage() {
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
            A badge that <span style={{ fontStyle: "italic", color: "#E5484D" }}>checks itself.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Most trust badges are a static image, true the day it was made and never checked again. This one is generated live: green while the chain is actively being witnessed, amber the moment syncing stops. It cannot lie by going stale.
          </p>
        </div>
      </section>

      <Section eyebrow="Live right now" title="This is the actual badge">
        <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/api/witness-badge" alt="Witnessed under the Open Witness Standard" width={240} height={60} />
        </div>
        <P>
          Refresh this page in a few hours after the hourly anchor cadence lapses and it will honestly turn amber, rather than keep showing green off a sync that stopped. The colour is read from Red Flag&apos;s own witness anchor log, not set by hand.
        </P>
      </Section>

      <Section eyebrow="Who can use it" title="Confirmed peers only">
        <P>
          The badge is for anyone who has confirmed the <a href="/witness-standard/peer-agreement" style={{ color: "#E5484D" }}>Witness Peer Agreement</a> and is actively sealing tips both directions. It is not a purchasable trust mark, it is a status indicator for a real, checkable relationship — see the confirmed peer list on that page.
        </P>
      </Section>

      <Section eyebrow="Embed it" title="Copy this">
        <P>HTML:</P>
        <CodeBlock>{`<a href="https://www.redflagaipro.com/witness-network"><img src="https://www.redflagaipro.com/api/witness-badge" alt="Witnessed under the Open Witness Standard" width="240" height="60" /></a>`}</CodeBlock>
        <P>Markdown:</P>
        <CodeBlock>{`[![Witnessed under the Open Witness Standard](https://www.redflagaipro.com/api/witness-badge)](https://www.redflagaipro.com/witness-network)`}</CodeBlock>
      </Section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro.
        </p>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)", marginTop: "1rem" }}>
          See also <a href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</a>,{" "}
          <a href="/witness-standard/proofs" style={{ color: "#C9A66B" }}>the proofs</a> and{" "}
          <a href="/witness-standard/peer-agreement" style={{ color: "#C9A66B" }}>the peer agreement</a>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
