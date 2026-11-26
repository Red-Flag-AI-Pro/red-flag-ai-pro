"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CALL_OUTCOMES,
  CALL_OUTCOME_LABEL,
  CHECKPOINTS,
  STAGES,
  STAGE_LABEL,
  callScript,
  checkpointSummary,
  checkpointsCovered,
  emailMessage,
  emailSubject,
  linkedinMessage,
  ukDate,
  type Activity,
  type CheckpointAnswers,
  type LeadRequestRow,
  type Prospect,
  type Stage,
} from "@/lib/console-shared";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" } as React.CSSProperties;

const C = {
  navy: "#0A1628",
  panel: "#0D1B2E",
  raised: "#102943",
  line: "rgba(255,255,255,0.09)",
  ivory: "#F4F1EA",
  dim: "rgba(244,241,234,0.6)",
  faint: "rgba(244,241,234,0.4)",
  red: "#E5484D",
  gold: "#C9A66B",
  green: "#4ade80",
};

const input: React.CSSProperties = {
  ...syne,
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
  color: C.ivory,
  background: C.navy,
  border: `1px solid rgba(244,241,234,0.22)`,
  borderRadius: "8px",
  padding: "9px 11px",
  outline: "none",
};

const label: React.CSSProperties = { ...mono, display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginBottom: "5px" };

function Btn({ children, onClick, kind = "ghost", disabled, title }: { children: React.ReactNode; onClick?: () => void; kind?: "primary" | "ghost" | "gold" | "danger"; disabled?: boolean; title?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: C.red, color: "#fff", border: `1px solid ${C.red}` },
    ghost: { background: "transparent", color: C.ivory, border: `1px solid rgba(244,241,234,0.25)` },
    gold: { background: "rgba(201,166,107,0.12)", color: C.gold, border: `1px solid rgba(201,166,107,0.5)` },
    danger: { background: "transparent", color: "#fca5a5", border: "1px solid rgba(252,165,165,0.4)" },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, ...styles[kind] }}
    >
      {children}
    </button>
  );
}

const fmtDay = (iso: string | null) =>
  iso ? new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "";

const ago = (iso: string) => {
  const h = Math.floor((Date.now() - Date.parse(iso)) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
};

const REQUEST_LABEL: Record<string, string> = { "site-check": "Wants their red flag", audit: "Asked about the full audit", sentinel: "Asked about Sentinel" };

const ACTIVITY_LABEL: Record<string, string> = { connect: "LinkedIn connection request sent", linkedin: "LinkedIn message sent", letter: "Letter posted", email: "Email sent", call: "Call", note: "Note", stage: "Moved to" };

// Colour for each stage, used on the list and the detail heading, so it is
// clear at a glance who still needs contacting and who is under way.
const STAGE_COLOUR: Record<Stage, string> = {
  new: "#E5484D",
  contacted: "#C9A66B",
  replied: "#60a5fa",
  flag_sent: "#a78bfa",
  audit_sold: "#4ade80",
  lost: "rgba(244,241,234,0.4)",
};

// Kinds that count as actually getting in touch (not notes or stage moves).
const TOUCH_KINDS = new Set(["connect", "linkedin", "letter", "email", "call"]);
const ICON: Record<string, string> = { connect: "+", linkedin: "in", letter: "✉", email: "@", call: "☎", note: "✎", stage: "→", checkpoints: "✓" };

const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

/** One line describing an activity row, as shown in the history. */
const describe = (a: Activity) =>
  a.kind === "checkpoints"
    ? "Checkpoint answers saved"
    : a.kind === "stage"
      ? `${ACTIVITY_LABEL.stage} ${STAGE_LABEL[a.outcome as Stage] ?? a.outcome}`
      : a.kind === "call"
        ? `${ACTIVITY_LABEL.call}: ${CALL_OUTCOME_LABEL[a.outcome as keyof typeof CALL_OUTCOME_LABEL] ?? a.outcome}`
        : ACTIVITY_LABEL[a.kind] ?? a.kind;

const EMPTY: Partial<Prospect> = { company: "", website: "", contact_name: "", contact_role: "", linkedin_url: "", email: "", phone: "", postal_address: "", sector: "", source: "outbound", red_flag_where: "", red_flag_quote: "", red_flag_problem: "", red_flag_rule: "", more_count: null, notes: "" };

async function post(path: string, body: unknown) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Something went wrong.");
  return data;
}

function Field({ name, value, onChange, text, placeholder, type }: { name: string; value: string; onChange: (v: string) => void; text?: boolean; placeholder?: string; type?: string }) {
  return (
    <div>
      <label style={label}>{name}</label>
      {text ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
      ) : (
        <input type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={input} />
      )}
    </div>
  );
}

