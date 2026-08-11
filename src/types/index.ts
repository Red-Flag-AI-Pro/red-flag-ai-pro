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

// Moe Hachem, LinkedIn 9 Aug 2026, on evidence platforms for legal/compliance
// work: separate confirmed material from inference before anything gets
// relied on. "keyword" = matched by the deterministic rule engine
// (analyzer.ts) — the same finding is reproducible by anyone re-running the
// rules. "ai" = added by the AI enhancement pass (ai-enhance.ts) on its own
// initiative, not tied to a specific keyword rule. A keyword flag whose
// wording the AI pass rewrote is still "keyword" — the finding itself came
// from the deterministic engine, only its phrasing was improved.
export type FlagSource = "keyword" | "ai";

export interface ScanFlag {
  id: string;
  scan_id: string;
  category: string;
  severity: Severity;
  text_excerpt: string | null;
  flag_description: string;
  suggestion: string | null;
  source: FlagSource;
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
  // A distinct, later confirmation that the underlying issue was actually
  // fixed, separate from the disposition made at review time.
  remediated_at: string | null;
  remediated_note: string | null;
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

// Moe Hachem and Midhun K., LinkedIn 10-11 Aug 2026, independently:
// ownership tells you whether the switch could be taken away, not whether
// anyone has a tested plan for the day it is. Distinct from required_by
// (who required the boundary) and stop_authority (who can halt it) --
// this is what the decision itself depends on outside the account, and
// whether losing that dependency was ever rehearsed rather than assumed.
// fallback_note is free text on what the tested (or untested) fallback
// actually is. added_at is stamped client-side when the entry is added,
// same as expiry_conditions' triggered_at pattern.
export interface ExternalDependency {
  name: string;
  organisation: string | null;
  fallback_tested: boolean;
  fallback_note: string | null;
  added_at: string;
}

// Distinct from risks_accepted: risks_accepted is the owner's OWN stated
// risk, accepted knowingly at signing. This is a warning raised by someone
// ELSE that got overridden -- a different fact, and one a clean
// risks_accepted list can hide entirely. override_reason is required, not
// optional -- a warning on record with no stated reason for overriding it
// is not a disclosure, it's the same silence with an extra field.
export interface BoundaryWarning {
  source_name: string;
  source_role: string | null;
  warning_text: string;
  overridden_at: string;
  override_reason: string;
}

// A falsifier: the observable condition that voids the grant. "This authority
// stops being valid if X becomes true." The falsifier IS the expiry condition —
// no separate revocation mechanism needed, the same written-down test that
// gates approval also triggers the lapse.
// triggered_at: when someone who noticed this condition become true flagged
// it. Setting it is what actually pulls expires_at forward — before this
// field existed, falsifiers were text nobody could act on, display only.
export interface BoundaryFalsifier {
  condition: string;
  triggered_at?: string | null;
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
  // Brad Wolfe, "The CEO's New Job" thread, 10 Aug 2026: "the person has to
  // be told. A seat named in a minute nobody circulated is not
  // accountability, it is a document that will be produced later at a
  // worse moment." Same mechanism as required_by and completion
  // confirmation, a token gating a link only the named owner acts on.
  owner_confirmed_token: string | null;
  owner_confirmed_at: string | null;
  owner_confirmed_name: string | null;
  owner_confirmed_email: string | null;
  // scan_flags stamps every sign-off with reviewer_role/reviewer_mandate
  // (see ScanFlag below); boundary confirmations never had the equivalent --
  // a name and an email, never the capacity confirmed in. Same treatment
  // for required_by_confirmed_role and completion_confirmed_role below.
  owner_confirmed_role: string | null;
  // owner_confirmed_at only ever answers "did they once know they held this
  // seat" -- nothing re-checks later whether they still do, and roles
  // change. Reuses owner_confirmed_token: requesting confirmation again on
  // an already-confirmed record overwrites it with a fresh token rather
  // than the original being reusable twice, but the result lands here, not
  // over owner_confirmed_at/name/email -- the first-confirmed fact stays
  // permanent, reconfirmation is a separate, later fact. No
  // owner_reconfirmed_email: the reconfirmation link only asks for name and
  // role, not a second capture of the same address.
  owner_reconfirmation_requested_at: string | null;
  owner_reconfirmed_at: string | null;
  owner_reconfirmed_name: string | null;
  owner_reconfirmed_role: string | null;
  options_considered: BoundaryOption[];
  risks_accepted: BoundaryRisk[];
  // Brad Wolfe, LinkedIn 11 Aug 2026, on why "the AI did it" survives every
  // policy written against it: an approval with real reasoning behind it and
  // an approval with none look identical in the stored shape, an empty array
  // versus a filled one, nothing marks the difference as a fact in its own
  // right. "The absence is not a gap in the record. It is the record."
  // Computed once, at creation, from whether options_considered, risks_accepted
  // or evidence held anything at the moment of signing -- never recomputed
  // later, so it can't be quietly made true by editing the record afterwards.
  reasoning_recorded: boolean;
  // Moe Hachem and Midhun K., LinkedIn 10-11 Aug 2026, independently: what
  // this decision depends on outside the account, and whether losing that
  // dependency has a tested fallback rather than an assumed one.
  external_dependencies: ExternalDependency[];
  // Distinct from risks_accepted (the owner's own stated risk) -- a
  // warning raised by someone else that got overridden anyway.
  warnings_overridden: BoundaryWarning[];
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
  // Real reference to the api_keys row this credential grant approves, and a
  // content hash of that key's approved scope taken at approval time. If the
  // key's live scope later stops matching the sealed fingerprint, the drift
  // is mechanically detectable — the record self-checks instead of staying
  // "approved" forever on a free text description. Null on decision grants
  // and on credential records created before this existed.
  api_key_id: string | null;
  permission_fingerprint: string | null;
  // Computed at read time by the API, never stored: does the linked key's
  // live scope still match the sealed fingerprint? null = not applicable.
  fingerprint_intact?: boolean | null;
  // Computed at read time, never stored: how many Real Time Gate decisions
  // this record has actually governed (via enforcement_decisions.governing_
  // record_id), and whether the block rate is trending up, down, or flat
  // across the record's life. null = no credential link, or zero decisions
  // governed yet. trend is null until there's enough data (4+ decisions) to
  // say anything about direction.
  performance?: {
    total: number;
    blocked: number;
    block_rate: number;
    trend: "up" | "down" | "flat" | null;
  } | null;
  // Computed at read time, never stored: only set when this record has a
  // predecessor (via supersedes_id) whose falsifiers fired at a meaningfully
  // higher rate than this record's own. Brad Wolfe, 6 Aug 2026: the failure
  // mode that shows up after a falsifier has actually fired a few times —
  // the threshold gets quietly loosened at the next renewal so it stops
  // firing, described as "tuning out noise" rather than named as gaming.
  // Not proof, a prompt to check whether the condition changed for a real
  // reason or just to make the alerts stop.
  firing_rate_declined?: {
    current_rate: number;
    previous_rate: number;
  } | null;
  // Where authority actually sits for this system. Null means it was never
  // stated, which is itself the finding the authority map surfaces.
  authority_mode: AuthorityMode | null;
  // Who, if anyone, actually required this boundary to exist — a lender, an
  // insurer, a board resolution. Null means self imposed: the account holder
  // wrote their own limit, nobody outside required it. Self reported, not a
  // countersignature, but a sealed, named fact instead of an assumption.
  required_by_name: string | null;
  required_by_organisation: string | null;
  // The real version: not the account holder's own claim about who required
  // this, but that party's own confirmation, via a link only they act on.
  // required_by_token is the secret in that link — present once a
  // confirmation request has been sent, never displayed as a raw value in
  // the UI after the moment it is first generated.
  required_by_token: string | null;
  required_by_confirmed_at: string | null;
  required_by_confirmed_name: string | null;
  required_by_confirmed_email: string | null;
  // Role and mandate audit stamp, same discipline as scan_flags'
  // reviewer_role. Captured on the same public confirmation page as name
  // and email, no separate flow.
  required_by_confirmed_role: string | null;
  // Michael H., "Beyond the AI Register," 9 Aug 2026: his bounded-delegation
  // test asks what would count as the objective being successfully complete,
  // not just how it dies. expiry_conditions/falsifiers already model
  // termination — this is the missing positive half, one observable
  // statement of what fulfillment looks like. Optional and free text, same
  // as a falsifier condition, just not tied to expiry: recording it doesn't
  // change expires_at, it's a fact about intent, not a trigger.
  completion_condition: string | null;
  // Michael H., LinkedIn 10 Aug 2026: a self declared completion_condition is
  // still self attestation, no matter what it's called. Same mechanism as
  // required_by confirmation, a token gating a link only an independent
  // confirmer acts on. completion_confirmed_note is required, not optional —
  // a name and a timestamp with no note is still just a diary entry.
  completion_token: string | null;
  completion_confirmed_at: string | null;
  completion_confirmed_name: string | null;
  completion_confirmed_email: string | null;
  completion_confirmed_note: string | null;
  // Role and mandate audit stamp, same discipline as scan_flags'
  // reviewer_role.
  completion_confirmed_role: string | null;
  // Brad Wolfe (5 Aug) and Dr. David Marco, independently, same week: three
  // distinct roles, none of them the owner (who approved) or the continuity
  // owner (whose job is renewal). stop_authority is who has standing to halt
  // this before its natural expiry without asking permission from whoever
  // depends on the timeline. defend_authority is who is obligated to justify
  // the decision if it's challenged by a regulator, board, or court.
  // escalation_ceiling is an explicit statement of where the buck stops —
  // distinct from the delegation chain, which shows who delegated to whom,
  // not where a dispute ultimately ends. All optional: for a solo founder or
  // small business there's often no separate person to name, and an empty
  // field here is honest, not a gap.
  stop_authority_name: string | null;
  stop_authority_role: string | null;
  defend_authority_name: string | null;
  defend_authority_role: string | null;
  escalation_ceiling: string | null;
  // Brad Wolfe, "The CEO's New Job," LinkedIn 10 Aug 2026: owner_name is who
  // holds the accountable seat, not who named them to it. "A seat that
  // assigns its own accountability is just marking its own homework." For a
  // solo founder there's often no apex above the owner to name it -- blank,
  // or "self assigned," is an honest answer here, not a gap to hide.
  named_by_name: string | null;
  named_by_role: string | null;
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
  flags: Omit<ScanFlag, "id" | "scan_id" | "disposition" | "reviewed_by" | "reviewed_at" | "reviewer_note" | "reviewer_role" | "reviewer_mandate" | "initial_read" | "initial_read_note" | "initial_read_at" | "remediated_at" | "remediated_note">[];
}
