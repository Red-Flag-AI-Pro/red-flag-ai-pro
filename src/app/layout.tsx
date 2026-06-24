import type { Metadata } from "next";
import { Inter, Syne, DM_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieBanner } from "@/components/CookieBanner";
import { ConsentScripts } from "@/components/ConsentScripts";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-syne",
});

// Newsreader — editorial serif used for display headlines. Signals the
// institutional, financial-grade credibility CFOs and compliance buyers expect.
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Red Flag AI Pro — AI Governance Maturity Index & Compliance Proof",
    template: "%s | Red Flag AI Pro",
  },
  description:
    "Red Flag AI Pro scores your AI governance maturity across 6 dimensions, benchmarks you against peers, and generates audit-ready evidence for the EU AI Act, DORA, SEC and Munir. Free 5-minute assessment — built for CFOs, compliance and risk teams.",
  keywords: [
    // Core positioning
    "AI governance assessment",
    "AI governance maturity",
    "governance maturity index",
    "AI governance audit",
    "AI governance scorecard",
    "AI governance framework",
    "AI governance for CFOs",
    "AI compliance for compliance teams",
    "AI risk assessment",
    "audit-ready AI governance",
    "AI governance evidence",
    "regulatory readiness AI",
    "compliance maturity assessment",
    "AI governance benchmarking",
    "board AI governance reporting",
    // Frameworks & regulations
    "EU AI Act compliance",
    "EU AI Act Article 50",
    "DORA compliance",
    "SEC AI governance",
    "NIST AI RMF",
    "ISO 42001",
    "GDPR AI compliance",
    "Munir v SSHD governance",
    "FTC AI enforcement",
    // Buyer roles
    "CFO AI governance",
    "chief compliance officer AI",
    "chief risk officer AI",
    "AI governance for regulated businesses",
    "prove AI governance",
    "AI governance monitoring",
    "managed AI governance",
  ],
  authors: [{ name: "Red Flag AI Pro", url: "https://www.redflagaipro.com" }],
  creator: "Red Flag AI Pro",
  metadataBase: new URL("https://www.redflagaipro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.redflagaipro.com",
    siteName: "Red Flag AI Pro",
    title: "Red Flag AI Pro — Prove your AI governance before regulators ask.",
    description:
      "Score your AI governance maturity across 6 dimensions, benchmark against peers, and generate audit-ready evidence for the EU AI Act, DORA, SEC and Munir. Free assessment for CFOs, compliance and risk teams.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Red Flag AI Pro — AI Governance Maturity Index for CFOs and compliance teams.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag AI Pro — AI Governance Maturity Index & Compliance Proof",
    description:
      "Score your AI governance maturity, benchmark against peers, and generate audit-ready evidence for the EU AI Act, DORA, SEC and Munir. Free 5-minute assessment.",
    images: ["/og-image.png"],
    creator: "@redflagaipro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/redflag-logo-transparent.png",
    apple: "/redflag-logo-transparent.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${newsreader.variable}`}>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Red Flag AI Pro",
              "url": "https://www.redflagaipro.com",
              "description": "AI governance assessment and assurance for CFOs, compliance and risk teams. Score your governance maturity across 6 dimensions, generate audit-ready evidence, and prove governance to regulators (EU AI Act, DORA, SEC, Munir). Free assessment.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Assessment",
                  "price": "0",
                  "priceCurrency": "GBP"
                },
                {
                  "@type": "Offer",
                  "name": "Scanner",
                  "price": "350",
                  "priceCurrency": "GBP",
                  "billingPeriod": "P1M"
                },
                {
                  "@type": "Offer",
                  "name": "Growth",
                  "price": "1200",
                  "priceCurrency": "GBP",
                  "billingPeriod": "P1M"
                },
                {
                  "@type": "Offer",
                  "name": "Sentinel",
                  "price": "5000",
                  "priceCurrency": "GBP",
                  "billingPeriod": "P1M"
                }
              ],
              "publisher": {
                "@type": "Organization",
                "name": "Red Flag AI Pro",
                "url": "https://www.redflagaipro.com",
                "logo": "https://www.redflagaipro.com/redflag-logo-transparent.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "support@redflagaipro.com",
                  "contactType": "customer support"
                }
              }
            })
          }}
        />
        <ConsentScripts />
      </body>
    </html>
  );
}
