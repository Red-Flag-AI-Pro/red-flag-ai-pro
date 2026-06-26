'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import {
  GOVERNANCE_DIMENSIONS,
  PEER_BENCHMARK,
  type GovernanceQuizResponse,
  type Dimension,
  type RiskLevel,
} from '@/lib/governance-audit';

interface BenchmarkData {
  average: number;
  quartile: { q1: number; q2: number; q3: number; q4: number };
  sampleSize: number;
  source: 'real' | 'estimate';
}

interface GovernanceAuditResultsProps {
  response: GovernanceQuizResponse;
  onDownloadReport?: () => void;
  onScheduleCall?: () => void;
  onExploreFeatures?: () => void;
  onUnlock?: () => void;
}

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; badge: string }> =
  {
    critical: {
      bg: 'bg-red-950',
      text: 'text-red-400',
      badge: 'bg-red-600',
    },
    moderate: {
      bg: 'bg-amber-950',
      text: 'text-amber-400',
      badge: 'bg-amber-600',
    },
    managed: {
      bg: 'bg-emerald-950',
      text: 'text-emerald-400',
      badge: 'bg-emerald-600',
    },
    mature: {
      bg: 'bg-green-950',
      text: 'text-green-400',
      badge: 'bg-green-600',
    },
  };

const RISK_LABELS: Record<RiskLevel, string> = {
  critical: 'Critical Risk',
  moderate: 'Moderate Risk',
  managed: 'Managed Risk',
  mature: 'Mature Governance',
};

