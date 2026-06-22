"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import React from "react";
import { ResultsGate } from "./ResultsGate";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

type Relationship = "affiliate" | "sponsored" | "gifted" | "income";
type Jurisdiction = "us" | "uk";
type Platform = "instagram" | "tiktok" | "youtube" | "email" | "page";

const RELATIONSHIPS: { value: Relationship; label: string; hint: string }[] = [
  { value: "affiliate", label: "Affiliate link", hint: "You earn a commission on sales" },
  { value: "sponsored", label: "Sponsored / paid partnership", hint: "A brand paid you to post" },
  { value: "gifted", label: "Gifted / free product", hint: "You received it free, no payment" },
  { value: "income", label: "Income or earnings claim", hint: "You're sharing results or earnings" },
];

const JURISDICTIONS: { value: Jurisdiction; label: string }[] = [
  { value: "us", label: "United States: FTC" },
  { value: "uk", label: "United Kingdom: ASA / CMA" },
];

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "email", label: "Email / newsletter" },
  { value: "page", label: "Sales page / blog post" },
];

const BRAND_TOKEN = "[Brand]";

const DISCLOSURE_TEXT: Record<Jurisdiction, Record<Relationship, string>> = {
  us: {
    affiliate:
      `Ad: this post contains affiliate links. If you buy through one of them, I may earn a commission at no extra cost to you.`,
    sponsored:
      `This post is sponsored by ${BRAND_TOKEN}. I was compensated to share it, and everything I'm saying is my honest opinion.`,
    gifted:
      `${BRAND_TOKEN} sent me this for free to try. I wasn't paid to post about it, but I want to be upfront that I didn't buy it myself.`,
    income:
      `Results mentioned here are not typical and are not a guarantee of what you'll achieve. Outcomes vary based on effort, experience, market conditions and other factors.`,
  },
  uk: {
    affiliate:
      `Ad: this post contains affiliate links. I earn a commission if you buy through them, at no extra cost to you.`,
    sponsored:
      `Ad: this is a paid partnership with ${BRAND_TOKEN}.`,
    gifted:
      `Gifted: ${BRAND_TOKEN} sent me this to try for free. This isn't a paid partnership, but I wanted to be upfront that it wasn't something I bought myself.`,
    income:
      `Income examples shown are not typical. Your results will depend on your own effort, your market, and other factors outside our control. There's no guarantee you'll achieve the same.`,
  },
};

const PLACEMENT_TIPS: Record<Platform, string> = {
  instagram:
    "Put this at the very start of your caption, not after a block of hashtags, and use Instagram's \"Paid partnership\" label too if it's a brand deal. The label alone usually isn't considered enough on its own.",
  tiktok:
    "Say it out loud in the first few seconds of the video AND show it as on screen text for at least 3 to 4 seconds. Turn on TikTok's \"Branded content\" toggle for any paid partnership.",
  youtube:
    "Say it verbally in the first 30 to 60 seconds of the video, and also switch on YouTube's paid promotion disclosure toggle. Don't rely on the description box alone, most viewers never open it.",
  email:
    "Place it near the top of the email, before the first product mention or link, not tucked away in a footer that most subscribers will never scroll to.",
  page:
    "Place it clearly near the top of the page, or directly next to the relevant link or claim, not only on a separate \"disclosures\" page linked from the footer.",
};

