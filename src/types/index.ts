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
  flags: Omit<ScanFlag, "id" | "scan_id" | "disposition" | "reviewed_by" | "reviewed_at" | "reviewer_note" | "reviewer_role" | "reviewer_mandate">[];
}
