import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/auth-callback(.*)",
  "/about(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  // 임시: 디버깅을 위해 뉴스 경로 공개
  "/news(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  console.log("[MIDDLEWARE] 요청 경로:", pathname);

  // 1. 공개 경로 처리
  if (isPublicRoute(req)) {
    // 로그인/회원가입 페이지는 로그인한 상태라면 온보딩/대시보드로 리다이렉트 필요
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      const { userId } = await auth();
      if (userId) {
        console.log("[MIDDLEWARE] 인증된 사용자가 로그인/회원가입 페이지 접근 - 온보딩으로 리다이렉트");
        return NextResponse.redirect(new URL("/onboarding/interests", req.url));
      }
    }

    // 그 외 공개 경로(랜딩, about 등)는 auth() 호출 없이 패스 (성능/캐싱 최적화)
    console.log("[MIDDLEWARE] 공개 경로 - 통과");
    return NextResponse.next();
  }

  // 2. 보호된 경로 처리 - 여기서부터는 auth 확인 필수
  const { userId } = await auth();
  console.log("[MIDDLEWARE] 사용자 ID:", userId);

  // 로그인하지 않은 사용자는 홈으로 리다이렉트
  if (!userId) {
    console.log("[MIDDLEWARE] 미인증 사용자 - 홈으로 리다이렉트");
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("[MIDDLEWARE] 인증된 사용자 - 통과");
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
