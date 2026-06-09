import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Affiliate Programme — Red Flag AI Pro",
  description: "Earn 25% recurring commission promoting Red Flag AI Pro. Share your link, earn every month your referrals stay subscribed. Free to join.",
  alternates: { canonical: "https://www.redflagaipro.com/affiliates" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const HOW_IT_WORKS = [
  { num: "01", title: "Sign up free", body: "Apply in one click. No approval process, no monthly fee. You get a unique tracking link the moment you join." },
  { num: "02", title: "Share your link", body: "Add it to your content, newsletter, social posts, or client recommendations — anywhere your audience trusts you." },
  { num: "03", title: "Earn every month", body: "You get 25% of every payment your referrals make, for as long as they stay subscribed. One referral on Pro pays you ~£10/month, every month." },
];

const WHO_IT_IS_FOR = [
  { label: "Marketing educators", desc: "Teaching ads, funnels, or copywriting? Compliance is the natural next chapter — and your audience already trusts your recommendations." },
  { label: "Compliance consultants", desc: "Refer clients to Red Flag AI Pro for day-to-day checks. Upsell your own audit time for what the tool can't do." },
  { label: "Agency owners", desc: "If you already use Red Flag AI Pro on client campaigns, you might as well get paid when they sign up directly." },
  { label: "Course creators", desc: "If your course teaches marketing, e-commerce, or business, compliance is a natural module — and Red Flag AI Pro is the tool." },
  { label: "Bloggers & newsletter writers", desc: "Write about marketing, legal risk, or online business? A single well-placed mention can pay you passively for years." },
  { label: "Anyone with an audience", desc: "If people trust your recommendations on marketing and business, this converts. The product sells itself once they see what it finds." },
];

const EARNINGS = [
  { referrals: 5, plan: "Pro (£39/mo)", monthly: "£49", annual: "£585" },
  { referrals: 10, plan: "Pro (£39/mo)", monthly: "£98", annual: "£1,170" },
  { referrals: 5, plan: "Growth (£199/mo)", monthly: "£249", annual: "£2,985" },
  { referrals: 10, plan: "Growth (£199/mo)", monthly: "£499", annual: "£5,970" },
];

export default function AffiliatesPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "10rem 1.5rem 6rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse at center, rgba(204,0,0,0.12), transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Affiliate Programme</p>
          <h1 style={{ ...syne, fontSize: "clamp(2.25rem, 6vw, 4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
            Get paid every month<br />
            <span style={{ background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              for a link you share once.
            </span>
          </h1>
          <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            25% recurring commission. Free to join. No approval process. Share your unique link — earn every month your referrals stay subscribed.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <a
              href="https://redflagaipro.tolt.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", ...syne, fontSize: "1rem", fontWeight: 700, padding: "14px 40px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none" }}
            >
              Join the programme →
            </a>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", ...syne, fontSize: "1rem", fontWeight: 600, padding: "14px 32px", borderRadius: "9999px", textDecoration: "none" }}>
              See what you&apos;re promoting
            </Link>
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Free to join · No monthly fee · Powered by Tolt</p>
        </div>
      </section>

      {/* Commission highlight */}
      <section style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2px", textAlign: "center" }}>
          {[
            { value: "25%", label: "Recurring commission", sub: "on every payment" },
            { value: "90", label: "Day cookie window", sub: "from first click" },
            { value: "£10+", label: "Per Pro referral/mo", sub: "every month they stay" },
            { value: "Free", label: "To join", sub: "no approval, no fee" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
              <p style={{ ...mono, fontSize: "2.5rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>{stat.value}</p>
              <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{stat.label}</p>
              <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>How it works</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "4rem", textAlign: "center" }}>Three steps. Recurring income.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
                <p style={{ ...mono, fontSize: "3rem", fontWeight: 700, color: "rgba(239,68,68,0.4)", lineHeight: 1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>{s.num}</p>
                <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{s.title}</p>
                <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings table */}
      <section style={{ background: "#080808", padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>What you can earn</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "3rem", textAlign: "center" }}>Numbers, not promises.</h2>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", background: "#0f0f0f", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Referrals", "Plan", "Monthly earnings", "Annual earnings"].map((h) => (
                <span key={h} style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{h}</span>
              ))}
            </div>
            {EARNINGS.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", padding: "1.25rem 1.5rem", borderBottom: i < EARNINGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "#0a0a0a" : "#080808" }}>
                <span style={{ ...mono, fontSize: "1.25rem", fontWeight: 700, color: "white" }}>{row.referrals}</span>
                <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", alignSelf: "center" }}>{row.plan}</span>
                <span style={{ ...mono, fontSize: "1.1rem", fontWeight: 700, color: "#ef4444" }}>{row.monthly}</span>
                <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>{row.annual}</span>
              </div>
            ))}
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem", textAlign: "center" }}>25% of net revenue. Paid monthly. Referrals must remain active subscribers.</p>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Who it&apos;s for</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "3rem" }}>If your audience does marketing, this fits.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
            {WHO_IT_IS_FOR.map((item) => (
              <div key={item.label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.6rem" }}>{item.label}</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#080808", padding: "7rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Ready to start?</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.1 }}>
            One link. Monthly income.<br />Zero cost to join.
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Join the programme via Tolt, get your unique link, and start earning from your first referral.
          </p>
          <a
            href="https://redflagaipro.tolt.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", ...syne, fontSize: "1rem", fontWeight: 700, padding: "14px 40px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none" }}
          >
            Join the programme →
          </a>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1.25rem" }}>
            Questions? <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "none" }}>Email us</a>
          </p>
        </div>
      </section>
    </div>
  );
}
