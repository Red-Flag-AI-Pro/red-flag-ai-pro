"use client";

import { useState } from "react";
import { RiskCalculator } from "@/components/marketing/RiskCalculator";

/* ─── Disclaimer Generator ─── */
const DISCLAIMER_TYPES = [
  { id: "income", label: "Income / Earnings Claim", disclaimer: `Individual results will vary. The income figures mentioned are not typical and are not a guarantee of results. Your results will depend on many factors including your experience, skills, effort, and market conditions. There is no assurance that any prior successes or past results as to income earnings can be used as an indication of your future success or results.` },
  { id: "health", label: "Health / Supplement Claim", disclaimer: `These statements have not been evaluated by the Food and Drug Administration (FDA) or the Medicines and Healthcare products Regulatory Agency (MHRA). This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Consult your healthcare professional before use.` },
  { id: "testimonial", label: "Testimonial / Case Study", disclaimer: `Results shown are individual case studies and are not typical. Your results will vary and depend on many unique factors. These testimonials may have been edited for brevity. We cannot guarantee you will achieve similar results.` },
  { id: "investment", label: "Investment / Financial Claim", disclaimer: `Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal. This is not financial advice. Please consult a qualified financial adviser before making any investment decisions.` },
  { id: "guarantee", label: "Money-Back Guarantee", disclaimer: `Our guarantee is subject to our full Terms & Conditions. Refunds are processed within 10 business days of request. Guarantee applies to first-time purchases only. Digital downloads are excluded once accessed.` },
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
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-[rgba(244,241,234,0.5)] mb-2">What type of claim are you making?</p>
        <div className="flex flex-wrap gap-2">
          {DISCLAIMER_TYPES.map((d, i) => (
            <button key={d.id} onClick={() => setSelected(i)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${selected === i ? "bg-[rgba(229,72,77,0.1)] border-red-300 text-[#ff9b9e]" : "bg-[#102943] border-white/10 text-[rgba(244,241,234,0.6)] hover:border-white/15"}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[#0A1628] border border-white/10 rounded p-4">
        <p className="text-sm text-[rgba(244,241,234,0.8)] leading-relaxed">{DISCLAIMER_TYPES[selected].disclaimer}</p>
      </div>
      <button onClick={copy} className={`text-xs font-bold tracking-widest uppercase py-2.5 rounded-full border transition-all ${copied ? "bg-[rgba(34,197,94,0.1)] border-green-300 text-green-300" : "bg-[#102943] border-white/10 text-[rgba(244,241,234,0.6)] hover:bg-white/5"}`}>
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
    if (!(/paid|sponsored|ad\b|#ad/.test(t)) && /@\w+/.test(t)) issues.push("Influencer/social testimonial may need #ad or #sponsored disclosure");
    if (text.length < 10) return;
    setResult({ issues, safe: issues.length === 0 });
  };
  return (
    <div className="flex flex-col gap-3">
      <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Paste the testimonial here..." rows={5} className="text-sm text-[#F4F1EA] bg-[#102943] border border-white/10 rounded p-3 resize-y outline-none focus:border-red-300 leading-relaxed placeholder-[rgba(244,241,234,0.4)]" />
      <button onClick={check} disabled={text.length < 10} className={`text-xs font-bold tracking-widest uppercase py-2.5 rounded-full transition-all ${text.length >= 10 ? "bg-red-600 text-white hover:bg-red-700" : "bg-white/5 text-[rgba(244,241,234,0.4)] cursor-not-allowed"}`}>
        Check testimonial
      </button>
      {result && (
        <div className={`rounded p-4 ${result.safe ? "bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]" : "bg-[rgba(229,72,77,0.1)] border border-[rgba(229,72,77,0.3)]"}`}>
          {result.safe
            ? <p className="text-sm font-semibold text-green-300">✓ No obvious issues found — looks good</p>
            : <ul className="flex flex-col gap-2">{result.issues.map((issue, i) => <li key={i} className="text-sm text-[#ff9b9e] flex gap-2"><span className="text-red-500 shrink-0">✕</span>{issue}</li>)}</ul>
          }
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
    <div className="flex flex-col gap-3">
      <input value={subject} onChange={(e) => { setSubject(e.target.value); setResult(null); }} placeholder="Email subject line..." className="text-sm text-[#F4F1EA] bg-[#102943] border border-white/10 rounded px-3 py-2.5 outline-none focus:border-red-300 placeholder-[rgba(244,241,234,0.4)]" />
      <textarea value={body} onChange={(e) => { setBody(e.target.value); setResult(null); }} placeholder="Email body (paste key sections)..." rows={5} className="text-sm text-[#F4F1EA] bg-[#102943] border border-white/10 rounded p-3 resize-y outline-none focus:border-red-300 leading-relaxed placeholder-[rgba(244,241,234,0.4)]" />
      <button onClick={check} disabled={!subject && !body} className={`text-xs font-bold tracking-widest uppercase py-2.5 rounded-full transition-all ${(subject || body) ? "bg-red-600 text-white hover:bg-red-700" : "bg-white/5 text-[rgba(244,241,234,0.4)] cursor-not-allowed"}`}>
        Check email compliance
      </button>
      {result && (
        <div className={`rounded p-4 ${result.length === 0 ? "bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]" : "bg-[rgba(229,72,77,0.1)] border border-[rgba(229,72,77,0.3)]"}`}>
          {result.length === 0
            ? <p className="text-sm font-semibold text-green-300">✓ No issues found — looks compliant</p>
            : <ul className="flex flex-col gap-2">{result.map((issue, i) => <li key={i} className="text-sm text-[#ff9b9e] flex gap-2"><span className="text-red-500 shrink-0">✕</span>{issue}</li>)}</ul>
          }
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
  const verdict = score === 5 ? "✓ Your urgency claim appears legally defensible" : score >= 3 ? "⚠ Partial — resolve the unchecked items before publishing" : "✕ High risk — this urgency claim could trigger regulatory action";
  const color = score === 5 ? "text-green-300" : score >= 3 ? "text-amber-300" : "text-[#ff9b9e]";
  const bg = score === 5 ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]" : score >= 3 ? "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]" : "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]";
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[rgba(244,241,234,0.5)] mb-1">Check every statement that applies to your urgency claim:</p>
      {URGENCY_CHECKS.map((c) => (
        <div key={c.id} onClick={() => toggle(c.id)} className={`flex items-center gap-3 cursor-pointer border rounded px-3 py-2.5 transition-all ${checks[c.id] ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]" : "bg-[#102943] border-white/10 hover:border-white/15"}`}>
          <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${checks[c.id] ? "bg-green-500 border-green-500" : "border-white/15"}`}>
            {checks[c.id] && <span className="text-white text-xs font-bold leading-none">✓</span>}
          </div>
          <p className={`text-sm ${checks[c.id] ? "text-green-300" : "text-[rgba(244,241,234,0.6)]"}`}>{c.label}</p>
        </div>
      ))}
      <div className={`rounded p-4 border mt-2 ${bg}`}>
        <p className={`text-2xl font-bold mb-1 font-mono ${color}`}>{score}/5</p>
        <p className={`text-sm font-semibold ${color}`}>{verdict}</p>
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
    return { high: HIGH_RISK.filter((w) => t.includes(w)), med: MED_RISK.filter((w) => t.includes(w)) };
  };
  const { high, med } = claim ? analyze() : { high: [], med: [] };
  const level = high.length > 0 ? "HIGH" : med.length > 1 ? "MODERATE" : claim.length > 10 ? "LOW" : null;
  return (
    <div className="flex flex-col gap-3">
      <textarea value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="Paste your health or wellness claim here..." rows={4} className="text-sm text-[#F4F1EA] bg-[#102943] border border-white/10 rounded p-3 resize-y outline-none focus:border-red-300 leading-relaxed placeholder-[rgba(244,241,234,0.4)]" />
      {level && (
        <div className={`rounded p-4 border ${level === "HIGH" ? "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]" : level === "MODERATE" ? "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]" : "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]"}`}>
          <p className={`text-xl font-bold font-mono mb-2 ${level === "HIGH" ? "text-[#ff9b9e]" : level === "MODERATE" ? "text-amber-300" : "text-green-300"}`}>{level} RISK</p>
          {high.length > 0 && <p className="text-sm text-[#ff9b9e] mb-1">High-risk words: <strong>{high.join(", ")}</strong> — may constitute drug claims under FDA/MHRA rules without clinical evidence</p>}
          {med.length > 0 && <p className="text-sm text-amber-300">Moderate-risk words: <strong>{med.join(", ")}</strong> — ensure you have substantiation for these</p>}
          {level === "LOW" && <p className="text-sm text-green-300">No high-risk terms detected — still add appropriate disclaimers if making any health claim</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Red Flag Checklist ─── */
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
  const color = pct < 20 ? "text-green-300" : pct < 50 ? "text-amber-300" : "text-[#ff9b9e]";
  const bg = pct < 20 ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]" : pct < 50 ? "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]" : "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]";
  const verdict = pct < 20 ? "Looks relatively clean — proceed with caution" : pct < 50 ? "Several yellow flags — research further before buying" : "Multiple red flags — high risk of misleading marketing";
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[rgba(244,241,234,0.5)] mb-1">Check every item that applies to the offer you&apos;re evaluating:</p>
      {RED_FLAG_QUESTIONS.map((item, i) => (
        <div key={i} onClick={() => toggle(i)} className={`flex items-center gap-3 cursor-pointer border rounded px-3 py-2.5 transition-all ${answers[i] ? "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]" : "bg-[#102943] border-white/10 hover:border-white/15"}`}>
          <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${answers[i] ? "bg-red-500 border-red-500" : "border-white/15"}`}>
            {answers[i] && <span className="text-white text-xs font-bold leading-none">✓</span>}
          </div>
          <p className={`text-sm flex-1 ${answers[i] ? "text-red-800" : "text-[rgba(244,241,234,0.6)]"}`}>{item.q}</p>
          {item.weight > 1 && <span className="text-xs font-bold tracking-wider text-red-400 shrink-0">HIGH</span>}
        </div>
      ))}
      {Object.keys(answers).length > 0 && (
        <div className={`rounded p-4 border mt-2 ${bg}`}>
          <p className={`text-2xl font-bold font-mono mb-1 ${color}`}>{pct}% risk</p>
          <p className={`text-sm font-semibold ${color}`}>{verdict}</p>
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
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)] block mb-1.5">Your country</label>
        <select value={country} onChange={(e) => { setCountry(e.target.value); setProductType(""); }} className="w-full bg-[#102943] border border-white/10 text-[#F4F1EA] text-sm rounded px-3 py-2.5 outline-none focus:border-red-300 cursor-pointer">
          <option value="">Select country...</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {country && (
        <div>
          <label className="text-xs font-semibold text-[rgba(244,241,234,0.5)] block mb-1.5">What did you buy?</label>
          <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full bg-[#102943] border border-white/10 text-[#F4F1EA] text-sm rounded px-3 py-2.5 outline-none focus:border-red-300 cursor-pointer">
            <option value="">Select type...</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}
      {result && (
        <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded p-4">
          <p className="text-xs font-bold tracking-wider uppercase text-green-300 mb-2">Your rights in {country}</p>
          <p className="text-sm text-[rgba(244,241,234,0.8)] leading-relaxed">{result}</p>
          <p className="text-xs text-[rgba(244,241,234,0.4)] mt-3">Not legal advice. For specific disputes, contact your national consumer protection authority.</p>
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
    const issues: string[] = [];
    const hasDisclosure = /#ad\b|#sponsored\b|#paid\b|#gifted\b|paid partnership|sponsored by|in partnership with|#collab/i.test(text);
    if (!hasDisclosure) issues.push("No clear paid partnership disclosure found — #ad, #sponsored, or 'paid partnership' required by FTC and ASA");
    if (/#ad/.test(text) && text.indexOf("#ad") > 100) issues.push("#ad must appear prominently — placing it at the end or buried in hashtags is not sufficient under FTC guidelines");
    if (/\(ad\)|\[ad\]/i.test(text)) issues.push("(ad) in brackets may not be sufficient — FTC and ASA prefer clear #ad or 'paid partnership' labels");
    if (/gifted|pr product|pr gift/i.test(text) && !/#gifted/i.test(text)) issues.push("Gifted products require clear #gifted disclosure even if no payment was made (ASA CAP Code)");
    setResult({ ok: issues.length === 0, issues });
  };
  return (
    <div className="flex flex-col gap-3">
      <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Paste the post caption or ad copy here..." rows={5} className="text-sm text-[#F4F1EA] bg-[#102943] border border-white/10 rounded p-3 resize-y outline-none focus:border-red-300 leading-relaxed placeholder-[rgba(244,241,234,0.4)]" />
      <button onClick={check} disabled={text.length < 10} className={`text-xs font-bold tracking-widest uppercase py-2.5 rounded-full transition-all ${text.length >= 10 ? "bg-red-600 text-white hover:bg-red-700" : "bg-white/5 text-[rgba(244,241,234,0.4)] cursor-not-allowed"}`}>
        Check disclosure
      </button>
      {result && (
        <div className={`rounded p-4 border ${result.ok ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]" : "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]"}`}>
          {result.ok
            ? <p className="text-sm font-semibold text-green-300">✓ Disclosure looks compliant</p>
            : <ul className="flex flex-col gap-2">{result.issues.map((issue, idx) => <li key={idx} className="text-sm text-[#ff9b9e] flex gap-2"><span className="text-red-500 shrink-0">✕</span>{issue}</li>)}</ul>
          }
        </div>
      )}
    </div>
  );
}

/* ─── Tool list ─── */
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

const tagStyle = (tag: string) => {
  if (tag === "Sellers") return "bg-[rgba(229,72,77,0.1)] text-[#ff9b9e] border-[rgba(229,72,77,0.3)]";
  if (tag === "Buyers") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-purple-50 text-purple-700 border-purple-200";
};

export default function DashboardToolsPage() {
  const [active, setActive] = useState("risk-calculator");
  const tool = TOOLS.find((t) => t.id === active)!;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest uppercase text-[#E5484D] mb-1">Compliance Toolkit</p>
        <h1 className="text-xl font-bold text-[#F4F1EA] mb-1">Your free compliance tools</h1>
        <p className="text-sm text-[rgba(244,241,234,0.5)]">9 tools included with your account. No scan credits used.</p>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "220px 1fr" }}>
        {/* Tool nav */}
        <div className="flex flex-col gap-1">
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`text-left px-3 py-2.5 rounded-lg border transition-all flex flex-col gap-0.5 ${active === t.id ? "bg-[rgba(229,72,77,0.1)] border-[rgba(229,72,77,0.3)]" : "bg-[#102943] border-white/5 hover:border-white/10 hover:bg-white/5"}`}>
              <span className={`text-sm font-semibold ${active === t.id ? "text-red-800" : "text-[rgba(244,241,234,0.8)]"}`}>{t.label}</span>
              <span className={`text-xs font-semibold ${active === t.id ? "text-red-500" : "text-[rgba(244,241,234,0.4)]"}`}>{t.tag}</span>
            </button>
          ))}
        </div>

        {/* Tool panel */}
        <div className="bg-[#102943] border border-white/10 rounded-xl p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-[#F4F1EA]">{tool.label}</h2>
              <span className={`text-xs font-bold tracking-wider uppercase border rounded-full px-2.5 py-0.5 ${tagStyle(tool.tag)}`}>{tool.tag}</span>
            </div>
            <p className="text-sm text-[rgba(244,241,234,0.5)]">{tool.desc}</p>
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
