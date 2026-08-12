import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgramDocumentPanel } from "@/components/program/ProgramDocumentPanel";
import { ProgramGeneratingStatus } from "@/components/program/ProgramGeneratingStatus";
import { ProgramRetryButton } from "@/components/program/ProgramRetryButton";
import { ProgramLetterGrade } from "@/components/program/ProgramLetterGrade";
import { DOCUMENT_LABELS, type SignoffEvent } from "@/lib/program-documents";
import type { FinancialSnapshot } from "@/lib/program-financial";
import type { RegulatoryMappingRow } from "@/lib/program-regulatory-mapping";
import type { RiskRegisterRow, RiskLikelihood, RiskImpact } from "@/lib/program-risk-register";
import type { ProgramTimeline as ProgramTimelineType } from "@/lib/program-timeline";
import { getDocumentReviewStatus, type DocumentReviews } from "@/lib/program-document-review";
import { applyStalenessCeiling, type LetterGrade } from "@/lib/program-grade";
import { detectGenericReasoning, computeSignerSpecificityRates } from "@/lib/signoff-genericity";
import React from "react";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

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

function fmtGBP(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return "£" + (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + "M";
  }
  if (n >= 1000) return "£" + Math.round(n / 1000) + "k";
  return "£" + Math.round(n);
}

