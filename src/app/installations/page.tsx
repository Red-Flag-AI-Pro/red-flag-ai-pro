import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Installations & Custom Work — Red Flag AI Pro",
  description:
    "One time engagements, not subscriptions: hosted witnessing, your own installable witness node, and other work we do once and hand over, priced separately from the Pro, Growth, and Sentinel plans.",
  alternates: { canonical: "https://www.redflagaipro.com/installations" },
  openGraph: {
    title: "Installations & Custom Work — Red Flag AI Pro",
    description: "One time engagements, priced separately from the standing plans.",
    url: "https://www.redflagaipro.com/installations",
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

const CONTACT_HREF =
  "mailto:support@redflagaipro.com?subject=" +
  encodeURIComponent("Custom work enquiry") +
  "&body=" +
  encodeURIComponent("Hi James,\n\nWe need something that isn't on the installations page yet.\n\nWhat we need:\n\n");

type Item = {
  name: string;
  tagline: string;
  summary: string;
  priceLabel: string;
  price: string;
  priceNote?: string;
  href: string;
};

const ITEMS: Item[] = [
  {
    name: "Hosted Witnessing",
    tagline: "We install it, host it, and hand you a dashboard",
    summary:
      "For a team that knows it needs independent proof but has nobody available to wire up the raw API. We work out what needs witnessing, install the connection, host your dashboard, and hand over a sealed quarterly compilation.",
    priceLabel: "Install once, hosted quarterly",
    price: "£995–£1,495 + £450–£750/quarter",
    priceNote: "or included at no extra charge inside Sentinel",
    href: "/witness-network/hosting",
  },
  {
    name: "Install Your Own Node",
    tagline: "The package runs on your infrastructure, not ours",
    summary:
      "For a team that has decided the chain itself, not just the sealed proof, has to live on infrastructure it controls. A standalone package, no dependencies, that seals your own events and can anchor into the wider network as a real peer.",
    priceLabel: "License once, support optional",
    price: "£2,500–£4,000 + £250–£400/month",
    priceNote: "support is optional, not required to keep running",
    href: "/witness-network/install",
  },
  {
    name: "Signed Decision Bundles, Your Own Key",
    tagline: "Prove a decision without trusting us at all",
    summary:
      "Sentinel already exports Real-Time Gate decisions signed with Red Flag's own Ed25519 key, offline verifiable, no account or network access needed to check one. This is the same capability built on a key that's yours, not ours, generated for your account, so verifying a bundle never has to trust Red Flag at all, only the math. No monthly fee: once the key exists and the export route works, there is nothing ongoing to host or run.",
    priceLabel: "Added to Install Your Own Node, or on its own",
    price: "£500–£750 as an add on, £1,500–£2,000 standalone",
    priceNote: "one time only, no recurring charge",
    href: "/real-time-gate",
  },
];

function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={item.href}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "1.75rem",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.02)",
        transition: "border-color 0.15s ease",
      }}
    >
      <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.6rem" }}>
        {item.tagline}
      </p>
      <h3 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>
        {item.name}
      </h3>
      <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.6)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
        {item.summary}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.1rem" }}>
        <div>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,241,234,0.4)", marginBottom: "0.3rem" }}>
            {item.priceLabel}
          </p>
          <p style={{ ...syne, fontSize: "1.15rem", fontWeight: 800, color: "#F4F1EA" }}>{item.price}</p>
          {item.priceNote && (
            <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.45)", marginTop: "0.25rem" }}>{item.priceNote}</p>
          )}
        </div>
        <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#E5484D" }}>See details →</span>
      </div>
    </Link>
  );
}

export default function InstallationsPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>One time, not a subscription</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.12, marginBottom: "1rem" }}>
            Installations & <span style={{ fontStyle: "italic", color: "#E5484D" }}>custom work</span>.
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
            Everything on the <Link href="/pricing" style={{ color: "#E5484D" }}>pricing page</Link> is a plan you sign up for. This is the other list: real work billed once, sometimes with an optional ongoing piece, for the part of the job that has to be done for you rather than switched on.
          </p>
        </div>
      </section>

      <section style={{ padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {ITEMS.map((item) => (
            <ItemCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem 5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>Need something that isn&apos;t listed?</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            This list grows as real requests come in. If what you need doesn&apos;t fit either option above, say so directly.
          </p>
          <a href={CONTACT_HREF} style={{
            display: "inline-block", background: "#E5484D", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px",
            borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none", letterSpacing: "0.02em",
          }}>
            Email support@redflagaipro.com →
          </a>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...mono, fontSize: "11px", color: "rgba(244,241,234,0.3)" }}>
          See also <Link href="/witness-network" style={{ color: "#C9A66B" }}>the Witness Network</Link>,{" "}
          <Link href="/pricing" style={{ color: "#C9A66B" }}>standing plans</Link> and{" "}
          <Link href="/sentinel" style={{ color: "#C9A66B" }}>Sentinel</Link>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
