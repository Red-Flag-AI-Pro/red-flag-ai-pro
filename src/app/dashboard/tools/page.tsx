"use client";

import { useState } from "react";
import { RiskCalculator } from "@/components/marketing/RiskCalculator";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

/* ─── Disclaimer Generator ─── */
const DISCLAIMER_TYPES = [
  {
    id: "income",
    label: "Income / Earnings Claim",
    disclaimer: `Individual results will vary. The income figures mentioned are not typical and are not a guarantee of results. Your results will depend on many factors including your experience, skills, effort, and market conditions. There is no assurance that any prior successes or past results as to income earnings can be used as an indication of your future success or results.`,
  },
  {
    id: "health",
    label: "Health / Supplement Claim",
    disclaimer: `These statements have not been evaluated by the Food and Drug Administration (FDA) or the Medicines and Healthcare products Regulatory Agency (MHRA). This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Consult your healthcare professional before use.`,
  },
  {
    id: "testimonial",
    label: "Testimonial / Case Study",
    disclaimer: `Results shown are individual case studies and are not typical. Your results will vary and depend on many unique factors. These testimonials may have been edited for brevity. We cannot guarantee you will achieve similar results.`,
  },
  {
    id: "investment",
    label: "Investment / Financial Claim",
    disclaimer: `Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal. This is not financial advice. Please consult a qualified financial adviser before making any investment decisions.`,
  },
  {
    id: "guarantee",
    label: "Money-Back Guarantee",
    disclaimer: `Our guarantee is subject to our full Terms & Conditions. Refunds are processed within 10 business days of request. Guarantee applies to first-time purchases only. Digital downloads are excluded once accessed.`,
  },
];

