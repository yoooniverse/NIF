"use client";

import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// FlightViewBackground를 dynamic import로 변경 (SSR 비활성화)
const FlightViewBackground = dynamic(
    () => import('@/components/landing/FlightViewBackground').then(mod => ({ default: mod.FlightViewBackground })),
    {
        ssr: false,
        loading: () => <div className="absolute inset-0 z-0 h-full w-full bg-[#030308]" />
    }
);

export default function NewsLayout({ children }: { children: ReactNode }) {
    // LCP/TBT 최적화: 3D 배경은 텍스트(LCP) 로드 후 지연 렌더링 -> 제거 (사용자 경험 개선)
    // const [showBackground, setShowBackground] = useState(false);

    // useEffect(() => {
    //     // 메인 스레드 아이들 상태일 때 로드하거나 최소 1초 지연
    //     if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    //         (window as any).requestIdleCallback(() => setShowBackground(true));
    //     } else {
    //         setTimeout(() => setShowBackground(true), 1000);
    //     }
    // }, []);

    return (
        <div className="relative min-h-screen bg-[#050814] text-white overflow-hidden">
            {/* 우주 배경 (비행기 뷰) - 모든 뉴스 페이지에서 공유됨 */}
            <FlightViewBackground earthSize={2.5} />

            {/* 페이지 컨텐츠 */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
