"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface InFlightEarthProps {
  className?: string;
}

// 🎯 Golden Ratio 설정 (변경 금지!)
const EARTH_RADIUS = 2.8;

console.log("🌍 Flight Window Style 지구 배경 설정:");
console.log("  - 지구 반지름:", EARTH_RADIUS);
console.log("  - 지구 위치: [0, -3.4, 0]");
console.log("  - 카메라: [0, 2.5, 6.5] (낮은 각도, 카메라 흔들림 효과 추가)");

// 🌍 회전하는 지구 메시
interface EarthMeshProps {
  radius: number;
}

function RotatingEarth({ radius }: EarthMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // 텍스처 로드 (Day, Night-Lights, Cloud) - 최적화된 설정
  const [dayTexture, nightTexture, cloudTexture] = useTexture([
    '/textures/earth-day.png',
    '/textures/earth-lights.jpg',
    '/textures/earth-cloud.png'
  ], (textures) => {
    // 텍스처 최적화 설정
    textures.forEach((texture) => {
      texture.generateMipmaps = false; // Mipmap 비활성화로 메모리 절약
      texture.minFilter = THREE.LinearFilter; // 필터링 최적화
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    });
  });

  useEffect(() => {
    console.log("🌍 지구 텍스처 로드 완료 (Day, Night-Lights, Cloud)");
  }, [dayTexture, nightTexture, cloudTexture]);

  // 🎬 느린 회전 애니메이션 (Y축) - 뉴스 페이지 스타일
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 지구 자전 (매우 느리게)
      groupRef.current.rotation.y += delta * 0.008;
    }
    if (cloudsRef.current) {
      // 구름 이동 (지구보다 약간 빠르게)
      cloudsRef.current.rotation.y += delta * 0.011;
      cloudsRef.current.rotation.x += delta * 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 지구 본체 (Day + Night Lights) - 뉴스 페이지 스타일 */}
      <mesh>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={dayTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color('#ffaa33')} // 도시 불빛 색상 (따뜻한 주황/노랑)
          emissiveIntensity={3.5} // 불빛 강도
          roughness={0.7}
          metalness={0.1}
          color="#ffffff" // 텍스처 색상 그대로 표현
        />
      </mesh>

      {/* 구름 레이어 - 뉴스 페이지 스타일 */}
      <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false} // 구름이 지구를 가리되 뒤쪽이 렌더링 문제 없도록
          color="#88ccff" // 구름에 약간의 푸른빛 감돌게
        />
      </mesh>

      {/* 대기권 후광 */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#3080ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// 🌍 Fallback 지구 (로딩 중)
function FallbackEarth({ radius }: EarthMeshProps) {
  console.log("⏳ 지구 로딩 중...");

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial color="#4169E1" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#3080ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// 🎬 메인 씬 - 뉴스 페이지 스타일 적용
function Scene() {
  useEffect(() => {
    console.log("🎬 Flight Window Style 씬 초기화 완료");
    console.log("📐 지구: [0, -3.4, 0], 반지름: 2.8, 뉴스 페이지 스타일 회전");
    console.log("📷 카메라: [0, 2.5, 6.5] (낮은 각도, 흔들림 효과)");
    console.log("✨ 비행기 창문 스타일 - 별, 조명, 안개 효과");
  }, []);

  return (
    <>
      {/* ⭐ 별 배경 - 유지 */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* 조명 - 뉴스 페이지 스타일 */}
      <SceneLights />

      {/* 🌍 회전하는 지구 - Low Angle 위치 */}
      <group position={[0, -3.4, 0]}>
        <Suspense fallback={<FallbackEarth radius={EARTH_RADIUS} />}>
          <RotatingEarth radius={EARTH_RADIUS} />
        </Suspense>
      </group>

      {/* 카메라 흔들림 효과 - 뉴스 페이지 추가 */}
      <CameraRig />

      {/* 분위기 있는 안개 효과 - 뉴스 페이지 추가 */}
      <fog attach="fog" args={['#030308', 5, 15]} />
    </>
  );
}

// 뉴스 페이지 스타일 조명
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

// 뉴스 페이지 스타일 카메라 흔들림
function CameraRig() {
  // 카메라 위치 조정 (비행기 창문에서 내려다보는 각도)
  useFrame((state) => {
    // 마우스 움직임에 따라 아주 미세하게 카메라가 흔들리는 효과 (비행기 진동/움직임)
    const t = state.clock.getElapsedTime();
    state.camera.position.x = 0 + Math.sin(t * 0.5) * 0.1;
    state.camera.position.y = 2.5 + Math.cos(t * 0.3) * 0.05; // 높이 조정
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// 🎬 메인 컴포넌트
export function InFlightEarth({ className = "" }: InFlightEarthProps) {
  useEffect(() => {
    console.log("🚀 InFlightEarth 마운트 - Flight Window Style 적용 (News Page Style)");
  }, []);

  return (
    <div className={`absolute inset-0 z-0 h-full w-full bg-[#030308] overflow-hidden ${className}`}>
      <Canvas
        dpr={[1, 2]} // 픽셀 비율 최적화
        camera={{ position: [0, 2.5, 6.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ scene, camera }) => {
          console.log("✅ Canvas 생성 완료 - Flight Window Style 지구");
          scene.background = new THREE.Color(0x030308);
          camera.lookAt(0, 0, 0);
        }}
      >
        <Scene />
      </Canvas>

      {/* 비네팅 효과 (가장자리 어둡게) - 시네마틱한 느낌 강화 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* 창문 유리 질감/노이즈 오버레이 (아주 희미하게) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
