'use client';

import { useEffect, useState } from 'react';

const CALENDLY_URL = 'https://calendly.com/redflagaipro/30min';
const CONTACT_EMAIL = 'support@redflagaipro.com';

interface CalendlyBookingProps {
  email?: string;
  onSuccess?: () => void;
}

export function CalendlyBooking({ email, onSuccess }: CalendlyBookingProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!CALENDLY_URL) return; // email fallback active — no widget to load
    if (isOpen && !isLoaded) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url: CALENDLY_URL,
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

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Book a governance assessment call'
  )}&body=${encodeURIComponent(
    `I'd like to book a governance assessment call.${email ? `\n\nMy email: ${email}` : ''}`
  )}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Schedule your governance assessment
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {CALENDLY_URL ? (
          <div id="calendly-inline" className="w-full" />
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              Email us and we&apos;ll send you a few times that work, usually within one business day.
            </p>
            <a
              href={mailto}
              style={{ background: '#E5484D' }}
              className="inline-block text-white text-sm font-semibold px-7 py-3 rounded-full no-underline"
            >
              Email to book your call →
            </a>
            <p className="text-xs text-gray-500 mt-4">{CONTACT_EMAIL}</p>
          </div>
        )}
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
