"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // 핵심 기능 로그: 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      console.log("[LOGIN_PAGE] 이미 로그인된 사용자 감지 -> 대시보드로 리다이렉트");
      router.push("/dashboard");
      return;
    }
  }, [user, isLoaded, router]);

  // 로딩 중이거나 이미 로그인된 경우 로딩 표시
  if (!isLoaded || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">리다이렉트 중...</p>
        </div>
      </div>
    );
  }

  console.log("[LOGIN_PAGE] 로그인 페이지 로드됨 - News In Flight");
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
      {/* 공항 체크인 카운터 느낌의 컨테이너 */}
      <div className="w-full max-w-md">
        {/* 헤더 - 공항 체크인 데스크 느낌 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            News In Flight
          </h1>
          <p className="text-gray-600">
            경제뉴스가 어렵나요? <span className="text-red-600 font-bold">가난은 더 어렵습니다</span>
          </p>
        </div>

        {/* 로그인 폼 - Apple스러운 카드 디자인 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              로그인
            </h2>
            <p className="text-sm text-gray-500">
              계정으로 돌아가 뉴스를 확인하세요
            </p>
          </div>

          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/onboarding/interests"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md',
                formButtonReset: 'bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all duration-200',
                card: 'shadow-none border-none bg-transparent p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-sm bg-white',
                socialButtonsBlockButtonText: 'font-medium text-gray-700',
                socialButtonsBlockButtonArrow: 'text-gray-500',
                formFieldInput: 'rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 h-12',
                formFieldLabel: 'text-gray-700 font-medium mb-2 block',
                footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium hover:underline',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500 text-sm font-medium',
                formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                alert: 'rounded-xl border-l-4 p-4',
                alertText: 'text-sm font-medium',
                formFieldErrorText: 'text-red-600 text-sm mt-1',
                formFieldHintText: 'text-gray-500 text-sm mt-1',
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
              variables: {
                colorPrimary: '#2563eb',
                colorBackground: 'transparent',
                colorInputBackground: '#ffffff',
                colorInputText: '#374151',
                borderRadius: '0.75rem',
              },
            }}
          />
        </div>

        {/* 푸터 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            지금 바로 News In Flight를 시작하세요
          </p>
        </div>
      </div>
    </div>
  );
}
