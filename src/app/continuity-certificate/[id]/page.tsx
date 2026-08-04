import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { verifyPublicEntry } from "@/lib/audit-log";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function monthsBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
}

const PLAN_DISPLAY: Record<string, string> = {
  sentinel: "Sentinel",
  scanner: "Pro",
  enterprise: "Growth",
  free: "Starter",
};

export default async function ContinuityCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await verifyPublicEntry(id);

  const valid = entry.found && entry.action === "account_coverage_lapsed" && entry.memberSince && entry.createdAt;

  return (
    <>
      <Navbar />
      <div style={{ background: "#0A1628", minHeight: "100vh" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "8rem 1.5rem 6rem" }}>
          {!valid ? (
            <div style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ ...syne, fontSize: "14px", color: "rgba(244,241,234,0.6)" }}>No continuity certificate found for that ID.</p>
            </div>
          ) : (
            <>
              <p style={{ ...syne, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E5484D", marginBottom: "1.5rem", textAlign: "center" }}>
                Certificate of continuous coverage
              </p>
              <h1 style={{ ...syne, fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem", textAlign: "center", color: "#F4F1EA" }}>
                {monthsBetween(entry.memberSince!, entry.createdAt!)} months of continuous {PLAN_DISPLAY[entry.fromPlan ?? "sentinel"]} governance coverage
              </h1>
              <p style={{ ...syne, fontSize: "1rem", color: "rgba(244,241,234,0.5)", lineHeight: 1.7, marginBottom: "2.5rem", textAlign: "center" }}>
                {formatDate(entry.memberSince!)} to {formatDate(entry.createdAt!)}. Sealed the moment coverage ended, not reconstructed afterward.
              </p>

              <div style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", padding: "1.75rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", textAlign: "center" }}>
                  <div>
                    <p style={{ ...syne, fontSize: "1.75rem", fontWeight: 800, color: "#F4F1EA" }}>{entry.totalChecks ?? 0}</p>
                    <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.5)" }}>checks performed</p>
                  </div>
                  <div>
                    <p style={{ ...syne, fontSize: "1.75rem", fontWeight: 800, color: "#F4F1EA" }}>{entry.sealedEvents ?? 0}</p>
                    <p style={{ ...syne, fontSize: "12px", color: "rgba(244,241,234,0.5)" }}>sealed audit events</p>
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: "10px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "1.5rem", textAlign: "center", marginBottom: "2rem" }}>
                <p style={{ ...syne, fontSize: "14px", fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>✓ Independently verifiable</p>
                <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.6)", lineHeight: 1.6, marginBottom: "1rem" }}>
                  This certificate is generated from a single sealed audit log entry, cryptographically hash chained and independently timestamped. Confirm it has not been altered since it was sealed.
                </p>
                <Link
                  href={`/verify?id=${id}`}
                  style={{ ...syne, fontSize: "13px", fontWeight: 700, color: "#F4F1EA", textDecoration: "underline" }}
                >
                  Verify this record →
                </Link>
              </div>

              <p style={{ ...syne, fontSize: "13px", color: "rgba(244,241,234,0.4)", lineHeight: 1.7, textAlign: "center" }}>
                The record grows with every check. It only stays continuous for as long as the plan does, it does not reset if you pick it back up.
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
