import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "The Open Witness Standard | Red Flag AI Pro",
  description:
    "A free, open protocol for independent companies to seal each other's evidence. Five fields, three endpoints, no vendor lock in. Implement it, anchor to us, get listed.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-standard" },
  openGraph: {
    title: "The Open Witness Standard",
    description: "A free, open protocol for independent companies to seal each other's evidence, no vendor lock in.",
    url: "https://www.redflagaipro.com/witness-standard",
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

const FIELD_ROWS: [string, string, string][] = [
  ["chain", "string", "The name your chain is known by on the network."],
  ["tip", "string", "The current hash at the end of your chain. 64 hex characters for SHA-256."],
  ["count", "number", "How many entries your chain holds. Lets a peer sanity check growth over time."],
  ["ts", "string", "The moment this tip was current, ISO 8601."],
  ["url", "string", "Optional. Where a peer can pull your tip back, so witnessing runs both ways."],
];

export default function WitnessStandardPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Open standard</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Five fields. Three endpoints. <span style={{ fontStyle: "italic", color: "#E5484D" }}>No lock in.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            The protocol behind <a href="/witness-network" style={{ color: "#E5484D" }}>the witness network</a>, written down so anyone can implement it, not just us. Free, open, and deliberately boring.
          </p>
        </div>
      </section>

      <Section eyebrow="Why write it down" title="A standard nobody can own">
        <P>
          The whole point of two chains witnessing each other is that neither one controls the other. That falls apart the moment the protocol itself is only in one company's private codebase, because then joining means trusting us to keep it stable, which is exactly the kind of trust this is supposed to remove.
        </P>
        <P>
          So here is the entire protocol. Anyone can read it, implement it in any language, and anchor to us or to anyone else running it. We do not gatekeep who joins. We cannot, that is the design.
        </P>
      </Section>

      <Section eyebrow="The payload" title="What gets sent">
        <P>
          One JSON object, five fields, sent to a peer's receiving endpoint whenever you want them to seal your current tip.
        </P>
        <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 1rem 0.6rem 0" }}>Field</th>
                <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 1rem 0.6rem 0" }}>Type</th>
                <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 0 0.6rem 0" }}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {FIELD_ROWS.map(([field, type, meaning]) => (
                <tr key={field} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ ...mono, fontSize: "0.85rem", color: "#F4F1EA", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>{field}</td>
                  <td style={{ ...mono, fontSize: "0.8rem", color: "rgba(244,241,234,0.45)", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>{type}</td>
                  <td style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.62)", padding: "0.85rem 0", verticalAlign: "top", lineHeight: 1.6 }}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>That is the whole payload. No auth token, no API key, no account. If you want to seal it, you seal it.</P>
      </Section>

      <Section eyebrow="The three jobs" title="What any implementation needs to do">
        <P><strong style={{ color: "#F4F1EA" }}>Expose your tip.</strong> A public GET endpoint returning your current chain's payload, so a peer can pull it whenever they want to seal you. Ours is at <span style={{ ...mono, color: "#E5484D" }}>/api/witness/tip</span>.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Receive an anchor.</strong> A public POST endpoint that takes the payload above and seals it into your own chain, timestamped if you have that capability. This only ever claims you received and sealed a peer's tip at a given time, never that their chain is truthful, that is their business to prove on their own record. Ours is at <span style={{ ...mono, color: "#E5484D" }}>/api/witness/anchor</span>.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Push to a peer.</strong> Send your own tip to a peer's anchor endpoint. Only seal your own record of having sent it if the peer actually accepts, a rejected or failed send should never be logged as a success. Ours is at <span style={{ ...mono, color: "#E5484D" }}>/api/witness/push</span>.</P>
      </Section>

      <Section eyebrow="The one rule that matters" title="Internal consistency is not proof">
        <P>
          A hash chain proves your own records agree with each other. It does not prove you could not have built the whole thing yourself, quietly, after the fact. That only gets closed by something outside your own control seeing your tip at the time, which is the entire reason this exists as an exchange between separate companies rather than a feature inside one product.
        </P>
        <P>
          If your implementation seals anchors but never sends any out, or receives from peers but exposes no tip of its own, it is not witnessing anything, it is just logging. Both directions have to be real.
        </P>
      </Section>

      <Section eyebrow="Join it" title="Implement it, anchor to us">
        <P>
          Build a client against the shape above, in whatever language suits you, point it at our tip and anchor endpoints, and press go. If it lands, you will see it appear on <a href="/witness-network" style={{ color: "#E5484D" }}>the live network page</a>, publicly, the same way every anchor does.
        </P>
        <P>
          Questions, or want your chain named properly rather than showing up as an unlabelled peer, reach us at <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D" }}>support@redflagaipro.com</a>.
        </P>
      </Section>

      <Footer />
    </div>
  );
}
