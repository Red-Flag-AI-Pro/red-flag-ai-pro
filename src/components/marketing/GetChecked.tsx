import React from "react";
import Link from "next/link";
import { AUDIT_PRICE, JURISDICTION_COUNT, RISK_CATEGORY_COUNT } from "@/lib/constants";
import { SiteCheckRequestForm } from "@/components/marketing/SiteCheckRequestForm";
import { ExampleRedFlag } from "@/components/marketing/ExampleRedFlag";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const STEPS = [
  {
    n: "01",
    title: "You give us your website.",
    body: "That is all we need. Nothing to paste, nothing to learn, no account.",
  },
  {
    n: "02",
    title: "We check it for you.",
    body: `What your site says, and how you use AI, against ${RISK_CATEGORY_COUNT} risk categories across ${JURISDICTION_COUNT} jurisdictions.`,
  },
  {
    n: "03",
    title: "You get your red flag. Free.",
    body: "The one most likely to cost you, the rule it breaks, and how many more there are. From James, personally.",
  },
  {
    n: "04",
    title: `Want them all cleared? £${AUDIT_PRICE.amount}.`,
    body: "The full audit: every red flag and how to fix it, on video and in writing, with a reviewed badge for your site. If we find nothing worth fixing, you get your money back.",
  },
];

function Steps() {
  return (
    <div>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ display: "flex", gap: "1.1rem", paddingTop: i === 0 ? 0 : "1.4rem", marginTop: i === 0 ? 0 : "1.4rem", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ ...mono, flexShrink: 0, fontSize: "13px", letterSpacing: "0.1em", color: i === 3 ? "#C9A66B" : "#E5484D", paddingTop: "5px" }}>{s.n}</span>
          <div>
            <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, marginBottom: "0.4rem" }}>{s.title}</h3>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.6)", lineHeight: 1.65 }}>{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The main offer: we do the checking, the visitor does nothing.
 *
 * `mode="page"` is the standalone /get-checked page: the heading is the page
 * title and the form sits beside the steps, with the example reply below.
 * `mode="home"` is the homepage, where the form already sits in the hero, so
 * the steps sit beside the example reply and a button sends people back up.
 */
export function GetChecked({ mode = "home" }: { mode?: "home" | "page" }) {
  const page = mode === "page";
  const Heading = page ? "h1" : "h2";

  return (
    <section
      id="get-checked"
      aria-label="Get your site checked"
      style={{ padding: "5.5rem 1.5rem", background: "#0D1B2E", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", scrollMarginTop: "80px" }}
    >
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            {page ? "You don't lift a finger" : "How it works"}
          </p>
          <Heading className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.1rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#F4F1EA", marginBottom: "1rem" }}>
            {page ? (
              <>
                What&apos;s your red flag?<br />
                <span style={{ fontStyle: "italic", color: "#E5484D" }}>We&apos;ll find it for you.</span>
              </>
            ) : (
              <>
                One red flag, free.<br />
                <span style={{ fontStyle: "italic", color: "#E5484D" }}>All of them cleared, £{AUDIT_PRICE.amount}.</span>
              </>
            )}
          </Heading>
          <p style={{ ...syne, fontSize: "1.02rem", color: "rgba(244,241,234,0.65)", lineHeight: 1.7, maxWidth: "640px", margin: "0 auto" }}>
            Don&apos;t find out from a regulator, a competitor or a customer. Find out from us first, privately, and for free.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
          <div>
            <Steps />
            {page ? (
              <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginTop: "1.75rem" }}>
                Ready to go straight to the full audit?{" "}
                <Link href="/audit" style={{ color: "#E5484D", fontWeight: 700, textDecoration: "none" }}>See what the £{AUDIT_PRICE.amount} covers →</Link>
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "2rem" }}>
                <a href="#red-flag" className="btn-primary" style={{ fontSize: "0.92rem", padding: "13px 26px" }}>
                  Show me my red flag <span className="arrow">→</span>
                </a>
                <Link href="/audit" className="btn-secondary" style={{ fontSize: "0.92rem", padding: "13px 26px" }}>
                  The full audit, £{AUDIT_PRICE.amount} <span className="arrow">→</span>
                </Link>
              </div>
            )}
          </div>

          {page ? <SiteCheckRequestForm variant="full" /> : <ExampleRedFlag />}
        </div>

        {page && (
          <div style={{ maxWidth: "640px", margin: "3.5rem auto 0" }}>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,241,234,0.55)", marginBottom: "1rem", textAlign: "center" }}>
              What you get back
            </p>
            <ExampleRedFlag />
          </div>
        )}
      </div>
    </section>
  );
}
