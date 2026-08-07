import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AbsenceProofTester } from "@/components/tools/AbsenceProofTester";
import { CHECKS } from "@/lib/ordering-test";
import { getLatestCompletenessCheckpoint } from "@/lib/audit-proofs";
import React from "react";

export const metadata: Metadata = {
  title: "Proofs — What Red Flag Can Actually Demonstrate",
  description:
    "Eight checks against the Ordering Test standard, scored honestly: what's built, what's publicly demonstrable right now with no account, and what genuinely isn't built yet.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-standard/proofs" },
  openGraph: {
    title: "Proofs — What Red Flag Can Actually Demonstrate",
    description: "Eight checks, scored honestly. Run the ones that are public yourself, right now.",
    url: "https://www.redflagaipro.com/witness-standard/proofs",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const LABELS: Record<string, string> = {
  rule_binding: "Rule binding",
  commit_before_reveal: "Commit before reveal",
  authority_tokens: "Authority tokens",
  mutual_witnessing: "Mutual witnessing",
  completeness_proof: "Completeness proof",
  absence_proof: "Absence proof",
  reconciliation: "Reconciliation",
  reproducibility: "Reproducibility",
  consistency_proof: "Consistency proof",
  external_anchoring: "External anchoring",
};

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
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

export default async function ProofsPage() {
  const checkpoint = await getLatestCompletenessCheckpoint();
  const checks = Object.entries(CHECKS);
  const publicCount = checks.filter(([, c]) => c.demonstrable_publicly).length;
  const supportedCount = checks.filter(([, c]) => c.supported).length;

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
            What we can <span style={{ fontStyle: "italic", color: "#E5484D" }}>actually prove.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Eight checks against the Ordering Test standard. {supportedCount} of {checks.length} built, {publicCount} you can run yourself right now with no account. The rest report NOT SUPPORTED honestly rather than overclaiming.
          </p>
        </div>
      </section>

      <Section eyebrow="Try it now, no account" title="Absence proof">
        <P>
          Given a hash, this proves it either exists in Red Flag&apos;s own public chain, or shows the two real entries either side of where it would sort if it existed — proof by adjacency on the chain itself, no separate Merkle tree needed. Paste anything, made up is fine.
        </P>
        <AbsenceProofTester />
      </Section>

      <Section eyebrow="Sealed daily, before any export" title="Completeness proof">
        <P>
          A record count for Red Flag&apos;s own public chain is committed before any export could reference it, so an export claiming a different count is checkably wrong — the same guarantee an inclusion proof gives, without needing a tree structure.
        </P>
        {checkpoint ? (
          <div style={{ padding: "1.1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ ...mono, fontSize: "12px", color: "#C9A66B" }}>
              {checkpoint.record_count} entries sealed as of {checkpoint.period}
            </p>
            {checkpoint.latest_entry_id && (
              <p style={{ ...syne, fontSize: "12px", marginTop: "0.5rem" }}>
                <a href={`/verify?id=${checkpoint.latest_entry_id}`} style={{ color: "#E5484D" }}>Verify this checkpoint</a>
              </p>
            )}
          </div>
        ) : (
          <P>No checkpoint sealed yet.</P>
        )}
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", marginTop: "0.75rem" }}>
          Raw endpoint: <a href="/api/complete/root" style={{ color: "#E5484D" }}>/api/complete/root</a>
        </p>
      </Section>

      <Section eyebrow="Every check, scored honestly" title="The full eight">
        <div style={{ display: "grid", gap: "0.85rem" }}>
          {checks.map(([key, check]) => (
            <div key={key} style={{
              padding: "1.1rem 1.25rem", borderRadius: "10px",
              border: check.supported ? "1px solid rgba(201,166,107,0.25)" : "1px solid rgba(255,255,255,0.08)",
              background: check.supported ? "rgba(201,166,107,0.04)" : "rgba(255,255,255,0.015)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#F4F1EA" }}>{LABELS[key] ?? key}</p>
                <span style={{
                  ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "2px 8px", borderRadius: "999px",
                  color: check.supported ? "#C9A66B" : "rgba(244,241,234,0.4)",
                  border: check.supported ? "1px solid rgba(201,166,107,0.4)" : "1px solid rgba(255,255,255,0.15)",
                }}>
                  {check.supported ? (check.demonstrable_publicly ? "Built, public" : "Built, account only") : "Not supported"}
                </span>
              </div>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(244,241,234,0.6)", lineHeight: 1.65 }}>{check.note}</p>
              {check.endpoint && (
                <p style={{ ...mono, fontSize: "11px", color: "#E5484D", marginTop: "0.5rem" }}>{check.endpoint}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro. Machine readable version at{" "}
          <a href="/.well-known/ordering-test.json" style={{ color: "#C9A66B" }}>/.well-known/ordering-test.json</a>.
        </p>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)", marginTop: "1rem" }}>
          See also <a href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</a> and{" "}
          <a href="/verify" style={{ color: "#C9A66B" }}>verify a record</a>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
