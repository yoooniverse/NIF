'use client';

import BlurOverlay from '@/components/paywall/blur-overlay';
import { Navigation } from 'lucide-react';

export default function ActionItem({
  tips,
  shouldBlur,
}: {
  tips: string[];
  shouldBlur: boolean;
}) {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-900 mb-4">
        <Navigation className="h-5 w-5" />
        <h2 className="text-base font-semibold">행동 가이드</h2>
      </div>

      <div className={shouldBlur ? 'blur-sm select-none pointer-events-none space-y-4' : 'space-y-4'}>
        {tips.map((text, index) => (
          <p key={index} className="whitespace-pre-line text-gray-600 leading-relaxed font-medium">
            {text}
          </p>
        ))}
      </div>

      {shouldBlur && (
        <div
          className="absolute inset-0"
          onClick={() => console.info('[ACTION_ITEM] blocked: show paywall overlay')}
          role="presentation"
        >
          <BlurOverlay />
        </div>
      )}
    </section>
  );
}
