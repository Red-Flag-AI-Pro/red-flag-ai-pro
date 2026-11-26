"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CALL_OUTCOMES,
  CALL_OUTCOME_LABEL,
  STAGES,
  STAGE_LABEL,
  linkedinMessage,
  ukDate,
  type Activity,
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

const ACTIVITY_LABEL: Record<string, string> = { linkedin: "LinkedIn message sent", letter: "Letter posted", email: "Email sent", call: "Call", note: "Note", stage: "Moved to" };

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

export function SalesConsole() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [requests, setRequests] = useState<LeadRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<"today" | Stage | "all">("today");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Prospect> | null>(null);
  const [adding, setAdding] = useState(false);
  const [callOutcome, setCallOutcome] = useState<string>(CALL_OUTCOMES[0]);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = ukDate(0);
  const open = (p: Prospect) => p.stage !== "audit_sold" && p.stage !== "lost";
  const due = useMemo(() => prospects.filter((p) => open(p) && p.next_action_at && p.next_action_at <= today && !p.do_not_contact), [prospects, today]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STAGES) c[s] = prospects.filter((p) => p.stage === s).length;
    return c;
  }, [prospects]);

  const list = view === "today" ? due : view === "all" ? prospects : prospects.filter((p) => p.stage === view);
  const selected = prospects.find((p) => p.id === selectedId) ?? null;
  const history = selected ? activity.filter((a) => a.prospect_id === selected.id) : [];

  const select = (p: Prospect | null) => {
    setSelectedId(p ? p.id : null);
    setDraft(p ? { ...p } : null);
    setAdding(false);
    setNote("");
    setCopied(false);
    setError("");
  };

  const run = async (fn: () => Promise<void>) => {
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

  const message = selected ? linkedinMessage({ ...(selected as Prospect), ...(draft as Prospect) }) : "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy. Select the text and copy it by hand.");
    }
  };

  const callBlocked = selected ? !selected.tps_checked_at || selected.tps_registered === true : true;

  const pill = (key: "today" | Stage | "all", text: string, n: number) => (
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
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
          <div style={card}>
            {list.length === 0 ? (
              <p style={{ ...syne, fontSize: "14px", color: C.dim, lineHeight: 1.6 }}>
                {view === "today" ? "Nothing due today. Add prospects, or pick a stage above." : "Nobody here yet."}
              </p>
            ) : (
              list.map((p, i) => {
                const overdue = open(p) && p.next_action_at && p.next_action_at < today;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => select(p)}
                    style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", background: selectedId === p.id ? C.raised : "transparent", border: "none", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, borderRadius: selectedId === p.id ? "8px" : 0, padding: "12px 10px", color: C.ivory }}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline" }}>
                      <span style={{ ...syne, fontSize: "15px", fontWeight: 700 }}>{p.company}</span>
                      <span style={{ ...mono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: p.stage === "audit_sold" ? C.green : p.stage === "lost" ? C.faint : C.gold, whiteSpace: "nowrap" }}>{STAGE_LABEL[p.stage]}</span>
                    </span>
                    <span style={{ ...syne, display: "block", fontSize: "13px", color: C.dim, marginTop: "2px" }}>
                      {[p.contact_name, p.contact_role].filter(Boolean).join(", ") || "No contact yet"}
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
                <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: C.ivory }}>{adding ? "New prospect" : selected?.company}</h2>
                <Btn onClick={() => { select(null); setAdding(false); setDraft(null); }}>Close</Btn>
              </div>

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

                  {/* The message */}
                  <div>
                    <p style={label}>LinkedIn message, ready to paste</p>
                    <textarea readOnly value={message} rows={12} style={{ ...input, resize: "vertical", lineHeight: 1.55, fontSize: "13.5px" }} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                      <Btn kind="gold" onClick={copy}>{copied ? "Copied" : "Copy message"}</Btn>
                      {selected.linkedin_url && (
                        <a href={selected.linkedin_url} target="_blank" rel="noreferrer" style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.ivory, border: "1px solid rgba(244,241,234,0.25)", textDecoration: "none" }}>Open their LinkedIn</a>
                      )}
                      <a href={`/console/letter/${selected.id}`} target="_blank" rel="noreferrer" style={{ ...syne, fontSize: "13px", fontWeight: 700, padding: "8px 14px", borderRadius: "8px", color: C.ivory, border: "1px solid rgba(244,241,234,0.25)", textDecoration: "none" }}>Print the letter</a>
                    </div>
                  </div>

                  {/* Log what you did */}
                  <div>
                    <p style={label}>Log what you did</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <Btn disabled={busy || selected.do_not_contact} onClick={() => log("linkedin")}>LinkedIn sent</Btn>
                      <Btn disabled={busy || selected.do_not_contact} onClick={() => log("letter")}>Letter posted</Btn>
                      <Btn disabled={busy || selected.do_not_contact} onClick={() => log("email")}>Email sent</Btn>
                    </div>

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
                <div style={{ marginTop: "14px" }}>
                  <Btn kind="primary" disabled={busy || !(draft.company ?? "").trim()} onClick={save}>{adding ? "Add prospect" : "Save changes"}</Btn>
                </div>
              </div>

              {/* History */}
              {!adding && selected && (
                <div>
                  <p style={label}>History</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" style={input} />
                    <Btn disabled={busy || !note.trim()} onClick={() => { const n = note; setNote(""); log("note", undefined, n); }}>Add</Btn>
                  </div>
                  {history.length === 0 ? (
                    <p style={{ ...syne, fontSize: "13px", color: C.faint }}>Nothing logged yet.</p>
                  ) : (
                    history.map((a) => (
                      <p key={a.id} style={{ ...syne, fontSize: "13px", color: C.dim, lineHeight: 1.6, padding: "6px 0", borderTop: `1px solid ${C.line}` }}>
                        <span style={{ ...mono, fontSize: "11px", color: C.faint, marginRight: "8px" }}>{new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                        {a.kind === "stage" ? `${ACTIVITY_LABEL.stage} ${STAGE_LABEL[a.outcome as Stage] ?? a.outcome}` : a.kind === "call" ? `${ACTIVITY_LABEL.call}: ${CALL_OUTCOME_LABEL[a.outcome as keyof typeof CALL_OUTCOME_LABEL] ?? a.outcome}` : ACTIVITY_LABEL[a.kind] ?? a.kind}
                        {a.detail ? `: ${a.detail}` : ""}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
