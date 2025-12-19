import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function withAuth(
  handler: (request: NextRequest, userId: string) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 },
      );
    }

    return handler(request, userId);
  };
}