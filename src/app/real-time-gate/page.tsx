import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createServiceClient } from "@/lib/supabase/server";
import { EvidencePipelineVisual } from "@/components/marketing/EvidencePipelineVisual";
import React from "react";

export const metadata: Metadata = {
  title: "Real-Time Gate: Block Before It Publishes",
  description:
    "A synchronous allow/block API you call before content goes live, not a check that runs after the damage is done. What it is, what it isn't, and why the difference matters.",
  alternates: { canonical: "https://www.redflagaipro.com/real-time-gate" },
  openGraph: {
    title: "Real-Time Gate",
    description: "A synchronous allow/block decision, called before content goes live.",
    url: "https://www.redflagaipro.com/real-time-gate",
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

// A single aggregate number across every account, never a per-customer
// breakdown — the point is proof the mechanism is live, not a league table
// of who's using it. 30 days rather than all time so the number reflects
// current activity, not just how long the feature has existed.
async function getGovernedDecisionCount(): Promise<number | null> {
  try {
    const supabase = await createServiceClient();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("enforcement_decisions")
      .select("id", { count: "exact", head: true })
      .not("governing_record_id", "is", null)
      .gte("created_at", since);
    return count ?? 0;
  } catch {
    return null;
  }
}

export default async function RealTimeGatePage() {
  const governedCount = await getGovernedDecisionCount();
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Real-Time Gate</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Block before it publishes, <span style={{ fontStyle: "italic", color: "#E5484D" }}>not after.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            A synchronous allow or block decision, called before content goes live. Checking after the fact tells you what already went wrong. This tells you before it does.
          </p>
        </div>
      </section>

      <EvidencePipelineVisual />

      <Section eyebrow="What this actually is" title="A decision API, called by your code">
        <P>
          Your system sends content to <span style={{ ...mono, color: "#E5484D" }}>/api/v1/enforce</span> at the moment it would otherwise go live, publishing a post, letting an agent proceed, sending a message. It gets back an allow or block decision, a risk score, and the specific flags behind it, in milliseconds, no external API calls in the path to slow it down. Your own code makes the final call on what to do with a block: hold the content, escalate to a human, or reject it outright.
        </P>
      </Section>

      <Section eyebrow="What this is not" title="Not a network proxy">
        <P>
          This is not a transparent gateway that sits inside your infrastructure intercepting every request automatically. That is a much bigger, much riskier piece of engineering, one that has to guarantee near constant uptime and sub second latency for every single call your production systems make, because a fault on our side would then be a fault in your live path. We are not claiming that, and anyone who tells you a small team ships that lightly is worth asking hard questions of.
        </P>
        <P>
          What we do claim: a fast, synchronous decision your own code calls voluntarily, at the point you choose to call it. The difference is not just words, it is where the operational risk actually sits, with you, deciding when and how to call a gate, rather than with a middleman positioned to break your production traffic if it stumbles.
        </P>
      </Section>

      <Section eyebrow="What gets sealed" title="Blocks get evidence, not just a log line">
        <P>
          Every blocked decision is sealed with an independent RFC 3161 timestamp and a public verify link, the same mechanism behind every other sealed record on this site. That means a block cannot quietly be edited or deleted after the fact to look like it never happened, or never existed to look like it did. Allowed decisions are recorded too, for your own review, but are not individually timestamped, to keep routine traffic from flooding the chain.
        </P>
        <P>
          The seal also names what governed the decision. If the API key making the call has a boundary authorization record naming who approved it and on what terms, that record is attached to the block itself, not left as a separate trail someone has to go find and match up by hand. Evidence and execution end up on the same chain, not two systems that happen to agree.
        </P>
        {governedCount !== null && (
          <P>
            <span style={{ color: "#E5484D", fontWeight: 700 }}>{governedCount.toLocaleString("en-GB")}</span> Real Time Gate decision{governedCount === 1 ? "" : "s"} tied back to a named authorization record in the last 30 days, across every account. One aggregate number, never a per customer breakdown, just proof the link above is real and live, not a diagram.
          </P>
        )}
        <P>
          Sentinel accounts can also export any decision as a bundle signed with Red Flag&apos;s Ed25519 key, the decision plus the authority state that governed it, captured at the moment of export. Hand it to a regulator, an insurer, or a counterparty and they can check it offline, no account, no network call, no need to trust our server at the moment they look. Full shape and a standalone verifier script at <Link href="/docs" style={{ color: "#E5484D" }}>/docs</Link>. Prefer proving it on a key that&apos;s entirely yours, not ours, rather than Red Flag&apos;s own — see <Link href="/installations" style={{ color: "#E5484D" }}>installations</Link>.
        </P>
      </Section>

      <section style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>Wire it in</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Full request and response shape in the API docs. Needs a Red Flag AI Pro API key, generated free from Settings.
          </p>
          <Link href="/docs" style={{
            display: "inline-block", background: "#E5484D", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px",
            borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none", letterSpacing: "0.02em",
          }}>
            Read the API docs →
          </Link>
        </div>
      </section>

      <section style={{ padding: "2rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.35)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          Complements, not replaces, <Link href="/boundary-authorization-records" style={{ color: "#E5484D" }}>boundary authorization records</Link>. A boundary record answers who authorized what and whether that authority still holds. Real-Time Gate answers whether this specific piece of content should go out right now.
        </p>
      </section>
      <Footer />
    </div>
  );
}
