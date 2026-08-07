import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/analyzer";
import { enhanceWithAI } from "@/lib/ai-enhance";
import { SEVERITY_DEDUCTIONS, getExcludedCategories, JURISDICTION_COUNT } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/server";
import { addContactToLoops, sendLoopsEvent } from "@/lib/loops";

const PREVIEW_COUNT = 1;

// How many locked (blurred) flag cards to show beyond the unlocked one —
// gives a clear sense of "there's more here" without an overwhelming list.
const MAX_LOCKED_PREVIEW = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const content: string = body.content ?? "";
  const rawEmail: string = body.email ?? "";
  const email = rawEmail.trim().toLowerCase();
  const selectedJurisdictions = body.jurisdictions ?? [];

  // Email is optional — free score preview. If given, it must be valid.
  if (email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  if (content.trim().length < 30) {
    return NextResponse.json(
      { error: "Please paste at least 30 characters of copy to check." },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  // One free scan per email address — claim it atomically via the unique
  // constraint on `email`. Only applies once an email is actually given;
  // anonymous scans aren't tracked per-address, they're rate-limited by
  // cost instead (see below: no AI call runs until email is provided).
  if (email) {
    const { error: claimError } = await supabase
      .from("demo_scan_emails")
      .insert({ email, content: content.trim() });

    if (claimError) {
      if (claimError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This email has already used its free check. Sign up for a free account to keep checking.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  }

  const { flags: rawFlags } = analyzeContent("Demo Scan", content, selectedJurisdictions.length > 0 ? selectedJurisdictions : undefined);

  // AI enhancement (specific rewrites + catch implied violations) costs a
  // real API call. Anonymous scans skip it entirely and use the free,
  // zero-cost keyword-matched flags instead — real value, no open-ended
  // cost. Giving an email is a genuine upgrade at that point: the AI
  // rewrite/suggestion for the one flag shown becomes real, not withheld
  // content that already existed.
  const allFlags = email ? await enhanceWithAI(content, rawFlags) : rawFlags;

  // Anonymous usage log — fires on every real scan, email or not. Lets us
  // see actual usage independent of who left an email.
  supabase
    .from("tool_usage_events")
    .insert({ tool: "compliance-scan" })
    .then(({ error: usageError }: { error: unknown }) => {
      if (usageError) console.error("tool_usage_events insert error:", usageError);
    });

  // Demo shows the free-tier category set (16 of 29)
  const excludedCategories = getExcludedCategories("free");
  const flags = allFlags.filter((f) => !excludedCategories.includes(f.category));

  // Recalculate score from allowed flags only
  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + (SEVERITY_DEDUCTIONS[f.severity] ?? 0), 0));

  // Sort highest-severity first so the one flag we fully reveal is the
  // most compelling one — the "look what we just found" moment.
  const severityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...flags].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const shownCount = Math.min(sorted.length, PREVIEW_COUNT + MAX_LOCKED_PREVIEW);

  const preview = sorted.slice(0, shownCount).map((f, i) => {
    const base = { category: f.category, severity: f.severity };
    // Fully reveal the single highest-severity flag — proof the scan is
    // real, not a black box — the rest stay locked behind a Pro upgrade.
    if (i === 0) {
      return {
        ...base,
        unlocked: true,
        text_excerpt: f.text_excerpt,
        flag_description: f.flag_description,
        suggestion: f.suggestion,
      };
    }
    return { ...base, unlocked: false };
  });

  const totalFlags = flags.length;
  const hiddenCount = Math.max(0, totalFlags - shownCount);

  // Everything below is lead-capture side effects — only relevant once an
  // email was actually given. Anonymous scans stop at the response below.
  if (email) {
    // The demo is the site's biggest top of funnel entry point — every email
    // that runs a check becomes a nurturable Loops contact, and the event
    // gives the Loops activation sequence a trigger to hang off. Best effort:
    // a Loops outage must never block showing results.
    try {
      await addContactToLoops({ email, source: "demo-scan", track: "compliance" });
      await sendLoopsEvent({
        email,
        eventName: "demo_check_completed",
        properties: { score, totalFlags },
      });
    } catch {
      // non fatal
    }

    // The demo UI promises results by email — keep that promise the moment it
    // is made, not once a nurture sequence exists. Best effort.
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const signupUrl = `https://www.redflagaipro.com/signup?email=${encodeURIComponent(email)}&track=compliance`;
        await resend.emails.send({
          from: "Red Flag AI Pro <audit@redflagaipro.com>",
          to: email,
          subject: `Your compliance check: ${score}/100, ${totalFlags} flag${totalFlags === 1 ? "" : "s"} found`,
          html: `<div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <p style="font-size:15px;line-height:1.7">Here is the result of your free compliance check.</p>
            <div style="padding:20px 24px;background:#0A1628;border-radius:10px;margin:16px 0">
              <p style="margin:0;color:#F4F1EA;font-size:34px;font-weight:700">${score}/100</p>
              <p style="margin:6px 0 0;color:rgba(244,241,234,0.7);font-size:14px">${totalFlags} compliance flag${totalFlags === 1 ? "" : "s"} found across {JURISDICTION_COUNT} jurisdictions</p>
            </div>
            <p style="font-size:14px;line-height:1.7">Your highest severity finding was unlocked on screen. The rest, including the compliant rewrite for each one, unlock with a free account. Your demo check carries over, so you will not have to paste anything again.</p>
            <p style="font-size:14px;line-height:1.7"><a href="${signupUrl}" style="color:#E5484D">Open my full results</a></p>
            <p style="font-size:13px;color:#888;line-height:1.6;margin-top:24px">James Stokes<br/>Red Flag AI Pro · redflagaipro.com</p>
          </div>`,
        });
      }
    } catch {
      // non fatal
    }
  }

  return NextResponse.json({ score, totalFlags, hiddenCount, flags: preview });
}
