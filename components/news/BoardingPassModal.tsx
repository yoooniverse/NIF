'use client';

import { X, LogOut, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PassportModal from '@/components/dashboard/PassportModal';

interface BoardingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsTitle?: string;
  economicIndex?: string;
  passengerName?: string;
  subscriptionStatus?: 'first_class' | 'economy';
}

export default function BoardingPassModal({
  isOpen,
  onClose,
  newsTitle = "Global Market Rally",
  economicIndex = "NASDAQ 100",
  passengerName = "PREMIUM MEMBER",
  subscriptionStatus = 'economy'
}: BoardingPassModalProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  // 모달이 열릴 때 온보딩 페이지를 미리 로드(Prefetch)
  useEffect(() => {
    if (isOpen) {
      console.info('[BOARDING_PASS] prefetching /onboarding/interests page');
      router.prefetch('/onboarding/interests');
    }
  }, [isOpen, router]);

  if (!isOpen) return null;

  console.info('[BOARDING_PASS_MODAL] opened with passengerName:', passengerName, 'subscriptionStatus:', subscriptionStatus);

  const handleSettingsClick = () => {
    console.info('[BOARDING_PASS] settings button clicked -> opening PassportModal');
    setIsPassportOpen(true);
  };

  const handleSignOut = () => {
    console.info('[BOARDING_PASS] user signing out');
    signOut();
  };

  // Determine seat class based on subscription
  const seat = subscriptionStatus === 'first_class' ? 'FIRST CLASS' : 'ECONOMY';
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl drop-shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header Strip */}
        <div className="w-full bg-sky-200 px-6 py-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-800">NEWS AIR</div>
          <div className="text-sm font-semibold text-gray-600 tracking-wider">PRESTIGE</div>
        </div>

        {/* Main Ticket Content */}
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left Section (70%) */}
          <div className="flex-1 p-8 space-y-6">
            {/* Passenger Name */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PASSENGER NAME</div>
              <div className="text-2xl font-bold font-mono text-gray-900">{passengerName}</div>
            </div>

            {/* From/To */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FROM</div>
                <div className="text-xl font-bold font-mono text-gray-900">SEOUL / ICN</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TO</div>
                <div className="text-xl font-bold font-mono text-gray-900 truncate" title={newsTitle}>
                  {newsTitle}
                </div>
              </div>
            </div>

            {/* Flight & Date */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FLIGHT</div>
                <div className="text-3xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  {economicIndex}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE</div>
                <div className="text-xl font-bold font-mono text-gray-900">{today}</div>
              </div>
            </div>

            {/* Gate & Seat */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GATE</div>
                <div className="text-2xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  A12
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEAT</div>
                <div className="text-2xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  {seat}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator (Dashed Line with Cutouts) */}
          <div className="hidden md:flex flex-col items-center justify-center relative">
            <div className="w-px bg-gray-300 h-full border-dashed border-l-2 border-gray-400"></div>
            {/* Top Cutout */}
            <div className="absolute top-0 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
            {/* Bottom Cutout */}
            <div className="absolute bottom-0 translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
          </div>

          {/* Right Section (30%) - Settings & Barcode */}
          <div className="md:w-1/3 p-6 flex flex-col items-center bg-gray-50 min-h-[300px] relative overflow-hidden">
            {/* Settings Button (Replaces Analysis Level) */}
            <div className="text-center mb-4 relative z-10">
              <div className="text-sm font-semibold text-gray-500 mb-3">내 정보 수정하기</div>
              <button
                type="button"
                onClick={handleSettingsClick}
                disabled={isNavigating}
                className="w-32 h-16 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border-2 border-gray-200 hover:border-sky-300 transition-all shadow-sm flex flex-col items-center justify-center gap-1 group disabled:opacity-70 disabled:cursor-wait"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
                    <span className="text-sky-600">이동 중...</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                    <span className="group-hover:text-sky-600 transition-colors">환경설정</span>
                  </>
                )}
              </button>
            </div>

            {/* Bon Voyage Stamp */}
            <div className="relative z-0 mt-2 select-none pointer-events-none">
              <div 
                className="relative w-32 h-32 transform -rotate-12 opacity-90 mix-blend-multiply rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-600"></div>
                <Image
                  src="/images/bon-voyage-stamp.png"
                  alt="Bon Voyage Stamp"
                  fill
                  className="object-cover mix-blend-screen grayscale contrast-150 brightness-110"
                />
              </div>
            </div>

            {/* Spacer to push barcode to bottom */}
            <div className="flex-1" />

            {/* Barcode Placeholder */}
            <div className="flex items-center justify-center w-full mt-4">
              <div className="w-32 h-20 bg-black flex flex-col justify-between p-1">
                {/* Simple barcode pattern */}
                <div className="flex justify-between h-full">
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Separator (when stacked) */}
        <div className="md:hidden w-full h-px bg-gray-300 border-dashed border-t-2 border-gray-400 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
        </div>

        {/* Footer Note */}
        <div className="px-8 py-4 bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              This boarding pass is valid for News In Flight premium access
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors"
            >
              <LogOut className="w-3 h-3" />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Passport Modal (Nested) */}
      <PassportModal 
        isOpen={isPassportOpen} 
        onClose={() => setIsPassportOpen(false)} 
      />
    </div>
  );
}
