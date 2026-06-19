import type { Metadata } from "next";
import { Inter, Syne, DM_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieBanner } from "@/components/CookieBanner";
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
  weight: ["400", "500", "600"],
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
    default: "Red Flag AI Pro — Spot Illegal Ads. Scan Your Copy. Free in 60 Seconds.",
    template: "%s | Red Flag AI Pro",
  },
  description:
    "Are you a Builder? Are you a Buyer? Scan it before it's too late. Red Flag AI Pro checks marketing copy, live URLs, YouTube VSLs and audio files for compliance risks across FTC, GDPR, ASA, FCA, ACCC, CASL, PDPA and UAE PDPL. 29 risk categories. 9 jurisdictions. Free scan — no account needed.",
  keywords: [
    // Core product
    "marketing compliance scanner",
    "ad compliance checker",
    "marketing law checker",
    "compliance risk score",
    "marketing legal checker",
    "false advertising checker",
    "misleading marketing detector",
    "URL compliance scanner",
    "VSL compliance scanner",
    "YouTube VSL compliance check",
    "audio transcription compliance",
    "site audit compliance",
    "bulk website compliance scan",
    // Jurisdiction keywords
    "FTC compliance checker",
    "GDPR compliance tool",
    "ASA compliance UK",
    "CMA compliance UK",
    "ACCC compliance Australia",
    "CASL compliance Canada",
    "FCA financial promotions compliance",
    "EU AI Act compliance checker",
    "EU Green Claims Directive",
    "greenwashing compliance checker",
    // Agency keywords
    "marketing compliance tool for agencies",
    "agency ad compliance software",
    "compliance audit trail agencies",
    "signed compliance certificate",
    "ad copy compliance review",
    "marketing agency compliance UK",
    "compliance infrastructure agencies",
    "legal timestamp ad review",
    "PI insurance compliance evidence",
    "ASA complaint defence",
    "white label compliance reports",
    "client compliance workspace",
    "compliance API for agencies",
    "Zapier compliance webhook",
    "Chrome extension compliance scanner",
    "weekly compliance monitoring",
    "team compliance seats",
    // AI compliance
    "EU AI Act Article 50",
    "AI content disclosure",
    "AI generated content compliance",
    "AI marketing compliance",
    "AI copy checker",
    "AI ad compliance",
    // Seller keywords
    "funnel compliance checker",
    "sales page compliance checker",
    "VSL compliance",
    "email marketing compliance",
    "income claim checker",
    "influencer disclosure checker",
    "subscription trap compliance",
    "compliance changelog",
    // Buyer keywords
    "how to spot misleading advertising",
    "is this ad legal",
    "fake scarcity checker",
    "misleading claims checker",
    "illegal advertising checker",
    "fake testimonials checker",
    "consumer protection tool",
    // Free scan keywords
    "free compliance scan no signup",
    "scan marketing copy free",
    "free ad compliance checker",
    "instant compliance check free",
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
    title: "Red Flag AI Pro — Are you a Builder? Are you a Buyer? Scan it before it's too late.",
    description:
      "Scan marketing copy, live URLs, YouTube VSLs and audio for compliance risks. FTC, GDPR, ASA, FCA, ACCC, CASL, LGPD, DPDP, PDPA, UAE PDPL. 29 risk categories across 9 jurisdictions. AI-powered. Free — no account needed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Red Flag AI Pro — Spot Illegal Ads Before You Buy. Scan Your Copy Before You Publish.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag AI Pro — Spot Illegal Ads. Scan Your Copy. Free in 60 Seconds.",
    description:
      "Buyers: paste any ad and find out if it is breaking the law. Sellers: scan your copy for FTC, GDPR, ASA, EU AI Act, ACCC and CASL violations. Free. No account needed. Both sides. 60 seconds.",
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
    icon: "/redflag-logo.png",
    apple: "/redflag-logo.png",
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
        <Script
          src="https://files.tlt-cdn.com/tlt.js"
          data-tolt="pk_uHSrWu9BsJAGNpueQV69rTrd"
          strategy="lazyOnload"
        />
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
                  "name": "Pro",
                  "price": "350",
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
                "logo": "https://www.redflagaipro.com/redflag-logo.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "support@redflagaipro.com",
                  "contactType": "customer support"
                }
              }
            })
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18172154544"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18172154544');
              gtag('config', 'AW-18172153815');
            `,
          }}
        />
      </body>
    </html>
  );
}
