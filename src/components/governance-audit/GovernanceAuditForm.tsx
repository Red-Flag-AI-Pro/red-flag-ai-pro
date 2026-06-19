'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ALL_QUESTIONS,
  GOVERNANCE_DIMENSIONS,
  type Answer,
  type Dimension,
} from '@/lib/governance-audit';

interface GovernanceAuditFormProps {
  onSubmit?: (data: { email: string; answers: Answer[] }) => void;
  isLoading?: boolean;
}

type FormStage = 'email-gate' | 'quiz' | 'submitted';

export function GovernanceAuditForm({
  onSubmit,
  isLoading = false,
}: GovernanceAuditFormProps) {
  const [stage, setStage] = useState<FormStage>('email-gate');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState('');

  // ============================================================
  // EMAIL GATE STAGE
  // ============================================================

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    // In production: check if email already completed quiz (403 response = already taken)
    // For MVP: proceed directly to quiz
    setStage('quiz');
  };

  // ============================================================
  // QUIZ STAGE
  // ============================================================

  const currentQuestion = ALL_QUESTIONS[currentQuestionIndex];
  const questionsRemaining = ALL_QUESTIONS.length - currentQuestionIndex;
  const progressPercent = ((currentQuestionIndex + 1) / ALL_QUESTIONS.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const option = currentQuestion.options[optionIndex];
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      dimension: currentQuestion.dimension,
      value: option.text,
      riskPoints: option.riskPoints || 0,
    };

    // Add or update answer
    const existingIndex = answers.findIndex(
      a => a.questionId === currentQuestion.id
    );
    if (existingIndex >= 0) {
      const updated = [...answers];
      updated[existingIndex] = newAnswer;
      setAnswers(updated);
    } else {
      setAnswers([...answers, newAnswer]);
    }

    // Move to next question
    if (currentQuestionIndex < ALL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      submitQuiz([...answers, newAnswer]);
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    setStage('submitted');
    onSubmit?.({ email, answers: finalAnswers });
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const dimensionInfo =
    GOVERNANCE_DIMENSIONS[currentQuestion.dimension as Dimension];
  const userAnswer = answers.find(a => a.questionId === currentQuestion.id);

  // ============================================================
  // EMAIL GATE UI
  // ============================================================

  if (stage === 'email-gate') {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 py-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            What's Your AI Governance Maturity?
          </h2>
          <p className="text-sm text-gray-400">
            Get your governance score + full evidence framework in 5 minutes.
          </p>
        </div>

        <div className="space-y-3 bg-gray-950 border border-gray-800 rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@company.com"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            onClick={handleEmailSubmit}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? 'Starting...' : 'Start Quiz'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            One quiz per email address. Results delivered immediately.
          </p>
        </div>

        <div className="space-y-2 text-xs text-gray-500">
          <p>✓ 25-30 questions across 6 governance dimensions</p>
          <p>✓ 0-100 maturity score in real time</p>
          <p>✓ Auto-generated governance evidence framework</p>
          <p>✓ Red flags mapped to regulatory requirements</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ UI
  // ============================================================

  if (stage === 'quiz') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 py-8">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-400">
              Question {currentQuestionIndex + 1} of {ALL_QUESTIONS.length}
            </p>
            <p className="text-xs text-gray-500">{questionsRemaining} remaining</p>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dimension Context */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="info" className="text-xs">
              {dimensionInfo.category}
            </Badge>
            <p className="text-xs font-medium text-gray-400">
              {dimensionInfo.title}
            </p>
          </div>
          <p className="text-xs text-gray-500">{dimensionInfo.subtitle}</p>
        </div>

        {/* Question */}
        <div className="space-y-4 bg-gray-950 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={isLoading}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  userAnswer?.value === option.text
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                } disabled:opacity-50`}
              >
                <div className="text-sm text-white font-medium">
                  {option.text}
                </div>
                {'context' in option && option.context && (
                  <div className="text-xs text-gray-400 mt-1">
                    {option.context}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0 || isLoading}
          >
            ← Back
          </Button>
          <div className="flex-1" />
          <p className="text-xs text-gray-500 pt-2">
            Question {currentQuestionIndex + 1} of {ALL_QUESTIONS.length}
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUBMITTED UI
  // ============================================================

  return (
    <div className="w-full max-w-md mx-auto text-center py-12 space-y-4">
      <div className="text-4xl">✓</div>
      <h3 className="text-xl font-bold text-white">Quiz Submitted</h3>
      <p className="text-sm text-gray-400">
        Calculating your governance maturity score...
      </p>
    </div>
  );
}
