import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Founding Chain Terms — The Witness Network",
  description:
    "What joining the Witness Network as a founding chain actually means: no equity, no revenue share, one vote each, published once so it never gets defined afterwards by whatever each side assumed.",
  alternates: { canonical: "https://www.redflagaipro.com/witness-standard/founding-chains" },
  openGraph: {
    title: "Founding Chain Terms — The Witness Network",
    description: "No equity, no revenue share, one vote each. The same terms, published once, for the first twenty chains.",
    url: "https://www.redflagaipro.com/witness-standard/founding-chains",
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

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0 0 1.1rem", padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.62)", lineHeight: 1.75, marginBottom: "0.75rem", paddingLeft: "1.4rem", position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: "#C9A66B" }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function FoundingChainsPage() {
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
            Founding <span style={{ fontStyle: "italic", color: "#E5484D" }}>chain terms.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            What being one of the first twenty chains on the Witness Network actually means, written down before anyone accepts, so it never gets defined afterwards by whatever each side assumed.
          </p>
        </div>
      </section>

      <Section eyebrow="Read this first" title="Two separate things, spoken about as one">
        <P>
          <strong style={{ color: "#F4F1EA" }}>The standard.</strong> The Open Witness Standard is a published protocol. It is free, open, and nobody owns it, including Red Flag AI Pro. There is no equity in it because there is no company behind it and nothing to hold shares in. It sits in the same category as an RFC.
        </P>
        <P>
          <strong style={{ color: "#F4F1EA" }}>Each operator&apos;s own business.</strong> Red Flag AI Pro and every other participant are separate, independent companies. Each keeps its own customers, its own revenue and its own liabilities. Nobody has a claim on anyone else&apos;s.
        </P>
        <P>
          Being a founding chain means participating in the first thing, not acquiring anything in the second. <strong style={{ color: "#F4F1EA" }}>No equity, no revenue share, no ownership, in either direction, for any participant, without exception.</strong> The commercial upside is that a participant&apos;s own records become checkable by someone with no reason to protect them. That value is real and it accrues to each operator separately, in their own business, not as a share of a venture.
        </P>
      </Section>

      <Section eyebrow="What it gets you" title="Four things, nothing more">
        <List
          items={[
            <>Listed as a founding participant, publicly and permanently, including after the founding cohort closes.</>,
            <>A vote on changes to the standard while the founding cohort is open, and a seat in the governance group afterwards. One chain, one vote, no weighting by size, revenue or arrival order.</>,
            <>Mutual witnessing at no cost, permanently. Red Flag seals your tip and you seal Red Flag&apos;s. This never becomes chargeable to a founding chain.</>,
            <>The reference implementation and the specification, free, the same as everyone gets, because it is open.</>,
          ]}
        />
      </Section>

      <Section eyebrow="What it does not get you" title="No exceptions, for anyone">
        <List
          items={[
            <>No equity, revenue share, or commercial interest in Red Flag AI Pro or in any other participant.</>,
            <>No exclusivity. You may join other networks, run other standards, and compete with Red Flag directly. Being witnessed by a competitor is the point, not a conflict.</>,
            <>No claim over the name, the trademark, or the specification text.</>,
            <>No guarantee the network reaches any particular size.</>,
          ]}
        />
      </Section>

      <Section eyebrow="What it asks of you" title="Four commitments">
        <List
          items={[
            <>Expose a tip endpoint conforming to the published spec, and keep it reachable. If it goes down for an extended period, you drop to inactive on the peer list until it returns. Not a penalty, just an accurate list.</>,
            <>Seal peers&apos; tips at the agreed cadence and make those seals checkable.</>,
            <>State the honest limit wherever you describe the network publicly: it proves a record existed at a time, in an order, and has not been altered since. It proves nothing about whether the record is true. Overclaiming this in public is the one thing that can get a chain removed, because the whole value of the network is that its claims survive being checked.</>,
            <>Give notice before leaving, so an exit is a recorded event rather than a silent gap.</>,
          ]}
        />
      </Section>

      <Section eyebrow="How decisions get made" title="One vote each, two thirds to change the spec">
        <P>
          While the founding cohort is open, changes to the standard need a two thirds majority of founding chains. James Stokes holds one vote, the same as every other chain, no casting vote and no veto. That costs control and buys the credibility the whole network runs on: a standard nobody but its author can actually change is not a standard, it is a product with extra steps.
        </P>
      </Section>

      <Section eyebrow="Size and closure" title="Twenty chains, not a date">
        <P>
          The founding cohort closes at twenty chains, however long that takes. After twenty, new participants join under whatever rules the governance group has set by then. They are full members, not founding ones. Founding status is historical and permanent: it does not confer extra votes after closure, only the record of having been early.
        </P>
      </Section>

      <Section eyebrow="Name and trademark" title="A defensive registration, stated as one">
        <P>
          The specification text is published openly and may be implemented by anyone, including competitors, without permission or payment. The marks &quot;The Open Witness Standard&quot; and &quot;The Witness Network&quot; are being filed by James Stokes to keep them free, so that no participant, including Red Flag, can later fence the standard off or license it back to the others. It is a defensive registration, not a claim of ownership over the idea.
        </P>
        <P>
          If Red Flag ever attempts to charge for the standard itself, or restrict who may implement it, founding chains are entitled to fork the specification under a new name and take the network with them. That commitment is what makes the trademark position trustworthy rather than a land grab, and it is written down here rather than left to be assumed.
        </P>
      </Section>

      <Section eyebrow="Hosting" title="A separate product, on purpose">
        <P>
          Red Flag sells hosted witnessing to organisations that want to participate without running their own infrastructure. That is Red Flag&apos;s product and Red Flag&apos;s revenue, not a network privilege. Founding chains never pay for it, and any participant may build and sell their own competing hosted offering. The standard being open is what makes that legitimate.
        </P>
      </Section>

      <Section eyebrow="Before this becomes real money" title="This is plain English, not a signed contract">
        <P>
          This page is written to be read and understood, not to be a countersigned legal agreement. Confirming founding status gets sealed the same way everything else on the standard is proved, a dated record naming who confirmed and when. Before any money or infrastructure dependency is built on top of this, both sides should have their own solicitor review this page, particularly the ownership statement above and the trademark section.
        </P>
        <P>
          To request founding status, reach <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D" }}>support@redflagaipro.com</a>.
        </P>
      </Section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.4)", letterSpacing: "0.03em" }}>
          Authored by James Stokes, Founder, Red Flag AI Pro. This page describes founding participation terms with stated boundaries, it is not legal advice, and a business intending to treat this as a binding signed agreement should have its own terms reviewed independently.
        </p>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)", marginTop: "1rem" }}>
          See also <a href="/witness-standard/peer-agreement" style={{ color: "#C9A66B" }}>the peer agreement</a> and <a href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</a>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