function ProspectForm({ draft, setDraft }: { draft: Partial<Prospect>; setDraft: (d: Partial<Prospect>) => void }) {
  const set = (k: keyof Prospect) => (v: string) => setDraft({ ...draft, [k]: v });
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" };
  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <div style={grid}>
        <Field name="Company" value={draft.company ?? ""} onChange={set("company")} />
        <Field name="Website" value={draft.website ?? ""} onChange={set("website")} placeholder="theircompany.co.uk" />
        <Field name="Sector" value={draft.sector ?? ""} onChange={set("sector")} placeholder="e.g. law firm, clinic, agency" />
      </div>
      <div style={grid}>
        <Field name="Who to contact" value={draft.contact_name ?? ""} onChange={set("contact_name")} placeholder="Full name" />
        <Field name="Their role" value={draft.contact_role ?? ""} onChange={set("contact_role")} placeholder="e.g. Managing Director" />
        <Field name="LinkedIn profile" value={draft.linkedin_url ?? ""} onChange={set("linkedin_url")} placeholder="https://www.linkedin.com/in/..." />
      </div>
      <div style={grid}>
        <Field name="Email" value={draft.email ?? ""} onChange={set("email")} />
        <Field name="Phone" value={draft.phone ?? ""} onChange={set("phone")} />
        <Field name="Where they came from" value={draft.source ?? ""} onChange={set("source")} placeholder="outbound, asa ruling, referral" />
      </div>
      <Field name="Postal address (for the letter)" value={draft.postal_address ?? ""} onChange={set("postal_address")} text placeholder={"Street\nTown\nPostcode"} />
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: "14px", display: "grid", gap: "12px" }}>
        <p style={{ ...mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: C.red }}>Their red flag</p>
        <div style={grid}>
          <Field name="Where on the site" value={draft.red_flag_where ?? ""} onChange={set("red_flag_where")} placeholder="e.g. pricing page" />
          <Field name="How many more" value={draft.more_count === null || draft.more_count === undefined ? "" : String(draft.more_count)} onChange={(v) => setDraft({ ...draft, more_count: v === "" ? null : Number(v) })} type="number" />
        </div>
        <Field name="The exact words on their site" value={draft.red_flag_quote ?? ""} onChange={set("red_flag_quote")} text />
        <Field name="Why it is a problem" value={draft.red_flag_problem ?? ""} onChange={set("red_flag_problem")} text />
        <Field name="The rule it breaks" value={draft.red_flag_rule ?? ""} onChange={set("red_flag_rule")} text />
      </div>
      <Field name="Notes" value={draft.notes ?? ""} onChange={set("notes")} text />
    </div>
  );
}

export interface ConsoleData {
  prospects: Prospect[];
  activity: Activity[];
  requests: LeadRequestRow[];
}

/**
 * `demo` shows the console with supplied sample data and no connection to the
 * real database, for looking around. Nothing can be changed in that mode.
 */
