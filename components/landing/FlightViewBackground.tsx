'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Stars } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

function Earth({ size }: { size: number }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // 텍스처 로드 (Day, Night, Cloud 모두 사용)
  const [dayTexture, nightTexture, cloudTexture] = useTexture([
    '/textures/earth-day.png',
    '/textures/earth-lights.jpg',
    '/textures/earth-cloud.png'
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      // 지구 자전 (매우 느리게)
      earthRef.current.rotation.y += delta * 0.008;
    }
    if (cloudsRef.current) {
      // 구름 이동 (지구보다 약간 빠르게)
      cloudsRef.current.rotation.y += delta * 0.011;
      cloudsRef.current.rotation.x += delta * 0.001;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}> {/* 약간 기울임 */}
      {/* 지구 (밤의 도시 불빛 + 낮 텍스처 혼합) */}
      <Sphere ref={earthRef} args={[size, 64, 64]}>
        <meshStandardMaterial
          map={dayTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color('#ffaa33')} // 도시 불빛 색상 (따뜻한 주황/노랑)
          emissiveIntensity={3.5} // 불빛 강도
          roughness={0.7}
          metalness={0.1}
          color="#ffffff" // 텍스처 색상 그대로 표현
        />
      </Sphere>

      {/* 구름 (반투명 레이어) */}
      <Sphere ref={cloudsRef} args={[size * 1.012, 64, 64]}>
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false} // 구름이 지구를 가리되 뒤쪽이 렌더링 문제 없도록
          color="#88ccff" // 구름에 약간의 푸른빛 감돌게
        />
      </Sphere>
    </group>
  );
}

function SceneLights() {
  return (
    <>
      {/* 앰비언트 라이트: 전체적으로 매우 어둡게 */}
      <ambientLight intensity={0.05} color="#111122" />
      
      {/* 방향성 조명 (달빛 느낌): 푸르스름하고 차가운 빛 */}
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={1.2} 
        color="#aaccff" 
      />
      
      {/* 도시 불빛을 돋보이게 하기 위한 보조 조명 (반대편에서) */}
      <pointLight position={[-5, -2, -5]} intensity={0.2} color="#223355" />
    </>
  );
}

function CameraRig() {
  // 카메라 위치 조정 (비행기 창문에서 내려다보는 각도)
  useFrame((state) => {
    // 마우스 움직임에 따라 아주 미세하게 카메라가 흔들리는 효과 (비행기 진동/움직임)
    const t = state.clock.getElapsedTime();
    state.camera.position.x = 0 + Math.sin(t * 0.5) * 0.1;
    state.camera.position.y = 1.8 + Math.cos(t * 0.3) * 0.05; // 높이
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

interface FlightViewBackgroundProps {
  earthSize?: number; // 지구 크기 조절 파라미터 (기본값: 2.5)
}

export function FlightViewBackground({ earthSize = 2.5 }: FlightViewBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#030308] overflow-hidden">
      <Canvas
        dpr={[1, 2]} // 픽셀 비율 최적화
        camera={{ position: [0, 1.8, 4.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          {/* 배경 별 */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <SceneLights />
          <Earth size={earthSize} />
          <CameraRig />

          {/* 분위기 있는 안개 효과 */}
          <fog attach="fog" args={['#030308', 5, 15]} />
        </Suspense>
      </Canvas>

      {/* 비네팅 효과 (가장자리 어둡게) - 시네마틱한 느낌 강화 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* 창문 유리 질감/노이즈 오버레이 (아주 희미하게) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
