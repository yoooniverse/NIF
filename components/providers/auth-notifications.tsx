"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";

export function AuthNotifications() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!isLoaded) return;

        const prevAuthState = sessionStorage.getItem("auth_state");
        const currentAuthState = isSignedIn ? "signed_in" : "signed_out";

        // 초기 마운트 시
        if (isInitialMount.current) {
            isInitialMount.current = false;

            // 이전 상태와 현재 상태가 다를 때 (새로고침/리다이렉트 후)
            if (prevAuthState && prevAuthState !== currentAuthState) {
                if (isSignedIn && user) {
                    const userName = user.firstName || user.username || "사용자";
                    toast({
                        title: "✅ 로그인 성공!",
                        description: `환영합니다, ${userName}님!`,
                        variant: "success",
                    });
                } else if (!isSignedIn && prevAuthState === "signed_in") {
                    toast({
                        title: "👋 로그아웃 완료",
                        description: "안전하게 로그아웃되었습니다.",
                        variant: "default",
                    });
                }
            }

            // 현재 상태 저장
            sessionStorage.setItem("auth_state", currentAuthState);
            return;
        }

        // 세션 중 상태 변화 감지 (SPA 네비게이션 등)
        if (prevAuthState !== currentAuthState) {
            if (isSignedIn && user) {
                const userName = user.firstName || user.username || "사용자";
                toast({
                    title: "✅ 로그인 성공!",
                    description: `환영합니다, ${userName}님!`,
                    variant: "success",
                });
            } else if (!isSignedIn && prevAuthState === "signed_in") {
                toast({
                    title: "👋 로그아웃 완료",
                    description: "안전하게 로그아웃되었습니다.",
                    variant: "default",
                });
            }
            sessionStorage.setItem("auth_state", currentAuthState);
        }
    }, [isSignedIn, isLoaded, user]);

    return null;
}
