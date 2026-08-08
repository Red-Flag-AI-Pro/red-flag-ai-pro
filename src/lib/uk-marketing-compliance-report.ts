// Source: brain/sessions/2026-07-26 Research Checks Export.csv, 50 UK
// businesses run through Red Flag's own compliance check on 26 Jul 2026.
// This file recomputes the dedup fresh from that source rather than reuse
// an earlier headline figure — the first pass by company name overcounted,
// two pairs of rows (Charlie Johnson, Higham Miller Coffee) shared the same
// underlying ASA ruling URL under slightly different name spellings. Deduping
// by ruling URL instead of name is what gets to the true, defensible count.
//
// "score" is Red Flag's own automated check score for that company's site
// at the time, 0-100, higher meaning fewer flags found in the copy itself.
// It is deliberately shown even where it's high, alongside a real ASA
// ruling: several of these companies score well on an automated text check
// while still carrying a live regulatory ruling, because what the ASA
// upheld against them (a subscription trap, an influencer disclosure gap)
// isn't always something a text scan alone would catch. That's an honest
// limit worth stating, not a result worth hiding.

export interface RulingCompany {
  name: string;
  domain: string;
  score: number | null;
  ruling: string;
  categories: string;
}

export const REPORT_CHECKED_AT = "2026-07-26";
export const REPORT_TOTAL_CHECKED = 50;

