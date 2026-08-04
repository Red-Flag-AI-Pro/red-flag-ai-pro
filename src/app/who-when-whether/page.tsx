import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GovernanceLifecycleDiagram } from "@/components/marketing/GovernanceLifecycleDiagram";
import React from "react";

export const metadata: Metadata = {
  title: "Who, When, Whether",
  description:
    "Why we built this, where we are, and where this is going. The whitepaper behind Red Flag AI Pro's authorisation records and the witness network, sealed and independently timestamped.",
  alternates: { canonical: "https://www.redflagaipro.com/who-when-whether" },
  openGraph: {
    title: "Who, When, Whether",
    description: "Why we built this, where we are, and where this is going.",
    url: "https://www.redflagaipro.com/who-when-whether",
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

export default function WhoWhenWhetherPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ position: "relative", overflow: "hidden", padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Image
          src="/images/whitepaper/signing.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={65}
          style={{ objectFit: "cover", objectPosition: "center 40%", filter: "saturate(0.6) contrast(1.05) brightness(0.9)", pointerEvents: "none" }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.6)", mixBlendMode: "multiply" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.45) 40%, rgba(10,22,40,0.7) 75%, #0A1628 100%)" }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Whitepaper</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Who, When, <span style={{ fontStyle: "italic", color: "#E5484D" }}>Whether.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto 1.25rem" }}>
            Why we built this, where we are, and where this is going.
          </p>
          <div style={{ background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.25)", borderRadius: "10px", padding: "1.1rem 1.4rem", textAlign: "left" }}>
            <p style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.6 }}>
              This document&apos;s core framework was conceived and sealed on 30 July 2026, timestamped by an independent authority and publicly verifiable by anyone, without an account.{" "}
              <a href="/verify?id=e111a26b-f46b-4448-a9fb-350918e3487e" style={{ color: "#E5484D", textDecoration: "underline" }}>Check it yourself →</a>
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Why" title="An industry that sells reassurance instead of proof">
        <P>
          We started this because an entire industry has learned to sell reassurance instead of proof, and nobody was stopping it.
        </P>
        <P>
          Marketers publish claims they never checked against the rules that actually govern them, and find out the hard way, in a public ruling, months later. Companies bolt AI onto their business and hand it real decisions, and when someone finally asks who approved that, and on what authority, and whether that authority was still good by the time it mattered, there is no answer. There is a policy document. There is a slide. There is a person saying trust me. There is almost never a record that survives being questioned.
        </P>
        <P>
          That gap is not a technical oversight. It is a choice, made across an entire market, to sell the appearance of oversight because the real thing is harder and less flattering to admit you do not have.
        </P>
        <P>
          We refuse that choice. Everything we have built exists to replace trust me with check for yourself, in compliance and in governance both, because a business, a regulator, an insurer, or a customer should never have to take anyone&apos;s word for something that can be shown.
        </P>
      </Section>

      <Section eyebrow="Where we are" title="Naming the actual gap">
        <P>
          We started narrow and honest about it: a tool that checks marketing copy against the actual rules regulators enforce, across ten jurisdictions and thirty risk categories, in under a minute, before a complaint ever gets filed. That product is live, it works, and it stays exactly what it is.
        </P>
        <P>
          Building it taught us the harder problem sitting underneath. Checking what a business said is only half the job. Nobody was proving what a business did, or who was accountable for letting an AI system do it, or whether that accountability had quietly expired by the time something went wrong.
        </P>
        <P>
          So we named the actual gap. Every real authorisation has three parts: who granted it, when they granted it, and whether their authority still held at the moment it mattered. Almost every governance product on the market answers the first two and skips the third entirely, because the third one is the only one that can catch you out later.
        </P>
        <P>
          We built the third one. Every authorisation record in our product now carries an expiry and the specific, named condition that would void it, written down at the moment someone signs, not added afterwards as an afterthought. An authority with no expiry is not a strong grant. It is one nobody was ever forced to think about ending.
        </P>
        <P>
          We chained every high value record cryptographically, sealed the ones that matter most with an independent, third party timestamp, and made the result checkable by any stranger, publicly, without asking our permission. This document is checked exactly that way. And when we found a genuine flaw in our own tamper evidence system this week, we said so, fixed it, and proved the fix in production before calling it done.
        </P>
        <P>
          We did all of this as one person, building fast, being argued with in public by people who know this space, and treating every good argument as a feature request rather than a threat.
        </P>
      </Section>

      <section style={{ padding: "4rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D1B2E" }}>
        <GovernanceLifecycleDiagram maxWidth="1000px" />
      </section>

      <Section eyebrow="Everything we offer today" title="Not a pitch deck concept">
        <P>
          None of this is a pitch deck concept. It is a platform, built in the open, with each part answering the same question from a different angle: not trust me, check.
        </P>
        <P><strong style={{ color: "#F4F1EA" }}>Compliance checking.</strong> Paste marketing copy in and it is checked against the actual rules regulators enforce, across ten jurisdictions and thirty risk categories, in under a minute. The same rules behind real, published rulings, so a business finds the problem before a complainant does, not after.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Governance scoring.</strong> A real, numbered score across six dimensions for how well a business oversees its use of AI, mapped to the EU AI Act, GDPR, NIST, and ISO 42001, not a vague maturity label dressed up as insight.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Authorisation records.</strong> The who, when, whether framework itself, built into the product. Every AI system a business approves gets a record naming who signed off, when, and the expiry and conditions that would void their authority. This is the evidence a regulator, an insurer, or a court actually asks for when something goes wrong, not a policy document asserting good intentions. See the <a href="/boundary-authorization-records" style={{ color: "#E5484D" }}>full record structure</a>, field by field.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Public verification.</strong> Every high value record is sealed and, for the ones that matter most, timestamped by an independent authority. Anyone, with no account and no need to trust us, can check that a record has not been edited, deleted, or backdated since it was made. This document is proof of that, checkable at the link above.</P>
        <P><strong style={{ color: "#F4F1EA" }}>A suite of free tools.</strong> Because proof should be something anyone can try before they pay for anything. A fine calculator that shows real regulatory exposure. A contract red flags checker. An accessibility checker. A shadow AI audit. A tool that checks whether a website exposes AI generated content without disclosure. And The Witness Test, five short questions that reveal whether a company&apos;s own AI evidence is independently witnessed or simply trusts itself. Every one of them free, no card required, built to demonstrate the standard rather than gate it behind a sales call.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Honest pricing.</strong> Everything the law actually requires should not cost what this industry charges for it, and we price accordingly. Small businesses and solo operators should be able to afford the same standard of proof as anyone else.</P>
      </Section>

      <section style={{ position: "relative", overflow: "hidden", padding: "4.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "440px" }}>
        <div aria-hidden className="img-side-blend" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "58%", aspectRatio: "16 / 9", maxHeight: "100%", pointerEvents: "none" }}>
          <Image
            src="/images/whitepaper/hourglass.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            quality={70}
            style={{ objectFit: "cover", objectPosition: "center", filter: "saturate(1) brightness(1)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0A1628 0%, rgba(10,22,40,0.45) 24%, rgba(10,22,40,0) 48%, rgba(10,22,40,0) 100%), linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0) 20%, rgba(10,22,40,0) 80%, #0A1628 100%)" }} />
        </div>
        <div style={{ maxWidth: "1120px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "560px", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 16px rgba(6,14,26,0.85)" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>Where we are heading</p>
        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem" }}>The first dated statement of an argument</h2>
        <P>
          This is the first dated statement of an argument we intend to keep making, in public, with evidence, for a long time.
        </P>
        <P>
          The same discipline, an expiry and a named voiding condition captured at the moment authority is granted, is being carried across the rest of the product, not left as a feature of one tier. Proof should not be a premium add on. It should be the ordinary shape of how any serious business governs its own use of AI.
        </P>
        <P>
          We are also testing, honestly and without assuming the answer in advance, whether independent parties witnessing each other&apos;s evidence, rather than any single vendor asking to be trusted, is something the people who actually pay for assurance, insurers, brokers, boards, will demand. Every system of mutual verification that has ever lasted did so because someone on the buying side required it, not because the idea was elegant. We would rather find that out honestly than build a network nobody asked for.
        </P>
        <P>
          What will not move is the standard underneath all of it. Every claim we make should be checkable by someone who owes us nothing. Every authority we track should carry the seed of its own ending. And every argument made against us in public, if it is right, becomes something we ship.
        </P>
        <P>
          We believe proof is about to become the actual floor this entire market is judged against, not a nice extra a few careful companies bother with. We believe the businesses that get there first, honestly, in public, checkable by strangers, are the ones still standing when everyone else is asked to prove what they have only ever promised.
        </P>
        <P>
          We built the compliance layer because nobody was checking. We built the governance layer because nobody was proving. This is where it started, and there is a great deal more coming.
        </P>
        </div>
        </div>
      </section>

      <section style={{ position: "relative", overflow: "hidden", padding: "4.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(229,72,77,0.03)", minHeight: "440px" }}>
        <div aria-hidden className="img-side-blend" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "58%", aspectRatio: "16 / 9", maxHeight: "100%", pointerEvents: "none" }}>
          <Image
            src="/images/whitepaper/waxseal.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            quality={70}
            style={{ objectFit: "cover", objectPosition: "center", filter: "saturate(1) brightness(1)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0A1628 0%, rgba(10,22,40,0.45) 24%, rgba(10,22,40,0) 48%, rgba(10,22,40,0) 100%), linear-gradient(180deg, #0A1628 0%, rgba(10,22,40,0) 20%, rgba(10,22,40,0) 80%, #0A1628 100%)" }} />
        </div>
        <div style={{ maxWidth: "1120px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "560px", textShadow: "0 1px 3px rgba(6,14,26,0.95), 0 2px 16px rgba(6,14,26,0.85)" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)", marginBottom: "0.6rem" }}>Addendum, 31 July 2026</p>
          <p style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.4)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Everything above this line was sealed on 30 July 2026, and stays exactly as it was written. Nothing above has been edited to fit what happened next, because a document that claims to be checkable does not get to quietly rewrite itself once things change. This addendum is dated separately, on the record, the same way everything else we build is.
          </p>

          <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1rem" }}>What changed in one day</h2>
          <P>
            The hedge in &quot;Where we are heading&quot; is resolved. We no longer have to guess whether independent parties witnessing each other&apos;s evidence is buildable. It is. Two independent companies now hold sealed copies of each other&apos;s governance records, live, with a public button anyone can press and a log anyone can check without an account. We published the protocol behind it free, <a href="/witness-standard" style={{ color: "#E5484D" }}>the Open Witness Standard</a>, because a standard only one company uses is not a standard, it is a product with extra steps. The reference code is public on <a href="https://github.com/Red-Flag-AI-Pro/witness-protocol" style={{ color: "#E5484D" }}>GitHub</a>, so nobody has to take our word for how any of it behaves.
          </P>
          <P>
            What is still genuinely open, and we are still not assuming the answer in advance, is whether the people who actually pay for assurance, insurers, brokers, boards, will demand this as the ordinary shape of proof rather than treat it as an interesting extra. Buildable and demanded are different questions. We answered the first one. The second one still belongs to the market, not to us.
          </P>

          <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500, color: "#F4F1EA", margin: "2rem 0 1rem" }}>Why, still</h2>
          <P>
            Strip away every feature named in this document and one sentence is left standing: nobody should have to take our word for anything we say about ourselves, and we built accordingly.
          </P>
          <P>
            A compliance check that flags a real, published ruling, not a hypothetical one. A governance score built from operational facts, not adjectives. An authorisation record that carries its own expiry, rather than pretending authority lasts forever. A witness network that lets a stranger, not us, confirm our own record has not quietly moved. A protocol we gave away rather than sold, because a standard is only real once someone other than its author is using it too.
          </P>
          <P>
            None of that is generosity. It is the only honest response to an industry that got comfortable selling reassurance instead of proof. We would rather be checked and found accurate than be believed and never asked.
          </P>
          <P>
            That is why this exists, and it is why everything built after this document keeps getting built the same way.
          </P>

          <p style={{ ...syne, fontSize: "0.95rem", color: "#F4F1EA", marginTop: "2rem" }}>James Stokes</p>
          <p style={{ ...syne, fontSize: "0.85rem", color: "rgba(244,241,234,0.5)" }}>Founder, Red Flag AI Pro · redflagaipro.com</p>

          <p style={{ ...mono, fontSize: "0.78rem", color: "rgba(244,241,234,0.35)", marginTop: "1.5rem", fontStyle: "italic" }}>
            This addendum is not yet independently timestamped. If that matters to you, that is the correct instinct, and it is on the list to fix.
          </p>
        </div>
        </div>
        <style>{`@media (max-width: 900px) { .img-side-blend { opacity: 0.35; width: 100% !important; } }`}</style>
      </section>

      <Footer />
    </div>
  );
}
