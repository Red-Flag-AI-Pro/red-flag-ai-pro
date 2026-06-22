import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog";
import React from "react";

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

const syne = "font-family: 'Syne', system-ui, sans-serif;";

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "white", marginTop: "3rem", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginTop: "2rem", marginBottom: "0.75rem" }}>
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "2.5rem 0" }} />);
    } else if (line.startsWith("| ")) {
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
        <div key={key++} style={{ margin: "1.5rem 0", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {rows[0]?.map((cell, ci) => (
                  <th key={ci} style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left", padding: "0.75rem 1rem" }}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", padding: "0.75rem 1rem" }}>
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
        <ul key={key++} style={{ margin: "1rem 0", paddingLeft: "0" }}>
          {items.map((item, ii) => (
            <li key={ii} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "0.625rem" }}>
              <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px", fontFamily: "'Syne', system-ui, sans-serif" }}>•</span>
              <span style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
    } else if (line.includes("☐")) {
      elements.push(
        <div key={key++} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)", padding: "1rem 1.25rem", margin: "0.5rem 0" }}>
          <span style={{ flexShrink: 0, width: "18px", height: "18px", border: "1.5px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
            <span style={{ color: "#4ade80", fontSize: "10px", fontWeight: 700 }}>✓</span>
          </span>
          <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/\*\*☐\s*\d+\.\s*/, "").replace(/☐\s*/, "").replace(/^\*\*/, "").replace(/\*\*$/, "")) }} />
        </div>
      );
    } else if (line.startsWith("[") && line.includes("](")) {
      const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        elements.push(
          <div key={key++} style={{ margin: "2rem 0", textAlign: "center" }}>
            <Link href={match[2]} style={{
              display: "inline-block",
              background: "#E5484D", color: "white",
              fontFamily: "'Syne', system-ui, sans-serif", fontSize: "0.875rem", fontWeight: 700,
              padding: "13px 28px", borderRadius: "9999px",
              boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
              textDecoration: "none"
            }}>
              {match[1]}
            </Link>
          </div>
        );
      }
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={key++} style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.9, margin: "1rem 0" }}
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
  }

  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong style=\"color:white;font-weight:700\">$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#ef4444;text-decoration:underline">$1</a>');
}

const CATEGORY_STYLES: Record<string, React.CSSProperties> = {
  "EU AI Act":    { color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" },
  "FTC":          { color: "#60a5fa", background: "rgba(96,165,250,0.1)",  border: "1px solid rgba(96,165,250,0.2)" },
  "ASA / UK":     { color: "#ef4444", background: "rgba(239,68,68,0.1)",   border: "1px solid rgba(239,68,68,0.2)" },
  "GDPR":         { color: "#4ade80", background: "rgba(74,222,128,0.1)",  border: "1px solid rgba(74,222,128,0.2)" },
  "Compliance":   { color: "#fbbf24", background: "rgba(251,191,36,0.1)",  border: "1px solid rgba(251,191,36,0.2)" },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <article style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 1.5rem" }}>

        {/* Back */}
        <Link href="/blog" style={{
          fontFamily: "'Syne', system-ui, sans-serif", fontSize: "12px",
          color: "rgba(255,255,255,0.3)", textDecoration: "none",
          letterSpacing: "0.06em"
        }}>
          ← All articles
        </Link>

        {/* Header */}
        <div style={{ marginTop: "2.5rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "3px 10px", borderRadius: "9999px",
              ...(CATEGORY_STYLES[post.category] ?? { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" })
            }}>
              {post.category}
            </span>
            <span style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{post.readTime}</span>
            <span style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', system-ui, sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem",
            background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            {post.title}
          </h1>
          <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            {post.description}
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "3rem" }} />

        {/* Content */}
        <div>
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: "5rem",
          background: "#102943",
          border: "1px solid rgba(239,68,68,0.2)",
          padding: "3rem",
          textAlign: "center",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: 0, left: "3rem", right: "3rem",
            height: "2px", background: "linear-gradient(90deg, #E5484D, transparent)"
          }} />
          <h2 style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.75rem", background: "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Scan Your Copy for Free
          </h2>
          <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Red Flag AI Pro checks your marketing copy against 29 risk categories across 9 jurisdictions in 60 seconds.
          </p>
          <Link href="/signup" style={{
            display: "inline-block",
            background: "#E5484D", color: "white",
            fontFamily: "'Syne', system-ui, sans-serif", fontSize: "0.875rem", fontWeight: 700,
            padding: "13px 28px", borderRadius: "9999px",
            boxShadow: "0 8px 24px rgba(229,72,77,0.3)",
            textDecoration: "none"
          }}>
            Start Free: No Credit Card
          </Link>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}>
              More articles
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {otherPosts.map((related, i) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} style={{
                  display: "block",
                  background: i % 2 === 0 ? "#0D1B2E" : "#102943",
                  border: "1px solid rgba(255,255,255,0.05)",
                  padding: "1.25rem 1.5rem",
                  textDecoration: "none"
                }}>
                  <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "3px" }}>{related.title}</p>
                  <p style={{ fontFamily: "'Syne', system-ui, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{related.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
      <Footer />
    </div>
  );
}
