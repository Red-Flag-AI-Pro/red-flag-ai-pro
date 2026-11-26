import { createServiceClient } from "@/lib/supabase/server";

// One place that stores a visitor's request in our own database, so a request
// can never depend on an email or a third party list to exist.

export type LeadRequestKind = "site-check" | "audit" | "sentinel";

export interface LeadRequest {
  kind: LeadRequestKind;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
}

const clip = (v: string | undefined, max: number) => (v ? v.trim().slice(0, max) || null : null);

/**
 * Saves the request. Returns true once it is safely stored.
 *
 * If the lead_requests table cannot be written (for example the migration has
 * not been applied yet), it falls back to the older tool_leads table, which
 * keeps at least the address and the kind of request.
 */
export async function saveLeadRequest(req: LeadRequest): Promise<boolean> {
  const email = req.email.trim().toLowerCase();
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase.from("lead_requests").insert({
      kind: req.kind,
      email,
      name: clip(req.name, 200),
      phone: clip(req.phone, 60),
      company: clip(req.company, 200),
      website: clip(req.website, 500),
      message: clip(req.message, 4000),
    });
    if (!error) return true;
    console.error(`lead_requests save failed for ${req.kind}:`, error.message);

    // A site check with no website attached is no use to anyone, so that
    // kind fails loudly instead and the visitor is told to email us.
    if (req.kind === "site-check") return false;

    const { error: fallbackError } = await supabase.from("tool_leads").insert({ email, tool: `${req.kind}-request` });
    if (fallbackError) {
      console.error(`tool_leads fallback failed for ${req.kind}:`, fallbackError.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`lead request save threw for ${req.kind}:`, err);
    return false;
  }
}

/**
 * Tidies whatever a visitor typed into a website box into a plain address,
 * or returns null if it is not one. Only http and https are accepted.
 */
export function normaliseWebsite(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 500 || /\s/.test(raw)) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
