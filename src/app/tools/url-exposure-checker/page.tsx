import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GetChecked } from "@/components/marketing/GetChecked";
import { LawClock } from "@/components/marketing/LawClock";

// This address used to host a public tool that checked any live page on the
// spot. That is now something we do for the visitor and reply about, so the
// page shows the request form. Search engines are pointed at /get-checked as
// the original so the two pages are not treated as duplicates.

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What's Your Red Flag? Get Your Site Checked, Free",
  description:
    "Give us your website. We check what it says and how you use AI against the rules, and show you the one problem most likely to cost you. Free, and you do none of the work.",
  alternates: { canonical: "https://www.redflagaipro.com/get-checked" },
};

export default function UrlExposureCheckerPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <GetChecked mode="page" />
      <LawClock cta={false} />
      <Footer />
    </div>
  );
}
