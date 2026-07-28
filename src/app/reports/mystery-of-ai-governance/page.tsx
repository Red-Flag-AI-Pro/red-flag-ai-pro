import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PurchaseConversion } from "@/components/marketing/PurchaseConversion";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "The Mystery of AI Governance: Red Flag AI Pro",
  description:
    "Why you're confused about AI governance, and who benefits from it. A 39 page report, every fine and ruling real and cited, written by the founder of a governance and compliance company that is not exempting itself from the argument.",
  alternates: { canonical: "https://www.redflagaipro.com/reports/mystery-of-ai-governance" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

const TICKER_ITEMS = [
  "The Falsities Index",
  "The Statute Book",
  "The Timeline Nobody Reads Aloud",
  "The Set-Up",
  "The Scandal",
  "The Drafting Room",
  "The Lie Works",
  "The Way Out",
  "38 Pages",
  "Every Fact Sourced",
  "£4.99",
  "First Edition, 2026",
];

const CONTENTS = [
  {
    num: "01",
    headline: "Ten things you'll be told this year that are not true",
    body: "Each one stamped false, with the mechanism of the lie and the evidence against it. “We have an AI policy, so we're covered.” “AI compliance is a 2027 problem.” “There's a human in the loop.”",
  },
  {
    num: "02",
    headline: "The statute book, no rounding required",
    body: "Verified maximum fines across ten jurisdictions, with the Canadian penalty figure that's actually a dead bill called out by name, and the per-violation regime everyone underestimates.",
  },
  {
    num: "03",
    headline: "The scandal: everyone convinced, nobody required",
    body: "Why the ASA can't fine anyone, the CMA's 10% power sits unused, and most high-risk conformity assessment is done by the provider itself. The payroll of the status quo, seat by seat.",
  },
  {
    num: "04",
    headline: "The drafting room: did they know?",
    body: "Yes. The 2017 European Parliament debate on machine personhood, and the 2018 letter that killed it, on the record, years before most of the industry was paying attention.",
  },
];

const FAQS = [
  {
    q: "Is this a sales pitch with extra steps?",
    a: "Partly, and it says so in print. Red Flag AI Pro operates inside the governance and compliance industry itself, and the report includes a page stating exactly what we sell, what nobody can do, and a dare to every vendor claiming otherwise. The rest of the report doesn't mention us.",
  },
  {
    q: "Why £4.99 and not free?",
    a: "Free reports get skimmed. This one is priced to be read twice and argued with. It's also a fairness position: everything the law actually requires should not cost what most of this industry charges for it.",
  },
  {
    q: "Is everything in it actually checkable?",
    a: "Yes. Every fine, ruling, and statistic is dated and sourced, with a full citations page at the back. If you find an error, tell us and we correct it publicly.",
  },
  {
    q: "What format do I get?",
    a: "A PDF. The download link appears the moment your payment completes. No account, no dashboard, no waiting.",
  },
  {
    q: "How do I pay?",
    a: "Card, securely, on the spot, no account needed. The download appears the moment the payment clears.",
  },
];

export default async function MysteryOfAIGovernancePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const paid = params.success === "1";
  const canceled = params.canceled === "1";

  // Instant delivery on the success page: verify the Stripe session
  // server-side, then hand over a signed download link directly. The
  // unguessable session id acts as the bearer of proof-of-purchase, so no
  // email leg is required for the customer to get their copy.
  let downloadUrl: string | null = null;
  if (paid && params.session_id?.startsWith("cs_")) {
    try {
      const { stripe } = await import("@/lib/stripe");
      const session = await stripe.checkout.sessions.retrieve(params.session_id);
      const settled = session.payment_status === "paid" || session.payment_status === "no_payment_required";
      if (settled && session.metadata?.plan === "report") {
        const { createClient: createAdminClient } = await import("@supabase/supabase-js");
        const admin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { data: signed } = await admin.storage
          .from("reports")
          .createSignedUrl("the-mystery-of-ai-governance.pdf", 60 * 60 * 24 * 7);
        downloadUrl = signed?.signedUrl ?? null;
      }
    } catch (err) {
      console.error("report success-page delivery failed:", err);
    }
  }

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Suspense>
        <PurchaseConversion />
      </Suspense>
      <Navbar />

      {paid && downloadUrl && (
        <div style={{
          maxWidth: "720px", margin: "1.5rem auto 0", padding: "1.5rem 1.5rem",
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)",
          borderRadius: "10px", textAlign: "center",
        }}>
          <p style={{ ...syne, fontSize: "16px", fontWeight: 700, color: "#4ade80", marginBottom: "0.75rem" }}>
            Payment received. Your copy is ready.
          </p>
          <a href={downloadUrl} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#E5484D", color: "white",
            ...syne, fontSize: "0.95rem", fontWeight: 700,
            padding: "13px 30px", borderRadius: "9999px",
            textDecoration: "none", letterSpacing: "0.02em",
            boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
          }}>
            Download the report (PDF)
          </a>
          <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.6)", lineHeight: 1.6, marginTop: "0.85rem" }}>
            This download link works for 7 days. Save the file somewhere safe. If anything goes wrong, email support@redflagaipro.com and we will sort it.
          </p>
        </div>
      )}
      {paid && !downloadUrl && (
        <div style={{
          maxWidth: "720px", margin: "1.5rem auto 0", padding: "1.25rem 1.5rem",
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)",
          borderRadius: "10px",
        }}>
          <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "#4ade80", marginBottom: "0.4rem" }}>
            Payment received.
          </p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.75)", lineHeight: 1.6 }}>
            We could not prepare your download automatically just now. Email support@redflagaipro.com with your receipt and your copy will be sent straight over.
          </p>
        </div>
      )}
      {canceled && (
        <div style={{
          maxWidth: "720px", margin: "1.5rem auto 0", padding: "1rem 1.5rem",
          background: "rgba(244,241,234,0.05)", border: "1px solid rgba(244,241,234,0.15)",
          borderRadius: "10px",
        }}>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.75)", lineHeight: 1.6 }}>
            Checkout was cancelled, nothing was charged.
          </p>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "4.5rem 1.5rem 3.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px", pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 60%)"
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.75rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E5484D", flexShrink: 0, display: "inline-block" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D" }}>
              Wake up. What are we all talking about, every day?
            </p>
          </div>

          <h1 style={{
            ...syne,
            fontSize: "clamp(2rem, 5.5vw, 3.4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            marginBottom: "1rem",
            color: "#F4F1EA"
          }}>
            The Mystery of AI Governance
          </h1>
          <p style={{ ...syne, fontSize: "clamp(1.1rem, 2.6vw, 1.4rem)", fontWeight: 700, color: "#E5484D", marginBottom: "1.5rem" }}>
            Why you&apos;re confused, and who benefits from it.
          </p>

          <p style={{ ...syne, fontSize: "clamp(0.9rem, 2vw, 1.05rem)", fontWeight: 500, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto 2.25rem" }}>
            An entire industry meets daily to discuss something no one in it can prove exists, and stays vague about it on purpose, because the vagueness is profitable. 39 pages, every fact real, dated, and sourced. Written by someone who operates inside this industry and says so in print.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <Link href="/reports/mystery-of-ai-governance/checkout" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#E5484D", color: "white",
              ...syne, fontSize: "0.9rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              Get the report: £4.99
            </Link>
            <Link href="/governance-audit" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.45)",
              ...syne, fontSize: "0.9rem", fontWeight: 600,
              padding: "13px 28px", borderRadius: "9999px",
              textDecoration: "none"
            }}>
              Try the free governance audit instead
            </Link>
          </div>

          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}>
            Instant download on payment · No account needed · Check everything, we invite it
          </p>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{
        background: "#0D1B2E",
        borderBottom: "1px solid rgba(239,68,68,0.12)",
        padding: "0.9rem 0",
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, #0D1B2E, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, #0D1B2E, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div className="ticker-track" style={{ gap: "0" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", padding: "0 1.5rem" }}>
              <span style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                {item}
              </span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#E5484D", display: "inline-block", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section style={{ padding: "4rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
            The problem
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1.25rem", color: "#F4F1EA" }}>
            You could hand a million pounds to the biggest firm on earth, and they still couldn&apos;t prove it.
          </h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.9 }}>
            Genuine human oversight of an AI decision. That is the thing an entire industry, panels, newsletters, frameworks, seven-figure contracts, talks about every day, and nobody selling in this space can prove ever happened. Not the vendors. Not the Big Four. Not us. This report says that on page three, then spends 35 more pages showing exactly why, with the fines, the case law, and the dates to back every claim.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section style={{ padding: "4rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem", textAlign: "center" }}>
            What&apos;s inside
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "2.5rem", color: "#F4F1EA", textAlign: "center" }}>
            39 pages. Four of them look like this.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.75rem" }}>
            {CONTENTS.map((item) => (
              <div key={item.num} style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                <p style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "#E5484D", marginBottom: "0.6rem" }}>{item.num}</p>
                <h3 style={{ ...syne, fontSize: "16px", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.6rem", lineHeight: 1.4 }}>{item.headline}</h3>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE ── */}
      <section style={{ padding: "4rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0C1929", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem" }}>
          Pricing, stated plainly
        </p>
        <p style={{ ...syne, fontSize: "clamp(2.4rem, 6vw, 3.2rem)", fontWeight: 800, color: "#F4F1EA", marginBottom: "0.5rem" }}>
          £4.99
        </p>
        <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
          One time. No subscription. Instant PDF delivery. The price is a position, not a discount, and the report explains why on its own sales page, in print.
        </p>
        <Link href="/reports/mystery-of-ai-governance/checkout" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#E5484D", color: "white",
          ...syne, fontSize: "0.9rem", fontWeight: 700,
          padding: "13px 28px", borderRadius: "9999px",
          boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
          textDecoration: "none", letterSpacing: "0.02em"
        }}>
          Get the report now
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1rem", textAlign: "center" }}>
            Questions
          </p>
          <h2 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "2rem", color: "#F4F1EA", textAlign: "center" }}>
            Straight answers
          </h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ padding: "1.5rem 0", borderBottom: i < FAQS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <h3 style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "#F4F1EA", marginBottom: "0.6rem" }}>{faq.q}</h3>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
