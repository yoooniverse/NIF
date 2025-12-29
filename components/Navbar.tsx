"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mounted, setMounted] = React.useState(false);

  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 랜딩 페이지 + 대시보드에서는 Navbar를 숨김
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        News In Flight
      </Link>
      <div className="flex gap-4 items-center">
        {mounted ? (
          <>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>로그인</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        ) : (
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
        )}
      </div>
    </header>
  );
};

export default Navbar;
