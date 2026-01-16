'use client';

import { Sparkles } from 'lucide-react';

export default function NewsSummary({
  summary,
}: {
  summary: string;
}) {
  console.info('[NEWS_SUMMARY] ✅ Rendering with summary:', summary?.substring(0, 100));

  if (!summary) {
    console.error('[NEWS_SUMMARY] ❌ 요약 데이터가 없습니다! summary:', summary);
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 px-7 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <Sparkles className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-black">AI 뉴스 해설</h2>
        </div>
        <p className="text-black">뉴스 내용을 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-black">AI 뉴스 해설</h2>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="whitespace-pre-line text-black leading-relaxed text-base">
          {summary}
        </p>
      </div>
    </section>
  );
}
