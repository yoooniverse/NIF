"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 px-4 bg-background border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 로고 및 서비스 소개 */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">News In Flight</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              경제 뉴스는 정보가 아니라 생존입니다.<br />
              AI가 당신의 눈높이에 맞춰 경제 뉴스를 해석해드립니다.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:contact@newsinflight.com" 
                className="hover:text-primary transition-colors"
              >
                contact@newsinflight.com
              </a>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  대시보드
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-primary transition-colors">
                  온보딩
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-primary transition-colors">
                  설정
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 문서 */}
          <div>
            <h4 className="font-semibold mb-4">법적 문서</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  개인정보 처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} News In Flight. All rights reserved.
          </p>
          <p className="mt-2">
            Powered by Claude Sonnet 4.5 | Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