export default async function ProgramDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/audit/program/${id}`);

  const { data: order } = await supabase
    .from("program_orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  if (order.status === "pending") {
    redirect("/audit/program-intake");
  }

  const companyName = (order.intake as { companyName?: string } | null)?.companyName?.trim();

  let boundaryRecord: { expires_at: string; owner_name: string; owner_role: string } | null = null;
  if (order.boundary_record_id) {
    const { data } = await supabase
      .from("boundary_authorization_records")
      .select("expires_at, owner_name, owner_role")
      .eq("id", order.boundary_record_id)
      .single();
    boundaryRecord = data ?? null;
  }

  // Live, not just the value struck at generation -- see applyStalenessCeiling
  // for why a document going stale after delivery has to be able to reopen
  // the grade, the same way a gap at generation already can.
  const documentReviews = order.document_reviews as DocumentReviews | null;
  const staleCount = order.delivered_at
    ? DOCUMENT_LABELS.filter((doc) => {
        const value = (order[doc.key] as { content?: string } | null)?.content;
        if (!value) return false;
        return getDocumentReviewStatus(doc.key, order.delivered_at, documentReviews).stale;
      }).length
    : 0;
  const liveGrade =
    order.letter_grade && order.letter_grade_score != null
      ? applyStalenessCeiling(
          {
            score: order.letter_grade_score,
            grade: order.letter_grade as LetterGrade,
            breakdown: [],
            capped: Boolean(order.letter_grade_capped),
            notStartedCount: order.letter_grade_not_started_count ?? 0,
          },
          staleCount
        )
      : null;

  const documentContents: Partial<Record<string, string>> = {};
  for (const doc of DOCUMENT_LABELS) {
    const content = (order[doc.key] as { content?: string } | null)?.content;
    if (content) documentContents[doc.key] = content;
  }

  const genericReasoningFindings = detectGenericReasoning(
    documentContents,
    order.artifact_signoffs as Record<string, SignoffEvent[]> | null
  );

  // Per-tenant rate, never cross-tenant -- see signoff-genericity.ts. Pull
  // this customer's own other delivered orders (RLS already restricts the
  // select to user_id, same pattern as the data-room export) so a signer's
  // rate reflects everything they've certified for this customer, not just
  // the one order this page happens to be showing.
  const { data: siblingOrders } = await supabase
    .from("program_orders")
    .select("id, artifact_signoffs, dpia, fria, ai_use_policy, incident_checklist, monitoring_plan, documentation")
    .eq("user_id", user.id)
    .eq("status", "delivered");

  const signerSpecificityRates = computeSignerSpecificityRates(
    (siblingOrders ?? []).map((o) => {
      const docs: Partial<Record<string, string>> = {};
      for (const doc of DOCUMENT_LABELS) {
        const content = (o[doc.key] as { content?: string } | null)?.content;
        if (content) docs[doc.key] = content;
      }
      return {
        documents: docs,
        signoffsByDocument: o.artifact_signoffs as Record<string, SignoffEvent[]> | null,
      };
    })
  ).filter((r) => r.totalNotes >= 2);

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3.5rem 1.5rem 4rem" }}>
        <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.75rem", textAlign: "center" }}>
          Full Governance Program
        </p>
        <h1 style={{ ...syne, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "2.5rem", textAlign: "center" }}>
          {companyName ? `${companyName}'s governance bundle` : "Your governance bundle"}
        </h1>

        {order.status === "generating" && <ProgramGeneratingStatus />}

        {order.status === "error" && (
          <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
            <p style={{ ...syne, fontSize: "15px", fontWeight: 700, color: "#f87171", marginBottom: "0.75rem" }}>
              Something went wrong generating your documents.
            </p>
            <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Nothing was lost — your answers are saved. Try again, or email support@redflagaipro.com if it keeps happening.
            </p>
            <ProgramRetryButton orderId={id} />
          </div>
        )}

        {order.status === "delivered" && (
          <>
            {liveGrade && (
              <ProgramLetterGrade
                grade={liveGrade.grade}
                score={liveGrade.score}
                capped={liveGrade.capped}
                notStartedCount={liveGrade.notStartedCount}
                staleCount={liveGrade.staleCount}
              />
            )}

            {order.financial_snapshot && (
              <FinancialSnapshotPanel snapshot={order.financial_snapshot as FinancialSnapshot} />
            )}

            {order.regulatory_mapping && (
              <RegulatoryMappingTable rows={order.regulatory_mapping as RegulatoryMappingRow[]} />
            )}

            {order.risk_register && (order.risk_register as RiskRegisterRow[]).length > 0 && (
              <RiskRegisterTable rows={order.risk_register as RiskRegisterRow[]} />
            )}

            {order.timeline && (order.timeline as ProgramTimelineType).phases?.length > 0 && (
              <ProgramTimelinePanel timeline={order.timeline as ProgramTimelineType} />
            )}

            {order.boundary_record_id && (
              <div style={{
                background: "rgba(201,166,107,0.06)",
                border: "1px solid rgba(201,166,107,0.25)",
                padding: "1.5rem 1.75rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <p style={{ ...labelStyle, marginBottom: 0 }}>Boundary authorization record</p>
                  {boundaryRecord && (() => {
                    const today = new Date().toISOString().slice(0, 10);
                    const lapsed = boundaryRecord.expires_at < today;
                    const daysLeft = Math.ceil((new Date(boundaryRecord.expires_at).getTime() - new Date(today).getTime()) / 86_400_000);
                    return (
                      <span style={{
                        ...mono, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "3px 10px", borderRadius: "9999px",
                        color: lapsed ? "#f87171" : "#4ade80",
                        background: lapsed ? "rgba(248,113,113,0.12)" : "rgba(74,222,128,0.12)",
                        border: `1px solid ${lapsed ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)"}`,
                      }}>
                        {lapsed ? "Lapsed" : `Active · expires in ${daysLeft} days`}
                      </span>
                    );
                  })()}
                </div>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  A dated, hash chained record of who approved this system and when that authority expires — the same mechanism Sentinel clients use, included here as a one-time record rather than an ongoing one. This status updates automatically; nothing here depends on remembering to check back.
                </p>
                <a href="/boundary-records" style={{ ...syne, fontSize: "12.5px", color: "#C9A66B", fontWeight: 700, textDecoration: "none" }}>
                  View it in your Boundary Authorization Records →
                </a>
              </div>
            )}

            {genericReasoningFindings.length > 0 && (
              <div style={{
                background: "rgba(248,113,113,0.06)",
                borderRadius: "10px",
                border: "1px solid rgba(248,113,113,0.25)",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
              }}>
                <p style={{ ...labelStyle, color: "#f87171", marginBottom: "0.6rem" }}>Reasoning check</p>
                <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  Brad Wolfe, 12 Aug 2026: a sign off certifies an instance, but a signer who only ever checked that the process ran will leave the same reasoning behind regardless of what&apos;s actually in the document. This checks each note for anything specific to the document it certifies, a figure, a citation, a detail that traces back to your own answers rather than the template. A note with nothing specific in it is flagged below, whether or not it repeats another note word for word.
                </p>
                {genericReasoningFindings.map((finding, i) => (
                  <p key={i} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: i === genericReasoningFindings.length - 1 ? 0 : "0.6rem" }}>
                    <strong style={{ color: "white" }}>{finding.signerName}</strong> certified the {DOCUMENT_LABELS.find((d) => d.key === finding.documentKey)?.label ?? finding.documentKey} with nothing specific to that document in the note: &ldquo;{finding.note}&rdquo;
                  </p>
                ))}
              </div>
            )}

            {signerSpecificityRates.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
              }}>
                <p style={{ ...labelStyle, marginBottom: "0.6rem" }}>Signer track record</p>
                <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  Scoped to your own orders only, never compared against other customers. What share of each signer&apos;s notes, across everything they&apos;ve certified for you, contain nothing specific to the document.
                </p>
                {signerSpecificityRates.map((rate, i) => (
                  <p key={i} style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: i === signerSpecificityRates.length - 1 ? 0 : "0.5rem" }}>
                    <strong style={{ color: "white" }}>{rate.signerName}</strong>: {rate.genericNotes} of {rate.totalNotes} notes ({Math.round(rate.rate * 100)}%) carry nothing specific to the document they certify.
                  </p>
                ))}
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ ...syne, fontSize: "1.05rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
                Your six documents
              </p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                Each follows the exact structure of Red Flag&apos;s free tools, tailored to what you told us. None of these are legal advice or a substitute for review by counsel where one is warranted — see each document&apos;s own closing note.
              </p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Two separate facts, not one. The text below is the sealed original — proof of what was agreed on delivery, it never changes. Whether it&apos;s still accurate is a different question: each document carries its own review clock (six months for the two tied to how the system currently runs, twelve for the rest), confirm it still matches to reset that clock, or mark it as changed if it doesn&apos;t. An unreviewed document past its date drops out of any AI Governance Data Room export you run.
              </p>
            </div>

            {DOCUMENT_LABELS.map((doc, i) => {
              const value = (order[doc.key] as { content?: string } | null)?.content;
              if (!value) return null;
              const review = order.delivered_at
                ? getDocumentReviewStatus(doc.key, order.delivered_at, order.document_reviews as DocumentReviews | null)
                : null;
              const docReviewEntry = (order.document_reviews as DocumentReviews | null)?.[doc.key];
              const currentEntry = (order.current_documents as Record<string, { note: string; updated_at: string }> | null)?.[doc.key];
              const signoffEvents = (order.artifact_signoffs as Record<string, SignoffEvent[]> | null)?.[doc.key] ?? [];
              return (
                <ProgramDocumentPanel
                  key={doc.key}
                  number={String(i + 1).padStart(2, "0")}
                  title={doc.label}
                  content={value}
                  orderId={id}
                  documentKey={doc.key}
                  dueAt={review?.dueAt}
                  stale={review?.stale}
                  everReviewed={review?.everReviewed}
                  lastReviewedAt={review?.lastReviewedAt}
                  sealedAt={order.sealed_at ?? undefined}
                  currentNote={currentEntry?.note}
                  currentUpdatedAt={currentEntry?.updated_at}
                  exercisable={doc.key === "incident_checklist"}
                  exercisedAt={docReviewEntry?.exercised_at}
                  exerciseNote={docReviewEntry?.exercise_note}
                  exercisedBy={docReviewEntry?.exercised_by}
                  exercisedFirstTime={docReviewEntry?.exercised_first_time}
                  signoffEvents={signoffEvents}
                />
              );
            })}

            <div style={{
              background: order.seal_id ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${order.seal_id ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.1)"}`,
              padding: "1.5rem 1.75rem",
              marginTop: "1rem",
              textAlign: "center",
            }}>
              {order.seal_id ? (
                <>
                  <p style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>
                    This delivery is sealed and independently verifiable.
                  </p>
                  <a
                    href={`https://www.redflagaipro.com/verify?id=${order.seal_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...syne, fontSize: "13px", color: "#E5484D", fontWeight: 700, textDecoration: "none" }}
                  >
                    Verify this record →
                  </a>
                </>
              ) : (
                <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  Sealing this delivery did not complete yet. Your documents above are unaffected — refresh this page shortly, or email support@redflagaipro.com if a verify link never appears.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

function FinancialSnapshotPanel({ snapshot }: { snapshot: FinancialSnapshot }) {
  return (
    <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", padding: "2rem", marginBottom: "1.5rem" }}>
      <p style={labelStyle}>Financial exposure snapshot</p>
      <p className="font-display" style={{ ...syne, fontSize: "clamp(2.2rem, 6vw, 2.8rem)", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "0.5rem" }}>
        {fmtGBP(snapshot.maxExposureGBP)}
      </p>
      <p style={{ ...mono, fontSize: "12px", color: "#C9A66B", marginBottom: "1.25rem" }}>
        Maximum statutory exposure under {snapshot.law} ({snapshot.jurisdictionLabel})
      </p>
      <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: snapshot.riskFactors.length ? "1.25rem" : 0 }}>
        {snapshot.explanation}
      </p>
      {snapshot.riskFactors.length > 0 && (
        <div>
          <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.6rem" }}>
            Factors that shape this
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {snapshot.riskFactors.map((f, i) => (
              <li key={i} style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "0.3rem" }}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const GAP_STATUS_CHIP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  not_started: { label: "Not started", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
  partial: { label: "Partial", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)" },
  in_place: { label: "In place", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
};

function RegulatoryMappingTable({ rows }: { rows: RegulatoryMappingRow[] }) {
  // Older stored programs (generated before task #278) have no status field —
  // show the column only when at least one row actually has one, rather than
  // rendering an empty "—" column for every historical order.
  const hasStatus = rows.some((r) => r.status);
  return (
    <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", padding: "2rem", marginBottom: "1.5rem", overflowX: "auto" }}>
      <p style={labelStyle}>Regulatory framework mapping</p>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
        <thead>
          <tr>
            {["Document", "Framework", "Article", "What it satisfies", ...(hasStatus ? ["Status"] : [])].map((h) => (
              <th key={h} style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const chip = row.status ? GAP_STATUS_CHIP[row.status] : null;
            return (
              <tr key={i}>
                <td style={{ ...syne, fontSize: "12.5px", color: "white", fontWeight: 600, padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.document}</td>
                <td style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.framework}</td>
                <td style={{ ...mono, fontSize: "11.5px", color: "#C9A66B", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.article}</td>
                <td style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", lineHeight: 1.6 }}>{row.whatItSatisfies}</td>
                {hasStatus && (
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>
                    {chip && (
                      <span style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", color: chip.color, background: chip.bg, border: `1px solid ${chip.border}`, borderRadius: "9999px", padding: "3px 10px", whiteSpace: "nowrap" }}>
                        {chip.label}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hasStatus && (
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem", lineHeight: 1.6 }}>
          Status is derived honestly from your own intake answers, never invented: how many of the fields that actually feed each document were left blank when you filled this in.
        </p>
      )}
    </div>
  );
}

const RISK_LEVEL_COLOR: Record<RiskLikelihood | RiskImpact, string> = {
  low: "#4ade80",
  medium: "#fbbf24",
  high: "#f87171",
};

function RiskRegisterTable({ rows }: { rows: RiskRegisterRow[] }) {
  return (
    <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", padding: "2rem", marginBottom: "1.5rem", overflowX: "auto" }}>
      <p style={labelStyle}>Risk register</p>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
        <thead>
          <tr>
            {["ID", "Risk", "Likelihood", "Impact", "Mitigation"].map((h) => (
              <th key={h} style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ ...mono, fontSize: "11.5px", color: "#C9A66B", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.id}</td>
              <td style={{ ...syne, fontSize: "12.5px", color: "white", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", lineHeight: 1.6 }}>{row.description}</td>
              <td style={{ ...syne, fontSize: "12px", fontWeight: 700, color: RISK_LEVEL_COLOR[row.likelihood], padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", textTransform: "capitalize" }}>{row.likelihood}</td>
              <td style={{ ...syne, fontSize: "12px", fontWeight: 700, color: RISK_LEVEL_COLOR[row.impact], padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", textTransform: "capitalize" }}>{row.impact}</td>
              <td style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", lineHeight: 1.6 }}>{row.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem", lineHeight: 1.6 }}>
        Each risk is derived from specific combinations of your own intake answers, not a live scan, and not invented. An empty register above means none of these specific patterns were found, not that nothing could ever go wrong.
      </p>
    </div>
  );
}

const PHASE_COLOR: Record<string, string> = {
  now: "#f87171",
  next: "#fbbf24",
  ongoing: "#4ade80",
};

function ProgramTimelinePanel({ timeline }: { timeline: ProgramTimelineType }) {
  return (
    <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", padding: "2rem", marginBottom: "1.5rem" }}>
      <p style={labelStyle}>Phased timeline</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {timeline.phases.map((phase) => (
          <div key={phase.key} style={{ borderLeft: `3px solid ${PHASE_COLOR[phase.key] ?? "#C9A66B"}`, paddingLeft: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
              <span style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "white" }}>{phase.label}</span>
              <span style={{ ...mono, fontSize: "11px", color: PHASE_COLOR[phase.key] ?? "#C9A66B" }}>{phase.window}</span>
            </div>
            <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "0.6rem" }}>{phase.rationale}</p>
            <ul style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {phase.items.map((item) => (
                <li key={item.document} style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.75)" }}>{item.document}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {timeline.regulatoryDeadlines.length > 0 && (
        <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9A66B", marginBottom: "0.75rem" }}>
            EU AI Act deadlines that apply to you
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {timeline.regulatoryDeadlines.map((d) => (
              <div key={d.date}>
                <p style={{ ...mono, fontSize: "12px", color: "white", fontWeight: 700 }}>{d.date} <span style={{ ...syne, fontWeight: 400, color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>— {d.status}</span></p>
                <p style={{ ...syne, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{d.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "1.25rem", lineHeight: 1.6 }}>
        Phases are ordered by the same gap status shown in the regulatory mapping above: what has nothing behind it goes first. No phase length or deadline here is invented.
      </p>
    </div>
  );
}
