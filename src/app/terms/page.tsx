import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Terms of Service — Red Flag AI Pro",
  description: "Terms of Service for Red Flag AI Pro — please read before using our service.",
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function TermsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "7rem 1.5rem 4rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span className="flag-wave" style={{ display: "inline-block" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="1" x2="2" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2h10l-3 4.5 3 4.5H2" fill="#ef4444"/>
              </svg>
            </span>
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444" }}>Legal</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #E5484D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Terms of Service
          </h1>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Last updated: 18 May 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          {/* 1 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>1. About Red Flag AI Pro</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              Red Flag AI Pro (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered marketing compliance scanning tool operated by Red Flag AI Pro. By accessing or using our platform at <strong style={{ color: "white" }}>www.redflagaipro.com</strong>, you agree to be bound by these Terms of Service.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>2. Not Legal Advice — Important Disclaimer</h2>
            <div style={{ background: "#102943", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 600, color: "#ef4444", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                Red Flag AI Pro is an AI-powered tool and does not constitute legal advice. Our scans and reports are provided for informational purposes only.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
                Nothing produced by Red Flag AI Pro should be relied upon as a substitute for professional legal counsel. We strongly recommend consulting a qualified solicitor or compliance professional for definitive legal guidance specific to your business. Red Flag AI Pro accepts no liability for decisions made based solely on our scan results.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>3. Eligibility</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              You must be at least 18 years old and capable of entering into a legally binding agreement to use Red Flag AI Pro. By using our service you confirm that you meet these requirements.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>4. Your Account</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "none" }}>support@redflagaipro.com</a>{" "}
              of any unauthorised use of your account.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>5. Subscription Plans & Billing</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Starter Plan", "1 scan per month at no charge. No credit card required."],
                ["Pro Plan", "£49/month (subject to change — existing subscribers grandfathered at their original rate). Billed monthly via Stripe."],
                ["Enterprise Plan", "£149/month. Billed monthly via Stripe."],
                ["VAT", "All prices are inclusive of any applicable VAT where required by law."],
                ["Renewal", "Subscriptions renew automatically unless cancelled before the renewal date."],
                ["Cancellation", "You may cancel your subscription at any time via your billing settings or by contacting support."],
              ].map(([label, text]) => (
                <div key={label as string} style={{ display: "flex", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "0.75rem" }}>
                  <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white", minWidth: "120px", flexShrink: 0 }}>{label}</span>
                  <span style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>6. Refund Policy</h2>
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                We want every customer to be satisfied with Red Flag AI Pro. However, because our service delivers immediate digital value upon use, refunds are not automatically granted.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                <strong style={{ color: "white" }}>Refund requests will be considered where there is sufficient and reasonable cause</strong>, such as a significant technical failure that prevented you from using the service, or a billing error on our part.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>To request a refund, you must:</p>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Contact us within 14 days of the charge in question",
                  "Email support@redflagaipro.com with your account email, the reason for your request, and any supporting detail",
                  "Allow up to 5 business days for us to review and respond to your request",
                ].map((item) => (
                  <li key={item} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item}</li>
                ))}
              </ul>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                We reserve the right to decline refund requests where the service has been used as intended without technical fault. Approved refunds will be returned to the original payment method within 5–10 business days.
              </p>
            </div>
          </div>

          {/* 7 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>7. Acceptable Use</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "0.75rem" }}>You agree not to:</p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Use Red Flag AI Pro for any unlawful purpose",
                "Attempt to reverse engineer, scrape, or copy our platform",
                "Share your account credentials with others",
                "Submit content that is harmful, abusive, or violates third-party rights",
                "Use our service to circumvent compliance regulations rather than comply with them",
              ].map((item) => (
                <li key={item} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>8. Intellectual Property</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              All content, branding, software, and technology on Red Flag AI Pro is the property of Red Flag AI Pro and is protected by applicable intellectual property laws. You retain ownership of any content you submit for scanning. We do not store or use your submitted copy for any purpose other than generating your scan results.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>9. Limitation of Liability</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              To the fullest extent permitted by law, Red Flag AI Pro shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service, including but not limited to regulatory fines, lost revenue, or business interruption. Our total liability to you shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>10. Changes to These Terms</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              We may update these Terms from time to time. We will notify you of material changes by email or via an in-app notice. Continued use of Red Flag AI Pro after changes constitutes acceptance of the updated Terms.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>11. Governing Law</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>12. Contact Us</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              For any questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", fontWeight: 700, textDecoration: "none" }}>
                support@redflagaipro.com
              </a>
            </p>
          </div>

        </div>

        {/* Footer nav */}
        <div style={{ maxWidth: "720px", margin: "4rem auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", gap: "2rem" }}>
          <Link href="/privacy" style={{ ...syne, fontSize: "13px", color: "#ef4444", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/" style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
        </div>
      </section>
    </div>
  );
}
