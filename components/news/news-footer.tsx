'use client';

import { ExternalLink, Newspaper } from 'lucide-react';

export default function NewsFooter({
  source,
  url,
}: {
  source: string;
  url: string;
}) {
  console.info('[NEWS_FOOTER] rendering with source:', source, 'url:', url);

  return (
    <footer className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
      <div className="flex items-center justify-center">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={() => console.info('[NEWS_FOOTER] click: open original', { url })}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all hover:shadow-md"
        >
          <ExternalLink className="h-5 w-5" />
          원문 보기
        </a>
      </div>
    </footer>
  );
}
