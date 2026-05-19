import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://www.redflagaipro.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.redflagaipro.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 text-2xl font-bold text-gray-900">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mt-6 mb-2 text-lg font-bold text-gray-900">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="my-8 border-gray-200" />);
    } else if (line.startsWith("| ")) {
      // Simple table
      const rows: string[][] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("|")) {
        if (!lines[j].includes("---")) {
          rows.push(lines[j].split("|").filter(Boolean).map((c) => c.trim()));
        }
        j++;
      }
      i = j - 1;
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                {rows[0]?.map((cell, ci) => (
                  <th key={ci} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-4 py-2 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [line.replace(/^[-*] /, "")];
      let j = i + 1;
      while (j < lines.length && (lines[j].startsWith("- ") || lines[j].startsWith("* "))) {
        items.push(lines[j].replace(/^[-*] /, ""));
        j++;
      }
      i = j - 1;
      elements.push(
        <ul key={key++} className="my-4 space-y-2 pl-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1 text-red-500 font-bold">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
    } else if (line.match(/^\*\*☐/)) {
      elements.push(
        <div key={key++} className="my-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="text-lg mt-0.5">☐</span>
          <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\*\*☐\s*/, "")) }} />
        </div>
      );
    } else if (line.startsWith("[") && line.includes("](")) {
      const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        elements.push(
          <div key={key++} className="my-6 text-center">
            <Link
              href={match[2]}
              className="inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
            >
              {match[1]}
            </Link>
          </div>
        );
      }
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={key++} className="my-4 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
  }

  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-600 underline hover:text-red-700">$1</a>');
}

const CATEGORY_COLOURS: Record<string, string> = {
  "EU AI Act": "bg-purple-100 text-purple-700",
  "FTC": "bg-blue-100 text-blue-700",
  "ASA / UK": "bg-red-100 text-red-700",
  "GDPR": "bg-green-100 text-green-700",
  "Compliance": "bg-amber-100 text-amber-700",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link href="/blog" className="text-sm text-gray-500 hover:text-red-600 transition-colors">
          ← Back to all articles
        </Link>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOURS[post.category] ?? "bg-gray-100 text-gray-700"}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{post.readTime}</span>
            <span className="text-xs text-gray-400">
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            {post.description}
          </p>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Content */}
        <div className="prose-content">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gray-950 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Scan Your Copy for Free
          </h2>
          <p className="mt-3 text-gray-400">
            Red Flag AI Pro checks your marketing copy against 16 risk categories across 5 jurisdictions in 60 seconds.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors"
          >
            Start Free — No Credit Card →
          </Link>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-bold text-gray-900 mb-6">More Articles</h3>
            <div className="space-y-4">
              {otherPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block rounded-xl border border-gray-200 p-4 hover:border-red-300 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {related.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{related.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
