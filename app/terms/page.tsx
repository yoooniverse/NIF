import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | News In Flight",
  description: "News In Flight의 이용약관을 확인하세요.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            이용약관
          </h1>
          <p className="text-gray-600">
            News In Flight 서비스 이용약관입니다.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제1조 (목적)
            </h2>
            <p className="text-gray-700">
              본 약관은 News In Flight(이하 {"\"회사\""})가 제공하는 뉴스 분석 서비스(이하 {"\"서비스\""})의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제2조 (용어의 정의)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{"\"서비스\""}란 회사가 제공하는 AI 기반 경제 뉴스 분석 서비스를 의미합니다.</li>
              <li>{"\"이용자\""}란 본 약관에 따라 서비스를 이용하는 회원을 의미합니다.</li>
              <li>{"\"회원\""}이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제3조 (서비스의 제공)
            </h2>
            <p className="text-gray-700 mb-4">
              회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>AI 기반 경제 뉴스 분석 서비스</li>
              <li>맞춤형 뉴스 콘텐츠 제공</li>
              <li>경제 순환기 지도 서비스</li>
              <li>구독 및 결제 서비스</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제4조 (서비스 이용 요금)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>서비스는 30일 무료 체험 기간을 제공합니다.</li>
              <li>무료 체험 기간 종료 후 월 9,900원의 구독료가 적용됩니다.</li>
              <li>결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제5조 (환불 정책)
            </h2>
            <p className="text-gray-700 mb-4">
              구독 서비스의 환불은 다음과 같이 처리됩니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>무료 체험 기간 중: 언제든지 취소 가능하며 요금 청구되지 않습니다.</li>
              <li>유료 구독 중: 구독 시작일로부터 7일 이내에 취소 시 전액 환불됩니다.</li>
              <li>환불 요청은 고객센터를 통해 접수되며, 영업일 기준 3-5일 이내에 처리됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제6조 (이용자의 의무)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>이용자는 본 약관 및 관련 법령을 준수하여야 합니다.</li>
              <li>이용자는 서비스 이용 시 타인의 권리를 침해하지 않아야 합니다.</li>
              <li>이용자는 서비스 이용을 위해 제공한 정보가 정확하고 최신이어야 합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제7조 (서비스의 제한)
            </h2>
            <p className="text-gray-700 mb-4">
              회사는 다음 각 호에 해당하는 경우 서비스 제공을 제한할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>서비스 설비의 장애 또는 유지보수</li>
              <li>천재지변 등의 불가항력적 사유</li>
              <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제8조 (책임의 제한)
            </h2>
            <p className="text-gray-700">
              회사는 AI 분석 결과의 정확성을 보장하지 않으며, 이용자가 서비스를 이용하여 얻은 정보에 따른
              투자 판단 등은 전적으로 이용자의 책임입니다. 회사는 투자 손실 등에 대해 어떠한 책임도 지지 않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              제9조 (문의사항)
            </h2>
            <p className="text-gray-700">
              서비스 이용에 대한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                이메일: yooon0322@gmail.com
              </p>
            </div>
          </section>

          <section>
            <p className="text-sm text-gray-500">
              본 이용약관은 2025년 12월 17일부터 적용됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}