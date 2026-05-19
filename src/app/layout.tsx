import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Red Flag AI Pro — Marketing Compliance Scanner",
    template: "%s | Red Flag AI Pro",
  },
  description:
    "The world's only 5-country marketing compliance scanner. Scan your funnels, ads and copy for FTC, CMA, ASA, GDPR, ACCC and CASL violations in 60 seconds. Get compliant rewrites instantly.",
  keywords: [
    "marketing compliance scanner",
    "FTC compliance checker",
    "GDPR compliance tool",
    "ad compliance checker",
    "marketing law checker",
    "ASA compliance UK",
    "CMA compliance",
    "ACCC compliance Australia",
    "CASL compliance Canada",
    "funnel compliance",
    "compliance risk score",
    "marketing legal checker",
    "EU AI Act compliance",
    "EU AI Act Article 50",
    "AI content disclosure",
    "AI generated content compliance",
    "AI marketing compliance",
    "AI endorsement FTC",
    "automated decision making GDPR",
    "AI copy checker",
    "AI ad compliance",
    "marketing agency AI compliance",
    "PI insurance AI exclusion",
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
    title: "Red Flag AI Pro — Marketing Compliance Scanner",
    description:
      "The world's only 5-country marketing compliance scanner. Scan for FTC, CMA, ASA, GDPR, ACCC and CASL violations in 60 seconds.",
    images: [
      {
        url: "/redflag-logo.png",
        width: 1200,
        height: 630,
        alt: "Red Flag AI Pro — Marketing Compliance Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Flag AI Pro — Marketing Compliance Scanner",
    description:
      "Scan your marketing copy for FTC, GDPR, ASA, ACCC and CASL violations in 60 seconds. The world's only 5-country compliance scanner.",
    images: ["/redflag-logo.png"],
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
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18172154544"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18172154544');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
