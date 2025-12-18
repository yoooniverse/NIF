'use client';

import { useRouter } from 'next/navigation';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function PaywallPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="mx-auto max-w-xl px-6 py-12">
        <button
          type="button"
          onClick={() => {
            console.info('[PAYWALL_PAGE] click: back to dashboard');
            router.push('/dashboard');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>

        <div className="mt-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-3 text-gray-900">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">체험 비행이 종료되었습니다</h1>
          </div>

          <p className="mt-3 text-gray-600 leading-relaxed">
            지금은 결제(토스페이먼츠) 연동 전 단계라서, 결제 화면은 임시 페이지입니다.
            추후 여기에서 구독 결제로 연결될 예정이에요.
          </p>

          <button
            type="button"
            onClick={() => console.info('[PAYWALL_PAGE] click: subscribe (placeholder)')}
            className="mt-6 w-full h-12 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            구독하기 (준비 중)
          </button>
        </div>
      </div>
    </div>
  );
}