export function DisclosureGenerator() {
  const [relationship, setRelationship] = useState<Relationship>("affiliate");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("us");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [brand, setBrand] = useState("");
  const [copied, setCopied] = useState(false);

  const disclosureText = useMemo(() => {
    const base = DISCLOSURE_TEXT[jurisdiction][relationship];
    if (!brand.trim()) return base;
    return base.split(BRAND_TOKEN).join(brand.trim());
  }, [jurisdiction, relationship, brand]);

  const showBrandField = relationship === "sponsored" || relationship === "gifted";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(disclosureText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — silently ignore, text is selectable anyway
    }
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    background: "#0F2138",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.9)",
    ...syne,
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "6px",
    appearance: "none",
  };

  const labelStyle: React.CSSProperties = {
    ...syne,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "0.6rem",
    display: "block",
  };

  return (
    <div>
      {/* Controls */}
      <div style={{
        background: "#0F2138",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "2rem",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)"
      }}>
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={labelStyle}>What's the relationship?</label>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value as Relationship)} style={selectStyle}>
              {RELATIONSHIPS.map((r) => (
                <option key={r.value} value={r.value} style={{ background: "#0F2138" }}>{r.label}</option>
              ))}
            </select>
            <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
              {RELATIONSHIPS.find((r) => r.value === relationship)?.hint}
            </p>
          </div>

          <div>
            <label style={labelStyle}>Which rules apply to you?</label>
            <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)} style={selectStyle}>
              {JURISDICTIONS.map((j) => (
                <option key={j.value} value={j.value} style={{ background: "#0F2138" }}>{j.label}</option>
              ))}
            </select>
            <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
              Pick where your audience is mainly based, not just where you live.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Where will you post this?</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} style={selectStyle}>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value} style={{ background: "#0F2138" }}>{p.label}</option>
              ))}
            </select>
          </div>

          {showBrandField && (
            <div>
              <label style={labelStyle}>Brand name (optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Acme Skincare"
                style={selectStyle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Output */}
      <ResultsGate tool="disclosure-generator" title="Enter your email to see your disclosure wording. Free, no spam.">
      <div style={{ marginTop: "1.5rem" }}>
        <div style={{
          background: "#102943",
          border: "1px solid rgba(239,68,68,0.2)",
          borderLeft: "3px solid #ef4444",
          padding: "1.5rem 1.75rem",
        }}>
          <p style={labelStyle}>Your disclosure wording</p>
          <p style={{ ...mono, fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            &ldquo;{disclosureText}&rdquo;
          </p>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? "rgba(74,222,128,0.12)" : "#E5484D",
              color: copied ? "#4ade80" : "white",
              border: copied ? "1px solid rgba(74,222,128,0.3)" : "none",
              ...syne,
              fontSize: "0.85rem",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: "9999px",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s",
            }}
          >
            {copied ? "Copied ✓" : "Copy to clipboard"}
          </button>
        </div>

        <div style={{
          background: "#0D1B2E",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "1.5rem 1.75rem",
          marginTop: "2px",
        }}>
          <p style={{ ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fbbf24", marginBottom: "0.6rem" }}>
            Where to put it on {PLATFORMS.find((p) => p.value === platform)?.label}
          </p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
            {PLACEMENT_TIPS[platform]}
          </p>
        </div>
      </div>
      </ResultsGate>

      {/* CTA */}
      <div style={{
        background: "#102943",
        border: "1px solid rgba(239,68,68,0.25)",
        padding: "2.25rem 2rem",
        textAlign: "center",
        marginTop: "1.5rem",
      }}>
        <p style={{ ...syne, fontSize: "1.1rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
          This disclosure is one piece of the puzzle.
        </p>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "440px", margin: "0.5rem auto 1.5rem" }}>
          The rest of your caption, script or sales page can carry its own risk: health claims, income promises, fake urgency and more. Paste it in and get a full compliance score, free.
        </p>
        <Link href="/#demo" style={{
          display: "inline-block",
          background: "#E5484D",
          color: "white",
          ...syne,
          fontSize: "0.9rem",
          fontWeight: 700,
          padding: "14px 32px",
          borderRadius: "9999px",
          boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}>
          Scan your full copy: free
        </Link>
      </div>

      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: 1.7, marginTop: "1.5rem", textAlign: "center" }}>
        This tool gives general guidance, not legal advice. Rules vary by platform, country and your specific situation. When in doubt, check the FTC&apos;s{" "}
        <a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444", textDecoration: "none" }}>
          Disclosures 101
        </a>{" "}
        guidance or the ASA&apos;s influencer guidance directly.
      </p>
    </div>
  );
}
