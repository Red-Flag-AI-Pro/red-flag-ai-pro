import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Free Compliance Tools — Red Flag AI Pro",
  description:
    "Free marketing compliance tools: a 29-category compliance checklist, an affiliate disclosure generator, and more — included free with every account.",
  alternates: { canonical: "https://www.redflagaipro.com/tools" },
};

export default function ToolsPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <Navbar />

      {/* Toolkit teaser — locked reward, unlocked on signup */}
      <section style={{background: "#080808", padding: "10rem 1.5rem 6rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1rem"}}>Unlocked free the moment you sign up</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700,
            letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem",
            background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Your compliance toolkit. A free gift for signing up.</h1>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem"}}>
            Create a free account and these 9 compliance tools unlock instantly in your dashboard — risk calculators, disclaimer generator, testimonial checker, email compliance, refund rights checker and more. No scan credits used. Always free.
          </p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2.5rem"}}>
            {["Risk Calculator", "Disclaimer Generator", "Testimonial Checker", "Email Compliance", "Urgency Validator", "Health Claim Rater", "Red Flag Checklist", "Refund Rights", "Influencer Disclosure"].map((t) => (
              <span key={t} style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: "9999px"}}>
                {t}
              </span>
            ))}
          </div>
          <Link href="/signup" style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "#cc0000", color: "white", fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", fontWeight: 700, padding: "13px 32px", borderRadius: "9999px", boxShadow: "0 8px 32px rgba(204,0,0,0.35)", textDecoration: "none"}}>
            Create free account — unlock toolkit →
          </Link>
        </div>
      </section>

      {/* Free, ungated tools */}
      <section style={{background: "#050505", padding: "5rem 1.5rem"}}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <p style={{fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "1.5rem", textAlign: "center"}}>Or try these now — no account needed</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px"}}>
            <Link href="/tools/compliance-checklist" style={{display: "block", background: "#0f0505", border: "1px solid rgba(239,68,68,0.15)", padding: "2rem", textDecoration: "none"}}>
              <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem"}}>29-Category Compliance Checklist</h2>
              <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6}}>Every compliance check to run before you launch a campaign — free, no signup.</p>
            </Link>
            <Link href="/tools/disclosure-generator" style={{display: "block", background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", textDecoration: "none"}}>
              <h2 style={{fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem"}}>Affiliate Disclosure Generator</h2>
              <p style={{fontFamily: "'Syne', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6}}>Generate an FTC/ASA-compliant affiliate or sponsorship disclaimer in seconds.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