export const RULING_COMPANIES: RulingCompany[] = [
  { name: "Evolution Slimming Ltd", domain: "evolution-slimming.com", score: 20, ruling: "https://www.asa.org.uk/rulings/evolution-slimming-ltd-a25-1281271-evolution-slimming-ltd.html", categories: "Health claim, subscription trap, age assurance" },
  { name: "Beauty Pie Ltd", domain: "beautypie.com", score: 30, ruling: "https://www.asa.org.uk/rulings/beauty-pie-ltd-a25-1322854.html", categories: "Health claim, email compliance, subscription trap" },
  { name: "Menwell Ltd (t/a Voy)", domain: "joinvoy.com", score: 50, ruling: "https://www.asa.org.uk/rulings/menwell-ltd-a24-1264774-menwell-ltd.html", categories: "Health claim, influencer disclosure, testimonial" },
  { name: "Trip Drink Ltd", domain: "drink-trip.com", score: 60, ruling: "https://www.asa.org.uk/rulings/trip-drink-ltd-a25-1277097-trip-drink-ltd.html", categories: "Subscription trap, fake discounts, country of origin" },
  { name: "Land Profits EDU Ltd", domain: "land-profits.co.uk", score: 65, ruling: "https://www.asa.org.uk/rulings/land-profits-edu-ltd-a24-1256132-land-profits-edu-ltd.html", categories: "Financial promotion, urgency, legal disclaimer" },
  { name: "SnackVerse Ltd", domain: "snackverse.com", score: 65, ruling: "https://www.asa.org.uk/rulings/snackverse-ltd-a25-1322021-snackverse-ltd.html", categories: "Subscription trap, fake discounts, guarantee" },
  { name: "Jones Whyte Law Ltd", domain: "joneswhyte.co.uk", score: 70, ruling: "https://www.asa.org.uk/rulings/jones-whyte-law-ltd-a24-1251674-jones-whyte-law-ltd.html", categories: "Age assurance, urgency" },
  { name: "Rosenthal Capital Ltd (t/a ULEZ Prosperity)", domain: "ulezprosperity.com", score: 70, ruling: "https://www.asa.org.uk/rulings/rosenthal-capital-ltd-a24-1270983-rosenthal-capital-ltd.html", categories: "Income claim, testimonial" },
  { name: "Team RH Fitness Ltd", domain: "teamrhfitness.com", score: 70, ruling: "https://www.asa.org.uk/rulings/team-rh-fitness-ltd-g23-1217041-team-rh-fitness-ltd.html", categories: "Health claim, comparative advertising" },
  { name: "Centre of CPD Excellence", domain: "centreofcpdexcellence.com", score: 80, ruling: "https://www.asa.org.uk/rulings/centre-of-cpd-excellence-a25-1314465-centre-of-cpd-excellence.html", categories: "Greenwashing" },
  { name: "Higham Miller Coffee Ltd (t/a Exhale Healthy Coffee)", domain: "exhalecoffee.com", score: 80, ruling: "https://www.asa.org.uk/rulings/higham-miller-coffee-ltd-a26-1330390-higham-miller-coffee-ltd.html", categories: "Subscription trap" },
  { name: "JLG Legal Ltd (t/a Johnson Law Group)", domain: "johnsonlawgroup.co.uk", score: 80, ruling: "https://www.asa.org.uk/rulings/jlg-legal-ltd-a24-1250914-jlg-legal-ltd.html", categories: "Greenwashing" },
  { name: "KP Law Ltd", domain: "kpl-databreach.co.uk", score: 80, ruling: "https://www.asa.org.uk/rulings/kp-law-ltd-a24-1251321-kp-law-ltd.html", categories: "Crypto promotion" },
  { name: "Charlie Johnson (t/a Seven Figure Scaling Systems)", domain: "7figurescalingsystems.com", score: 90, ruling: "https://www.asa.org.uk/rulings/charlie-johnson-a25-1293121-charlie-johnson.html", categories: "Comparative advertising" },
  { name: "HGV Learning", domain: "hgvlearning.com", score: 90, ruling: "https://www.asa.org.uk/rulings/hgv-learning--a25-1317887-hgv-learning.html", categories: "Scarcity" },
  { name: "HGV Training Services Ltd (t/a HGVT)", domain: "hgvt.co.uk", score: 90, ruling: "https://www.asa.org.uk/rulings/hgvt-ltd-a25-1317888-hgvt-ltd.html", categories: "Testimonial" },
  { name: "Supreme CBD Ltd", domain: "supremecbd.uk", score: 90, ruling: "https://www.asa.org.uk/non-compliant/supreme-cbd-ltd.html", categories: "Fake discounts" },
  { name: "Valterous Ltd (t/a Therapie Clinic UK)", domain: "therapieclinic.com", score: 90, ruling: "https://www.asa.org.uk/rulings/valterous-ltd-g24-1253503-valterous-ltd.html", categories: "Fake discounts" },
  // Genuine miss, confirmed against the source ruling on 8 Aug 2026 during a
  // back-test: "200 years combined experience / globally recognised" and an
  // implied insurer partnership that did not exist. No category in
  // FLAG_CATEGORY_LABELS covers an unsubstantiated credentials/history/
  // partnership claim — see RULESET_BACKTESTS in this file.
  { name: "Course Accreditation Ltd", domain: "course-accreditation.com", score: 100, ruling: "https://www.asa.org.uk/rulings/course-accreditation-ltd-a25-1322901-course-accreditation-ltd.html", categories: "Not specified in ruling summary" },
  // Was "not specified" — corrected 8 Aug 2026 after re-checking the source
  // ruling: an unsubstantiated "UK's leading body" claim, an unproven
  // implicit competitor comparison. Maps cleanly to comparative_advertising.
  { name: "The Professional Development Consortium Ltd (t/a CPD Standards Office)", domain: "cpdstandards.com", score: 100, ruling: "https://www.asa.org.uk/rulings/the-professional-development-consortium-ltd-a25-1322754-the-professional-development-consortium-ltd.html", categories: "Comparative advertising" },
  // Was "not specified" — corrected 8 Aug 2026: misleading "typical" earnings
  // claims plus a hidden £390 course price behind "free guide" wording.
  // Maps cleanly to income_claim and hidden_fees.
  { name: "Self Made Girl Boss Ltd", domain: "selfmadegirlboss.co.uk", score: null, ruling: "https://www.asa.org.uk/rulings/self-made-girl-boss-ltd-a25-1293166-self-made-girl-boss-ltd.html", categories: "Income claim, Hidden fees" },
];

export const UNIQUE_RULING_COUNT = RULING_COMPANIES.length;
