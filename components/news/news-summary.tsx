'use client';

import { Sparkles } from 'lucide-react';

export default function NewsSummary({
  easyTitle,
  summary,
}: {
  easyTitle: string;
  summary: string;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-900">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-base font-semibold">AI 뉴스 해설</h2>
      </div>

      <div className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
        {easyTitle}
      </div>
      <p className="mt-3 whitespace-pre-line text-gray-600 leading-relaxed">
        {summary}
      </p>
    </section>
  );
}