export function GovernanceAuditResults({
  response,
  onDownloadReport,
  onScheduleCall,
  onExploreFeatures,
  onUnlock,
}: GovernanceAuditResultsProps) {
  const colors = RISK_COLORS[response.riskLevel];
  const [benchmark, setBenchmark] = useState<BenchmarkData>({
    ...PEER_BENCHMARK.overall,
    sampleSize: 0,
    source: 'estimate',
  });

  useEffect(() => {
    fetch('/api/governance-audit/benchmark')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BenchmarkData | null) => {
        if (data) setBenchmark(data);
      })
      .catch(() => {
        // Static fallback already set as initial state — nothing to do.
      });
  }, []);

  const compareLine =
    response.overallScore >= benchmark.quartile.q4
      ? `Top tier. Above the top quartile benchmark of ${benchmark.quartile.q4}/100.`
      : response.overallScore >= benchmark.average
        ? `Above the industry average of ${benchmark.average}/100.`
        : `Below the industry average of ${benchmark.average}/100. ${benchmark.average - response.overallScore} points to close.`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8">
      {/* ============================================================
          BIG SCORE DISPLAY
          ============================================================ */}

      <div className={`rounded-lg border border-gray-800 p-8 space-y-6 ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">
              Governance Maturity Index
            </p>
            <div className="flex items-baseline gap-3">
              <span className={`text-6xl font-bold ${colors.text}`}>
                <AnimatedNumber value={response.overallScore} />
              </span>
              <span className="text-3xl text-gray-500">/100</span>
            </div>
          </div>

          {/* Risk level */}
          <div className="flex flex-col items-end">
            <div className="w-8 h-0.5 bg-[#E5484D] mb-3" />
            <p className={`text-sm font-semibold ${colors.text}`}>
              {RISK_LABELS[response.riskLevel]}
            </p>
          </div>
        </div>

        {/* Peer Benchmarking */}
        <div className="pt-4 border-t border-gray-700 space-y-2">
          <p className="text-xs text-gray-400">How you compare:</p>
          <p className={`text-sm font-medium ${colors.text}`}>
            {compareLine}
          </p>
          <p className="text-xs text-gray-500">
            Industry average: {benchmark.average}/100 | Top performers: {benchmark.quartile.q4}/100
            {benchmark.source === 'real' && (
              <> · based on {benchmark.sampleSize.toLocaleString()} real Red Flag assessments</>
            )}
          </p>
        </div>
      </div>

      {/* ============================================================
          DIMENSION BREAKDOWN
          ============================================================ */}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Governance Dimensions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            Object.entries(response.dimensionScores) as [Dimension, number][]
          ).map(([dimension, score]) => {
            const dimInfo = GOVERNANCE_DIMENSIONS[dimension];
            const riskLevel =
              score >= 75 ? 'mature' : score >= 55 ? 'managed' : score >= 35 ? 'moderate' : 'critical';
            const dimColors = RISK_COLORS[riskLevel];

            return (
              <div
                key={dimension}
                className={`border border-gray-800 rounded-lg p-4 space-y-2 ${dimColors.bg}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {dimInfo.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {dimInfo.subtitle}
                    </p>
                  </div>
                  <span className={`text-2xl font-bold ${dimColors.text}`}>
                    <AnimatedNumber value={score} />
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-gray-900 rounded-full h-1">
                  <div
                    className={`h-full rounded-full ${dimColors.badge}`}
                    style={{ width: `${Math.min(100, score)}%`, transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          DETAILED GAP ANALYSIS, PDF REPORT, CTAs (email already captured to start)
          ============================================================ */}
      {response.redFlags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Top Governance Gaps
          </h3>

          <div className="space-y-3">
            {response.redFlags.map((flag, idx) => {
              const severity =
                flag.severity === 'high'
                  ? 'high'
                  : flag.severity === 'medium'
                    ? 'medium'
                    : 'low';
              const dimInfo = GOVERNANCE_DIMENSIONS[flag.dimension];
              const locked = flag.unlocked === false;

              return (
                <div
                  key={idx}
                  className="border border-gray-800 rounded-lg p-4 space-y-3 bg-gray-950"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            severity === 'high'
                              ? 'high'
                              : severity === 'medium'
                                ? 'medium'
                                : 'low'
                          }
                          className="text-xs"
                        >
                          {severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-medium text-gray-400">
                          {dimInfo.title}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        {flag.title}
                      </h4>
                    </div>
                    <span className="text-2xl">#{idx + 1}</span>
                  </div>

                  {locked ? (
                    <div className="relative">
                      <p className="text-sm text-gray-400 leading-relaxed blur-sm select-none">
                        This gap could expose your organisation to regulatory action. Unlock the full report to see exactly why, and the specific fix.
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full border border-gray-700 bg-black/80 px-3 py-1 text-xs font-semibold text-gray-300">
                          Locked — Growth plan and up
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Description — the warning, visible from Growth up */}
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {flag.description}
                      </p>

                      {/* Recommendation — the fix, Sentinel only */}
                      {flag.recommendation ? (
                        <div className="bg-gray-900 border border-gray-800 rounded p-3 space-y-1">
                          <p className="text-xs font-semibold text-gray-400">
                            RECOMMENDATION:
                          </p>
                          <p className="text-sm text-gray-300">
                            {flag.recommendation}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-900 border border-dashed border-gray-700 rounded p-3 space-y-1">
                          <p className="text-xs font-semibold text-gray-500">
                            RECOMMENDATION: Locked — Sentinel only
                          </p>
                          <p className="text-xs text-gray-500">
                            We've confirmed this is a real gap. The specific fix unlocks with Sentinel.
                          </p>
                        </div>
                      )}

                      {/* Regulatory Context */}
                      <div className="flex flex-wrap gap-2">
                        {flag.regulatoryContext.map((context, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-400"
                          >
                            {context}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!response.managed && response.roadmapCount > 0 && (
        <div className="border border-gray-800 rounded-lg p-5 bg-gray-950 text-center space-y-2">
          <p className="text-sm font-semibold text-white">
            {response.roadmapCount} remediation action{response.roadmapCount === 1 ? '' : 's'} identified across 90 days, 6 months and 12 months
          </p>
          <p className="text-xs text-gray-400">
            Your prioritised roadmap — with owners and timelines — unlocks with Sentinel.
          </p>
        </div>
      )}

      {/* ============================================================
          CALL-TO-ACTION SECTION
          ============================================================ */}

      <div className="space-y-4 border-t border-gray-800 pt-8">
        <h3 className="text-lg font-semibold text-white">
          Next Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CTA 1: Download Report (full access) or Unlock (locked) */}
          {response.managed ? (
            <Button
              onClick={onDownloadReport}
              variant="primary"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <div className="text-center">
                <p className="font-semibold text-sm">Download Full Report</p>
                <p className="text-xs text-gray-300 mt-1">
                  Governance assessment + roadmap + fixes
                </p>
              </div>
            </Button>
          ) : response.fullAccess ? (
            <Button
              onClick={onDownloadReport}
              variant="primary"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <div className="text-center">
                <p className="font-semibold text-sm">Download Diagnosis</p>
                <p className="text-xs text-gray-300 mt-1">
                  Every gap — fixes unlock with Sentinel
                </p>
              </div>
            </Button>
          ) : (
            <Button
              onClick={onUnlock}
              variant="primary"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <div className="text-center">
                <p className="font-semibold text-sm">Unlock Full Report</p>
                <p className="text-xs text-gray-300 mt-1">
                  Every gap + your remediation roadmap
                </p>
              </div>
            </Button>
          )}

          {/* CTA 2: Schedule Call */}
          <Button
            onClick={onScheduleCall}
            variant="secondary"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <div className="text-center">
              <p className="font-semibold text-sm">Schedule Assessment</p>
              <p className="text-xs text-gray-300 mt-1">
                20-min governance consultation
              </p>
            </div>
          </Button>

          {/* CTA 3: Explore plans */}
          <Button
            onClick={onExploreFeatures}
            variant="secondary"
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <div className="text-center">
              <p className="font-semibold text-sm">Explore Growth & Sentinel</p>
              <p className="text-xs text-gray-300 mt-1">
                Governance monitoring & enforcement
              </p>
            </div>
          </Button>
        </div>
      </div>

      {/* ============================================================
          EVIDENCE FRAMEWORK PREVIEW
          ============================================================ */}

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-1">
            What You're Getting
          </h4>
          <p className="text-xs text-gray-400">
            {response.managed
              ? 'Automatically generated audit ready artifacts — all 6 documents included'
              : response.fullAccess
                ? 'Automatically generated audit ready artifacts — 1 free document with Growth, all 6 with Sentinel'
                : 'Automatically generated audit ready artifacts (unlocks with Growth)'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <p className="font-medium text-white">Governance Assessment Report</p>
              <p className="text-gray-400">Scoring + framework mapping</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <p className="font-medium text-white">Risk Register Template</p>
              <p className="text-gray-400">Prioritized remediation roadmap</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <p className="font-medium text-white">Evidence Framework Checklist</p>
              <p className="text-gray-400">What regulators need from you</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" stroke="#C9A66B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <p className="font-medium text-white">Board Slide Deck</p>
              <p className="text-gray-400">Executive summary (4 slides)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          FOOTER
          ============================================================ */}

      <div className="text-center pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Questions? Email{' '}
          <a href="mailto:support@redflagaipro.com" className="text-gray-400 hover:text-white">
            support@redflagaipro.com
          </a>
        </p>
      </div>
    </div>
  );
}
