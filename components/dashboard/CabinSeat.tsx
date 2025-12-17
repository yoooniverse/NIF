'use client';

/**
 * CabinSeat - 퍼스트 클래스 가죽 좌석(하단 원근감)
 *
 * - 외부 이미지 없이 CSS 도형/그라디언트만 사용
 * - 화면 하단에 고정되어 "좌석에 앉아있는 시점"을 만들어줌
 */
export default function CabinSeat() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10">
      {/* Seat shadow to wall */}
      <div className="absolute inset-x-0 bottom-28 h-20 bg-black/20 blur-3xl" />

      {/* Main seat body */}
      <div
        className="
          relative mx-auto
          w-[min(1100px,100vw)]
          h-72 sm:h-80
        "
      >
        {/* Left armrest */}
        <div
          className="
            absolute bottom-0 left-0
            h-56 w-[34%]
            rounded-tr-[48px]
            bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900
            shadow-[inset_0_10px_30px_rgba(255,255,255,0.06)]
            opacity-95
          "
        >
          <div className="absolute inset-x-8 top-10 h-px bg-amber-200/25" />
          <div className="absolute inset-x-10 top-16 h-px bg-amber-200/15" />
        </div>

        {/* Right armrest */}
        <div
          className="
            absolute bottom-0 right-0
            h-56 w-[34%]
            rounded-tl-[48px]
            bg-gradient-to-bl from-amber-950 via-orange-950 to-amber-900
            shadow-[inset_0_10px_30px_rgba(255,255,255,0.06)]
            opacity-95
          "
        >
          <div className="absolute inset-x-8 top-10 h-px bg-amber-200/25" />
          <div className="absolute inset-x-10 top-16 h-px bg-amber-200/15" />
        </div>

        {/* Backrest / headrest center */}
        <div
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2
            w-[52%]
            h-72 sm:h-80
            rounded-t-[64px]
            bg-gradient-to-b from-amber-900 via-orange-950 to-amber-950
            shadow-[0_-20px_80px_-55px_rgba(2,6,23,0.95)]
            border-t border-amber-200/20
            overflow-hidden
          "
        >
          {/* subtle leather sheen */}
          <div className="absolute -top-14 left-10 right-10 h-44 rotate-[-8deg] bg-white/10 blur-2xl" />

          {/* stitches */}
          <div className="absolute left-10 right-10 top-10 h-px bg-amber-200/25" />
          <div className="absolute left-12 right-12 top-16 h-px bg-amber-200/15" />
          <div className="absolute left-10 right-10 top-24 h-px bg-amber-200/10" />

          {/* headrest pillow hint */}
          <div
            className="
              absolute left-1/2 top-10 -translate-x-1/2
              h-20 w-[70%]
              rounded-[28px]
              bg-gradient-to-b from-amber-800/70 to-orange-950/60
              shadow-[inset_0_8px_18px_rgba(255,255,255,0.08)]
              border border-amber-200/10
            "
          />
        </div>
      </div>
    </div>
  );
}

