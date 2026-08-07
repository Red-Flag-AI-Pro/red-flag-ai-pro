import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getConfirmedPeers } from "@/lib/peer-agreement";
import React from "react";

export const metadata: Metadata = {
  title: "The Witness Peer Agreement",
  description:
    "The same terms for every company that anchors to the Open Witness Standard, published once instead of negotiated each time. What a receipt claims, what it doesn't, and how confirmation gets sealed.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-standard/peer-agreement" },
  openGraph: {
    title: "The Witness Peer Agreement",
    description: "The same terms for every company that anchors to the Open Witness Standard.",
    url: "https://www.redflagaipro.com/witness-standard/peer-agreement",
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

const CONTRACT_ROWS: [string, string][] = [
  ["Endpoint", "/api/witness/anchor, also reachable at /api/witness/observe"],
  ["Method", "POST, unauthenticated, no account needed"],
  ["Payload", "chain, tip, count, ts, url (optional), same five fields as the published standard"],
  ["Success response", "HTTP 200, sealed: true, a non empty id, a non empty verify link"],
  ["Rate limit", "10 requests a minute per address"],
  ["Recommended cadence", "At least once every 24 hours, whether or not the tip changed. Proves the chain was alive during quiet periods too, not just when something happened."],
  ["Stale threshold", "72 hours (3 missed heartbeats) with no accepted anchor. A stale chain stays valid, it is a status shown publicly, not a removal."],
];

export default async function PeerAgreementPage() {
  const confirmedPeers = await getConfirmedPeers();

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
            The Witness <span style={{ fontStyle: "italic", color: "#E5484D" }}>Peer Agreement.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            The same terms for every company that anchors to us, published once rather than negotiated in a fresh document each time someone joins.
          </p>
        </div>
      </section>

      <Section eyebrow="Why one document, not a custom one each time" title="A standard has one set of terms">
        <P>
          The moment two companies negotiate their own private version of this, it stops being a standard and becomes a bespoke contract that happens to reuse some of the same words. Everyone who anchors to <span style={{ ...mono, color: "#E5484D" }}>redflagaipro.com</span> operates under this exact page, whether that is a solo builder or a company with its own legal team.
        </P>
        <P>
          What does change per peer is not the terms, it is confirmation. Accepting this gets sealed as its own dated record on the same chain everything else here proves things with, see the bottom of this page.
        </P>
      </Section>

      <Section eyebrow="The one thing this promises" title="What a receipt claims, and what it doesn't">
        <P>
          A sealed anchor only ever claims one thing: we received and sealed this exact tip from this named peer at this moment. It says nothing about whether your underlying chain, your governance decisions, or your product are correct, current, or authorised. That stays entirely yours to answer, on your own record.
        </P>
        <P>
          We do not evaluate your policy, your evidence, or your admissibility rules. We do not endorse your product by witnessing it. Witnessing is integrity of a timestamp, not a verdict on what it timestamps.
        </P>
      </Section>

      <Section eyebrow="The contract" title="What actually happens, technically">
        <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
            <tbody>
              {CONTRACT_ROWS.map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#E5484D", padding: "0.85rem 1.25rem 0.85rem 0", verticalAlign: "top", whiteSpace: "nowrap" }}>{label}</td>
                  <td style={{ ...syne, fontSize: "0.88rem", color: "rgba(244,241,234,0.7)", padding: "0.85rem 0", verticalAlign: "top", lineHeight: 1.6 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>No idempotency key. Only submit when the tip is meant to move, or you will create harmless but duplicate entries.</P>
      </Section>

      <Section eyebrow="The boundary" title="What this is not">
        <P>
          This is not a partnership, an integration commitment, an endorsement, an exclusivity arrangement, an operational dependency, a licence, or an agency relationship. It does not transfer intellectual property in either direction, and it does not require either side to disclose internal policy, proprietary logic, or confidential material to make witnessing work.
        </P>
        <P>
          Either side can stop submitting at any time. A peer going quiet does not retroactively change any record already sealed, it just means no new ones get added. There is no exit process to complete: nothing to close, cancel, or notify us of. Every record already sealed stays valid and public forever regardless. After 30 days with no accepted anchor from a peer, we may stop actively pushing our own tip to their endpoint, purely to avoid indefinite traffic to an address nobody is reading, not as a penalty. Resuming later needs no re-application: it just becomes a chain with a gap in it, exactly as valid as one that never stopped.
        </P>
      </Section>

      <Section eyebrow="Growing the network" title="Becoming a mutual peer">
        <P>
          Submitting to us is one direction. Our own side also pushes our tip out on a fixed schedule to a short list of approved peers, so they can seal us the same way we seal them. Getting added to that list is what makes it mutual rather than one direction, not a special arrangement, just both sides witnessing each other the way the standard is meant to work.
        </P>
      </Section>

      <Section eyebrow="How this gets confirmed" title="Acceptance is a sealed record too">
        <P>
          Rather than a private side letter, confirming you operate under this agreement gets sealed the same way everything else on this standard is proved: a dated, hash sealed entry naming who confirmed and when, checkable by anyone at the verify link. To request one, reach <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D" }}>support@redflagaipro.com</a> and we will seal it and send you the record.
        </P>

        {confirmedPeers.length > 0 ? (
          <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 1rem 0.6rem 0" }}>Peer</th>
                  <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 1rem 0.6rem 0" }}>Confirmed</th>
                  <th style={{ ...syne, textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E5484D", padding: "0 0 0.6rem 0" }}>Record</th>
                </tr>
              </thead>
              <tbody>
                {confirmedPeers.map((peer) => (
                  <tr key={peer.verifyId} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ ...syne, fontSize: "0.88rem", color: "#F4F1EA", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>{peer.sealed_by_org || peer.title}</td>
                    <td style={{ ...mono, fontSize: "0.8rem", color: "rgba(244,241,234,0.5)", padding: "0.85rem 1rem 0.85rem 0", verticalAlign: "top" }}>
                      {new Date(peer.sealedAt).toISOString().slice(0, 10)}
                    </td>
                    <td style={{ ...syne, fontSize: "0.85rem", padding: "0.85rem 0", verticalAlign: "top" }}>
                      <a href={`/verify?id=${peer.verifyId}`} style={{ color: "#E5484D" }}>verify</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <P>No peers have confirmed against this version yet, this table fills in as they do rather than starting pre-populated.</P>
        )}
      </Section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro. This page describes a technical protocol with stated boundaries, it is not legal advice, and a business intending to treat this as a binding signed agreement should have its own terms reviewed independently.
        </p>
      </section>

      <Footer />
    </div>
  );
}
