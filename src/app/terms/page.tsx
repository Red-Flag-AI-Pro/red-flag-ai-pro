import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Terms of Service: Red Flag AI Pro",
  description: "Terms of Service for Red Flag AI Pro. Please read before using our service.",
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
            <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D" }}>Legal</p>
          </div>
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", color: "#F4F1EA" }}>
            Terms of Service
          </h1>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Last updated: 29 July 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          {/* 1 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>1. About Red Flag AI Pro</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              Red Flag AI Pro (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI powered marketing compliance checking and AI governance assessment service. By accessing or using our platform at <strong style={{ color: "white" }}>www.redflagaipro.com</strong>, you agree to be bound by these Terms of Service.
            </p>
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.25rem", marginTop: "1rem" }}>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
                <strong style={{ color: "white" }}>Who we are.</strong> Red Flag AI Pro is a trading name of James Stokes, a sole trader established in the United Kingdom.
                <br /><br />
                <strong style={{ color: "white" }}>Trading address:</strong> 17 Mariston Way, Warmley, South Gloucestershire, BS30 8UD, United Kingdom
                <br />
                <strong style={{ color: "white" }}>Contact:</strong>{" "}
                <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>
              </p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>2. Not Legal Advice: Important Disclaimer</h2>
            <div style={{ background: "#102943", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ ...syne, fontSize: "14px", fontWeight: 600, color: "#E5484D", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                Red Flag AI Pro is an AI powered tool and does not constitute legal advice. Our checks and reports are provided for informational purposes only.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
                Nothing produced by Red Flag AI Pro should be relied upon as a substitute for professional legal counsel. We strongly recommend consulting a qualified solicitor or compliance professional for definitive legal guidance specific to your business. Red Flag AI Pro accepts no liability for decisions made based solely on our check results.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginTop: "0.75rem" }}>
                Red Flag AI Pro is not a firm of solicitors, is not authorised or regulated by the Solicitors Regulation Authority, and does not carry out reserved legal activities.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginTop: "0.75rem" }}>
                Our records can show that a record existed at a given time, that it has not been altered since, and who signed it. They cannot prove that the named person applied their own judgement. No system can. We do not claim otherwise and you should not rely on our records as proof that a review was genuinely carried out.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>3. Eligibility</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              You must be at least 18 years old and capable of entering into a legally binding agreement to use Red Flag AI Pro. By using our service you confirm that you meet these requirements.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>4. Your Account</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>{" "}
              of any unauthorised use of your account.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>5. Subscription Plans & Billing</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Free Plan", "1 check per month at no charge. No credit card required. The governance assessment is also free and requires no payment."],
                ["Pro Plan", "£350/month standard price, currently offered at £149/month. Promotional pricing applies for as long as the offer is shown at checkout and existing subscribers are grandfathered at their original rate. Pricing may vary by location. Billed monthly via Stripe."],
                ["Growth Plan", "£1,200/month for most regions. Pricing may vary by location. Billed monthly via Stripe."],
                ["Sentinel Plan", "Custom pricing, agreed in writing before any charge is made. For larger engagements."],
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
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>6. One Off Purchases, Refunds and Cancellation Rights</h2>
            <div style={{ background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", lineHeight: 1.9 }}>One off digital purchases</p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                As well as subscriptions we sell individual digital products, including written reports and one off audits. These are delivered electronically. Reports are supplied as a PDF via a secure download link that remains valid for 7 days. If your link expires or fails, email{" "}
                <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>{" "}
                and we will reissue it at no charge. No account is required to buy a report.
              </p>

              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", lineHeight: 1.9, marginTop: "0.5rem" }}>Your 14 day cancellation right</p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                If you are a consumer, you normally have 14 days from purchase to cancel and receive a full refund under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                Because digital content is delivered immediately, we ask you at checkout to confirm two things before payment: that you want the content supplied straight away, and that you understand you lose the 14 day cancellation right once the download begins. <strong style={{ color: "white" }}>If you did not give that confirmation, your 14 day cancellation right still applies in full</strong> and we will refund you on request within that period, with no reason needed.
              </p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                As a matter of policy we extend the same 14 day right to business customers on one off digital purchases, even though it is not legally required.
              </p>

              <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "white", lineHeight: 1.9, marginTop: "0.5rem" }}>Subscription refunds</p>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                Subscriptions can be cancelled at any time and will run to the end of the paid period. For refunds on subscription charges, contact us within 14 days of the charge at{" "}
                <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", textDecoration: "none" }}>support@redflagaipro.com</a>{" "}
                with your account email and the reason. We will respond within 5 business days. We look favourably on billing errors, technical failures that prevented use, and accidental renewals. Approved refunds are returned to the original payment method within 5 to 10 business days.
              </p>

              <div style={{ background: "#102943", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "1.1rem", marginTop: "0.5rem" }}>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
                  <strong style={{ color: "#E5484D" }}>Your statutory rights.</strong> Nothing in these Terms removes or limits any right you have as a consumer under the Consumer Rights Act 2015 or the Consumer Contracts Regulations 2013. Where anything in this section conflicts with those rights, those rights take precedence.
                </p>
              </div>
            </div>
          </div>

          {/* 7 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>7. Acceptable Use</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "0.75rem" }}>You agree not to:</p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Use Red Flag AI Pro for any unlawful purpose",
                "Attempt to reverse engineer, scrape, or copy our platform",
                "Share your account credentials with others",
                "Submit content that is harmful, abusive, or violates third party rights",
                "Use our service to circumvent compliance regulations rather than comply with them",
              ].map((item) => (
                <li key={item} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>8. Intellectual Property</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              All content, branding, software, and technology on Red Flag AI Pro is the property of Red Flag AI Pro and is protected by applicable intellectual property laws. You retain ownership of any content you submit for checking. We do not use your submitted copy for any purpose other than generating and storing your check results. Where you have an account, submitted copy and results are retained so your check history remains available to you. Full detail of what we retain and for how long is in our{" "}
              <Link href="/privacy" style={{ color: "#E5484D", textDecoration: "none" }}>Privacy Policy</Link>.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>9. Limitation of Liability</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              To the fullest extent permitted by law, Red Flag AI Pro shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service, including but not limited to regulatory fines, lost revenue, or business interruption. Our total liability to you shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginTop: "0.75rem" }}>
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot lawfully be excluded or limited. If you are a consumer, nothing in these Terms affects your statutory rights, and the limitation above does not apply to the extent it would be unfair under the Consumer Rights Act 2015.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>10. Changes to These Terms</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              We may update these Terms from time to time. We will notify you of material changes by email or via an in app notice. Continued use of Red Flag AI Pro after changes constitutes acceptance of the updated Terms.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>11. Governing Law</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#E5484D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>12. Contact Us</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              For any questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#E5484D", fontWeight: 700, textDecoration: "none" }}>
                support@redflagaipro.com
              </a>
            </p>
          </div>

        </div>

        {/* Footer nav */}
        <div style={{ maxWidth: "720px", margin: "4rem auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", gap: "2rem" }}>
          <Link href="/privacy" style={{ ...syne, fontSize: "13px", color: "#E5484D", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/" style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
