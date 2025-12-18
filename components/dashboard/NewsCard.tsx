'use client';

import { useRouter } from 'next/navigation';
import { Newspaper, Clock } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  summary?: string;
  isWhite?: boolean;
  fromPage?: 'today' | 'monthly';
}

export default function NewsCard({
  id,
  title,
  category,
  publishedAt,
  summary,
  isWhite = false,
  fromPage,
}: NewsCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // 뉴스 상세 페이지로 이동
    console.info('[NEWS_CARD] click:', { id, title, fromPage, category });
    const url = fromPage ? `/news/${id}?from=${fromPage}&category=${encodeURIComponent(category)}` : `/news/${id}`;
    router.push(url);
  };

  const baseClasses = "rounded-2xl border px-6 py-5 cursor-pointer transition hover:shadow-lg";

  const colorClasses = isWhite
    ? "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
    : "bg-white/5 border-white/10 text-white hover:bg-white/10";

  return (
    <div
      className={`${baseClasses} ${colorClasses}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <Newspaper className={`h-6 w-6 mt-0.5 ${isWhite ? 'text-gray-400' : 'text-white/60'}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-base font-semibold mb-2 ${isWhite ? 'text-gray-500' : 'text-white/60'}`}>
            {category}
          </div>
          <h3 className={`font-bold text-lg leading-snug mb-2 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            {title}
          </h3>
          {summary && (
            <p className={`text-base leading-relaxed mb-3 ${isWhite ? 'text-gray-600' : 'text-white/80'}`}>
              {summary}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isWhite ? 'text-gray-400' : 'text-white/50'}`} />
            <span className={`text-sm ${isWhite ? 'text-gray-500' : 'text-white/60'}`}>
              {new Date(publishedAt).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}