'use client';

import { Suspense } from 'react';
import { Earth3D } from './earth-3d';

interface FlightViewBackgroundProps {
  earthSize?: number; // 호환성을 위해 남겨둠 (실제로는 Earth3D의 설정을 따름)
}

export function FlightViewBackground({ earthSize }: FlightViewBackgroundProps) {
  // Earth3D는 이미 최적화된 설정과 카메라 위치(Flight Window Style)를 내장하고 있으므로
  // 별도의 설정 없이 그대로 재사용하여 모든 페이지에서 일관된 경험을 제공합니다.
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#030308] overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-[#050814]" />}>
        <Earth3D />
      </Suspense>
    </div>
  );
}
