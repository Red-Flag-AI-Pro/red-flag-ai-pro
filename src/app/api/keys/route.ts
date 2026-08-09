import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";
import { createHash, randomBytes } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, approved_threshold, model_version, hard_enforcement, hard_enforcement_accepted_by, hard_enforcement_accepted_at, created_at, last_used_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum 5 API keys allowed. Delete one to create another." }, { status: 400 });
  }

  const body = await request.json();
  const name: string = (body.name ?? "").trim() || "My API Key";
  const modelVersion: string | null = typeof body.model_version === "string" && body.model_version.trim() ? body.model_version.trim() : null;

  const rawKey = "rfp_" + randomBytes(24).toString("hex");
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12) + "…";

  const { data, error } = await supabase
    .from("api_keys")
    .insert({ user_id: user.id, name, key_hash: keyHash, key_prefix: keyPrefix, model_version: modelVersion })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to create key." }, { status: 500 });

  // Return the full key once — never stored
  return NextResponse.json({ ...data, raw_key: rawKey }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id: string = (body.id ?? "").trim();
  const approvedThreshold: unknown = body.approved_threshold;
  const modelVersionProvided = Object.prototype.hasOwnProperty.call(body, "model_version");
  const modelVersion: unknown = body.model_version;
  const hardEnforcementProvided = Object.prototype.hasOwnProperty.call(body, "hard_enforcement");
  const hardEnforcement: unknown = body.hard_enforcement;

  if (!id) return NextResponse.json({ error: "Key id is required." }, { status: 400 });

  const update: {
    approved_threshold?: number;
    model_version?: string | null;
    hard_enforcement?: boolean;
    hard_enforcement_accepted_by?: string | null;
    hard_enforcement_accepted_at?: string | null;
  } = {};

  if (approvedThreshold !== undefined) {
    if (typeof approvedThreshold !== "number" || !Number.isFinite(approvedThreshold) || approvedThreshold < 0 || approvedThreshold > 100) {
      return NextResponse.json({ error: "approved_threshold must be a number between 0 and 100." }, { status: 400 });
    }
    update.approved_threshold = Math.round(approvedThreshold);
  }

  if (modelVersionProvided) {
    if (modelVersion !== null && typeof modelVersion !== "string") {
      return NextResponse.json({ error: "model_version must be a string or null." }, { status: 400 });
    }
    update.model_version = typeof modelVersion === "string" && modelVersion.trim() ? modelVersion.trim() : null;
  }

  if (hardEnforcementProvided) {
    if (typeof hardEnforcement !== "boolean") {
      return NextResponse.json({ error: "hard_enforcement must be a boolean." }, { status: 400 });
    }
    update.hard_enforcement = hardEnforcement;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  // Detection, enforcement, and consequence ownership are different
  // governance functions (Evelyne-Claudia Y., LinkedIn 9 Aug 2026) -- turning
  // hard enforcement on is the moment someone accepts the risk of a false
  // positive blocking live traffic. That acceptance gets a name and a date
  // here, at the moment it's chosen, not reconstructed later from a generic
  // audit entry. Turning it off clears the acceptance, since nobody is
  // currently accepting anything.
  if (hardEnforcementProvided) {
    if (hardEnforcement) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      update.hard_enforcement_accepted_by = (profile?.full_name as string | undefined)?.trim() || user.email || "Unnamed account owner";
      update.hard_enforcement_accepted_at = new Date().toISOString();
    } else {
      update.hard_enforcement_accepted_by = null;
      update.hard_enforcement_accepted_at = null;
    }
  }

  const { data, error } = await supabase
    .from("api_keys")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, name, key_prefix, approved_threshold, model_version, hard_enforcement, hard_enforcement_accepted_by, hard_enforcement_accepted_at")
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to update key." }, { status: 500 });

  // Changing a key's approved scope OR its declared model/vendor version is a
  // governance event either way — both are now part of the permission
  // fingerprint (src/lib/permission-fingerprint.ts), sealed so the timeline
  // shows the change happened, whoever did or didn't re-approve it. If a
  // boundary record's sealed fingerprint no longer matches after this, the
  // drift check (live on /enforce, daily via cron) surfaces it.
  await logAuditEvent(
    user.id,
    "api_key.scope_changed",
    {
      api_key_id: data.id,
      key_name: data.name,
      key_prefix: data.key_prefix,
      approved_threshold: data.approved_threshold,
      model_version: data.model_version,
      hard_enforcement: data.hard_enforcement,
      hard_enforcement_accepted_by: data.hard_enforcement_accepted_by,
      hard_enforcement_accepted_at: data.hard_enforcement_accepted_at,
    },
    { timestamp: true }
  );

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await supabase.from("api_keys").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
