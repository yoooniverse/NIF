import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono, Space_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { AuthNotifications } from "@/components/providers/auth-notifications";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "News In Flight - 경제 뉴스 AI 해석 서비스",
  description: "경제뉴스가 어렵나요? 가난은 더 어렵습니다. 경제 문맹 탈출, News In Flight면 하루 5분으로 끝납니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <head>
          <link rel="preconnect" href="https://powerful-pika-33.clerk.accounts.dev" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <SyncUserProvider>
            <AuthNotifications />
            <Navbar />
            {children}
            <Toaster />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
