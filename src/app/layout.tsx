import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieBanner } from "@/components/CookieBanner";
import { SiteAssistant } from "@/components/marketing/SiteAssistant";
import { ConsentScripts } from "@/components/ConsentScripts";
import "./fonts.css";
import "./globals.css";

// Fonts are served from /public/fonts (see fonts.css). These are the Latin
// files the page needs first, loaded early so text renders in the right font
// straight away. The list matches what Next.js used to preload.
const PRELOAD_FONTS = [
  "/fonts/0e96d314a90a6138-s.p.woff2",
  "/fonts/4b9bb515ce6d026f-s.p.woff2",
  "/fonts/5611c55482296524-s.p.woff2",
  "/fonts/8a1d8947e5852e30-s.p.woff2",
  "/fonts/b7ea2ab4a8ad1f81-s.p.woff2",
  "/fonts/e4af272ccee01ff0-s.p.woff2",
];

export const metadata: Metadata = {
  title: {
    default: "Red Flag AI Pro: AI Compliance and AI Governance, Done Properly.",
    template: "%s | Red Flag AI Pro",
  },
  description:
    "Compliance and AI governance, done for you. Your first red flag is free. The full audit is £449, signed by James, with your money back if we find nothing worth fixing.",
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
    title: "Red Flag AI Pro: AI Compliance and AI Governance, Done Properly.",
    description:
      "Compliance and AI governance, done for you. Your first red flag is free. The full audit is £449, signed by James, with your money back if we find nothing worth fixing.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Red Flag AI Pro: compliance and AI governance, done for you.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag AI Pro: AI Compliance and AI Governance, Done Properly.",
    description:
      "Compliance and AI governance, done for you. Your first red flag is free. The full audit is £449, signed by James, with your money back if we find nothing worth fixing.",
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {PRELOAD_FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body className="font-body">
        {children}
        <Analytics />
        <SpeedInsights />
        <CookieBanner />
        <SiteAssistant />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Red Flag AI Pro",
              "url": "https://www.redflagaipro.com",
              "description": "Compliance and AI governance, done for you, for UK businesses. Your first red flag is free. The full audit is £449, signed by James Stokes, with your money back if we find nothing worth fixing. Sentinel keeps it current for £199 a month.",
              "areaServed": { "@type": "Country", "name": "United Kingdom" },
              "offers": [
                { "@type": "Offer", "name": "Your red flag", "price": "0", "priceCurrency": "GBP" },
                { "@type": "Offer", "name": "Compliance and AI governance audit", "price": "449", "priceCurrency": "GBP" },
                {
                  "@type": "Offer",
                  "name": "Sentinel",
                  "price": "199",
                  "priceCurrency": "GBP",
                  "priceSpecification": { "@type": "UnitPriceSpecification", "price": "199", "priceCurrency": "GBP", "unitText": "MONTH" }
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
