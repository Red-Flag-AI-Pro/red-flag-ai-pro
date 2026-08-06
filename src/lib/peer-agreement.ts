import { createServiceClient } from "@/lib/supabase/server";
import { WITNESS_CHAIN_USER_ID } from "@/lib/witness";

// Confirmations get sealed through the existing /api/admin/seal-document
// route with category "peer_agreement", so no new sealing mechanism was
// needed, just a way to read that category back out publicly. Deliberately
// returns an empty list rather than fabricating anyone, this only ever
// shows peers who actually confirmed.
export interface PeerConfirmation {
  title: string;
  sealed_by_name: string;
  sealed_by_org: string;
  content_sha256: string;
  verifyId: string;
  sealedAt: string;
}

export async function getConfirmedPeers(): Promise<PeerConfirmation[]> {
  const supabase = await createServiceClient();

  const { data } = await supabase
    .from("audit_log")
    .select("id, created_at, details")
    .eq("user_id", WITNESS_CHAIN_USER_ID)
    .eq("action", "concept.sealed")
    .eq("details->>category", "peer_agreement")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => {
    const details = row.details as {
      title?: string;
      sealed_by_name?: string;
      sealed_by_org?: string;
      content_sha256?: string;
    };
    return {
      title: details.title ?? "Unnamed peer",
      sealed_by_name: details.sealed_by_name ?? "",
      sealed_by_org: details.sealed_by_org ?? "",
      content_sha256: details.content_sha256 ?? "",
      verifyId: row.id,
      sealedAt: row.created_at,
    };
  });
}
