'use client';

import { ExternalLink, Newspaper } from 'lucide-react';

export default function NewsFooter({
  source,
  url,
}: {
  source: string;
  url: string;
}) {
  return (
    <footer className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Newspaper className="h-5 w-5 text-gray-400" />
          <span className="text-sm">
            출처: <span className="font-semibold text-gray-900">{source}</span>
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={() => console.info('[NEWS_FOOTER] click: open original', { url })}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          <ExternalLink className="h-4 w-4" />
          원문 보기
        </a>
      </div>
    </footer>
  );
}
