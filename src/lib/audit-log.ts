import { createServiceClient } from "@/lib/supabase/server";

// Writes always go through the service role, bypassing RLS, so a logged-in
// user can never insert or edit their own audit trail — only read it.
export async function logAuditEvent(
  userId: string,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = await createServiceClient();
    await supabase.from("audit_log").insert({ user_id: userId, action, details });
  } catch {
    // Audit logging must never break the action it's logging.
  }
}
