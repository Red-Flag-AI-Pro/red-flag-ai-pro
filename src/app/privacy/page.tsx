import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Red Flag AI Pro — how we collect, use and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 18 May 2026</p>

        <div className="mt-10 space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p>
              Red Flag AI Pro (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at <strong>www.redflagaipro.com</strong>. We are committed to protecting your personal data and complying with the UK GDPR, EU GDPR, and applicable data protection laws.
            </p>
            <p className="mt-2">
              For data protection queries, contact us at:{" "}
              <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline">support@redflagaipro.com</a>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. What Data We Collect</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Data</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Why we collect it</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Name & email address", "To create and manage your account"],
                    ["Payment information", "Processed securely by Stripe — we never store card details"],
                    ["Copy you submit for scanning", "To generate your compliance scan results only"],
                    ["Scan results and history", "To display your dashboard and scan history"],
                    ["Usage data (pages visited, features used)", "To improve our service"],
                    ["IP address", "For security and fraud prevention"],
                  ].map(([data, reason]) => (
                    <tr key={data} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-medium">{data}</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-600">{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Your Submitted Copy</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p>
                The marketing copy you paste into Red Flag AI Pro is used <strong>solely to generate your scan results</strong>. We do not:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Share your submitted copy with third parties</li>
                <li>Use your copy to train AI models</li>
                <li>Store your copy beyond what is necessary to display your scan history</li>
              </ul>
              <p className="mt-3">You can delete your scan history at any time from your dashboard.</p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Legal Basis for Processing (UK & EU GDPR)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contract:</strong> Processing your account data and scans to deliver the service you signed up for</li>
              <li><strong>Legitimate interests:</strong> Improving our service, preventing fraud, ensuring security</li>
              <li><strong>Legal obligation:</strong> Retaining billing records as required by law</li>
              <li><strong>Consent:</strong> Marketing emails — you can unsubscribe at any time</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third Parties We Use</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase</strong> — database and authentication (data stored in EU region)</li>
              <li><strong>Stripe</strong> — payment processing (PCI DSS compliant)</li>
              <li><strong>Vercel</strong> — website hosting</li>
              <li><strong>OpenAI / Anthropic</strong> — AI processing of scan requests</li>
            </ul>
            <p className="mt-3">All third parties are bound by appropriate data processing agreements.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. How Long We Keep Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account data: retained while your account is active and for 30 days after deletion</li>
              <li>Billing records: 7 years as required by UK law</li>
              <li>Scan history: retained until you delete it or close your account</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>Under UK and EU GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Access</strong> — request a copy of your personal data</li>
              <li><strong>Rectification</strong> — correct inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your data ("right to be forgotten")</li>
              <li><strong>Portability</strong> — receive your data in a portable format</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests</li>
              <li><strong>Restrict</strong> — request we limit how we process your data</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline">support@redflagaipro.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>We use essential cookies only — for authentication and session management. We do not use advertising or tracking cookies. No cookie consent banner is required for essential cookies under UK GDPR.</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Data Security</h2>
            <p>
              We implement industry-standard security measures including encrypted data storage, HTTPS, and access controls. However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes by email. Continued use of Red Flag AI Pro after changes constitutes acceptance.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Complaints</h2>
            <p>
              If you are unhappy with how we handle your data, you have the right to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">ico.org.uk</a>.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <p>
              For any privacy questions:{" "}
              <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline font-semibold">
                support@redflagaipro.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex gap-6 text-sm">
          <Link href="/terms" className="text-red-600 hover:underline">Terms of Service</Link>
          <Link href="/" className="text-gray-500 hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
