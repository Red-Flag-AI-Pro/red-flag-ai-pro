import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import React from "react";

export const metadata: Metadata = {
  title: "About — Red Flag AI Pro",
  description:
    "Red Flag was built to solve a real problem: you can't prove governance happened. Built by James Stokes. For CFOs, compliance teams, and regulated businesses.",
  alternates: { canonical: "https://www.redflagaipro.com/about" },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as React.CSSProperties;

export default function AboutPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "8rem 1.5rem 6rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "600px",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, rgba(229,72,77,0.08) 0%, transparent 65%)",
          }}
        />

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...syne,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ef4444",
              marginBottom: "1.5rem",
            }}
          >
            Why we exist
          </p>

          <h1
            style={{
              ...syne,
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: "1.5rem",
              background:
                "linear-gradient(160deg, #F4F1EA 0%, #F4F1EA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The real problem isn&apos;t<br />
            governance policy.<br />
            It&apos;s proving it happened.
          </h1>

          <p
            style={{
              ...syne,
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.01em",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Every organization has policies. But when a regulator asks, "Can you
            prove governance happened?"—most organizations can&apos;t. Red Flag
            was built to close that gap.
          </p>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section style={{ padding: "6rem 1.5rem", background: "#0D1B2E" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                ...syne,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            >
              The Gap
            </p>
            <h2
              style={{
                ...syne,
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "white",
              }}
            >
              Policy vs. Practice vs. Proof
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                title: "Every org has policy",
                desc: "Written AI governance frameworks exist. Board approved. Documented. But...",
              },
              {
                title: "Practice diverges silently",
                desc: "Teams don't follow it. Tools aren't approved. Data flows weren't checked. No one's monitoring.",
              },
              {
                title: "Proof doesn't exist",
                desc: "When regulators ask, 'prove governance happened?' most organizations can't. That's liability under Munir.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(16,41,67,0.6)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px",
                  padding: "2rem",
                }}
              >
                <p
                  style={{
                    ...syne,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    ...syne,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "3rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "2.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                ...syne,
                fontSize: "12px",
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Munir v SSHD (2024)
            </p>
            <p
              style={{
                ...syne,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              &ldquo;Governance you cannot demonstrate is liability.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* WHAT RED FLAG DOES */}
      <section style={{ padding: "6rem 1.5rem", background: "#0A1628" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                ...syne,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            >
              What We Build
            </p>
            <h2
              style={{
                ...syne,
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "white",
              }}
            >
              Governance you can prove
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "",
                title: "See Reality",
                desc: "Assessment shows where governance actually is (not where you hope it is). 6-dimension audit reveals every gap.",
              },
              {
                icon: "",
                title: "Know What to Fix",
                desc: "Strategic roadmap prioritizes gaps by impact. Quick wins in 90 days. Medium-term in 6 months. Transformation in 12.",
              },
              {
                icon: "",
                title: "Build Systems",
                desc: "Manual governance doesn't scale. We build monitoring, enforcement, and audit trails so proof is automatic.",
              },
              {
                icon: "",
                title: "Prove It Happened",
                desc: "Forensic logs. Evidence packages. Regulatory mapping. When auditors ask 'prove it', you have the answer.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(16,41,67,0.6)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px",
                  padding: "2rem",
                }}
              >
                <div style={{ width: "32px", height: "2px", background: "#E5484D", marginBottom: "1.25rem" }} />
                <p
                  style={{
                    ...syne,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    ...syne,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "#0D1B2E",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              ...syne,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ef4444",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Built by James Stokes
          </p>

          <div
            style={{
              background: "rgba(16,41,67,0.5)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <p
              style={{
                ...syne,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              I&apos;ve built products before. But this one came from a different place.
            </p>

            <p
              style={{
                ...syne,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              I watched teams write governance policies that nobody read. I saw
              compliance officers struggling to answer one simple question:
              &ldquo;Can you prove governance is actually happening?&rdquo; The
              answer was always no. Not because they didn&apos;t care. Because
              there was no tool to make it visible.
            </p>

            <p
              style={{
                ...syne,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
              }}
            >
              Red Flag solves that. It makes governance visible. It shows you
              exactly what&apos;s broken, prioritizes fixes, and then proves to
              regulators that governance actually happened. That&apos;s the only
              thing that matters now.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "#0A1628",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              ...syne,
              fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              color: "white",
            }}
          >
            Ready to know where you actually stand?
          </h2>
          <p
            style={{
              ...syne,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Start with a free assessment. 5 minutes. See your governance
            maturity, gaps, and roadmap.
          </p>
          <Link
            href="/governance-audit"
            style={{
              ...syne,
              fontSize: "1rem",
              fontWeight: 700,
              background: "#ef4444",
              color: "white",
              padding: "14px 40px",
              borderRadius: "9999px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Start assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
