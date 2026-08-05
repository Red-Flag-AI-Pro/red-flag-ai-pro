import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgramDocumentPanel } from "@/components/program/ProgramDocumentPanel";
import { ProgramGeneratingStatus } from "@/components/program/ProgramGeneratingStatus";
import { ProgramRetryButton } from "@/components/program/ProgramRetryButton";
import { ProgramLetterGrade } from "@/components/program/ProgramLetterGrade";
import { DOCUMENT_LABELS } from "@/lib/program-documents";
import type { FinancialSnapshot } from "@/lib/program-financial";
import type { RegulatoryMappingRow } from "@/lib/program-regulatory-mapping";
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
            {order.letter_grade && order.letter_grade_score != null && (
              <ProgramLetterGrade grade={order.letter_grade} score={order.letter_grade_score} />
            )}

            {order.financial_snapshot && (
              <FinancialSnapshotPanel snapshot={order.financial_snapshot as FinancialSnapshot} />
            )}

            {order.regulatory_mapping && (
              <RegulatoryMappingTable rows={order.regulatory_mapping as RegulatoryMappingRow[]} />
            )}

            {order.boundary_record_id && (
              <div style={{
                background: "rgba(201,166,107,0.06)",
                border: "1px solid rgba(201,166,107,0.25)",
                padding: "1.5rem 1.75rem",
                marginBottom: "1.5rem",
              }}>
                <p style={labelStyle}>Boundary authorization record</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  A dated, hash chained record of who approved this system and when that authority expires — the same mechanism Sentinel clients use, included here as a one-time record rather than an ongoing one.
                </p>
                <a href="/boundary-records" style={{ ...syne, fontSize: "12.5px", color: "#C9A66B", fontWeight: 700, textDecoration: "none" }}>
                  View it in your Boundary Authorization Records →
                </a>
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ ...syne, fontSize: "1.05rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
                Your six documents
              </p>
              <p style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Each follows the exact structure of Red Flag&apos;s free tools, tailored to what you told us. None of these are legal advice or a substitute for review by counsel where one is warranted — see each document&apos;s own closing note.
              </p>
            </div>

            {DOCUMENT_LABELS.map((doc, i) => {
              const value = (order[doc.key] as { content?: string } | null)?.content;
              if (!value) return null;
              return (
                <ProgramDocumentPanel
                  key={doc.key}
                  number={String(i + 1).padStart(2, "0")}
                  title={doc.label}
                  content={value}
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

function RegulatoryMappingTable({ rows }: { rows: RegulatoryMappingRow[] }) {
  return (
    <div style={{ background: "#0F2138", border: "1px solid rgba(255,255,255,0.15)", padding: "2rem", marginBottom: "1.5rem", overflowX: "auto" }}>
      <p style={labelStyle}>Regulatory framework mapping</p>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
        <thead>
          <tr>
            {["Document", "Framework", "Article", "What it satisfies"].map((h) => (
              <th key={h} style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textAlign: "left", padding: "0.6rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ ...syne, fontSize: "12.5px", color: "white", fontWeight: 600, padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.document}</td>
              <td style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.framework}</td>
              <td style={{ ...mono, fontSize: "11.5px", color: "#C9A66B", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top" }}>{row.article}</td>
              <td style={{ ...syne, fontSize: "12.5px", color: "rgba(255,255,255,0.6)", padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", verticalAlign: "top", lineHeight: 1.6 }}>{row.whatItSatisfies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
