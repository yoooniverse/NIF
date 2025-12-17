"use client";

export default function WorstScenario({ text }: { text: string }) {
  console.info("[NEWS_DETAIL] render: worst scenario block");

  return (
    <section className="rounded-3xl border border-amber-200/60 bg-white/35 backdrop-blur px-7 py-6">
      <div className="text-sm font-semibold text-amber-900/70">Block 2</div>
      <div className="mt-2 text-lg font-bold text-amber-950">최악의 시나리오</div>
      <p className="mt-3 text-amber-900/75 leading-relaxed">{text}</p>
    </section>
  );
}

