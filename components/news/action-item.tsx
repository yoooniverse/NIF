"use client";

import BlurOverlay from "@/components/paywall/blur-overlay";

export default function ActionItem({
  text,
  shouldBlur,
}: {
  text: string;
  shouldBlur: boolean;
}) {
  console.info("[NEWS_DETAIL] render: action item block", { shouldBlur });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-white/35 backdrop-blur px-7 py-6">
      <div className="text-sm font-semibold text-amber-900/70">Block 3</div>
      <div className="mt-2 text-lg font-bold text-amber-950">행동 가이드</div>

      <p className={`mt-3 text-amber-900/75 leading-relaxed ${shouldBlur ? "blur-sm select-none" : ""}`}>
        {text}
      </p>

      {shouldBlur && (
        <BlurOverlay
          title="구독하고 행동 가이드 보기"
          description="31일차 이후에는 행동 가이드가 블러 처리돼요. 구독하면 전체 내용을 볼 수 있어요."
        />
      )}
    </section>
  );
}

