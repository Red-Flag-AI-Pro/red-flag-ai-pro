'use client';

import { useState } from 'react';
import { GovernanceAuditForm } from './GovernanceAuditForm';
import { GovernanceAuditResults } from './GovernanceAuditResults';
import { CalendlyBooking } from './CalendlyBooking';
import { generateGovernanceAuditPDF } from '@/lib/governance-audit-pdf';
import { type GovernanceQuizResponse, type Answer } from '@/lib/governance-audit';

export function GovernanceAuditFlow() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GovernanceQuizResponse | null>(null);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const handleFormSubmit = async (data: { email: string; answers: Answer[] }) => {
    setIsLoading(true);
    setError('');

    try {
      // Submit quiz to API
      const response = await fetch('/api/governance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError(
            "You've already completed this assessment. Check your email for your report."
          );
          return;
        }
        throw new Error('Failed to submit quiz');
      }

      const result = (await response.json()) as GovernanceQuizResponse;
      setResults(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;
    try {
      setIsDownloading(true);
      const pdfBytes = await generateGovernanceAuditPDF(results);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `governance-assessment-${results.email}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      // Send email after download
      try {
        await fetch('/api/governance-audit/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ response: results }),
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    } catch (err) {
      console.error('Failed to download report:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleScheduleCall = () => {
    // Open Calendly modal (FREE - no payment required)
    setShowCalendly(true);
  };

  const handleExploreFeatures = () => {
    // Redirect to pricing/Sentinel page
    window.location.href = '/pricing';
  };

  // Show results if available
  if (results) {
    return (
      <>
        <GovernanceAuditResults
          response={results}
          onDownloadReport={handleDownloadReport}
          onScheduleCall={handleScheduleCall}
          onExploreFeatures={handleExploreFeatures}
        />
        {showCalendly && (
          <CalendlyBooking
            email={results.email}
            onSuccess={() => setShowCalendly(false)}
          />
        )}
      </>
    );
  }

  // Show form (with error if present)
  return (
    <div className="space-y-4">
      <GovernanceAuditForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      {error && (
        <div className="max-w-md mx-auto bg-red-950 border border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
