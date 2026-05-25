import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Marketing Compliance Guides & Updates",
  description:
    "Expert guides on FTC compliance, GDPR email marketing, ASA CAP Code violations, EU AI Act requirements and marketing compliance best practices for 2026.",
  alternates: { canonical: "https://www.redflagaipro.com/blog" },
};

const CATEGORY_COLOURS: Record<string, string> = {
  "EU AI Act": "bg-purple-100 text-purple-700",
  "FTC": "bg-blue-100 text-blue-700",
  "ASA / UK": "bg-red-100 text-red-700",
  "GDPR": "bg-green-100 text-green-700",
  "Compliance": "bg-amber-100 text-amber-700",
  "For Buyers": "bg-emerald-100 text-emerald-700",
  "For Sellers": "bg-orange-100 text-orange-700",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Compliance Guides & Updates
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Plain-English guides to FTC, ASA, GDPR, EU AI Act and global marketing compliance law — written for marketers, not lawyers.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-gray-200 p-6 hover:border-red-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOURS[post.category] ?? "bg-gray-100 text-gray-700"}`}>
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
                <span className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {post.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-red-600">
                Read article →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gray-950 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Stop Reading About Compliance. Start Scanning.
          </h2>
          <p className="mt-3 text-gray-400">
            Red Flag AI Pro checks your copy against 16 risk categories across 5 jurisdictions in 60 seconds.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Scan Your Copy Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
