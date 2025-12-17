import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function redirectToDashboard(req: Request, userId: string | null) {
  const url = new URL(req.url);

  // 핵심 기능 로그: 인증 콜백 진입(로그인/회원가입/OAuth 등 완료 이후)
  console.log("[AUTH_CALLBACK] hit:", {
    method: req.method,
    pathname: url.pathname,
    hasUserId: Boolean(userId),
    search: url.search,
  });

  // 인증이 아직 확정되지 않은 상태라면 로그인으로 유도
  if (!userId) {
    console.log("[AUTH_CALLBACK] no userId -> redirect /login");
    return NextResponse.redirect(new URL("/login", url), { status: 303 });
  }

  // 로그인 완료 후에는 대시보드로 이동 (대시보드에서 온보딩 여부에 따라 추가 이동 처리)
  console.log("[AUTH_CALLBACK] userId ok -> redirect /dashboard");
  return NextResponse.redirect(new URL("/dashboard", url), { status: 303 });
}

export async function GET(req: Request) {
  const { userId } = await auth();
  return redirectToDashboard(req, userId);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  return redirectToDashboard(req, userId);
}

