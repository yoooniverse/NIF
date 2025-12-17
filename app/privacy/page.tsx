import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | News In Flight",
  description: "News In Flight의 개인정보 처리방침을 확인하세요.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            개인정보 처리방침
          </h1>
          <p className="text-gray-600">
            News In Flight는 이용자의 개인정보를 중요하게 생각하며,
            개인정보 보호법 및 관련 법령을 준수합니다.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. 수집하는 개인정보 항목
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>필수항목: 이메일 주소, 이름, 프로필 사진 (Clerk를 통한 소셜 로그인)</li>
              <li>선택항목: 관심 분야, 경제 상황 정보</li>
              <li>자동 수집: 접속 로그, 쿠키, 접속 IP 정보</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>회원 관리 및 서비스 제공</li>
              <li>맞춤형 뉴스 콘텐츠 제공</li>
              <li>결제 및 구독 서비스 관리</li>
              <li>서비스 개선 및 통계 분석</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="text-gray-700">
              이용자의 개인정보는 서비스 이용계약 체결 시부터 서비스 이용계약 해지 시까지 보유합니다.
              다만, 관련 법령에 따라 일정 기간 보존해야 하는 경우에는 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-gray-700 mb-4">
              News In Flight는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. 이용자의 권리
            </h2>
            <p className="text-gray-700 mb-4">
              이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. 문의사항
            </h2>
            <p className="text-gray-700">
              개인정보 처리방침에 대한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                이메일: yooon0322@gmail.com
              </p>
            </div>
          </section>

          <section>
            <p className="text-sm text-gray-500">
              본 개인정보 처리방침은 2025년 12월 17일부터 적용됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}