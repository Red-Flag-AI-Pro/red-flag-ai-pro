'use client';

import { useEffect, useState } from 'react';

interface CalendlyBookingProps {
  email?: string;
  onSuccess?: () => void;
}

export function CalendlyBooking({ email, onSuccess }: CalendlyBookingProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isLoaded) {
      // Load Calendly widget script dynamically
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/red-flag-ai/governance-assessment',
            parentElement: document.getElementById('calendly-inline'),
            prefilled: email ? { email } : undefined,
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [isOpen, isLoaded, email]);

  const handleClose = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Schedule Your Governance Assessment
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div id="calendly-inline" className="w-full" />
      </div>
    </div>
  );
}

// Extend window type for Calendly
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement | null;
        prefilled?: { email?: string };
      }) => void;
    };
  }
}
