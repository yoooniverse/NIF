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
  console.info('[ACTION_ITEM] ✅ Rendering with tips:', tips);
  console.info('[ACTION_ITEM] Tips count:', tips?.length, 'shouldBlur:', shouldBlur);
  
  if (!tips || tips.length === 0) {
    console.error('[ACTION_ITEM] ❌ 액션팁 데이터가 없습니다!', tips);
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 px-7 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <Navigation className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-black">행동 가이드</h2>
        </div>
        <p className="text-black">행동 가이드 데이터를 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
          <Navigation className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-black">행동 가이드</h2>
      </div>

      <div className={shouldBlur ? 'blur-sm select-none pointer-events-none space-y-4' : 'space-y-4'}>
        {tips.map((text, index) => (
          <div key={index} className="pl-4 border-l-4 border-green-200">
            <p className="whitespace-pre-line text-black leading-relaxed text-base">
              {text}
            </p>
          </div>
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
