import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Why Compliance and Governance Matter: Red Flag AI Pro",
  description: "Real fines. Real losses. $6 billion in marketing compliance penalties in three years, plus what unproven AI governance costs when a regulator or board asks. See what it costs sellers, buyers, and CFOs to get this wrong.",
  alternates: { canonical: "https://www.redflagaipro.com/why-compliance" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const FINES = [
  { country: "USA", body: "FTC", fine: "Up to $50,000", detail: "per violation, per day" },
  { country: "UK", body: "CMA / ASA", fine: "Up to £300,000", detail: "plus full campaign takedown" },
  { country: "EU", body: "GDPR", fine: "Up to €20 million", detail: "or 4% of global turnover" },
  { country: "Australia", body: "ACCC", fine: "Up to $50M AUD", detail: "per breach under ACL" },
  { country: "Canada", body: "CASL", fine: "Up to $10M CAD", detail: "per violation for businesses" },
  { country: "Brazil", body: "ANPD", fine: "Up to 2% revenue", detail: "capped at R$50M per incident" },
  { country: "India", body: "DPDPB", fine: "Up to ₹250 crore", detail: "per data breach" },
  { country: "Singapore", body: "PDPC", fine: "Up to S$1 million", detail: "per organisation" },
  { country: "UAE", body: "TDRA", fine: "Up to AED 5 million", detail: "per violation" },
];

const BUYER_LOSSES = [
  { label: "Ecommerce", sub: "Misleading product claims", amount: "£200 to £800", detail: "average loss per purchase" },
  { label: "Course buyers", sub: "Fake income claims", amount: "£500 to £5k", detail: "average loss per course" },
  { label: "Health products", sub: "Unsubstantiated claims", amount: "£100 to £2k", detail: "average loss per product" },
  { label: "Subscriptions", sub: "Hidden recurring charges", amount: "£300 to £1.2k", detail: "average annual loss" },
];

export default function WhyCompliancePage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>The cost of getting it wrong</p>
        <h1 style={{ ...syne, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Real fines. Real losses.<br />
          <span style={{ fontStyle: "italic" }}>Both sides.</span>
        </h1>
        <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", maxWidth: "560px", margin: "0 auto 1rem", lineHeight: 1.7 }}>
          $6 billion in marketing compliance fines globally in the last three years. Same illegal copy: sellers face regulators, buyers lose money.
        </p>
        <p style={{ ...mono, fontSize: "3rem", fontWeight: 800, color: "#ef4444", marginBottom: "3rem" }}>$6B+</p>
        <Link href="/#scanner" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none" }}>
          Scan your copy free
        </Link>
      </section>

      {/* What buyers lose */}
      <section style={{ background: "#0C1929", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>What buyers lose</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Every year. From the same ads.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px" }}>
            {BUYER_LOSSES.map((item) => (
              <div key={item.label} style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{item.label}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>{item.sub}</p>
                <p style={{ ...mono, fontSize: "2.25rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px" }}>{item.amount}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What sellers face */}
      <section style={{ background: "#0A1628", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>What sellers face</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Maximum regulatory penalties per jurisdiction.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", marginBottom: "2px" }}>
            {FINES.map((f) => (
              <div key={f.country} style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{f.country}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>{f.body}</p>
                <p style={{ ...mono, fontSize: "1.75rem", fontWeight: 700, color: "#ef4444", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "6px" }}>{f.fine}</p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{f.detail}</p>
              </div>
            ))}
            <div style={{ background: "#1a0505", border: "1px solid rgba(239,68,68,0.2)", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ ...mono, fontSize: "3rem", fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: "8px" }}>$6B+</p>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>in marketing compliance fines globally in the last 3 years</p>
            </div>
          </div>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "1.5rem", textAlign: "center" }}>Fine amounts based on published maximum penalties. Individual penalties vary. Not legal advice.</p>
        </div>
      </section>

      {/* AI Liability */}
      <section style={{ background: "#0C1929", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse at center, rgba(185,28,28,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>New threat: 2026</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem", lineHeight: 1.2, background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            AI generated it.<br />That does not make it legal.
            <span style={{ display: "block", fontStyle: "italic" }}>Or safe to buy.</span>
          </h2>
          <p style={{ ...syne, fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", marginBottom: "4rem", maxWidth: "600px", lineHeight: 1.7 }}>
            From January 2026, major insurers began adding AI exclusions to Professional Indemnity policies. AI generated copy that breaches advertising law is now an <span style={{ color: "white", fontWeight: 600 }}>uninsured liability</span>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", marginBottom: "3rem" }}>
            {[
              { title: "Berkley Insurance", body: "Introduced an absolute AI exclusion on D&O, E&O and Fiduciary Liability policies, covering all AI use, not just generative." },
              { title: "EU AI Act, Aug 2026", body: "Article 50(4) requires AI assisted marketing content to carry disclosure or documented human review. Non compliance triggers regulatory action." },
              { title: "RSA (UK)", body: "RSA's UK Head of PI confirmed they are \"assuming but not yet pricing\" AI exposures, meaning exclusions are coming at next renewal." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginBottom: "1.25rem" }} />
                <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "1px",
            background: "rgba(229,72,77,0.06)",
            border: "1px solid rgba(229,72,77,0.25)",
            padding: "2.5rem",
            textAlign: "center",
          }}>
            <p style={{ ...syne, fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.75rem", lineHeight: 1.6 }}>
              The same question sits behind every fine on this page: can you prove what you checked, and when?
            </p>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              That is the broader AI governance question CFOs and boards are now being asked directly. Take the free 5 minute Governance Maturity Index to see where your organisation stands.
            </p>
            <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", color: "white", ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "12px 28px", borderRadius: "9999px", textDecoration: "none" }}>
              Take the free governance assessment
            </Link>
          </div>
        </div>
      </section>

      {/* The maths */}
      <section style={{ background: "#0A1628", padding: "8rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem" }}>The maths</p>
          <h2 style={{ ...syne, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "3rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>For both sides.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "3rem", textAlign: "left" }}>
            {[
              { label: "Compliance lawyer", value: "£400 per hour" },
              { label: "Full funnel audit", value: "£2,400 minimum" },
              { label: "Average buyer loss", value: "£500 to £2,000" },
              { label: "Red Flag AI Pro", value: "Free. 60 seconds.", highlight: true },
            ].map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ ...syne, fontSize: "1.1rem", color: item.highlight ? "white" : "rgba(255,255,255,0.6)", fontWeight: item.highlight ? 700 : 500 }}>{item.label}</p>
                <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: item.highlight ? "#ef4444" : "rgba(255,255,255,0.6)", textAlign: "right" }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p style={{ ...syne, fontSize: "1.1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "3rem" }}>If it catches one thing, it has paid for itself a thousand times over.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#scanner" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#E5484D", color: "white", ...syne, fontSize: "1rem", fontWeight: 700, padding: "14px 40px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)", textDecoration: "none" }}>
              Scan free: 60 seconds →
            </Link>
            <Link href="/governance-audit" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", ...syne, fontSize: "1rem", fontWeight: 700, padding: "14px 40px", borderRadius: "9999px", textDecoration: "none" }}>
              Free governance assessment
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
