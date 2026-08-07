import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotarySeal } from "@/components/tools/NotarySeal";
import React from "react";

export const metadata: Metadata = {
  title: "Payment Notary: Seal Bank Details Before You Pay",
  description: "Free, no account needed. Seal payment or bank details when you first receive them, so if they change later — a classic invoice fraud move — you have an independently timestamped record of the original.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/payment-notary" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

export default function PaymentNotaryPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem" }}>Free, no account needed</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Payment <span style={{ fontStyle: "italic", color: "#E5484D" }}>Notary</span>
          </h1>
          <p style={{ ...syne, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Seal a supplier or landlord&apos;s bank details the first time you receive them. If an email later arrives saying &quot;our bank details have changed,&quot; check it against the seal before you pay a penny. That switch is one of the most common invoice fraud moves there is.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem 3rem" }}>
        <NotarySeal
          placeholder="Paste the payment details exactly as given to you — account name, sort code, account number or IBAN."
          sealLabel="Seal these details →"
          verifyHelp="Before you pay, paste the details exactly as they now appear (from the new email or invoice) and the Seal ID from when you first sealed them. If they don't match, stop and call the supplier on a known number before paying."
        />
      </section>

      <section style={{ padding: "3rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>Your bank details never leave your browser</p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75, marginBottom: "1rem" }}>
            The account name, sort code and number you paste are hashed on your own device before anything is sent. Red Flag never receives or stores the actual numbers, only a fingerprint of them, sealed with an independent third party timestamp. Nobody, including us, can read back what you sealed.
          </p>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.75 }}>
            This is a fingerprint match, not a bank verification service — it tells you whether the details match what you sealed before, not whether an account is genuine. If they don&apos;t match, that is the signal to stop and check by phone before paying.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
