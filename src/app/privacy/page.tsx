import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Red Flag AI Pro",
  description: "Privacy Policy for Red Flag AI Pro — how we collect, use and protect your data.",
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function PrivacyPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
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
          <h1 style={{ ...syne, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", background: "linear-gradient(160deg, #ffffff 0%, #e2e8f0 40%, #cc0000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Privacy Policy
          </h1>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Last updated: 12 June 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          {/* 1 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>1. Who We Are</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              Red Flag AI Pro (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at <strong style={{ color: "white" }}>www.redflagaipro.com</strong>. We are committed to protecting your personal data and complying with the UK GDPR, EU GDPR, and applicable data protection laws.
            </p>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginTop: "0.75rem" }}>
              For data protection queries, contact us at:{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "none" }}>support@redflagaipro.com</a>
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>2. What Data We Collect</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.08)" }}>
                    <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "left", padding: "0.75rem 1rem 0.75rem 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>Data</th>
                    <th style={{ ...syne, fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "left", padding: "0.75rem 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>Why we collect it</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Name & email address", "To create and manage your account"],
                    ["Payment information", "Processed securely by Stripe — we never store card details"],
                    ["Copy you submit for scanning", "To generate your compliance scan results only"],
                    ["Scan results and history", "To display your dashboard and scan history"],
                    ["Usage data (pages visited, features used)", "To improve our service"],
                    ["IP address", "For security and fraud prevention"],
                  ].map(([data, reason], i) => (
                    <tr key={data} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ ...syne, fontSize: "13px", color: "white", padding: "0.75rem 1rem 0.75rem 0", fontWeight: 600 }}>{data}</td>
                      <td style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", padding: "0.75rem 0", lineHeight: 1.6 }}>{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>3. Your Submitted Copy — Data Handling & Confidentiality</h2>
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                The marketing copy you paste into Red Flag AI Pro is used <strong style={{ color: "white" }}>solely to generate your scan results</strong>. This is your data. It remains your data. We do not:
              </p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Store your submitted copy beyond processing (removed after scan delivery unless you retain history)",
                  "Allow any human to view, access, or read your submitted copy",
                  "Use your copy to train AI models or improve our service",
                  "Share your copy with third parties for any reason",
                  "Retain your copy for longer than necessary to display your scan history",
                ].map((item) => (
                  <li key={item} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item}</li>
                ))}
              </ul>
              <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginTop: "0.75rem" }}>You can delete your scan history at any time from your dashboard. Deletion is permanent.</p>
              <p style={{ ...syne, fontSize: "12px", color: "#4ade80", lineHeight: 1.7, marginTop: "1rem", background: "rgba(74,222,128,0.08)", padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(74,222,128,0.15)" }}>
                <strong>Munir v SSHD Compliance:</strong> Red Flag operates under contractual terms that prohibit human review, training, or onward disclosure of your data. This satisfies the data handling requirements established in the Munir ruling and is equivalent to closed-enterprise AI tools.
              </p>
            </div>
          </div>

          {/* 4 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>4. Legal Basis for Processing (UK & EU GDPR)</h2>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Contract", "Processing your account data and scans to deliver the service you signed up for"],
                ["Legitimate interests", "Improving our service, preventing fraud, ensuring security"],
                ["Legal obligation", "Retaining billing records as required by law"],
                ["Consent", "Marketing emails — you can unsubscribe at any time"],
                ["Consent", "Sharing conversion data with Google Ads for advertising measurement and Customer Match — you can opt out via Google's Ads Settings"],
              ].map(([label, text]) => (
                <li key={label as string} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  <strong style={{ color: "white" }}>{label}:</strong> {text}
                </li>
              ))}
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>5. Third Parties We Use</h2>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Supabase", "Database and authentication (data stored in EU region)"],
                ["Stripe", "Payment processing (PCI DSS compliant)"],
                ["Vercel", "Website hosting"],
                ["OpenAI / Anthropic", "AI processing of scan requests"],
                ["Google Ads", "Conversion data (e.g. signups) may be shared with Google to measure ad performance and show our ads to similar audiences (Customer Match). You can opt out via Google's Ads Settings."],
              ].map(([label, text]) => (
                <li key={label as string} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  <strong style={{ color: "white" }}>{label}</strong> — {text}
                </li>
              ))}
            </ul>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginTop: "0.75rem" }}>All third parties are bound by appropriate data processing agreements.</p>
          </div>

          {/* 6 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>6. How Long We Keep Your Data</h2>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Account data: retained while your account is active and for 30 days after deletion",
                "Billing records: 7 years as required by UK law",
                "Scan history: retained until you delete it or close your account",
              ].map((item) => (
                <li key={item} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>7. Your Rights</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: "0.75rem" }}>Under UK and EU GDPR, you have the right to:</p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                ["Access", "Request a copy of your personal data"],
                ["Rectification", "Correct inaccurate data"],
                ["Erasure", "Request deletion of your data (right to be forgotten)"],
                ["Portability", "Receive your data in a portable format"],
                ["Object", "Object to processing based on legitimate interests"],
                ["Restrict", "Request we limit how we process your data"],
              ].map(([label, text]) => (
                <li key={label as string} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  <strong style={{ color: "white" }}>{label}</strong> — {text}
                </li>
              ))}
            </ul>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginTop: "0.75rem" }}>
              To exercise any of these rights, email{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", textDecoration: "none" }}>support@redflagaipro.com</a>.
              {" "}We will respond within 30 days.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>8. Cookies</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              We use essential cookies for authentication and session management. No cookie consent banner is required for essential cookies under UK GDPR.
            </p>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginTop: "0.75rem" }}>
              We also use Google Ads conversion tracking to measure the performance of our advertising and to share conversion data with Google for Customer Match (showing ads to existing and similar potential customers). You can opt out of personalised advertising at any time via{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444", textDecoration: "none" }}>Google&apos;s Ads Settings</a>.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>9. Data Security</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              We implement industry-standard security measures including encrypted data storage, HTTPS, and access controls. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>10. Changes to This Policy</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              We may update this Privacy Policy periodically. We will notify you of significant changes by email. Continued use of Red Flag AI Pro after changes constitutes acceptance.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>11. Complaints</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              If you are unhappy with how we handle your data, you have the right to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444", textDecoration: "none" }}>ico.org.uk</a>.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>12. Contact</h2>
            <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
              For any privacy questions:{" "}
              <a href="mailto:support@redflagaipro.com" style={{ color: "#ef4444", fontWeight: 700, textDecoration: "none" }}>
                support@redflagaipro.com
              </a>
            </p>
          </div>

        </div>

        {/* Footer nav */}
        <div style={{ maxWidth: "720px", margin: "4rem auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", display: "flex", gap: "2rem" }}>
          <Link href="/terms" style={{ ...syne, fontSize: "13px", color: "#ef4444", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/" style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
        </div>
      </section>
    </div>
  );
}
