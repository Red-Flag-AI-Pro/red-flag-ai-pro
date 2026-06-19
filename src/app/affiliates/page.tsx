import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PromoBox } from "@/components/affiliates/PromoBox";

export const metadata: Metadata = {
  title: "Affiliate Programme — Red Flag AI Pro",
  description: "Earn 15% recurring commission promoting Red Flag AI Pro. Share your link, earn every month your referrals stay subscribed. Free to join.",
  alternates: { canonical: "https://www.redflagaipro.com/affiliates" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const HOW_IT_WORKS = [
  { num: "01", title: "Sign up free", body: "Apply in one click. No approval process, no monthly fee. You get a unique tracking link the moment you join." },
  { num: "02", title: "Share your link", body: "Add it to your content, newsletter, social posts, or client recommendations — anywhere your audience trusts you." },
  { num: "03", title: "Earn every month", body: "You get 15% recurring commission on every payment. One Sentinel referral (£5000+/mo) pays ~£750/month. One Pro referral (£350/mo) pays ~£52.50/month. As long as they stay subscribed, you earn." },
];

const WHO_IT_IS_FOR = [
  { label: "Governance consultants", desc: "Your clients need proven governance. Red Flag provides the assessment, roadmap, and monitoring. You earn 15% on every client who signs up." },
  { label: "Compliance officers", desc: "Recommend Red Flag to your network of CFOs, board members, and regulated enterprises. 15% recurring from each who subscribes." },
  { label: "Executive coaches", desc: "Your C-suite clients need AI governance proof. Red Flag gives them the score, gaps, and strategic roadmap. Earn passive income from referrals." },
  { label: "Risk & legal advisors", desc: "Your clients are asking about Munir compliance, SEC readiness, EU AI Act. Point them to Red Flag. Get 15% recurring on each." },
  { label: "Newsletter writers (B2B)", desc: "Write about CFO challenges, AI regulation, compliance, or financial risk? Your audience will convert. One mention pays you monthly." },
  { label: "Anyone with a CFO/compliance audience", desc: "If you influence CFOs, compliance teams, or regulated enterprises on governance topics, Red Flag is a high-converting recommendation. 15% recurring." },
];

const EARNINGS = [
  { referrals: 5, plan: "Pro (£350/mo)", monthly: "£263", annual: "£3,150" },
  { referrals: 10, plan: "Pro (£350/mo)", monthly: "£525", annual: "£6,300" },
  { referrals: 1, plan: "Sentinel (£5000/mo)", monthly: "£750", annual: "£9,000" },
  { referrals: 2, plan: "Sentinel (£5000/mo)", monthly: "£1,500", annual: "£18,000" },
  { referrals: 3, plan: "Sentinel (£5000/mo)", monthly: "£2,250", annual: "£27,000" },
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
            15% recurring commission. Free to join. No approval process. Share your unique link — earn every month your referrals stay subscribed.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <a
              href="https://red-flag-ai-pro.tolt.io"
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
            { value: "15%", label: "Recurring commission", sub: "on every payment they make" },
            { value: "£750+", label: "Monthly per Sentinel referral", sub: "15% of £5000+/mo" },
            { value: "£52.50+", label: "Monthly per Pro referral", sub: "15% of £350/mo" },
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
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", textAlign: "center", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Three steps. Recurring income.</h2>
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
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", textAlign: "center", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Numbers, not promises.</h2>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", background: "#0f0f0f", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Referrals", "Plan", "Monthly earnings", "Annual earnings"].map((h) => (
                <span key={h} style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{h}</span>
              ))}
            </div>
            {EARNINGS.map((row, i) => {
              const isSentinel = row.plan.includes("Sentinel");
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr", padding: "1.25rem 1.5rem", borderBottom: i < EARNINGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: isSentinel ? "rgba(204,0,0,0.06)" : i % 2 === 0 ? "#0a0a0a" : "#080808" }}>
                  <span style={{ ...mono, fontSize: "1.25rem", fontWeight: 700, color: isSentinel ? "#fca5a5" : "white" }}>{row.referrals}</span>
                  <span style={{ ...syne, fontSize: "13px", color: isSentinel ? "#fca5a5" : "rgba(255,255,255,0.5)", alignSelf: "center", fontWeight: isSentinel ? 700 : 400 }}>{row.plan}</span>
                  <span style={{ ...mono, fontSize: "1.1rem", fontWeight: 700, color: "#ef4444" }}>{row.monthly}</span>
                  <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: isSentinel ? "white" : "rgba(255,255,255,0.6)", alignSelf: "center" }}>{row.annual}</span>
                </div>
              );
            })}
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1rem", textAlign: "center" }}>15% of net revenue. Paid monthly. Referrals must remain active subscribers.</p>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "7rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Who it&apos;s for</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>If your audience does marketing, this fits.</h2>
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

      {/* Promo pack */}
      <section style={{ background: "#080808", padding: "7rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Promo pack</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem", textAlign: "center", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ready-made posts. Just add your link.</h2>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "3.5rem" }}>Copy any of these, swap in your affiliate link, and post. Click a box to select all.</p>

          <PromoBox
            platform="LinkedIn"
            label="Professional / agency audience"
            post={`I just scanned a well-known brand's homepage through Red Flag AI Pro.\n\nScore: 0/100. Seven compliance violations — income claims, fake urgency, GDPR issues.\n\nThey had no idea.\n\nIf you run ads, write copy, or manage client campaigns — you need to run this before anything goes live. It checks against FTC, ASA, GDPR, FCA and 25 other risk categories. Takes 60 seconds. Free scan, no account needed.\n\nIf you want to earn from it: they have an affiliate programme. 15% recurring commission. One agency referral pays you every month they stay subscribed.\n\n→ [YOUR AFFILIATE LINK]`}
          />
          <PromoBox
            platform="X / Twitter"
            label="Short hook for engagement"
            post={`I scanned a £10M/yr brand's marketing copy through a compliance tool.\n\n0 out of 100.\n\nIncome claims that break FTC rules. Fake countdown timers. GDPR violations.\n\nAll live. All potentially actionable.\n\nThis tool catches it in 60 seconds: [YOUR AFFILIATE LINK]\n\n(They also pay 15% recurring if you share it)`}
          />
          <PromoBox
            platform="Instagram / TikTok caption"
            label="Visual-first, short"
            post={`Did you know most online ads are technically illegal?\n\nIncome claims that break the law. Fake scarcity. Health claims with zero evidence.\n\nI found a tool that scans any ad or sales page in 60 seconds and tells you exactly what regulators would flag.\n\nFree to use. Link in bio 👇\n\n[YOUR AFFILIATE LINK]`}
          />
          <PromoBox
            platform="Facebook Group / Forum"
            label="Helpful, not salesy"
            post={`Not sure if this is useful for anyone here but I've been using Red Flag AI Pro to check my copy before running ads.\n\nYou paste your sales page or email, it tells you what's non-compliant — fake urgency, income claims, GDPR issues, influencer disclosure, all of it. 29 risk categories across 9 countries.\n\nSaved me from running an ad that had three FTC violations I didn't know about.\n\nFree scan here (no account needed): [YOUR AFFILIATE LINK]\n\nThere's also an affiliate programme if you want to share it — 15% recurring commission.`}
          />
          <PromoBox
            platform="Newsletter / Email"
            label="For newsletter writers"
            post={`Quick one this week — a tool I've been using called Red Flag AI Pro.\n\nYou paste any marketing copy — sales page, ad, email — and it scans it against 29 compliance categories across 9 jurisdictions (FTC, GDPR, ASA, FCA and more). Results in 60 seconds. First scan is free.\n\nI ran my own copy through it. Found things I didn't know were issues. Fixed them before the next campaign went out.\n\nIf your audience writes or buys from online ads, it's worth knowing about: [YOUR AFFILIATE LINK]\n\n(Full disclosure: that's my affiliate link — I earn a commission if you sign up for a paid plan. Doesn't change the price for you.)`}
          />
        </div>
      </section>

      {/* Jurisdictions */}
      <section style={{ background: "#0a0a0a", padding: "7rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center" }}>Governance Frameworks Covered</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", textAlign: "center", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Red Flag covers 9 jurisdictions</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2px" }}>
            {[
              { flag: "🇺🇸", country: "USA", regs: "SEC · FTC · GDPR" },
              { flag: "🇬🇧", country: "UK", regs: "FCA · CMA · ASA · DSA" },
              { flag: "🇪🇺", country: "EU", regs: "EU AI Act · GDPR · DSA" },
              { flag: "🇦🇺", country: "Australia", regs: "ACCC · TGA · ASIC" },
              { flag: "🇨🇦", country: "Canada", regs: "CASL · PIPEDA · OSC" },
              { flag: "🇧🇷", country: "Brazil", regs: "LGPD" },
              { flag: "🇮🇳", country: "India", regs: "DPDP Act 2023" },
              { flag: "🇸🇬", country: "Singapore", regs: "PDPA" },
              { flag: "🇦🇪", country: "UAE", regs: "PDPL 2022" },
            ].map((j) => (
              <div key={j.country} style={{
                background: "#0f0505",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{j.flag}</p>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{j.country}</p>
                <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{j.regs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#080808", padding: "7rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>Ready to start?</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1rem", lineHeight: 1.1, background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            One link. Monthly income.<br />Zero cost to join.
          </h2>
          <p style={{ ...syne, fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Join the programme via Tolt, get your unique link, and start earning from your first referral.
          </p>
          <a
            href="https://red-flag-ai-pro.tolt.io"
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
