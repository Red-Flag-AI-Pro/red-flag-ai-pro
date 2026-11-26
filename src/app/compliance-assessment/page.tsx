import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GetChecked } from "@/components/marketing/GetChecked";
import { LawClock } from "@/components/marketing/LawClock";

// This address used to host the public self serve copy check. The check now
// happens on our side: the visitor asks, we do the work and reply. The page
// stays at the same address so search results and old links still land
// somewhere useful, and it points search engines at /get-checked as the
// original so the two pages are not treated as duplicates.
//
// The checker itself is unchanged and lives behind the login at /scans/new.

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What's Your Red Flag? Get Your Site Checked, Free",
  description:
    "Give us your website. We check what it says and how you use AI against the rules, and show you the one problem most likely to cost you. Free, and you do none of the work.",
  alternates: { canonical: "https://www.redflagaipro.com/get-checked" },
};

export default function ComplianceAssessmentPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <GetChecked mode="page" />
      <LawClock cta={false} />
      <Footer />
    </div>
  );
}
