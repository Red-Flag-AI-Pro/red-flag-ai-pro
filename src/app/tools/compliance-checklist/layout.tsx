import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Compliance Checklist — 26 Categories, 9 Jurisdictions | Red Flag AI Pro",
  description: "Free interactive marketing compliance checklist. 35 checkpoints across income claims, health claims, fake urgency, GDPR, influencer disclosure, email marketing and more — covering FTC, CMA, GDPR, ACCC and all 9 major jurisdictions.",
  alternates: { canonical: "https://www.redflagaipro.com/tools/compliance-checklist" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
