import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const redFlags = generateRedFlags(dimensionScores, answers);
    const roadmap = generateRoadmap(dimensionScores, redFlags);

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
    }

    // ============================================================
    // ALSO SAVE A TRACKABLE COPY FOR LOGGED-IN SENTINEL USERS
    // ============================================================
    // Account-linked, separate from the anonymous lead-gen row above, so
    // their remediation roadmap shows up as a managed checklist in /governance.

    try {
      const serverSupabase = await createServerClient();
      const {
        data: { user },
      } = await serverSupabase.auth.getUser();

      if (user) {
        const { data: profile } = await serverSupabase
          .from('profiles')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        if (profile?.plan === 'sentinel') {
          await serverSupabase.from('governance_assessments').insert({
            user_id: user.id,
            score: overallScore,
            risk_level: riskLevel,
            dimension_scores: dimensionScores,
            red_flags: redFlags,
            roadmap: trackRoadmap(roadmap),
          });
        }
      }
    } catch (linkError) {
      // Never let account-linking failures break the public assessment flow.
      console.error('Governance assessment account-link error:', linkError);
    }

    // ============================================================
    // BUILD RESPONSE
    // ============================================================

    const response: GovernanceQuizResponse = {
      email: trimmedEmail,
      answers,
      dimensionScores,
      overallScore,
      riskLevel,
      redFlags,
      roadmap,
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
