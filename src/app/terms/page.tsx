import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Red Flag AI Pro — please read before using our service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 18 May 2026</p>

        <div className="mt-10 space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. About Red Flag AI Pro</h2>
            <p>
              Red Flag AI Pro (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered marketing compliance scanning tool operated by Red Flag AI Pro. By accessing or using our platform at <strong>www.redflagaipro.com</strong>, you agree to be bound by these Terms of Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Not Legal Advice — Important Disclaimer</h2>
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                Red Flag AI Pro is an AI-powered tool and does not constitute legal advice. Our scans and reports are provided for informational purposes only.
              </p>
              <p className="mt-3 text-red-700">
                Nothing produced by Red Flag AI Pro should be relied upon as a substitute for professional legal counsel. We strongly recommend consulting a qualified solicitor or compliance professional for definitive legal guidance specific to your business. Red Flag AI Pro accepts no liability for decisions made based solely on our scan results.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of entering into a legally binding agreement to use Red Flag AI Pro. By using our service you confirm that you meet these requirements.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Your Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline">support@redflagaipro.com</a> of any unauthorised use of your account.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Subscription Plans & Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Plan:</strong> 1 scan per month at no charge. No credit card required.</li>
              <li><strong>Pro Plan:</strong> £49/month (subject to change — existing subscribers grandfathered at their original rate). Billed monthly via Stripe.</li>
              <li><strong>Enterprise Plan:</strong> £149/month. Billed monthly via Stripe.</li>
              <li>All prices are inclusive of any applicable VAT where required by law.</li>
              <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
              <li>You may cancel your subscription at any time via your billing settings or by contacting support.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Refund Policy</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-3">
              <p>
                We want every customer to be satisfied with Red Flag AI Pro. However, because our service delivers immediate digital value upon use, refunds are not automatically granted.
              </p>
              <p>
                <strong>Refund requests will be considered where there is sufficient and reasonable cause</strong>, such as a significant technical failure that prevented you from using the service, or a billing error on our part.
              </p>
              <p>
                To request a refund, you must:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact us within <strong>14 days</strong> of the charge in question</li>
                <li>Email <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline">support@redflagaipro.com</a> with your account email, the reason for your request, and any supporting detail</li>
                <li>Allow up to 5 business days for us to review and respond to your request</li>
              </ul>
              <p>
                We reserve the right to decline refund requests where the service has been used as intended without technical fault. Approved refunds will be returned to the original payment method within 5–10 business days.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use Red Flag AI Pro for any unlawful purpose</li>
              <li>Attempt to reverse engineer, scrape, or copy our platform</li>
              <li>Share your account credentials with others</li>
              <li>Submit content that is harmful, abusive, or violates third-party rights</li>
              <li>Use our service to circumvent compliance regulations rather than comply with them</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              All content, branding, software, and technology on Red Flag AI Pro is the property of Red Flag AI Pro and is protected by applicable intellectual property laws. You retain ownership of any content you submit for scanning. We do not store or use your submitted copy for any purpose other than generating your scan results.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Red Flag AI Pro shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service, including but not limited to regulatory fines, lost revenue, or business interruption. Our total liability to you shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by email or via an in-app notice. Continued use of Red Flag AI Pro after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
            <p>
              For any questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@redflagaipro.com" className="text-red-600 hover:underline font-semibold">
                support@redflagaipro.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex gap-6 text-sm">
          <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
          <Link href="/" className="text-gray-500 hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
