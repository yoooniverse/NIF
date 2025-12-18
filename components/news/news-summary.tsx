"use client";

export default function NewsSummary({
  easyTitle,
  summary,
  variant = "default",
}: {
  easyTitle: string;
  summary: string;
  variant?: "default" | "pearl";
}) {
  console.info("[NEWS_DETAIL] render: summary block");

  return (
    <section
      className={
        "rounded-3xl border px-7 py-6 " +
        (variant === "pearl" ? "border-slate-200/80 bg-white" : "border-amber-200/60 bg-white/35 backdrop-blur")
      }
    >
      <div className="text-sm font-semibold text-amber-900/70">Block 1</div>
      <div className="mt-2 text-xl sm:text-2xl font-bold text-amber-950">
        {easyTitle}
      </div>
      <p className="mt-3 text-amber-900/75 leading-relaxed">{summary}</p>
    </section>
  );
}

