'use client';

import { AlertTriangle } from 'lucide-react';

export default function WorstScenario({ scenarios }: { scenarios: string[] }) {
  console.info('[WORST_SCENARIO] ✅ Rendering with scenarios:', scenarios);
  console.info('[WORST_SCENARIO] Scenarios count:', scenarios?.length);
  
  if (!scenarios || scenarios.length === 0) {
    console.error('[WORST_SCENARIO] ❌ 최악의 시나리오 데이터가 없습니다!', scenarios);
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 px-7 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-black">최악의 시나리오</h2>
        </div>
        <p className="text-black">최악의 시나리오 데이터를 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-black">최악의 시나리오</h2>
      </div>

      <div className="space-y-4">
        {scenarios.map((text, index) => (
          <div key={index} className="pl-4 border-l-4 border-red-200">
            <p className="whitespace-pre-line text-black leading-relaxed text-base">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