export function SalesConsole({ demo }: { demo?: ConsoleData } = {}) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<LeadRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<"today" | Stage | "all" | "recoverroi">("today");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Prospect> | null>(null);
  const [adding, setAdding] = useState(false);
  const [callOutcome, setCallOutcome] = useState<string>(CALL_OUTCOMES[0]);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"message" | "email" | "script" | "checkpoints" | "letter">("message");
  const [answers, setAnswers] = useState<CheckpointAnswers>({});
  const [heardCopied, setHeardCopied] = useState(false);
  // A short confirmation after something is logged, so it is obvious it worked.
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 8000);
    return () => clearTimeout(t);
  }, [flash]);

  const load = useCallback(async () => {
    if (demo) {
      setProspects(demo.prospects);
      setActivity(demo.activity);
      setRequests(demo.requests);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/console/data", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Could not load the console.");
      setProspects(data.prospects ?? []);
      setActivity(data.activity ?? []);
      setRequests(data.requests ?? []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the console.");
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    load();
  }, [load]);

  const today = ukDate(0);
  const open = (p: Prospect) => p.stage !== "audit_sold" && p.stage !== "lost";
  // Today's list keeps anyone contacted today (ticked) as well as anyone due,
  // so a prospect does not vanish the moment you log a message to them.
  const contactedToday = useMemo(() => {
    const s = new Set<string>();
    for (const a of activity) {
      if (TOUCH_KINDS.has(a.kind) && new Date(a.created_at).toLocaleDateString("en-CA", { timeZone: "Europe/London" }) === today) s.add(a.prospect_id);
    }
    return s;
  }, [activity, today]);
  const due = useMemo(
    () => prospects.filter((p) => !p.do_not_contact && ((open(p) && p.next_action_at && p.next_action_at <= today) || contactedToday.has(p.id))),
    [prospects, today, contactedToday]
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STAGES) c[s] = prospects.filter((p) => p.stage === s).length;
    return c;
  }, [prospects]);

  const recoverroi = useMemo(() => prospects.filter((p) => p.recoverroi_fit), [prospects]);
  const list = view === "today" ? due : view === "all" ? prospects : view === "recoverroi" ? recoverroi : prospects.filter((p) => p.stage === view);
  const selected = prospects.find((p) => p.id === selectedId) ?? null;
  const history = selected ? activity.filter((a) => a.prospect_id === selected.id) : [];

  // Last real contact for each prospect (activity is newest first).
  const lastTouch = useMemo(() => {
    const m = new Map<string, Activity>();
    for (const a of activity) if (TOUCH_KINDS.has(a.kind) && !m.has(a.prospect_id)) m.set(a.prospect_id, a);
    return m;
  }, [activity]);
  const touchCount = (id: string) => activity.filter((a) => a.prospect_id === id && TOUCH_KINDS.has(a.kind)).length;

  // The same kind logged in the last 12 hours: almost certainly a double press.
  const loggedRecently = (kind: string) =>
    history.some((a) => a.kind === kind && Date.now() - Date.parse(a.created_at) < 12 * 3_600_000);
  const lastOf = (kind: string) => history.find((a) => a.kind === kind);

  // The most recently saved checkpoint answers for a prospect, if any.
  const savedAnswers = (id: string): CheckpointAnswers => {
    const row = activity.find((a) => a.prospect_id === id && a.kind === "checkpoints");
    if (!row?.detail) return {};
    try {
      const parsed = JSON.parse(row.detail);
      return parsed && typeof parsed === "object" ? (parsed as CheckpointAnswers) : {};
    } catch {
      return {};
    }
  };

  const select = (p: Prospect | null) => {
    setAnswers(p ? savedAnswers(p.id) : {});
    setHeardCopied(false);
    setSelectedId(p ? p.id : null);
    setDraft(p ? { ...p } : null);
    setAdding(false);
    setNote("");
    setCopied(false);
    setError("");
    setFlash("");
  };

  const run = async (fn: () => Promise<void>) => {
    if (demo) {
      setError("This is a preview with sample data, so nothing is saved. Sign in at redflagaipro.com/console to use the real one.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(async () => {
      if (!draft) return;
      const data = await post("/api/console/prospect", adding ? draft : { ...draft, id: selectedId });
      if (data.prospect) {
        setSelectedId(data.prospect.id);
        setDraft({ ...data.prospect });
        setAdding(false);
      }
    });

  const log = (kind: string, outcome?: string, detail?: string) =>
    run(async () => {
      if (!selected) return;
      const data = await post("/api/console/activity", { prospect_id: selected.id, kind, outcome: outcome ?? null, detail: detail ?? null });
      if (data.prospect) setDraft({ ...data.prospect });
      const what = describe({ id: "", prospect_id: selected.id, kind, outcome: outcome ?? null, detail: null, created_at: "" });
      const p = data.prospect as Prospect | undefined;
      const next = p?.next_action ? ` Next: ${p.next_action}${p.next_action_at ? ` on ${fmtDay(p.next_action_at)}` : ""}.` : "";
      setFlash(kind === "checkpoints" ? "✓ Checkpoint answers saved." : `✓ ${what} logged.${next}`);
    });

  const setTps = (checked: boolean, registered: boolean | null) =>
    run(async () => {
      if (!selected) return;
      const data = await post("/api/console/prospect", { id: selected.id, tps_checked: checked, tps_registered: registered });
      if (data.prospect) setDraft({ ...data.prospect });
    });

  const handleRequest = (id: string, action: "handled" | "to_prospect") =>
    run(async () => {
      const data = await post("/api/console/request", { id, action });
      if (data.prospect) {
        setSelectedId(data.prospect.id);
        setDraft({ ...data.prospect });
      }
    });

  const merged = selected ? ({ ...(selected as Prospect), ...(draft as Prospect) } as Prospect) : null;
  const message = merged ? linkedinMessage(merged) : "";
  const mail = merged ? emailMessage(merged) : "";
  const subject = merged ? emailSubject(merged) : "";
  // Which copy button was last pressed, so each shows its own "Copied".
  const [copiedWhat, setCopiedWhat] = useState("");
  const copyText = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWhat(what);
      window.setTimeout(() => setCopiedWhat(""), 2000);
    } catch {
      setError("Could not copy. Select the text and copy it by hand.");
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy. Select the text and copy it by hand.");
    }
  };

  const remove = () =>
    run(async () => {
      if (!selected) return;
      if (!window.confirm(`Delete ${selected.company} and its history for good?`)) return;
      const res = await fetch(`/api/console/prospect?id=${encodeURIComponent(selected.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete that prospect.");
      setSelectedId(null);
      setDraft(null);
    });

  const toggleAnswer = (id: string, labelText: string, multi?: boolean) => {
    setAnswers((prev) => {
      const current = (prev[id]?.answer ?? "").split(" | ").filter(Boolean);
      let next: string[];
      if (multi) next = current.includes(labelText) ? current.filter((l) => l !== labelText) : [...current, labelText];
      else next = current.includes(labelText) ? [] : [labelText];
      return { ...prev, [id]: { ...prev[id], answer: next.join(" | ") } };
    });
  };
  const setAnswerNote = (id: string, noteText: string) => setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], note: noteText } }));
  const covered = checkpointsCovered(answers);
  const heard = selected ? checkpointSummary({ contact_name: (draft?.contact_name ?? selected.contact_name) as string | null }, answers) : "";
  const copyHeard = async () => {
    try {
      await navigator.clipboard.writeText(heard);
      setHeardCopied(true);
      window.setTimeout(() => setHeardCopied(false), 2000);
    } catch {
      setError("Could not copy. Select the text and copy it by hand.");
    }
  };

  const script = selected ? callScript({ ...(selected as Prospect), ...(draft as Prospect) }) : null;

  const callBlocked = selected ? !selected.tps_checked_at || selected.tps_registered === true : true;

  const pill = (key: "today" | Stage | "all" | "recoverroi", text: string, n: number) => (
    <button
      key={key}
      type="button"
      onClick={() => setView(key)}
      style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "9999px", cursor: "pointer", background: view === key ? C.red : "transparent", color: view === key ? "#fff" : C.dim, border: `1px solid ${view === key ? C.red : "rgba(244,241,234,0.2)"}` }}
    >
      {text} <span style={{ ...mono, fontWeight: 400, marginLeft: "4px", opacity: 0.8 }}>{n}</span>
    </button>
  );

  const card: React.CSSProperties = { background: C.panel, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "1.25rem" };

  return (
    <div style={{ background: C.navy, minHeight: "100vh", color: C.ivory, padding: "1.5rem 1.25rem 4rem" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ ...mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.red, marginBottom: "4px" }}>Red Flag AI Pro</p>
            <h1 className="font-display" style={{ fontSize: "1.9rem", fontWeight: 500, color: C.ivory }}>Sales console</h1>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Btn onClick={() => { setAdding(true); setSelectedId(null); setDraft({ ...EMPTY }); setError(""); }} kind="primary">Add a prospect</Btn>
            <Btn onClick={() => run(async () => {})} disabled={busy}>Refresh</Btn>
            <a href="/scans/new" target="_blank" rel="noreferrer" style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.ivory, border: "1px solid rgba(244,241,234,0.25)", textDecoration: "none" }}>Open the checker</a>
          </div>
        </div>

        {/* The day at a glance */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "1.5rem" }}>
          {[
            { n: requests.length, t: "website requests waiting", hot: requests.length > 0 },
            { n: due.length, t: "to do today", hot: due.length > 0 },
            { n: counts.contacted ?? 0, t: "waiting on a reply", hot: false },
            { n: counts.flag_sent ?? 0, t: "red flags sent", hot: false },
            { n: counts.audit_sold ?? 0, t: "audits sold", hot: false },
          ].map((s) => (
            <div key={s.t} style={{ ...card, padding: "1rem 1.1rem", borderColor: s.hot ? "rgba(229,72,77,0.5)" : C.line }}>
              <span style={{ ...mono, display: "block", fontSize: "1.8rem", lineHeight: 1, color: s.hot ? C.red : C.ivory }}>{s.n}</span>
              <span style={{ ...mono, display: "block", marginTop: "8px", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint }}>{s.t}</span>
            </div>
          ))}
        </div>

        {demo && (
          <p style={{ ...syne, fontSize: "13.5px", color: C.gold, background: "rgba(201,166,107,0.1)", border: "1px solid rgba(201,166,107,0.45)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", lineHeight: 1.6 }}>
            Preview with made up prospects, for looking around. Click anything. Nothing is saved and none of these businesses are real.
          </p>
        )}
        {error && (
          <p role="alert" style={{ ...syne, fontSize: "14px", color: "#fca5a5", background: "rgba(229,72,77,0.1)", border: "1px solid rgba(229,72,77,0.4)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem" }}>{error}</p>
        )}
        {loading && <p style={{ ...syne, color: C.dim }}>Loading…</p>}

        {/* Website requests */}
        {requests.length > 0 && (
          <div style={{ ...card, borderColor: "rgba(229,72,77,0.45)", marginBottom: "1.5rem" }}>
            <p style={{ ...mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: C.red, marginBottom: "1rem" }}>From the website, waiting for you</p>
            <div style={{ display: "grid", gap: "12px" }}>
              {requests.map((r) => (
                <div key={r.id} style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "12px", borderTop: `1px solid ${C.line}` }}>
                  <div style={{ minWidth: 0, flex: "1 1 320px" }}>
                    <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: C.ivory, wordBreak: "break-word" }}>{r.website || r.company || r.email}</p>
                    <p style={{ ...syne, fontSize: "13px", color: C.dim, marginTop: "2px", wordBreak: "break-word" }}>
                      {REQUEST_LABEL[r.kind] ?? r.kind} · {r.email}{r.name ? ` · ${r.name}` : ""} · {ago(r.created_at)}
                    </p>
                    {r.message && <p style={{ ...syne, fontSize: "13px", color: C.faint, marginTop: "6px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{r.message}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Btn kind="primary" disabled={busy} onClick={() => handleRequest(r.id, "to_prospect")}>Work this one</Btn>
                    <Btn disabled={busy} onClick={() => handleRequest(r.id, "handled")}>Already dealt with</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
          {pill("today", "Today", due.length)}
          {STAGES.map((s) => pill(s, STAGE_LABEL[s], counts[s] ?? 0))}
          {pill("all", "Everyone", prospects.length)}
          {pill("recoverroi", "RecoverROI fit", recoverroi.length)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
          <div style={card}>
            {list.length === 0 ? (
              <p style={{ ...syne, fontSize: "14px", color: C.dim, lineHeight: 1.6 }}>
                {view === "today" ? "Nothing due today. Add prospects, or pick a stage above." : view === "recoverroi" ? "Nobody ticked as a fit for RecoverROI yet. Tick the box in a prospect's details when you notice something." : "Nobody here yet."}
              </p>
            ) : (
              list.map((p, i) => {
                const overdue = open(p) && p.next_action_at && p.next_action_at < today;
                const touch = lastTouch.get(p.id);
                const n = touch ? touchCount(p.id) : 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => select(p)}
                    style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", background: selectedId === p.id ? C.raised : "transparent", border: "none", borderLeft: `3px solid ${STAGE_COLOUR[p.stage]}`, borderTop: i === 0 ? "none" : `1px solid ${C.line}`, borderRadius: selectedId === p.id ? "8px" : 0, padding: "12px 10px 12px 12px", marginBottom: "2px", color: C.ivory }}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline" }}>
                      <span style={{ ...syne, fontSize: "15px", fontWeight: 700 }}>{p.company}</span>
                      <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: STAGE_COLOUR[p.stage], border: `1px solid ${STAGE_COLOUR[p.stage]}`, borderRadius: "4px", padding: "2px 7px", whiteSpace: "nowrap" }}>
                        {p.stage === "new" ? "" : "✓ "}{STAGE_LABEL[p.stage]}
                      </span>
                    </span>
                    {touch && (
                      <span style={{ ...mono, display: "block", fontSize: "11px", color: C.gold, marginTop: "4px" }}>
                        ✓ {describe(touch)} {fmtDay(touch.created_at)}{n > 1 ? ` · ${n} contacts` : ""}
                      </span>
                    )}
                    <span style={{ ...syne, display: "block", fontSize: "13px", color: C.dim, marginTop: "2px" }}>
                      {[p.contact_name, p.contact_role].filter(Boolean).join(", ") || "No contact yet"}
                      {p.recoverroi_fit ? <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, border: "1px solid rgba(201,166,107,0.5)", borderRadius: "4px", padding: "1px 6px", marginLeft: "8px" }}>RecoverROI</span> : null}
                    </span>
                    {p.next_action && (
                      <span style={{ ...syne, display: "block", fontSize: "13px", marginTop: "6px", color: overdue ? "#fca5a5" : C.ivory }}>
                        {p.next_action}
                        {p.next_action_at ? <span style={{ ...mono, fontSize: "11px", marginLeft: "8px", color: overdue ? "#fca5a5" : C.faint }}>{overdue ? "overdue · " : ""}{fmtDay(p.next_action_at)}</span> : null}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Detail */}
          {(selected || adding) && draft && (
            <div style={{ ...card, display: "grid", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: C.ivory }}>
                  {adding ? "New prospect" : selected?.company}
                  {!adding && selected && (
                    <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: STAGE_COLOUR[selected.stage], border: `1px solid ${STAGE_COLOUR[selected.stage]}`, borderRadius: "4px", padding: "2px 7px", marginLeft: "10px", verticalAlign: "middle" }}>
                      {selected.stage === "new" ? "" : "✓ "}{STAGE_LABEL[selected.stage]}
                    </span>
                  )}
                </h2>
                <Btn onClick={() => { select(null); setAdding(false); setDraft(null); }}>Close</Btn>
              </div>

              {flash && (
                <div role="status" style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#0A1628", background: C.green, borderRadius: "10px", padding: "10px 14px" }}>
                  {flash}
                </div>
              )}

              {!adding && selected && (
                <>
                  {/* What to do next */}
                  <div style={{ background: C.raised, border: `1px solid rgba(201,166,107,0.4)`, borderRadius: "10px", padding: "1rem" }}>
                    <p style={label}>Next</p>
                    <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: C.ivory }}>
                      {selected.next_action ?? "Nothing scheduled"}
                      {selected.next_action_at ? <span style={{ ...mono, fontSize: "12px", fontWeight: 400, color: C.gold, marginLeft: "10px" }}>{fmtDay(selected.next_action_at)}</span> : null}
                    </p>
                  </div>

                  {/* History: every contact and note, newest first */}
                  {(() => {
                    const touches = history.filter((a) => TOUCH_KINDS.has(a.kind));
                    const last = touches[0];
                    return (
                      <div style={{ border: `1px solid ${C.line}`, borderRadius: "10px", padding: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                          <p style={{ ...label, marginBottom: 0 }}>History</p>
                          <span style={{ ...mono, fontSize: "11px", color: last ? C.gold : C.faint }}>
                            {last ? `${touches.length} contact${touches.length === 1 ? "" : "s"} · last ${ago(last.created_at)}` : "Not contacted yet"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                          <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && note.trim() && !busy) { const n = note; setNote(""); log("note", undefined, n); } }}
                            placeholder="Add a note: what they said, when to try again"
                            style={input}
                          />
                          <Btn disabled={busy || !note.trim()} onClick={() => { const n = note; setNote(""); log("note", undefined, n); }}>Add</Btn>
                        </div>
                        {history.length === 0 ? (
                          <p style={{ ...syne, fontSize: "13px", color: C.faint }}>Nothing logged yet.</p>
                        ) : (
                          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                            {history.map((a) => (
                              <div key={a.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 0", borderTop: `1px solid ${C.line}` }}>
                                <span style={{ ...mono, flexShrink: 0, width: "26px", height: "26px", lineHeight: "26px", textAlign: "center", borderRadius: "50%", fontSize: "11px", fontWeight: 700, color: TOUCH_KINDS.has(a.kind) ? C.navy : C.ivory, background: TOUCH_KINDS.has(a.kind) ? C.gold : "rgba(244,241,234,0.12)" }}>
                                  {ICON[a.kind] ?? "•"}
                                </span>
                                <div style={{ minWidth: 0 }}>
                                  <p style={{ ...syne, fontSize: "13.5px", fontWeight: 700, color: C.ivory, lineHeight: 1.4 }}>{describe(a)}</p>
                                  <p style={{ ...mono, fontSize: "11px", color: C.faint }}>{fmtWhen(a.created_at)}</p>
                                  {a.detail && a.kind !== "checkpoints" && (
                                    <p style={{ ...syne, fontSize: "13px", color: C.dim, lineHeight: 1.55, marginTop: "3px", whiteSpace: "pre-wrap" }}>{a.detail}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* What to say: LinkedIn message, call script or letter */}
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                      {([
                        ["message", "LinkedIn message"],
                        ["email", "Email"],
                        ["script", "Call script"],
                        ["checkpoints", `Checkpoints ${covered}/${CHECKPOINTS.length}`],
                        ["letter", "Letter"],
                      ] as const).map(([key, text]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTab(key)}
                          style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", cursor: "pointer", background: tab === key ? C.raised : "transparent", color: tab === key ? C.ivory : C.dim, border: `1px solid ${tab === key ? "rgba(201,166,107,0.6)" : "rgba(244,241,234,0.18)"}` }}
                        >
                          {text}
                        </button>
                      ))}
                    </div>

                    {tab === "message" && (
                      <>
                        <p style={label}>Ready to paste</p>
                        <textarea readOnly value={message} rows={12} style={{ ...input, resize: "vertical", lineHeight: 1.55, fontSize: "13.5px" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                          <Btn kind="gold" onClick={copy}>{copied ? "Copied" : "Copy message"}</Btn>
                          {selected.linkedin_url && (
                            <a href={selected.linkedin_url} target="_blank" rel="noreferrer" style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.ivory, border: "1px solid rgba(244,241,234,0.25)", textDecoration: "none" }}>Open their LinkedIn</a>
                          )}
                        </div>
                      </>
                    )}

                    {tab === "email" && (
                      <>
                        <p style={label}>Send to</p>
                        <p style={{ ...syne, fontSize: "14px", color: selected.email ? C.ivory : C.faint, marginBottom: "10px" }}>
                          {selected.email || "No email saved. Find it on their contact page and add it in the details below."}
                        </p>
                        <p style={label}>Subject</p>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                          <input readOnly value={subject} style={input} />
                          <Btn onClick={() => copyText(subject, "subject")}>{copiedWhat === "subject" ? "Copied" : "Copy"}</Btn>
                        </div>
                        <p style={label}>Message, with the opt out line at the end</p>
                        <textarea readOnly value={mail} rows={14} style={{ ...input, resize: "vertical", lineHeight: 1.55, fontSize: "13.5px" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                          <Btn kind="gold" onClick={() => copyText(mail, "mail")}>{copiedWhat === "mail" ? "Copied" : "Copy message"}</Btn>
                          {selected.email && (
                            <a
                              href={`mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mail)}`}
                              style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.ivory, border: "1px solid rgba(244,241,234,0.25)", textDecoration: "none" }}
                            >
                              Open in my email
                            </a>
                          )}
                        </div>
                        <p style={{ ...syne, fontSize: "12.5px", color: C.dim, lineHeight: 1.6, marginTop: "10px" }}>
                          Check the address on their own contact page before sending. Then press &ldquo;Email sent&rdquo; below.
                        </p>
                      </>
                    )}

                    {tab === "letter" && (
                      <>
                        <p style={{ ...syne, fontSize: "13.5px", color: C.dim, lineHeight: 1.65, marginBottom: "12px" }}>
                          One page, addressed to {selected.contact_name || "the director"}, with their red flag and the line that lets them opt out. Check the postal address in the details below first. Hand write the name on the envelope and mark it private and confidential.
                        </p>
                        <a href={demo ? undefined : `/console/letter/${selected.id}`} target="_blank" rel="noreferrer" style={{ ...syne, display: "inline-block", fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.gold, border: "1px solid rgba(201,166,107,0.5)", background: "rgba(201,166,107,0.12)", textDecoration: "none" }}>Open the letter to print</a>
                      </>
                    )}

                    {tab === "script" && script && (
                      <div style={{ display: "grid", gap: "12px" }}>
                        {script.steps.map((step, i) => (
                          <div key={step.title} style={{ border: `1px solid ${C.line}`, borderRadius: "10px", padding: "12px 14px" }}>
                            <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.red, marginBottom: "8px" }}>{i + 1}. {step.title}</p>
                            {step.say.map((line) => (
                              <p key={line} className="font-display" style={{ fontSize: "1.02rem", color: C.ivory, lineHeight: 1.5, marginBottom: "6px" }}>{line}</p>
                            ))}
                            {step.note && <p style={{ ...syne, fontSize: "12.5px", color: C.gold, lineHeight: 1.5, marginTop: "6px" }}>{step.note}</p>}
                          </div>
                        ))}

                        <div>
                          <p style={{ ...label, marginTop: "6px" }}>If they push back</p>
                          {script.objections.map((o) => (
                            <details key={o.they} style={{ borderTop: `1px solid ${C.line}`, padding: "10px 2px" }}>
                              <summary style={{ ...syne, fontSize: "14px", fontWeight: 700, color: C.ivory, cursor: "pointer" }}>{o.they}</summary>
                              <p className="font-display" style={{ fontSize: "1.02rem", color: C.ivory, lineHeight: 1.5, marginTop: "8px" }}>{o.you}</p>
                            </details>
                          ))}
                        </div>

                        <div style={{ border: `1px solid ${C.line}`, borderRadius: "10px", padding: "12px 14px" }}>
                          <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.red, marginBottom: "8px" }}>If it goes to voicemail</p>
                          <p className="font-display" style={{ fontSize: "1.02rem", color: C.ivory, lineHeight: 1.5 }}>{script.voicemail}</p>
                        </div>

                        <div style={{ background: C.raised, borderRadius: "10px", padding: "12px 14px" }}>
                          <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>Four rules</p>
                          {script.rules.map((r, i) => (
                            <p key={r} style={{ ...syne, fontSize: "13px", color: C.dim, lineHeight: 1.6 }}>{i + 1}. {r}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === "checkpoints" && (
                      <div style={{ display: "grid", gap: "12px" }}>
                        <p style={{ ...syne, fontSize: "13.5px", color: C.dim, lineHeight: 1.65 }}>
                          Eight things to find out on the call. Tap what they say as you go. You do not need all eight; most owners cannot answer 2, 6 or 8, and the silence does the work.
                        </p>
                        {(["said", "did"] as const).map((half) => (
                          <div key={half} style={{ display: "grid", gap: "10px" }}>
                            <p style={{ ...mono, fontSize: "10.5px", letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginTop: "4px" }}>
                              {half === "said" ? "What they say" : "What they do with AI"}
                            </p>
                            {CHECKPOINTS.filter((c) => c.half === half).map((c) => {
                              const chosen = (answers[c.id]?.answer ?? "").split(" | ").filter(Boolean);
                              const n = CHECKPOINTS.findIndex((x) => x.id === c.id) + 1;
                              return (
                                <div key={c.id} style={{ border: `1px solid ${chosen.length ? "rgba(201,166,107,0.45)" : C.line}`, borderRadius: "10px", padding: "12px 14px" }}>
                                  <p className="font-display" style={{ fontSize: "1.05rem", color: C.ivory, lineHeight: 1.45, marginBottom: "10px" }}>
                                    <span style={{ ...mono, fontSize: "12px", color: C.red, marginRight: "8px" }}>{n}</span>
                                    {c.question}
                                  </p>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                                    {c.options.map((o) => {
                                      const on = chosen.includes(o.label);
                                      return (
                                        <button
                                          key={o.label}
                                          type="button"
                                          onClick={() => toggleAnswer(c.id, o.label, c.multi)}
                                          aria-pressed={on}
                                          style={{ ...syne, fontSize: "12.5px", fontWeight: 600, padding: "6px 11px", borderRadius: "9999px", cursor: "pointer", background: on ? (o.gap ? "rgba(229,72,77,0.18)" : "rgba(201,166,107,0.16)") : "transparent", color: on ? C.ivory : C.dim, border: `1px solid ${on ? (o.gap ? C.red : C.gold) : "rgba(244,241,234,0.2)"}` }}
                                        >
                                          {o.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <input value={answers[c.id]?.note ?? ""} onChange={(e) => setAnswerNote(c.id, e.target.value)} placeholder="Anything they said, in their words" style={{ ...input, fontSize: "13px", padding: "7px 10px" }} />
                                </div>
                              );
                            })}
                          </div>
                        ))}

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                          <Btn kind="primary" disabled={busy || covered === 0} onClick={() => log("checkpoints", undefined, JSON.stringify(answers))}>Save answers</Btn>
                          <span style={{ ...mono, fontSize: "11px", letterSpacing: "0.1em", color: C.faint }}>{covered} of {CHECKPOINTS.length} covered</span>
                        </div>

                        {heard && (
                          <div>
                            <p style={label}>What I heard, ready for your follow up</p>
                            <textarea readOnly value={heard} rows={12} style={{ ...input, resize: "vertical", lineHeight: 1.55, fontSize: "13.5px" }} />
                            <div style={{ marginTop: "10px" }}>
                              <Btn kind="gold" onClick={copyHeard}>{heardCopied ? "Copied" : "Copy summary"}</Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Log what you did */}
                  <div>
                    <p style={label}>Log what you did</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {([
                        ["connect", "Connection request sent"],
                        ["linkedin", "LinkedIn sent"],
                        ["letter", "Letter posted"],
                        ["email", "Email sent"],
                      ] as const).map(([kind, text]) => {
                        const prev = lastOf(kind);
                        const recent = loggedRecently(kind);
                        return (
                          <Btn
                            key={kind}
                            kind={prev ? "gold" : "ghost"}
                            disabled={busy || selected.do_not_contact || recent}
                            title={recent ? "Already logged in the last 12 hours" : ""}
                            onClick={() => log(kind)}
                          >
                            {prev ? `✓ ${text} ${fmtDay(prev.created_at)}` : text}
                          </Btn>
                        );
                      })}
                    </div>
                    {(lastOf("linkedin") || lastOf("letter") || lastOf("email")) && (
                      <p style={{ ...syne, fontSize: "12px", color: C.faint, marginTop: "6px" }}>A tick means it has been logged. Press it again only for a genuine second contact.</p>
                    )}

                    <div style={{ marginTop: "14px", padding: "12px", border: `1px solid ${C.line}`, borderRadius: "10px" }}>
                      <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: C.ivory, marginBottom: "8px" }}>Phone call</p>
                      {!selected.tps_checked_at ? (
                        <>
                          <p style={{ ...syne, fontSize: "12.5px", color: C.dim, lineHeight: 1.6, marginBottom: "10px" }}>
                            UK rules: check the number against the do not call registers (TPS and CTPS) before a sales call. Record the result here first.
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <Btn disabled={busy || !selected.phone} onClick={() => setTps(true, false)} title={selected.phone ? "" : "Add a phone number first"}>Checked: not registered</Btn>
                            <Btn kind="danger" disabled={busy || !selected.phone} onClick={() => setTps(true, true)}>Checked: registered, do not call</Btn>
                          </div>
                        </>
                      ) : selected.tps_registered ? (
                        <p style={{ ...syne, fontSize: "13px", color: "#fca5a5", lineHeight: 1.6 }}>
                          This number is on the do not call register. Use LinkedIn or the letter instead.{" "}
                          <button type="button" onClick={() => setTps(false, null)} style={{ ...syne, fontSize: "12px", color: C.faint, background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Undo</button>
                        </p>
                      ) : (
                        <>
                          <p style={{ ...syne, fontSize: "12.5px", color: C.dim, marginBottom: "10px" }}>
                            Number checked {fmtDay(selected.tps_checked_at)}: fine to call {selected.phone ? `(${selected.phone})` : ""}.{" "}
                            <button type="button" onClick={() => setTps(false, null)} style={{ ...syne, fontSize: "12px", color: C.faint, background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Undo</button>
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <select value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)} style={{ ...input, width: "auto", flex: "1 1 200px" }}>
                              {CALL_OUTCOMES.map((o) => (
                                <option key={o} value={o}>{CALL_OUTCOME_LABEL[o]}</option>
                              ))}
                            </select>
                            <Btn disabled={busy || callBlocked || selected.do_not_contact} onClick={() => log("call", callOutcome)}>Log the call</Btn>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Move them on */}
                  <div>
                    <p style={label}>Move them on</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <Btn disabled={busy} onClick={() => log("stage", "replied")}>They replied</Btn>
                      <Btn disabled={busy} onClick={() => log("stage", "flag_sent")}>Red flag sent</Btn>
                      <Btn kind="gold" disabled={busy} onClick={() => log("stage", "audit_sold")}>Audit sold</Btn>
                      <Btn kind="danger" disabled={busy} onClick={() => log("stage", "lost")}>Lost</Btn>
                    </div>
                  </div>
                </>
              )}

              {/* Details */}
              <div>
                {!adding && <p style={{ ...label, marginBottom: "12px" }}>Details</p>}
                <ProspectForm draft={draft} setDraft={setDraft} />
                {!adding && selected && (
                  <label style={{ ...syne, display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.dim, marginTop: "14px", cursor: "pointer" }}>
                    <input type="checkbox" checked={Boolean(draft.do_not_contact)} onChange={(e) => setDraft({ ...draft, do_not_contact: e.target.checked })} />
                    They asked not to be contacted again
                  </label>
                )}
                {!adding && selected && (
                  <div style={{ marginTop: "14px", padding: "12px 14px", border: `1px solid ${draft.recoverroi_fit ? "rgba(201,166,107,0.5)" : C.line}`, borderRadius: "10px" }}>
                    <label style={{ ...syne, display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: 700, color: C.ivory, cursor: "pointer" }}>
                      <input type="checkbox" checked={Boolean(draft.recoverroi_fit)} onChange={(e) => setDraft({ ...draft, recoverroi_fit: e.target.checked })} />
                      Also a fit for RecoverROI
                    </label>
                    <p style={{ ...syne, fontSize: "12.5px", color: C.dim, lineHeight: 1.6, margin: "6px 0 8px" }}>
                      Tick it when you notice something that is not compliance: an enquiry form that goes nowhere, nobody answering out of hours, a dated site. Raise it in a conversation you are already having, never as a separate cold call.
                    </p>
                    <input value={draft.recoverroi_note ?? ""} onChange={(e) => setDraft({ ...draft, recoverroi_note: e.target.value })} placeholder="What you noticed" style={{ ...input, fontSize: "13px", padding: "7px 10px" }} />
                    {draft.recoverroi_fit && (
                      <p className="font-display" style={{ fontSize: "0.98rem", color: C.ivory, lineHeight: 1.5, marginTop: "10px" }}>
                        &ldquo;One more thing, and it&apos;s nothing to do with compliance. While I was in your site I noticed {(draft.recoverroi_note ?? "").trim() ? (draft.recoverroi_note ?? "").trim().replace(/\.$/, "") : "something else"}. I run a second business that fixes exactly that. Want me to take a look?&rdquo;
                      </p>
                    )}
                  </div>
                )}
                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between" }}>
                  <Btn kind="primary" disabled={busy || !(draft.company ?? "").trim()} onClick={save}>{adding ? "Add prospect" : "Save changes"}</Btn>
                  {!adding && selected && <Btn kind="danger" disabled={busy} onClick={remove}>Delete this prospect</Btn>}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
