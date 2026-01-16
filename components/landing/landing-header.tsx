"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export function LandingHeader() {
    const { isSignedIn, isLoaded } = useUser();

    console.log("🔐 [Header] 인증 상태:", { isSignedIn, isLoaded });

    if (!isLoaded) {
        return null; // 로딩 중에는 아무것도 표시하지 않음 (또는 스켈레톤)
    }

    return (
        <div className="absolute top-6 right-6 z-20">
            {isSignedIn ? (
                <div className="flex gap-2">
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            size="default"
                            className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 hover:border-white/40 transition-all duration-300 px-4 py-2 text-sm font-medium"
                        >
                            <ArrowRight className="w-5 h-5 mr-2" />
                            대시보드
                        </Button>
                    </Link>
                    <SignOutButton>
                        <Button
                            variant="outline"
                            size="default"
                            className="bg-red-500/20 backdrop-blur-md border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 px-4 py-2 text-sm font-medium"
                        >
                            로그아웃
                        </Button>
                    </SignOutButton>
                </div>
            ) : (
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button
                        variant="outline"
                        size="default"
                        className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 hover:border-white/40 transition-all duration-300 px-4 py-2 text-sm font-medium"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        로그인
                    </Button>
                </SignInButton>
            )}
        </div>
    );
}
