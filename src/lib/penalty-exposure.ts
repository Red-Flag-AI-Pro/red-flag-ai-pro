/**
 * Regulatory exposure for a compliance report.
 *
 * Turns the violations a report actually found into the maximum statutory
 * ceiling attached to the regimes those violations engage. This is the "so
 * what" the report was missing: it says what wrong copy could cost, not just
 * which rule it breaks.
 *
 * Every figure here is a verified statutory MAXIMUM (see penalty-caps-reference,
 * verified 2026-06-20), framed strictly as a ceiling, never a prediction. Actual
 * penalties sit at each regulator's discretion and depend on turnover and
 * conduct. These are the same figures the public Fine Calculator uses.
 */

import type { JurisdictionCode } from "./analyzer";
import { CATEGORY_JURISDICTIONS } from "./analyzer";

export interface RegimeCeiling {
  code: JurisdictionCode;
  market: string;
  law: string;
  // Turnover independent human label for the ceiling, e.g. the fixed cap or the
  // "higher of" wording. Shown verbatim in the report.
  ceiling: string;
  // Approximate GBP value of the ceiling, used only to rank regimes and pick the
  // single headline figure. Not shown as a precise number.
  rankGBP: number;
  // True where the cap is stated per violation and so multiplies with reach.
  perViolation?: boolean;
}

// One ceiling per jurisdiction the analyzer covers.
export const REGIME_CEILINGS: Record<JurisdictionCode, RegimeCeiling> = {
  eu: {
    code: "eu",
    market: "European Union",
    law: "EU AI Act / GDPR",
    ceiling: "up to €35M or 7% of global annual turnover",
    rankGBP: 29_750_000,
  },
  gb: {
    code: "gb",
    market: "United Kingdom",
    law: "UK GDPR / DPA 2018",
    ceiling: "up to £17.5M or 4% of global annual turnover",
    rankGBP: 17_500_000,
  },
  au: {
    code: "au",
    market: "Australia",
    law: "Privacy Act 1988",
    ceiling: "up to AU$50M or 30% of adjusted turnover",
    rankGBP: 26_000_000,
  },
  in: {
    code: "in",
    market: "India",
    law: "DPDP Act 2023",
    ceiling: "up to ₹250 crore per breach",
    rankGBP: 23_750_000,
  },
  br: {
    code: "br",
    market: "Brazil",
    law: "LGPD",
    ceiling: "2% of Brazil revenue, capped at R$50M per infraction",
    rankGBP: 7_500_000,
  },
  cn: {
    code: "cn",
    market: "China",
    law: "PIPL / PRC Advertising Law",
    ceiling: "up to ¥50M or 5% of prior-year turnover",
    rankGBP: 5_500_000,
  },
  ae: {
    code: "ae",
    market: "United Arab Emirates",
    law: "PDPL",
    ceiling: "up to AED 5M",
    rankGBP: 1_075_000,
  },
  sg: {
    code: "sg",
    market: "Singapore",
    law: "PDPA",
    ceiling: "up to 10% of Singapore turnover or S$1M",
    rankGBP: 580_000,
  },
  ng: {
    code: "ng",
    market: "Nigeria",
    law: "NDPR / NITDA",
    ceiling: "up to 2% of annual gross revenue",
    rankGBP: 500_000,
  },
  ca: {
    code: "ca",
    market: "Canada",
    law: "PIPEDA",
    ceiling: "up to C$100,000 today (tougher reform proposed)",
    rankGBP: 58_000,
  },
  us: {
    code: "us",
    market: "United States",
    law: "FTC Act Section 5",
    ceiling: "up to $53,088 per violation, multiplying per consumer",
    rankGBP: 41_939,
    perViolation: true,
  },
};

export interface ScanExposure {
  // Regimes engaged by the findings, richest ceiling first.
  regimes: RegimeCeiling[];
  // The single highest ceiling, used as the headline figure.
  headline: RegimeCeiling | null;
}

// Given the categories of the flags a report found, returns the regimes those
// violations engage and their ceilings, richest first. Empty when nothing was
// found, so callers can skip the panel entirely.
export function computeScanExposure(categories: string[]): ScanExposure {
  const codes = new Set<JurisdictionCode>();
  for (const category of categories) {
    const jurisdictions = CATEGORY_JURISDICTIONS[category];
    if (jurisdictions) {
      for (const code of jurisdictions) codes.add(code);
    }
  }

  const regimes = [...codes]
    .map((code) => REGIME_CEILINGS[code])
    .filter(Boolean)
    .sort((a, b) => b.rankGBP - a.rankGBP);

  return { regimes, headline: regimes[0] ?? null };
}
