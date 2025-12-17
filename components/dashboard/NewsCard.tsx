'use client';

import { motion } from 'framer-motion';

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  date: string;
  onClick?: () => void;
}

/**
 * NewsCard - 뉴스 카드 컴포넌트
 * 
 * 퍼스트 클래스 테마에 맞춘 고급스러운 카드 디자인
 */
export default function NewsCard({ 
  title, 
  summary, 
  category, 
  date, 
  onClick 
}: NewsCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="
        group
        relative
        bg-white/70 backdrop-blur-lg
        rounded-2xl
        border border-white/60
        shadow-xl hover:shadow-2xl
        p-6
        cursor-pointer
        transition-all duration-300
        overflow-hidden
      "
      whileHover={{ 
        y: -4,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 카테고리 배지 */}
      <div className="
        absolute top-4 right-4
        px-3 py-1
        bg-gradient-to-r from-blue-500 to-blue-600
        text-white text-xs font-semibold
        rounded-full
        shadow-lg
      ">
        {category}
      </div>

      {/* 장식 요소 - 좌측 상단 빛 효과 */}
      <div className="
        absolute top-0 left-0
        w-24 h-24
        bg-gradient-to-br from-blue-100/50 to-transparent
        rounded-full blur-2xl
        -translate-x-1/2 -translate-y-1/2
      " />

      {/* 콘텐츠 */}
      <div className="relative z-10">
        {/* 제목 */}
        <h4 className="
          text-lg font-bold
          text-gray-900
          mb-3
          line-clamp-2
          pr-16
        ">
          {title}
        </h4>

        {/* 요약 */}
        <p className="
          text-sm text-gray-600
          mb-4
          line-clamp-3
        ">
          {summary}
        </p>

        {/* 하단 정보 */}
        <div className="
          flex items-center justify-between
          text-xs text-gray-500
          pt-3
          border-t border-gray-200/50
        ">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {date}
          </span>
          
          <span className="
            text-blue-600 font-semibold
            flex items-center gap-1
            group-hover:gap-2
            transition-all
          ">
            자세히 보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Hover 시 나타나는 빛 효과 */}
      <motion.div
        className="
          absolute inset-0
          bg-gradient-to-tr from-blue-50/0 via-blue-100/30 to-purple-50/0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
        "
      />
    </motion.div>
  );
}
