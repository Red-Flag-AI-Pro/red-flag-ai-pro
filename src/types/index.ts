export type Plan = "free" | "scanner" | "enterprise" | "sentinel";
export type ScanStatus = "pending" | "complete" | "error";
export type Severity = "low" | "medium" | "high";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  title: string;
  content: string;
  score: number;
  status: ScanStatus;
  created_at: string;
  // Opt-in public sharing. Private by default; set true only when the owner
  // shares the report. Gates the public share page and badge.
  is_public?: boolean;
}

export type Disposition = "resolved" | "accepted_risk" | "not_applicable";

export type InitialRead = "real_issue" | "unsure" | "not_applicable";

export interface ScanFlag {
  id: string;
  scan_id: string;
  category: string;
  severity: Severity;
  text_excerpt: string | null;
  flag_description: string;
  suggestion: string | null;
  disposition: Disposition | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  reviewer_note: string | null;
  reviewer_role: string | null;
  reviewer_mandate: string | null;
  // Commit before reveal: the reviewer's own read, recorded before the AI's
  // reasoning was shown to them. Null on flags reviewed before this existed.
  initial_read: InitialRead | null;
  initial_read_note: string | null;
  initial_read_at: string | null;
}

export interface BoundaryOption {
  label: string;
}

export interface BoundaryRisk {
  risk: string;
  mitigation: string;
}

export interface BoundaryEvidence {
  label: string;
}

// A falsifier: the observable condition that voids the grant. "This authority
// stops being valid if X becomes true." The falsifier IS the expiry condition —
// no separate revocation mechanism needed, the same written-down test that
// gates approval also triggers the lapse.
export interface BoundaryFalsifier {
  condition: string;
}

// The authority spectrum, from a human deciding everything to a system
// deciding without anyone in the loop for each instance. Same shape as the
// assistant/operator/orchestrator framing used across the governance field.
export type AuthorityMode = "human_decides" | "ai_recommends" | "ai_decides";

export interface BoundaryAuthorizationRecord {
  id: string;
  user_id: string;
  decision: string;
  owner_name: string;
  owner_role: string;
  options_considered: BoundaryOption[];
  risks_accepted: BoundaryRisk[];
  evidence: BoundaryEvidence[];
  decision_date: string;
  // The "whether" leg: a grant needs a shelf life stamped on it the same way
  // a signature needs a name. Null only on records created before this field
  // existed — new records require it.
  expires_at: string | null;
  expiry_conditions: BoundaryFalsifier[];
  // If this authorization replaces an earlier one (the role holder changed),
  // this points at the record it supersedes, so the chain of custody for the
  // mandate is provable, not just each record standing alone.
  supersedes_id: string | null;
  // Who holds the duty to renew this authorization or arrange a successor
  // before it lapses — distinct from owner_name, who holds the authority
  // itself. A lapse only tells you the seat went empty; this is who the
  // lapse-check cron names as accountable for it having gone empty. Null on
  // records created before this field existed, and optional going forward.
  continuity_owner_name: string | null;
  continuity_owner_role: string | null;
  // An API key or agent credential is the same kind of grant as a decision:
  // standing authority for a system to act. credential_reference identifies
  // which credential (key name or last four characters), never the secret.
  grant_type: "decision" | "credential";
  credential_reference: string | null;
  // Where authority actually sits for this system. Null means it was never
  // stated, which is itself the finding the authority map surfaces.
  authority_mode: AuthorityMode | null;
  created_at: string;
  updated_at: string;
}

export type VideoJobStatus = "pending" | "processing" | "complete" | "error";

export interface VideoJob {
  id: string;
  scan_id: string;
  user_id: string;
  status: VideoJobStatus;
  video_url: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  score: number;
  flags: Omit<ScanFlag, "id" | "scan_id" | "disposition" | "reviewed_by" | "reviewed_at" | "reviewer_note" | "reviewer_role" | "reviewer_mandate" | "initial_read" | "initial_read_note" | "initial_read_at">[];
}
