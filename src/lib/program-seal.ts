// Seals a completed Full Governance Program bundle (task #240).
//
// Calls the existing admin seal-document endpoint the same way every other
// internal caller authenticates to a CRON_SECRET protected route: as a
// bearer token on the Authorization header. Kept as a real HTTP call to
// /api/admin/seal-document rather than importing its internals directly, so
// every seal in the system, program bundles included, goes through the one
// endpoint that owns the hashing and chain-append logic.

interface SealResult {
  sealed: true;
  id: string;
  content_sha256: string;
  verify: string;
}

export interface ProgramSealInput {
  companyName: string;
  systemName: string;
  letterGrade: string;
  letterGradeScore: number;
  maxExposureGBP: number;
  jurisdictionLabel: string;
  documents: { label: string }[];
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://www.redflagaipro.com";
}

function buildSealContent(input: ProgramSealInput): { title: string; content: string } {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const company = input.companyName.trim() || "Unnamed company";

  const title = `Full Governance Program: ${company}, ${date}`;

  const content = `FULL GOVERNANCE PROGRAM — DELIVERY RECORD
${company}${input.systemName ? ` — ${input.systemName}` : ""}
Sealed ${date}

Documents delivered:
${input.documents.map((d) => `- ${d.label}`).join("\n")}

Governance letter grade: ${input.letterGrade} (${input.letterGradeScore}/100)
Maximum statutory exposure identified: up to £${Math.round(input.maxExposureGBP).toLocaleString("en-GB")} (${input.jurisdictionLabel})

This record seals that the Full Governance Program bundle above was generated and delivered to this customer as of the date above. It does not certify legal compliance — see each document's own disclaimer for what it does and does not cover.`;

  return { title, content };
}

// Returns null (never throws) if sealing fails for any reason — the bundle
// still delivers to the customer without a seal rather than blocking on it.
// The caller can retry sealing later since seal_id/sealed_at stay null.
export async function sealProgramBundle(input: ProgramSealInput): Promise<SealResult | null> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("program seal skipped: CRON_SECRET not set");
    return null;
  }

  const { title, content } = buildSealContent(input);

  try {
    const res = await fetch(`${appUrl()}/api/admin/seal-document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ title, content, category: "governance_program" }),
    });

    if (!res.ok) {
      console.error("program seal request failed:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = (await res.json()) as SealResult;
    if (!data?.sealed || !data.id || !data.content_sha256) return null;
    return data;
  } catch (err) {
    console.error("program seal error:", err);
    return null;
  }
}
