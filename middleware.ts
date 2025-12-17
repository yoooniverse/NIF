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
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  console.log("[MIDDLEWARE] 요청 경로:", pathname);
  console.log("[MIDDLEWARE] 사용자 ID:", userId);

  // 공개 경로는 그냥 통과
  if (isPublicRoute(req)) {
    console.log("[MIDDLEWARE] 공개 경로 - 통과");
    return NextResponse.next();
  }

  // 로그인하지 않은 사용자는 홈으로 리다이렉트
  if (!userId) {
    console.log("[MIDDLEWARE] 미인증 사용자 - 홈으로 리다이렉트");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인한 사용자가 로그인/회원가입 페이지에 접근하면 온보딩 페이지로 리다이렉트
  if (userId && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    console.log("[MIDDLEWARE] 인증된 사용자가 로그인/회원가입 페이지 접근 - 온보딩으로 리다이렉트");
    return NextResponse.redirect(new URL("/onboarding/interests", req.url));
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
