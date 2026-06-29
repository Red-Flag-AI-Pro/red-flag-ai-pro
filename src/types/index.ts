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
  flags: Omit<ScanFlag, "id" | "scan_id" | "disposition" | "reviewed_by" | "reviewed_at" | "reviewer_note">[];
}
