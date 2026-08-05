import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { addContactToLoops, sendLoopsEvent } from '@/lib/loops';
import {
  calculateScores,
  calculateOverallScore,
  getRiskLevel,
  generateRedFlags,
  generateRoadmap,
  trackRoadmap,
  type Answer,
  type GovernanceQuizResponse,
} from '@/lib/governance-audit';
import { enhanceGovernanceReport } from '@/lib/governance-enhance';
import { sendGovernanceSummaryEmail } from '@/lib/governance-email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Where the "new governance lead" notification event is sent. A Loops automation
// (Loops > Automations > Event triggered: "governanceLeadCaptured") can email
// this address whenever a real visitor completes the quiz, so leads are never
// invisible again.
const FOUNDER_NOTIFY_EMAIL = 'jamesbstokes82@gmail.com';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email: string;
      answers: Answer[];
    };

    const { email, answers } = body;
    const trimmedEmail = (email ?? '').trim();

    // Validate inputs — email is optional (free score preview); answers are required.
    if (!answers || answers.length === 0) {
      return Response.json(
        { error: 'Missing answers' },
        { status: 400 }
      );
    }

    // Only enforce one-assessment-per-email and persist a lead once an email is actually provided
    // (i.e. once the visitor unlocks the detailed gap analysis / PDF report).
    if (trimmedEmail) {
      const { data: existing } = await supabase
        .from('governance_audit_emails')
        .select('id')
        .eq('email', trimmedEmail.toLowerCase())
        .single();

      if (existing) {
        return Response.json(
          { error: 'Already submitted' },
          { status: 409 }
        );
      }
    }

    // ============================================================
    // CALCULATE SCORES
    // ============================================================

    const dimensionScores = calculateScores(answers);
    const overallScore = calculateOverallScore(dimensionScores);
    const riskLevel = getRiskLevel(overallScore);
    const templateFlags = generateRedFlags(dimensionScores, answers);

    // ============================================================
    // CHECK FOR A PAYING (GROWTH OR SENTINEL) ACCOUNT — moved ahead of AI
    // enhancement on purpose. Since the quiz no longer requires an email to
    // run, this now needs to be known BEFORE the AI call, not after: a free
    // or anonymous respondent only ever sees one warning, so only that one
    // flag needs enhancing. Enhancing all of them first (the old order) meant
    // paying an AI call for detail that gets thrown away the moment the
    // response is built, an open-ended cost with no cap tied to it.
    // ============================================================
    // The split is warnings vs fixes, not "some flags vs all flags" — Growth
    // and Sentinel looked nearly identical when Growth got full detail
    // (including the fix) on half its gaps. Now:
    //   - Free: ONE warning (what's wrong + why), no fix, no citation.
    //   - Growth: EVERY warning, with citation — the full diagnosis, scary
    //     and complete — but the recommendation (the fix) is stripped from
    //     all of them, and the roadmap (the action plan) stays locked to a
    //     count. Growth tells you everything that's wrong; Sentinel is the
    //     only tier that tells you how to fix it.
    //   - Sentinel: every warning + every fix + the full roadmap, plus the
    //     managed layer (tracked /governance checklist, all 6 documents,
    //     financial modeling, board reporting — sold outside code gates).

    let tier: 'free' | 'growth' | 'sentinel' = 'free';
    let loggedInUser: { id: string; email?: string } | null = null;

    try {
      const serverSupabase = await createServerClient();
      const {
        data: { user },
      } = await serverSupabase.auth.getUser();

      if (user) {
        loggedInUser = { id: user.id, email: user.email };
        const { data: profile } = await serverSupabase
          .from('profiles')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        if (profile?.plan === 'enterprise' || profile?.plan === 'sentinel') {
          tier = profile.plan === 'sentinel' ? 'sentinel' : 'growth';
        }
      }
    } catch (linkError) {
      // Never let account-linking failures break the public assessment flow.
      console.error('Governance assessment account-link error:', linkError);
    }

    const fullAccess = tier !== 'free'; // every warning visible (Growth + Sentinel)
    const managed = tier === 'sentinel'; // fixes unlocked + managed tooling

    const severityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
    const sortedTemplateFlags = [...templateFlags].sort(
      (a, b) => severityRank[a.severity] - severityRank[b.severity]
    );
    const warningVisibleCount = fullAccess ? sortedTemplateFlags.length : 1;
    const toEnhance = sortedTemplateFlags.slice(0, warningVisibleCount);
    const restUnenhanced = sortedTemplateFlags.slice(warningVisibleCount);

    // Tailor each VISIBLE finding to the respondent's actual answers. Locked
    // flags stay as template-only — their description/recommendation get
    // stripped to '' before they ever reach the response anyway, so paying
    // for AI enhancement on them was always wasted work, not just an
    // anonymous-user problem. Falls back silently to the template findings
    // if the AI layer is unavailable, so the assessment always completes.
    const enhancedVisible = await enhanceGovernanceReport(
      toEnhance,
      answers,
      dimensionScores,
      overallScore,
      riskLevel
    );
    const redFlags = [...enhancedVisible, ...restUnenhanced];

    const roadmap = generateRoadmap(dimensionScores, redFlags);

    // ============================================================
    // ANONYMOUS USAGE LOG — fires on every real completion, email or not.
    // Decoupled from lead capture on purpose: this is the only way to see
    // how many people actually used the tool, independent of who left an
    // email. Never blocks the response if it fails.
    // ============================================================
    supabase
      .from('tool_usage_events')
      .insert({ tool: 'governance-audit', score: overallScore })
      .then(({ error: usageError }) => {
        if (usageError) console.error('tool_usage_events insert error:', usageError);
      });

    // ============================================================
    // STORE IN SUPABASE (lead capture — only once an email is provided)
    // ============================================================

    if (trimmedEmail) {
      const { error: insertError } = await supabase
        .from('governance_audit_emails')
        .insert({
          email: trimmedEmail.toLowerCase(),
          score: overallScore,
          risk_level: riskLevel,
          dimension_scores: dimensionScores,
          red_flags: redFlags,
          roadmap: roadmap,
          answers: answers,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return Response.json(
          { error: 'Failed to save results' },
          { status: 500 }
        );
      }

      // Lead capture side effects. Wrapped so a Loops outage can never break the
      // visitor's assessment. Two things happen:
      //   1. The lead is added to the Loops audience (source "governance-audit")
      //      so it's immediately visible and nurturable, not just a hidden DB row.
      //   2. A "governanceLeadCaptured" event fires to the founder's own address
      //      so a Loops automation can notify James the moment someone completes it.
      try {
        const leadEmail = trimmedEmail.toLowerCase();
        await addContactToLoops({
          email: leadEmail,
          plan: 'free',
          source: 'governance-audit',
          // Restored now that loops.ts ships the track param (it was stripped
          // at cf9910c while that change was still unshipped).
          track: 'governance',
        });
        await sendLoopsEvent({
          email: FOUNDER_NOTIFY_EMAIL,
          eventName: 'governanceLeadCaptured',
          properties: {
            leadEmail,
            score: overallScore,
            riskLevel,
          },
        });
      } catch (notifyError) {
        console.error('Governance lead notification error:', notifyError);
      }

      // Send the respondent their summary straight away — the FAQ promises a
      // summary in their inbox, and it doubles as the first warm touch.
      try {
        const topGaps = redFlags
          .slice(0, 3)
          .map((f: { title?: string; dimension?: string }) => f.title ?? f.dimension ?? '')
          .filter(Boolean);
        await sendGovernanceSummaryEmail({
          email: trimmedEmail.toLowerCase(),
          score: overallScore,
          riskLevel,
          topGaps,
        });
      } catch (summaryError) {
        console.error('Governance summary email error:', summaryError);
      }
    }

    // ============================================================
    // ACCOUNT-LINKED PERSISTENCE — paying tiers only. Auth/tier was already
    // resolved above (needed before enhancement); this just does the side
    // effects that depend on it: the tracked assessment row and the
    // first-use activation event.
    // ============================================================
    if (loggedInUser) {
      try {
        const serverSupabase = await createServerClient();

        if (tier === 'growth' || tier === 'sentinel') {
          // Account-linked, separate from the anonymous lead-gen row above.
          // Persisted for both tiers so Growth's one free document can be
          // generated later — only Sentinel's roadmap is actually tracked
          // (status toggling) via the /governance dashboard.
          const { count: existingAuditCount } = await serverSupabase
            .from('governance_assessments')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', loggedInUser.id);

          await serverSupabase.from('governance_assessments').insert({
            user_id: loggedInUser.id,
            score: overallScore,
            risk_level: riskLevel,
            dimension_scores: dimensionScores,
            red_flags: redFlags,
            roadmap: trackRoadmap(roadmap),
          });

          // First governance audit — lets Loops suppress the activation nudge
          if ((existingAuditCount ?? 0) === 0 && loggedInUser.email) {
            sendLoopsEvent({
              email: loggedInUser.email,
              eventName: 'first_tool_used',
              properties: { tool: 'governance_audit', score: overallScore, risk_level: riskLevel },
            }).catch(() => {});
          }
        } else if (loggedInUser.email) {
          // Free logged-in user completed governance audit — still fire activation event
          const { count: existingAuditCount } = await serverSupabase
            .from('governance_audit_emails')
            .select('id', { count: 'exact', head: true })
            .eq('email', loggedInUser.email);

          if ((existingAuditCount ?? 0) <= 1) {
            sendLoopsEvent({
              email: loggedInUser.email,
              eventName: 'first_tool_used',
              properties: { tool: 'governance_audit', score: overallScore, risk_level: riskLevel },
            }).catch(() => {});
          }
        }
      } catch (linkError) {
        // Never let account-linking failures break the public assessment flow.
        console.error('Governance assessment account-link error:', linkError);
      }
    }

    // ============================================================
    // BUILD RESPONSE
    // ============================================================
    // redFlags is already severity-sorted (built from sortedTemplateFlags
    // above), so no need to re-sort here.

    const responseFlags = redFlags.map((f, i) => {
      if (i >= warningVisibleCount) {
        return {
          severity: f.severity,
          dimension: f.dimension,
          title: f.title,
          description: '',
          recommendation: '',
          regulatoryContext: [],
          unlocked: false,
        };
      }
      return {
        ...f,
        recommendation: managed ? f.recommendation : '',
        unlocked: true,
      };
    });

    const response: GovernanceQuizResponse = {
      email: trimmedEmail,
      answers,
      dimensionScores,
      overallScore,
      riskLevel,
      redFlags: responseFlags,
      roadmap: managed ? roadmap : [],
      roadmapCount: roadmap.length,
      fullAccess,
      managed,
    };

    return Response.json(response);
  } catch (error) {
    console.error('Governance audit API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
