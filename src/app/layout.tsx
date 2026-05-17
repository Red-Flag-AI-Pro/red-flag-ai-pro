import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Red Flag AI Pro — Compliance Risk Scanner",
  description:
    "The world's only marketing compliance scanner covering US, UK, EU, Australian and Canadian law. Scan your funnels for FTC, CMA, ASA, GDPR, ACCC and CASL violations in 60 seconds.",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
