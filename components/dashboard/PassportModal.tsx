'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, PenTool, Globe, LogOut, User } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEVEL_MAP: Record<string, string> = {
  '1': 'LV.1 (입문)',
  '2': 'LV.2 (중급)',
  '3': 'LV.3 (심화)',
};

// 통일된 텍스트 스타일 정의
const VALUE_STYLE = "text-base font-bold text-gray-900 leading-relaxed";

export default function PassportModal({
  isOpen,
  onClose,
}: PassportModalProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const supabase = useClerkSupabaseClient();

  const [isNavigating, setIsNavigating] = useState(false);
  const [interestMap, setInterestMap] = useState<Record<string, string>>({});
  const [contextMap, setContextMap] = useState<Record<string, string>>({});

  // Supabase에서 관심사와 상황 목록 가져오기
  useEffect(() => {
    if (!isOpen) return;

    const fetchDefinitions = async () => {
      try {
        const [interestsResult, contextsResult] = await Promise.all([
          supabase.from('interests').select('id, name'),
          supabase.from('contexts').select('id, name')
        ]);

        if (interestsResult.data) {
          const map: Record<string, string> = {};
          interestsResult.data.forEach(item => {
            map[item.id] = item.name;
          });
          setInterestMap(map);
        }

        if (contextsResult.data) {
          const map: Record<string, string> = {};
          contextsResult.data.forEach(item => {
            map[item.id] = item.name;
          });
          setContextMap(map);
        }
      } catch (error) {
        console.error("Failed to fetch definitions:", error);
      }
    };

    fetchDefinitions();
  }, [isOpen, supabase]);

  // 사용자 메타데이터 가져오기
  const publicMeta = user?.publicMetadata as any;
  const unsafeMeta = user?.unsafeMetadata as any;

  // 레벨 처리
  const rawLevel = publicMeta?.userProfiles?.level || unsafeMeta?.level || 1;
  const userLevelDisplay = LEVEL_MAP[String(rawLevel)] || `LV.${rawLevel}`;

  // IDs
  const interestIds: string[] = publicMeta?.userProfiles?.interests || unsafeMeta?.interests || [];
  const contextIds: string[] = publicMeta?.userProfiles?.contexts || unsafeMeta?.contexts || [];

  // Names (mapped)
  const userInterests = interestIds.map(id => interestMap[id] || (Object.keys(interestMap).length > 0 ? '알 수 없음' : 'Loading...'));

  // Contexts (mapped and joined if multiple)
  const userContextNames = contextIds.map(id => contextMap[id] || (Object.keys(contextMap).length > 0 ? '알 수 없음' : 'Loading...'));

  const joinDate = user?.createdAt ? new Date(user.createdAt) : null;

  // 날짜 포맷팅 (DD MMM YYYY)
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '01 JAN 2024';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  const handleEditClick = () => {
    setIsNavigating(true);
    router.push('/onboarding/interests'); // 온보딩 수정 페이지로 이동
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // 여권 번호 생성 (User ID 기반 또는 랜덤)
  const passportNumber = 'economy_No.1';

  // 이름 분리
  const fullName = user?.fullName || 'TRAVELER';
  const names = fullName.split(' ');
  const surname = names.length > 1 ? names[names.length - 1] : names[0];
  const givenNames = names.length > 1 ? names.slice(0, -1).join(' ') : names[0];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-0 bg-transparent border-none shadow-none sm:max-w-4xl overflow-hidden z-[60]">
        <DialogTitle className="sr-only">My Passport</DialogTitle>

        {/* Passport Container */}
        <div className="relative w-full bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">

          {/* Passport Header Pattern (Blue/Red Wave) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #dbeafe 1px, transparent 1px), radial-gradient(circle at 0% 0%, #fee2e2 1px, transparent 1px)`,
              backgroundSize: '20px 20px, 15px 15px'
            }}
          />

          <div className="flex flex-col md:flex-row h-full">

            {/* Left Page (Photo & Identity) */}
            <div className="relative flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">

              {/* Header Text */}
              <div className="text-center space-y-1 mb-8">
                <div className="text-sm font-serif font-bold tracking-widest text-gray-800">REPUBLIC OF KOREA</div>
                <div className="text-3xl font-serif font-black tracking-wider text-gray-900">PASSPORT</div>
              </div>

              {/* Photo & Details Layout */}
              <div className="flex gap-6">
                {/* Photo Area */}
                <div className="w-32 h-40 md:w-36 md:h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-inner flex-shrink-0 relative flex items-center justify-center group">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-gray-400" strokeWidth={1.5} />

                  {/* Hologram Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Text Fields */}
                <div className="flex-1 space-y-3 font-mono">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Surname / 성</div>
                    <div className="text-lg font-bold text-black leading-tight">{surname.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Given names / 이름</div>
                    <div className="text-lg font-bold text-black leading-tight">{givenNames.toUpperCase()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Nationality / 국적</div>
                      <div className="text-md font-bold text-black">REPUBLIC OF KOREA</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Date of birth / 생년월일</div>
                      <div className="text-md font-bold text-black">
                        {/* Clerk doesn't provide DOB by default, mocking or leaving blank */}
                        XX XXX XXXX
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Sex / 성별</div>
                      <div className="text-md font-bold text-black">M/F</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Date of issue / 발급일</div>
                      <div className="text-md font-bold text-black">{formatDate(joinDate || new Date())}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MRZ (Machine Readable Zone) for Left Page */}
              <div className="absolute bottom-2 left-0 right-0 px-4">
                <div className="bg-white/80 backdrop-blur-sm p-2 font-mono text-[8px] md:text-[10px] tracking-[0.15em] leading-tight text-black overflow-hidden whitespace-nowrap select-none uppercase border-t border-gray-300">
                  <div>P&lt;KOR{surname}&lt;&lt;{givenNames}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div>{passportNumber}&lt;0KOR{new Date().getFullYear().toString().slice(2)}01015M{new Date(new Date().setFullYear(new Date().getFullYear() + 10)).getFullYear().toString().slice(2)}01018&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
                </div>
              </div>
            </div>

            {/* Right Page (Settings / Amendments) */}
            <div className="flex-1 bg-[#fdfbf7] p-6 md:p-8 relative">
              {/* Background Stamp */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-5 pointer-events-none">
                <Globe className="w-full h-full text-blue-900" />
              </div>

              <div className="text-sm font-serif font-bold text-gray-800 border-b border-gray-300 pb-1 mb-6">
                AMENDMENTS AND ENDORSEMENTS / 기재사항
              </div>

              <div className="space-y-6 font-mono relative z-10">
                {/* Level */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                    LV
                  </div>
                  <div>
                    {/* Investment Level -> Analysis Level */}
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Analysis Level / 해설 레벨</div>
                    <div className={VALUE_STYLE}>
                      {userLevelDisplay}
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                    CTX
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Situation / 상황</div>
                    <div className={VALUE_STYLE}>
                      {userContextNames.length > 0 ? (
                        userContextNames.join(', ')
                      ) : (
                        <span className="text-gray-400 font-normal">선택 안함</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
                    INT
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Interests / 관심분야</div>
                    <div className={VALUE_STYLE}>
                      {userInterests.length > 0 ? (
                        // 뱃지 스타일 대신 텍스트로 콤마 구분하여 표시 (일관성)
                        userInterests.join(', ')
                      ) : (
                        <span className="text-gray-400 font-normal">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button Stamp */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleEditClick}
                  disabled={isNavigating}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-dashed border-red-300 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all shadow-sm transform hover:-rotate-1"
                >
                  {isNavigating ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      <span>EDIT / 수정하기</span>
                    </>
                  )}
                  {/* Fake Stamp Border Effect */}
                  <div className="absolute inset-0 rounded-xl border border-red-200 opacity-50 blur-[1px]"></div>
                </button>
              </div>

              {/* Logout Button (Small) */}
              <div className="absolute bottom-4 right-6">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Log out
                </button>
              </div>

              {/* MRZ (Machine Readable Zone) for Right Page */}
              <div className="absolute bottom-2 left-0 right-0 px-4">
                <div className="bg-white/80 backdrop-blur-sm p-2 font-mono text-[8px] md:text-[10px] tracking-[0.15em] leading-tight text-black overflow-hidden whitespace-nowrap select-none uppercase border-t border-gray-300">
                  <div>P&lt;KOR{surname}&lt;&lt;{givenNames}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div>{passportNumber}&lt;0KOR{new Date().getFullYear().toString().slice(2)}01015M{new Date(new Date().setFullYear(new Date().getFullYear() + 10)).getFullYear().toString().slice(2)}01018&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
