"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function LandingCTA() {
    const { isSignedIn, isLoaded } = useUser();

    console.log("🔐 [CTA] 인증 상태:", { isSignedIn, isLoaded });

    // 로딩 중일 때 표시할 스켈레톤 또는 플레이스홀더
    if (!isLoaded) {
        return <div className="animate-pulse bg-gray-700/50 rounded-lg h-12 w-32 backdrop-blur-md"></div>;
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 px-4">
            {isSignedIn ? (
                <Link href="/dashboard">
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-white/20 text-white hover:bg-black hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 group"
                    >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        대시보드
                    </Button>
                </Link>
            ) : (
                <Link href="/signup">
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-white/20 text-white hover:bg-black hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 group"
                    >
                        회원가입
                    </Button>
                </Link>
            )}
            <Link href="/about">
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-white/20 text-white hover:bg-black hover:border-white/40 transition-all duration-300"
                >
                    자세히 알아보기
                </Button>
            </Link>
        </div>
    );
}
