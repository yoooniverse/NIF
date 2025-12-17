"use client";

import Link from "next/link";
import { Mail, MapPin, Radio } from "lucide-react";

export function Footer() {
  console.log("📱 Footer 렌더링 - Apple 스타일");

  return (
    <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 로고 및 서비스 소개 - Apple 스타일 */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              News In Flight
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              경제 뉴스는 정보가 아니라 생존입니다.<br />
              AI가 당신의 눈높이에 맞춰 경제 뉴스를 해석해드립니다.
            </p>

            {/* 문의하기 - Apple 스타일 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors group">
              <Mail className="w-4 h-4 text-blue-600" />
              <a
                href="mailto:yooon0322@gmail.com"
                className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors"
              >
                yooon0322@gmail.com
              </a>
            </div>

            {/* 추가 정보 */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>서울, 대한민국</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3" />
                <span>24/7 서비스</span>
              </div>
            </div>
          </div>

          {/* 서비스 - Apple 스타일 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">서비스</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  대시보드
                </Link>
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  온보딩
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  설정
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 문서 - Apple 스타일 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">법적 문서</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  개인정보 처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - Apple 스타일 */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} News In Flight. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>Powered by Claude Sonnet 4.5</span>
              <span>Built with Next.js & Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
