import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TryToBreakIt } from "@/components/witness/TryToBreakIt";
import React from "react";

export const metadata: Metadata = {
  title: "Boundary Authorization Records",
  description:
    "What a boundary authorization record actually captures, why each field exists, and what happens the moment one lapses. The record structure behind Red Flag AI Pro's who, when, whether framework.",
  alternates: { canonical: "https://www.redflagaipro.com/boundary-authorization-records" },
  openGraph: {
    title: "Boundary Authorization Records",
    description: "The record structure behind who, when, whether.",
    url: "https://www.redflagaipro.com/boundary-authorization-records",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ ...mono, fontSize: "0.82rem", color: "#E5484D", minWidth: "180px", flexShrink: 0, paddingTop: "0.1rem" }}>{name}</p>
      <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.65)", lineHeight: 1.65 }}>{children}</p>
    </div>
  );
}

export default function BoundaryAuthorizationRecordsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Reference</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            What a boundary authorization <span style={{ fontStyle: "italic", color: "#E5484D" }}>record</span> actually contains.
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Not the argument for why this matters, that&apos;s in <a href="/who-when-whether" style={{ color: "#E5484D" }}>Who, When, Whether</a>. This is the structure itself: every field, why it exists, and what happens the moment one lapses.
          </p>
        </div>
      </section>

      <Section eyebrow="The three questions" title="Who, when, and whether it still held">
        <P>
          Every real authorization answers three questions. Who granted it. When they granted it. And whether their authority still held at the moment it mattered. Most governance products stop at the first two, because the third one is the only one that can catch you out later.
        </P>
        <P>
          A boundary authorization record is a single, sealed answer to all three, for one specific decision to let an AI system do something. Below is exactly what it captures, field by field.
        </P>
      </Section>

      <Section eyebrow="The record" title="Every field, and why it exists">
        <Field name="decision">What was actually approved. Plain text, e.g. &quot;Approved use of Vendor X&apos;s AI copywriting tool for marketing drafts.&quot; Not a category. The specific thing.</Field>
        <Field name="owner_name / owner_role">Who granted it, and in what capacity. A name without a role is an assertion. A name with a role is a fact someone can be held to.</Field>
        <Field name="authority_mode">Where authority actually sits for this system, across three positions: a human decides, AI recommends and a human approves each one, or AI decides outright. It has no default. Quietly assuming the safest sounding answer would manufacture a position nobody took, so a record that never states this is marked incomplete rather than passing silently.</Field>
        <Field name="grant_type / credential_reference">An API key or agent credential is the same kind of standing authority as a decision, so it gets the same record. The reference names which credential, a key name or the last four characters. Never the secret itself, and the field refuses anything long enough to be one.</Field>
        <Field name="decision_date">When authority was granted. Fixed at creation, sealed, not editable afterwards.</Field>
        <Field name="expires_at">The shelf life. Required, not optional: an authorization with no expiry is not a strong grant, it&apos;s one nobody was ever forced to think about ending.</Field>
        <Field name="expiry_conditions">The specific, observable conditions that void the grant early, written at the moment of signing, not added afterwards. &quot;Vendor X appears on a regulator&apos;s enforcement list&quot; is a condition. &quot;If things go wrong&quot; is not. Each one carries its own action: anyone who can view the record, not just the owner, can mark it observed the moment it becomes true. That pulls the expiry forward, never back, and seals as its own dated event. Where a condition is something a system itself can detect, like a linked credential&apos;s live scope drifting from what was sealed, the record pulls its own expiry forward automatically, no human has to notice first. At renewal, at least one condition must be genuinely reconsidered rather than retyped unchanged from the record it replaces — confirming what was already there proves you typed it, not that you chose it.</Field>
        <Field name="completion_condition">Optional, and answers a different question to expiry_conditions above. Those name how a grant dies. This names what it looks like to actually succeed, one plain statement of what completion is, written at signing rather than decided in hindsight once something has already happened.</Field>
        <Field name="stop_authority_name / stop_authority_role">Optional. Who has standing to halt this before its natural expiry without asking permission from whoever depends on the timeline — distinct from the owner, who approved it, and often nobody distinct exists to name, which is an honest empty field, not a gap being papered over.</Field>
        <Field name="defend_authority_name / defend_authority_role">Optional. Who is obligated to justify this decision to a regulator, board, or court if it's disputed, a separate duty from approving it or being able to stop it.</Field>
        <Field name="escalation_ceiling">Optional, one statement of where the buck stops in a dispute. Distinct from the delegation chain, which shows who delegated to whom, not where it ultimately ends.</Field>
        <Field name="continuity_owner_name / continuity_owner_role">Distinct from the owner above. This is whoever holds the duty to renew the authorization or arrange a successor before it lapses. Added after a sharp public question: a lapse record used to fix only when a mandate went vacant, never who was accountable for it going vacant. This field closes that gap.</Field>
        <Field name="required_by_name / required_by_organisation">Optional, and left blank on most records, honestly. Every boundary authorization record is self authored, the account holder writes their own limits. A boundary you write for yourself and a boundary someone else is holding you to read very differently, even worded identically, because one was a choice you could have skipped and the other is a condition. This field names who, if anyone outside, actually required this boundary to exist, a lender, an insurer, a board resolution. Blank means self imposed, a real limit, but a volunteered one.</Field>
        <Field name="supersedes_id">If this record replaces an earlier one, because the role holder changed, this links to the record it replaces. The chain of custody for the mandate is provable, not left as separate, disconnected records.</Field>
        <Field name="options_considered / risks_accepted / evidence">What else was weighed, what risk was knowingly taken and how it was mitigated, and what evidence the decision actually rested on. The difference between a decision and a guess, on the record.</Field>
      </Section>

      <Section eyebrow="Across everything you've authorized" title="The decision authority map">
        <P>
          One record answers where authority sits for one system. The map answers it for all of them at once: how many decisions a human still makes, how many the AI recommends and a human clears, and how many the system now makes outright.
        </P>
        <P>
          That last number is the one worth knowing before someone else asks for it. It is not a fault, it is a position, and it is the one a board will ask you to justify by name. Most organisations cannot answer it today, not because the answer is bad, but because nobody ever wrote it down in a form you could count.
        </P>
        <P>
          The map counts a fourth group too, and it is usually the largest at first: the systems where nobody ever stated where authority sits. Until that is answered, the record cannot tell you whether a human was ever required before the system acted.
        </P>
      </Section>

      <Section eyebrow="When it lapses" title="A gap in coverage is a fact, not an inference">
        <P>
          Most systems check an expiry date lazily, on display, whenever someone happens to look. That means a real gap in coverage, a period where nobody actually held valid authority, is never itself a recorded fact. It&apos;s only something reconstructible later, if anyone thinks to look.
        </P>
        <P>
          A daily check finds every record whose expiry has passed and seals the lapse itself as its own event, the moment it&apos;s detected, before any successor exists. And because the continuity owner is named on the original record, the sealed lapse event names them directly too: not just that the seat went empty, but who was on the hook for it going empty.
        </P>
        <P>
          That sealed lapse event is timestamped by an independent authority and checkable by anyone, with no account, the same way every other claim on this site is.
        </P>
      </Section>

      <Section eyebrow="When it drifts" title="The record checks itself against what is actually live">
        <P>
          An expiry catches authority that ran out. Drift is the quieter failure: the authorization is still in date, but the thing it approved has changed underneath it. An API key approved with one set of permissions, running with another. Nobody revoked anything, nobody re approved anything, and every document still says approved.
        </P>
        <P>
          When a credential grant record links the actual API key it approves, a fingerprint of that key&apos;s approved permissions is sealed into the record at the moment of approval. From then on the comparison is mechanical: every live gate call and a daily check both recompute the key&apos;s current fingerprint and compare it against the sealed one. The moment they stop matching, the drift is sealed as its own dated event and an alert goes out, whether or not anyone decided the change was worth reporting.
        </P>
        <P>
          That is the difference between a certification that was true once and one that is still true today. A record that waits for someone to notice a change is a snapshot. A record that flags its own mismatch the day it happens is a living one.
        </P>
      </Section>

      <Section eyebrow="Provable, not just written down" title="Sealed, timestamped, and publicly checkable">
        <P>
          Every boundary authorization record is chained cryptographically to the ones before it, and sealed with an independent, third party timestamp. Editing, deleting, or backdating a record after the fact breaks the seal, and that break is detectable by anyone, not just us.
        </P>
        <P>
          Tampering isn&apos;t made impossible. It&apos;s made detectable. Those are different claims, and only one of them is true of any system, including this one. Try it yourself below, or check any specific record at <a href="/verify" style={{ color: "#E5484D" }}>redflagaipro.com/verify</a>. The same mechanism also runs between independent companies on the <a href="/witness-network" style={{ color: "#E5484D" }}>Witness Network</a>.
        </P>
        <div style={{ marginTop: "2rem" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>
            Try to break it
          </p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.62)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Seal the sample record below, then edit anything, one character is enough, and watch the fingerprint stop matching. This runs entirely in your browser. Nothing here is sent anywhere or stored.
          </p>
          <TryToBreakIt />
        </div>
      </Section>

      <section style={{ padding: "4rem 1.5rem 6rem", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1rem" }}>
            This is what Sentinel builds for every AI system you approve.
          </h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", marginBottom: "1.75rem" }}>
            The evidence a regulator, insurer, or court asks for when something goes wrong, not a policy document asserting good intentions.
          </p>
          <a
            href="/sentinel"
            style={{
              display: "inline-block", ...syne, fontSize: "14px", fontWeight: 700, padding: "13px 28px",
              borderRadius: "8px", background: "#E5484D", color: "white", textDecoration: "none",
            }}
          >
            Explore Sentinel →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