function DisclaimerGenerator() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(DISCLAIMER_TYPES[selected].disclaimer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>What type of claim are you making?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {DISCLAIMER_TYPES.map((d, i) => (
            <button key={d.id} onClick={() => setSelected(i)} style={{ ...syne, fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "9999px", cursor: "pointer", border: `1px solid ${selected === i ? "#ef4444" : "rgba(255,255,255,0.1)"}`, background: selected === i ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)", color: selected === i ? "#fca5a5" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "4px" }}>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>{DISCLAIMER_TYPES[selected].disclaimer}</p>
      </div>
      <button onClick={copy} style={{ ...syne, fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "11px", borderRadius: "9999px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: copied ? "#4ade80" : "rgba(255,255,255,0.6)", width: "100%", transition: "all 0.2s" }}>
        {copied ? "✓ Copied to clipboard" : "Copy disclaimer"}
      </button>
    </div>
  );
}

/* ─── Testimonial Checker ─── */
function TestimonialChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | { issues: string[]; safe: boolean }>(null);

  const check = () => {
    const issues: string[] = [];
    const t = text.toLowerCase();
    if (/\d+[k%]|\d{4,}/.test(t)) issues.push("Contains specific numbers — add 'results not typical' disclaimer");
    if (/guarantee|guaranteed/.test(t)) issues.push("'Guaranteed' language requires documented proof");
    if (/always|never|every|all/.test(t)) issues.push("Absolute claims ('always', 'never') are high-risk under FTC rules");
    if (!/results (may|will) vary|not typical|individual results/.test(t) && text.length > 20) issues.push("Missing 'results may vary' or 'individual results' caveat");
    if (/paid|sponsored|ad\b|#ad/.test(t) === false && /@\w+/.test(t)) issues.push("Influencer/social testimonial may need #ad or #sponsored disclosure");
    if (text.length < 10) return;
    setResult({ issues, safe: issues.length === 0 });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Paste the testimonial here..." rows={5} style={{ ...syne, fontSize: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "1rem", borderRadius: "4px", resize: "vertical", outline: "none", lineHeight: 1.6 }} />
      <button onClick={check} disabled={text.length < 10} style={{ ...syne, fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "11px", borderRadius: "9999px", cursor: text.length >= 10 ? "pointer" : "not-allowed", border: "none", background: text.length >= 10 ? "#cc0000" : "rgba(255,255,255,0.05)", color: "white", transition: "all 0.2s" }}>
        Check testimonial
      </button>
      {result && (
        <div style={{ background: result.safe ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${result.safe ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, padding: "1.25rem", borderRadius: "4px" }}>
          {result.safe ? (
            <p style={{ ...syne, fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>✓ No obvious issues found — looks good</p>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.issues.map((issue, i) => (
                <li key={i} style={{ ...syne, fontSize: "12px", color: "#fca5a5", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>✕</span>{issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Email Compliance Checker ─── */
function EmailComplianceChecker() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<null | string[]>(null);

  const check = () => {
    const issues: string[] = [];
    const s = subject.toLowerCase();
    const b = body.toLowerCase();
    if (/re:|fwd:|fw:/.test(s) && !/reply|forward/i.test(subject)) issues.push("Fake RE: or FW: in subject line violates CAN-SPAM and CASL");
    if (/free|winner|urgent|act now|limited|!!/.test(s)) issues.push("Subject line contains spam trigger words — high risk of filtering + regulatory attention");
    if (!/unsubscribe|opt.?out|remove me/.test(b)) issues.push("Missing unsubscribe mechanism — required by CAN-SPAM, CASL and GDPR");
    if (!/\d+.{3,30},.{2,20},.{2,10}/.test(b) && !/address|street|postal|postcode|zip/.test(b)) issues.push("Missing physical postal address — required by CAN-SPAM");
    if (/guaranteed|100%|no risk/.test(b)) issues.push("Absolute guarantee language in body — ensure it matches actual terms");
    if (!subject && !body) return;
    setResult(issues);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <input value={subject} onChange={(e) => { setSubject(e.target.value); setResult(null); }} placeholder="Email subject line..." style={{ ...syne, fontSize: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "12px 1rem", borderRadius: "4px", outline: "none" }} />
      <textarea value={body} onChange={(e) => { setBody(e.target.value); setResult(null); }} placeholder="Email body (paste key sections)..." rows={5} style={{ ...syne, fontSize: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "1rem", borderRadius: "4px", resize: "vertical", outline: "none", lineHeight: 1.6 }} />
      <button onClick={check} disabled={!subject && !body} style={{ ...syne, fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "11px", borderRadius: "9999px", cursor: (subject || body) ? "pointer" : "not-allowed", border: "none", background: (subject || body) ? "#cc0000" : "rgba(255,255,255,0.05)", color: "white", transition: "all 0.2s" }}>
        Check email compliance
      </button>
      {result && (
        <div style={{ background: result.length === 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${result.length === 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, padding: "1.25rem", borderRadius: "4px" }}>
          {result.length === 0 ? (
            <p style={{ ...syne, fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>✓ No issues found — looks compliant</p>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.map((issue, i) => (
                <li key={i} style={{ ...syne, fontSize: "12px", color: "#fca5a5", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>✕</span>{issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Urgency Claim Validator ─── */
const URGENCY_CHECKS = [
  { id: "real_stock", label: "Limited stock — this reflects actual inventory levels" },
  { id: "real_deadline", label: "Deadline — the offer genuinely ends at this time" },
  { id: "no_reset", label: "The countdown timer does NOT reset after it expires" },
  { id: "no_fake_spots", label: "'Limited spots' reflects real capacity, not a sales tactic" },
  { id: "documented", label: "I can document the scarcity if a regulator asks" },
];

function UrgencyValidator() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setChecks((c) => ({ ...c, [id]: !c[id] }));
  const score = Object.values(checks).filter(Boolean).length;
  const color = score === 5 ? "#4ade80" : score >= 3 ? "#fbbf24" : "#ef4444";
  const verdict = score === 5 ? "✓ Your urgency claim appears legally defensible" : score >= 3 ? "⚠ Partial — resolve the unchecked items before publishing" : "✕ High risk — this urgency claim could trigger regulatory action";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Check every statement that applies to your urgency claim:</p>
      {URGENCY_CHECKS.map((c) => (
        <div key={c.id} onClick={() => toggle(c.id)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: checks[c.id] ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${checks[c.id] ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`, padding: "12px 14px", borderRadius: "4px", transition: "all 0.2s" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${checks[c.id] ? "#4ade80" : "rgba(255,255,255,0.2)"}`, background: checks[c.id] ? "#4ade80" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {checks[c.id] && <span style={{ fontSize: "11px", color: "#000", fontWeight: 700 }}>✓</span>}
          </div>
          <p style={{ ...syne, fontSize: "12px", color: checks[c.id] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)" }}>{c.label}</p>
        </div>
      ))}
      <div style={{ background: `rgba(0,0,0,0.3)`, border: `1px solid ${color}33`, padding: "1rem 1.25rem", borderRadius: "4px", marginTop: "4px" }}>
        <p style={{ ...mono, fontSize: "1.5rem", fontWeight: 700, color, marginBottom: "4px" }}>{score}/5</p>
        <p style={{ ...syne, fontSize: "12px", color, fontWeight: 600 }}>{verdict}</p>
      </div>
    </div>
  );
}

/* ─── Health Claim Risk Rater ─── */
const HIGH_RISK = ["cure", "treat", "prevent", "heal", "reverse", "eliminate", "guaranteed", "clinically proven", "scientifically proven", "fda approved", "100%", "instant", "overnight", "miracle"];
const MED_RISK = ["boost", "improve", "support", "enhance", "promote", "help", "natural", "organic", "pure", "powerful", "effective", "results"];

function HealthClaimRater() {
  const [claim, setClaim] = useState("");
  const analyze = () => {
    const t = claim.toLowerCase();
    const high = HIGH_RISK.filter((w) => t.includes(w));
    const med = MED_RISK.filter((w) => t.includes(w));
    return { high, med };
  };
  const { high, med } = claim ? analyze() : { high: [], med: [] };
  const level = high.length > 0 ? "HIGH" : med.length > 1 ? "MODERATE" : claim.length > 10 ? "LOW" : null;
  const color = level === "HIGH" ? "#ef4444" : level === "MODERATE" ? "#fbbf24" : "#4ade80";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <textarea value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="Paste your health or wellness claim here..." rows={4} style={{ ...syne, fontSize: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "1rem", borderRadius: "4px", resize: "vertical", outline: "none", lineHeight: 1.6 }} />
      {level && (
        <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${color}33`, padding: "1.25rem", borderRadius: "4px" }}>
          <p style={{ ...mono, fontSize: "1.75rem", fontWeight: 700, color, marginBottom: "8px" }}>{level} RISK</p>
          {high.length > 0 && <p style={{ ...syne, fontSize: "12px", color: "#fca5a5", marginBottom: "6px" }}>High-risk words: <strong>{high.join(", ")}</strong> — these may constitute drug claims under FDA/MHRA rules without clinical evidence</p>}
          {med.length > 0 && <p style={{ ...syne, fontSize: "12px", color: "#fde047" }}>Moderate-risk words: <strong>{med.join(", ")}</strong> — ensure you have substantiation for these</p>}
          {level === "LOW" && <p style={{ ...syne, fontSize: "12px", color: "#4ade80" }}>No high-risk terms detected — still add appropriate disclaimers if making any health claim</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Red Flag Checklist (Buyers) ─── */
const RED_FLAG_QUESTIONS = [
  { q: "Did they show earnings screenshots or income figures?", weight: 2 },
  { q: "Was there a countdown timer or 'only X spots left'?", weight: 2 },
  { q: "Did they claim results are 'guaranteed'?", weight: 2 },
  { q: "Were testimonials shown without 'results not typical'?", weight: 1 },
  { q: "Did they compare themselves to a named competitor?", weight: 1 },
  { q: "Is the refund policy hard to find or conditional?", weight: 2 },
  { q: "Did they use phrases like 'as seen on BBC/Forbes'?", weight: 1 },
  { q: "Were health or weight-loss results promised?", weight: 2 },
  { q: "Is the price crossed out or shown as 'was £X, now £Y'?", weight: 1 },
  { q: "Were there celebrity endorsements without clear #ad?", weight: 1 },
];

function RedFlagChecklist() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setAnswers((a) => ({ ...a, [i]: !a[i] }));
  const score = RED_FLAG_QUESTIONS.reduce((s, q, i) => s + (answers[i] ? q.weight : 0), 0);
  const maxScore = RED_FLAG_QUESTIONS.reduce((s, q) => s + q.weight, 0);
  const pct = Math.round((score / maxScore) * 100);
  const color = pct < 20 ? "#4ade80" : pct < 50 ? "#fbbf24" : "#ef4444";
  const verdict = pct < 20 ? "Looks relatively clean — proceed with caution" : pct < 50 ? "Several yellow flags — research further before buying" : "Multiple red flags — high risk of misleading marketing";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Check every item that applies to the offer you're evaluating:</p>
      {RED_FLAG_QUESTIONS.map((item, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: answers[i] ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${answers[i] ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`, padding: "11px 14px", borderRadius: "4px", transition: "all 0.2s" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${answers[i] ? "#ef4444" : "rgba(255,255,255,0.2)"}`, background: answers[i] ? "#ef4444" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {answers[i] && <span style={{ fontSize: "11px", color: "white", fontWeight: 700 }}>✓</span>}
          </div>
          <p style={{ ...syne, fontSize: "12px", color: answers[i] ? "#fca5a5" : "rgba(255,255,255,0.45)", flex: 1 }}>{item.q}</p>
          {item.weight > 1 && <span style={{ ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "#ef4444", opacity: 0.6 }}>HIGH RISK</span>}
        </div>
      ))}
      {Object.keys(answers).length > 0 && (
        <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${color}33`, padding: "1.25rem", borderRadius: "4px", marginTop: "4px" }}>
          <p style={{ ...mono, fontSize: "1.75rem", fontWeight: 700, color, marginBottom: "4px" }}>{pct}% risk</p>
          <p style={{ ...syne, fontSize: "12px", color, fontWeight: 600 }}>{verdict}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Refund Rights Checker ─── */
const REFUND_RIGHTS: Record<string, Record<string, string>> = {
  "UK": {
    "Physical product": "14-day right to cancel (Consumer Contracts Regulations). Full refund including standard delivery. No reason needed.",
    "Digital product": "No automatic right once download starts — unless seller's fault. Check their policy.",
    "Service": "14 days to cancel if ordered online. Reduced right if service has started.",
    "Course / coaching": "14 days from purchase if no digital content accessed. Strongly check T&Cs before buying.",
  },
  "EU": {
    "Physical product": "14-day cooling-off period under EU Consumer Rights Directive. Seller pays return postage.",
    "Digital product": "Right to cancel within 14 days unless download has begun with your explicit consent.",
    "Service": "14-day right to cancel. Partial refund if service has started.",
    "Course / coaching": "14-day right. Waived if content accessed with your consent.",
  },
  "USA": {
    "Physical product": "No federal law — varies by state and retailer policy. FTC requires sellers to state their policy clearly.",
    "Digital product": "No federal requirement. Subject to seller policy. Check before purchasing.",
    "Service": "No federal cooling-off for most services. 3-day right for door-to-door sales.",
    "Course / coaching": "No federal right. Rely on seller's stated refund policy — screenshot it before buying.",
  },
  "Australia": {
    "Physical product": "ACL guarantees repair, replacement or refund for faulty goods. No time limit for major failures.",
    "Digital product": "ACL applies if product is not fit for purpose. Seller cannot exclude consumer guarantees.",
    "Service": "Services must be provided with due care. Right to remedy if not.",
    "Course / coaching": "Consumer guarantees apply. Refund if course not as described or not fit for purpose.",
  },
  "Canada": {
    "Physical product": "Varies by province. Ontario: 7-day cooling off for direct sales. Check provincial consumer protection law.",
    "Digital product": "No federal cooling off. Subject to seller policy.",
    "Service": "Province-dependent. Most have cooling off for certain contract types.",
    "Course / coaching": "Check provincial rules — many provinces have specific protections for training contracts.",
  },
};

function RefundRightsChecker() {
  const [country, setCountry] = useState("");
  const [productType, setProductType] = useState("");
  const countries = Object.keys(REFUND_RIGHTS);
  const types = country ? Object.keys(REFUND_RIGHTS[country]) : [];
  const result = country && productType ? REFUND_RIGHTS[country]?.[productType] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <label style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "6px" }}>Your country</label>
        <select value={country} onChange={(e) => { setCountry(e.target.value); setProductType(""); }} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", ...syne, fontSize: "13px", padding: "10px 12px", borderRadius: "4px", cursor: "pointer", outline: "none", appearance: "none" as const }}>
          <option value="" style={{ background: "#111" }}>Select country...</option>
          {countries.map((c) => <option key={c} value={c} style={{ background: "#111" }}>{c}</option>)}
        </select>
      </div>
      {country && (
        <div>
          <label style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "6px" }}>What did you buy?</label>
          <select value={productType} onChange={(e) => setProductType(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", ...syne, fontSize: "13px", padding: "10px 12px", borderRadius: "4px", cursor: "pointer", outline: "none", appearance: "none" as const }}>
            <option value="" style={{ background: "#111" }}>Select type...</option>
            {types.map((t) => <option key={t} value={t} style={{ background: "#111" }}>{t}</option>)}
          </select>
        </div>
      )}
      {result && (
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", padding: "1.25rem", borderRadius: "4px" }}>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", marginBottom: "8px" }}>Your rights in {country}</p>
          <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{result}</p>
          <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "10px" }}>Not legal advice. For specific disputes, contact your national consumer protection authority.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Influencer Disclosure Checker ─── */
function InfluencerDisclosureChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; issues: string[] }>(null);

  const check = () => {
    const t = text.toLowerCase();
    const issues: string[] = [];
    const hasDisclosure = /#ad\b|#sponsored\b|#paid\b|#gifted\b|paid partnership|sponsored by|in partnership with|#collab/i.test(text);
    if (!hasDisclosure) issues.push("No clear paid partnership disclosure found — #ad, #sponsored, or 'paid partnership' required by FTC and ASA");
    if (/#ad/.test(text) && text.indexOf("#ad") > 100) issues.push("#ad must appear prominently — placing it at the end or buried in hashtags is not sufficient under FTC guidelines");
    if (/\(ad\)|\[ad\]/i.test(text)) issues.push("(ad) in brackets may not be sufficient — FTC and ASA prefer clear #ad or 'paid partnership' labels");
    if (/gifted|pr product|pr gift/i.test(text) && !/#gifted/i.test(text)) issues.push("Gifted products require clear #gifted disclosure even if no payment was made (ASA CAP Code)");
    setResult({ ok: issues.length === 0, issues });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Paste the post caption or ad copy here..." rows={5} style={{ ...syne, fontSize: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "1rem", borderRadius: "4px", resize: "vertical", outline: "none", lineHeight: 1.6 }} />
      <button onClick={check} disabled={text.length < 10} style={{ ...syne, fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "11px", borderRadius: "9999px", cursor: text.length >= 10 ? "pointer" : "not-allowed", border: "none", background: text.length >= 10 ? "#cc0000" : "rgba(255,255,255,0.05)", color: "white", transition: "all 0.2s" }}>
        Check disclosure
      </button>
      {result && (
        <div style={{ background: result.ok ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${result.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, padding: "1.25rem", borderRadius: "4px" }}>
          {result.ok
            ? <p style={{ ...syne, fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>✓ Disclosure looks compliant</p>
            : <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{result.issues.map((i, idx) => <li key={idx} style={{ ...syne, fontSize: "12px", color: "#fca5a5", display: "flex", gap: "8px" }}><span style={{ color: "#ef4444", flexShrink: 0 }}>✕</span>{i}</li>)}</ul>
          }
        </div>
      )}
    </div>
  );
}

/* ─── Tool definitions ─── */
const TOOLS = [
  { id: "risk-calculator", label: "Risk Calculator", tag: "Sellers & Buyers", desc: "Calculate your personal compliance exposure — seller fines or buyer losses." },
  { id: "disclaimer-generator", label: "Disclaimer Generator", tag: "Sellers", desc: "Get the right legal disclaimer for your claim type — income, health, testimonials and more." },
  { id: "testimonial-checker", label: "Testimonial Checker", tag: "Sellers", desc: "Paste a testimonial and check it for FTC / ASA compliance issues before publishing." },
  { id: "email-compliance", label: "Email Compliance Checker", tag: "Sellers", desc: "Check an email subject and body for CAN-SPAM, CASL and GDPR violations." },
  { id: "urgency-validator", label: "Urgency Claim Validator", tag: "Sellers", desc: "Is your countdown timer or limited spots claim legally defensible? Find out in 60 seconds." },
  { id: "health-claim-rater", label: "Health Claim Risk Rater", tag: "Sellers", desc: "Paste a health or wellness claim and get an instant risk rating before it goes live." },
  { id: "red-flag-checklist", label: "Red Flag Checklist", tag: "Buyers", desc: "10-question checklist to spot misleading marketing before you hand over your money." },
  { id: "refund-rights", label: "Refund Rights Checker", tag: "Buyers", desc: "Pick your country and product type — know your exact legal refund rights." },
  { id: "influencer-disclosure", label: "Influencer Disclosure Checker", tag: "Buyers & Sellers", desc: "Paste a post caption and check if paid partnerships are properly disclosed." },
];

const tagColor = (tag: string) => {
  if (tag === "Sellers") return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#fca5a5" };
  if (tag === "Buyers") return { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#93c5fd" };
  return { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#d8b4fe" };
};

export default function DashboardToolsPage() {
  const [active, setActive] = useState("risk-calculator");
  const tool = TOOLS.find((t) => t.id === active)!;
  const tc = tagColor(tool.tag);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", marginBottom: "4px" }}>Compliance Toolkit</p>
        <h1 style={{ ...syne, fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "4px" }}>Your free compliance tools</h1>
        <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>9 tools included with your account. No scan credits used.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2px", minHeight: "600px" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {TOOLS.map((t) => {
            const tc2 = tagColor(t.tag);
            return (
              <button key={t.id} onClick={() => setActive(t.id)} style={{ ...syne, fontSize: "12px", fontWeight: 600, textAlign: "left", padding: "12px 14px", background: active === t.id ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${active === t.id ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.05)"}`, color: active === t.id ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.15s", display: "flex", flexDirection: "column", gap: "4px" }}>
                {t.label}
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: active === t.id ? tc2.text : "rgba(255,255,255,0.25)" }}>{t.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Tool panel */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <h2 style={{ ...syne, fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{tool.label}</h2>
              <span style={{ ...syne, fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`, padding: "3px 10px", borderRadius: "9999px" }}>{tool.tag}</span>
            </div>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{tool.desc}</p>
          </div>

          {active === "risk-calculator" && <RiskCalculator />}
          {active === "disclaimer-generator" && <DisclaimerGenerator />}
          {active === "testimonial-checker" && <TestimonialChecker />}
          {active === "email-compliance" && <EmailComplianceChecker />}
          {active === "urgency-validator" && <UrgencyValidator />}
          {active === "health-claim-rater" && <HealthClaimRater />}
          {active === "red-flag-checklist" && <RedFlagChecklist />}
          {active === "refund-rights" && <RefundRightsChecker />}
          {active === "influencer-disclosure" && <InfluencerDisclosureChecker />}
        </div>
      </div>
    </div>
  );
}
