import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";
import { JURISDICTION_COUNT_WORD, RISK_CATEGORY_COUNT_WORD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "What, Where, Whether",
  description:
    "The three questions a regulator asks about anything you publish, and the framework behind Red Flag AI Pro's compliance checker: what was claimed, which jurisdiction's rules apply, and whether it's substantiated.",
  alternates: { canonical: "https://www.redflagaipro.com/what-where-whether" },
  openGraph: {
    title: "What, Where, Whether",
    description: "The three questions a regulator asks about anything you publish, answered before they have to.",
    url: "https://www.redflagaipro.com/what-where-whether",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

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

export default function WhatWhereWhetherPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ position: "relative", overflow: "hidden", padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Image
          src="/images/compliance/press.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={65}
          style={{ objectFit: "cover", objectPosition: "center 40%", filter: "saturate(0.85) contrast(1.05) brightness(1.08)", pointerEvents: "none" }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,22,40,0.32)", mixBlendMode: "multiply" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.45) 40%, rgba(10,22,40,0.7) 75%, #0A1628 100%)" }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>The Framework</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            What, Where, <span style={{ fontStyle: "italic", color: "#E5484D" }}>Whether.</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto 1.25rem" }}>
            The three questions a regulator asks about anything you publish, answered before they have to.
          </p>
          <div style={{ background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.25)", borderRadius: "10px", padding: "1.1rem 1.4rem", textAlign: "left" }}>
            <p style={{ ...syne, fontSize: "0.82rem", color: "rgba(244,241,234,0.75)", lineHeight: 1.6 }}>
              This is the framework behind the compliance checker itself, the same one behind real published rulings. See it applied to your own copy in under a minute.{" "}
              <a href="/compliance-assessment#scanner" style={{ color: "#E5484D", textDecoration: "underline" }}>Try the checker →</a>
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Why" title="Reassurance is not the same as a check">
        <P>
          Most marketing copy is never checked against the rules that actually govern it. It is written to sound confident, approved because nobody objected, and published because the deadline arrived. The first time it meets the actual rule is when a regulator, a competitor, or a customer complains, and by then the cost is a ruling, not a rewrite.
        </P>
        <P>
          That gap exists because checking copy against real regulatory rules, across every market you sell into, has always been slow, expensive, or both. A solo creator or a small marketing team was never going to commission a compliance review for a landing page. So the copy went out unchecked, and the business found out the hard way what a regulator meant by misleading, unsubstantiated, or undisclosed.
        </P>
        <P>
          We built a checker to close that gap, not by writing another vague best practices guide, but by asking the same three questions a regulator actually asks, and answering them in under a minute, before a complaint ever gets filed.
        </P>
      </Section>

      <Section eyebrow="Where we are" title="Every real compliance question has three parts">
        <P>
          Strip away the legal language and a compliance question is always the same shape: what was actually said, where the rules that govern it apply, and whether the claim holds up. Almost every piece of marketing copy that gets flagged fails on one of these three, not because the writer meant to mislead, but because nobody checked all three before it went out.
        </P>
        <P><strong style={{ color: "#F4F1EA" }}>What.</strong> Not what the business meant to say. The checker reads the literal words on the page, the same way a regulator would, because that is the only version of the claim that actually gets enforced against.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Where.</strong> The same sentence can be perfectly fine in one market and prohibited in another. An income claim that is unremarkable in one jurisdiction can be a strict-liability breach in the next. Every flag names the specific jurisdiction whose rule it breaks, across {JURISDICTION_COUNT_WORD} jurisdictions, not a generic "this might be a problem somewhere."</P>
        <P><strong style={{ color: "#F4F1EA" }}>Whether.</strong> Whether the claim is substantiated, not just whether it sounds plausible. A guarantee, a health claim, an income promise, a before-and-after result: whether it holds up under the standard a regulator actually applies, checked against {RISK_CATEGORY_COUNT_WORD} risk categories built from real enforcement action, not hypothetical ones.</P>
        <P>
          A claim that answers all three cleanly is not a risk. A claim that fails even one of them is exactly what shows up in a ruling six months later, and by then the business rarely remembers writing it.
        </P>
      </Section>

      <section style={{ position: "relative", overflow: "hidden", padding: "4.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "440px" }}>
        <div aria-hidden className="img-side-blend" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "58%", aspectRatio: "16 / 9", maxHeight: "100%", pointerEvents: "none" }}>
          <Image
            src="/images/compliance/newsstack.jpg"
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
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>Not a rewrite, a citation</p>
        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem" }}>Every flag names the rule, not just the risk</h2>
        <P>
          A tool that says "this might be risky" is not much more useful than a gut feeling. Every flag the checker raises names the specific rule it breaks, the jurisdiction that rule applies in, and a rewrite that would clear it, drawn from the same enforcement patterns regulators actually publish.
        </P>
        <P>
          That is the difference between reassurance and a check. Reassurance tells you it is probably fine. A check tells you exactly what is not, and what to do about it, before anyone outside the business reads it.
        </P>
        </div>
        </div>
      </section>

      <Section eyebrow="Everything the checker offers today" title="Built to be tried, not just described">
        <P>
          None of this is theoretical. Paste your own copy in and the same three questions get answered in front of you.
        </P>
        <P><strong style={{ color: "#F4F1EA" }}>Compliance checking.</strong> Marketing copy checked against the actual rules regulators enforce, across {JURISDICTION_COUNT_WORD} jurisdictions and {RISK_CATEGORY_COUNT_WORD} risk categories, in under a minute. Try it on the <Link href="/compliance-assessment#scanner" style={{ color: "#E5484D" }}>compliance assessment page</Link>, no account required.</P>
        <P><strong style={{ color: "#F4F1EA" }}>A suite of free tools.</strong> A fine calculator that shows real regulatory exposure, an accessibility checker, an influencer disclosure checker, a shadow AI audit, and more, all free, built to demonstrate the standard rather than gate it behind a sales call.</P>
        <P><strong style={{ color: "#F4F1EA" }}>The other half of the question.</strong> Checking what a business said is only half the job. What a business did, and who was accountable for it, is a different question with its own framework. See <Link href="/who-when-whether" style={{ color: "#E5484D" }}>who, when, whether</Link>, the governance side of the same standard.</P>
        <P><strong style={{ color: "#F4F1EA" }}>Honest pricing.</strong> Checking copy against the law should not cost what this industry charges for it. Small businesses and solo operators should be able to afford the same standard of proof as anyone else.</P>
      </Section>

      <Footer />
    </div>
  );
}
