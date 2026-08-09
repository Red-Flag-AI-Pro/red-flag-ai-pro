// Phased compliance timeline for the £497 Full Governance Program (task #277).
//
// Jabber Khan sample deliverable, 9 Aug 2026: his roadmap sequences work into
// phases (now to 8 weeks, 8 to 16 weeks, etc.) tied to the actual regulatory
// deadline. Ours stated deadlines but never sequenced the six documents'
// work against them — presentation/pacing on top of documents already
// delivered together, not a missing analytical layer.
//
// Phases are bucketed from the regulatory mapping's own gap status, the same
// honest signal already computed from the customer's intake answers: a
// document with nothing behind it is urgent, one with a partial answer is
// next, one already in place only needs review. No phase length or document
// urgency is invented beyond that. Where the customer's primary jurisdiction
// is the EU, the real, already-verified EU AI Act deadlines are surfaced
// alongside as context, not attached as a fabricated due date on a specific
// document.

import type { ProgramIntake } from "./program-intake";
import type { RegulatoryMappingRow, GapStatus } from "./program-regulatory-mapping";
import { REGULATORY_DEADLINES } from "./assistant-knowledge";

export interface TimelinePhaseItem {
  document: string;
  status: GapStatus;
}

export interface TimelinePhase {
  key: "now" | "next" | "ongoing";
  label: string;
  window: string;
  rationale: string;
  items: TimelinePhaseItem[];
}

export interface RegulatoryDeadline {
  date: string;
  status: string;
  meaning: string;
}

export interface ProgramTimeline {
  phases: TimelinePhase[];
  regulatoryDeadlines: RegulatoryDeadline[];
}

const PHASE_META: Record<GapStatus, { key: TimelinePhase["key"]; label: string; window: string; rationale: string }> = {
  not_started: {
    key: "now",
    label: "Now",
    window: "0–4 weeks",
    rationale: "Nothing was answered at intake for these yet, so a regulator or auditor asking today would find no record at all.",
  },
  partial: {
    key: "next",
    label: "Next",
    window: "4–12 weeks",
    rationale: "Some of what these need was answered at intake, but not enough to call the document complete.",
  },
  in_place: {
    key: "ongoing",
    label: "Ongoing",
    window: "Review at your usual cadence",
    rationale: "Intake shows these are already answered. The work here is keeping them current, not building them from nothing.",
  },
};

export function computeProgramTimeline(
  regulatoryMapping: RegulatoryMappingRow[],
  intake: ProgramIntake
): ProgramTimeline {
  const order: GapStatus[] = ["not_started", "partial", "in_place"];
  const phases: TimelinePhase[] = order
    .map((status) => {
      const items = regulatoryMapping
        .filter((row) => row.status === status)
        .map((row) => ({ document: row.document, status: row.status }));
      if (!items.length) return null;
      const meta = PHASE_META[status];
      return { key: meta.key, label: meta.label, window: meta.window, rationale: meta.rationale, items };
    })
    .filter((p): p is TimelinePhase => p !== null);

  // Four of the six documents cite the EU AI Act directly, so this context
  // only applies when the customer actually operates under it — never shown
  // as a generic scare deadline to a UK- or US-primary business.
  const regulatoryDeadlines = intake.primaryJurisdiction === "eu" ? [...REGULATORY_DEADLINES] : [];

  return { phases, regulatoryDeadlines };
}
