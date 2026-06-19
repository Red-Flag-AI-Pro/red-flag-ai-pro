import { createClient } from '@supabase/supabase-js';
import {
  calculateScores,
  calculateOverallScore,
  getRiskLevel,
  generateRedFlags,
  generateRoadmap,
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

    // Validate inputs
    if (!email || !answers || answers.length === 0) {
      return Response.json(
        { error: 'Missing email or answers' },
        { status: 400 }
      );
    }

    // Check if email already submitted (prevent duplicate submissions)
    const { data: existing } = await supabase
      .from('governance_audit_emails')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return Response.json(
        { error: 'Already submitted' },
        { status: 409 }
      );
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
    // STORE IN SUPABASE
    // ============================================================

    const { error: insertError } = await supabase
      .from('governance_audit_emails')
      .insert({
        email: email.toLowerCase(),
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

    // ============================================================
    // BUILD RESPONSE
    // ============================================================

    const response: GovernanceQuizResponse = {
      email,
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
