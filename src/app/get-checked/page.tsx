import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GetChecked } from "@/components/marketing/GetChecked";
import { LawClock } from "@/components/marketing/LawClock";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What's Your Red Flag? Get Your Site Checked, Free",
  description:
    "Give us your website. We check what it says and how you use AI against the rules, and send you the worst thing we find. Free, and you do none of the work.",
  alternates: { canonical: "https://www.redflagaipro.com/get-checked" },
};

export default function GetCheckedPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />
      <GetChecked mode="page" />
      <LawClock cta={false} />
      <Footer />
    </div>
  );
}
