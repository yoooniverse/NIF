"use client";

import { useRouter } from "next/navigation";

export default function BlurOverlay({
  title = "구독하고 최악의 시나리오 피하기",
  description = "체험 비행이 종료되었어요. 구독하면 행동 가이드를 끝까지 볼 수 있어요.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      <div className="relative z-10 w-[min(560px,92%)] rounded-3xl border border-red-500 bg-white/55 px-6 py-6 shadow-[0_24px_80px_-50px_rgba(120,53,15,0.75)]">
        <div className="text-xl font-bold text-amber-950">{title}</div>
        <div className="mt-2 text-amber-900/75">
          체험 비행이 종료되었어요
          <br />
          구독하면 행동 가이드를 끝까지 볼 수 있어요.
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              console.info("[PAYWALL] click: subscribe CTA");
              // Paywall 페이지는 TODO에 있으니, 우선 이동만 연결해둡니다.
              router.push("/paywall");
            }}
            className="h-11 px-5 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            구독하기
          </button>
        </div>
      </div>
    </div>
  );
}

