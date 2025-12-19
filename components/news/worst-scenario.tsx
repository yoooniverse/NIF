'use client';

import { AlertTriangle } from 'lucide-react';

export default function WorstScenario({ text }: { text: string }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-900">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-base font-semibold">최악의 시나리오</h2>
      </div>

      <p className="mt-4 whitespace-pre-line text-gray-600 leading-relaxed">
        {text}
      </p>
    </section>
  );
}
