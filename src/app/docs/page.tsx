import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "API Documentation — Red Flag AI Pro",
  description: "REST API for scanning marketing copy programmatically. Sentinel plan required.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-xl bg-gray-950 text-gray-100 p-5 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {children}
    </pre>
  );
}

function Tag({ method }: { method: "POST" | "GET" }) {
  return (
    <span className={["rounded px-2 py-0.5 text-xs font-bold", method === "POST" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"].join(" ")}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">

        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Developer Docs</p>
          <h1 className="text-4xl font-extrabold text-white mb-3">Red Flag AI Pro API</h1>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            Scan marketing copy programmatically. Integrate compliance checking into your CMS, workflow or agency tools. Available on the Sentinel plan.
          </p>
          <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/50 p-6 max-w-2xl">
            <p className="text-sm font-semibold text-white mb-2">Why agencies use the API</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instead of your team manually pasting copy into the dashboard, the API lets you plug compliance scanning directly into the tools you already use. Your CMS can scan a page the moment it is published. Your project management tool can flag a task when copy fails. Your client portal can show a live compliance score without anyone lifting a finger. If it can make an HTTP request, it can use this API.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/settings" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
              Get API key →
            </Link>
            <Link href="/sentinel" className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">
              Sentinel plan
            </Link>
          </div>
        </div>

        {/* Authentication */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication</h2>
          <p className="text-gray-400 text-sm mb-4">Pass your API key in the Authorization header on every request.</p>
          <Code>{`Authorization: Bearer rfp_your_api_key_here`}</Code>
          <p className="text-gray-500 text-xs mt-2">Generate keys in Settings. Keys start with <code className="text-gray-300">rfp_</code>. Keep them secret.</p>
        </div>

        {/* Base URL */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Base URL</h2>
          <Code>{`https://redflagaipro.com/api/v1`}</Code>
        </div>

        {/* POST /scan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag method="POST" />
            <h2 className="text-xl font-bold text-white">/v1/scan</h2>
          </div>
          <p className="text-gray-400 text-sm">Scan marketing copy for compliance risks. Returns a score, risk level, and all flags with suggested fixes.</p>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request body</p>
            <Code>{`{
  "title": "My Sales Page",        // optional, string
  "content": "Your copy here..."   // required, string, min 20 chars
}`}</Code>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Example request</p>
            <Code>{`curl -X POST https://redflagaipro.com/api/v1/scan \\
  -H "Authorization: Bearer rfp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Landing Page",
    "content": "Earn six figures from home with our guaranteed system..."
  }'`}</Code>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Response</p>
            <Code>{`{
  "scan_id": "uuid",
  "title": "Landing Page",
  "score": 60,
  "risk": "medium",
  "flag_count": 2,
  "flags": [
    {
      "category": "income_claim",
      "severity": "high",
      "text_excerpt": "…six figures from home…",
      "description": "Contains an income claim...",
      "suggestion": "Add a clear earnings disclaimer..."
    }
  ],
  "scanned_at": "2026-05-29T11:00:00.000Z"
}`}</Code>
          </div>
        </div>

        {/* GET /scans */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag method="GET" />
            <h2 className="text-xl font-bold text-white">/v1/scans</h2>
          </div>
          <p className="text-gray-400 text-sm">List your recent scans. Supports pagination.</p>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Query parameters</p>
            <Code>{`limit   integer   Max results to return (default 20, max 100)
offset  integer   Number of results to skip (default 0)`}</Code>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Example request</p>
            <Code>{`curl https://redflagaipro.com/api/v1/scans?limit=10 \\
  -H "Authorization: Bearer rfp_your_key"`}</Code>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Response</p>
            <Code>{`{
  "scans": [
    {
      "id": "uuid",
      "title": "Landing Page",
      "score": 60,
      "status": "complete",
      "created_at": "2026-05-29T11:00:00.000Z"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}`}</Code>
          </div>
        </div>

        {/* Webhooks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Webhooks</h2>
          <p className="text-gray-400 text-sm">
            Set a webhook URL in Settings and we POST scan results there every time a scan completes - whether from the dashboard, URL scan, VSL scan, or API. Use with Zapier, Make, or your own backend.
          </p>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payload</p>
            <Code>{`{
  "event": "scan.completed",
  "scan_id": "uuid",
  "title": "Landing Page",
  "score": 60,
  "flag_count": 2,
  "flags": [
    {
      "category": "income_claim",
      "severity": "high",
      "suggestion": "Add a clear earnings disclaimer..."
    }
  ],
  "scanned_at": "2026-05-29T11:00:00.000Z"
}`}</Code>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm font-semibold text-white mb-1">Zapier setup</p>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Create a new Zap with trigger: Webhooks by Zapier → Catch Hook</li>
              <li>Copy the webhook URL Zapier gives you</li>
              <li>Paste it into Settings → Webhook URL in Red Flag AI Pro</li>
              <li>Run a scan to test the connection</li>
              <li>Add your action (Slack message, Google Sheet row, email, etc.)</li>
            </ol>
          </div>
        </div>

        {/* Risk categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Risk categories</h2>
          <p className="text-gray-400 text-sm">All 21 categories are scanned on Sentinel. Other plans scan 16.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "income_claim", "urgency", "scarcity", "testimonial", "guarantee",
              "health_claim", "legal_disclaimer", "contract_contradiction", "data_privacy",
              "hidden_fees", "fake_reviews", "comparative_advertising", "email_compliance",
              "dark_patterns", "ai_disclosure", "ai_endorsement", "automated_decisions",
              "financial_promotion", "greenwashing", "subscription_trap", "influencer_disclosure",
            ].map((cat) => (
              <div key={cat} className="rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs font-mono text-gray-400">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Rate limits */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Rate limits</h2>
          <p className="text-gray-400 text-sm">Sentinel plan: unlimited scans via dashboard. API calls are subject to fair use. If you need higher throughput, contact us.</p>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">Questions? Email <a href="mailto:support@redflagaipro.com" className="text-red-400 hover:underline">support@redflagaipro.com</a></p>
        </div>

      </div>
    </div>
  );
}
