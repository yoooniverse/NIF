"use client";

export default function NewsFooter({
  source,
  url,
}: {
  source: string;
  url: string;
}) {
  console.info("[NEWS_DETAIL] render: footer");

  return (
    <footer className="rounded-3xl border border-amber-200/60 bg-white/35 backdrop-blur px-7 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-amber-900/75">
          <span className="font-semibold text-amber-950">출처</span>: {source}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={() => console.info("[NEWS_DETAIL] click: original link", { url })}
          className="h-11 inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 font-semibold text-white hover:bg-amber-700 transition"
        >
          원문 보기
        </a>
      </div>
    </footer>
  );
}

