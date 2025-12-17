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

console.log("🌍 Low Angle 영화 같은 지구 배경 설정:");
console.log("  - 지구 반지름:", EARTH_RADIUS);
console.log("  - 지구 위치: [0, -3.4, 0]");
console.log("  - 카메라: [0, 0.5, 5.5] → [0, 1.5, 0] (낮은 각도, 약간 위를 올려다봄)");

// 🌍 회전하는 지구 메시
interface EarthMeshProps {
  radius: number;
}

function RotatingEarth({ radius }: EarthMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthTexture = useTexture('/earth/earth.jpg');

  useEffect(() => {
    console.log("🌍 지구 텍스처 로드 완료");
  }, [earthTexture]);

  // 🎬 느린 회전 애니메이션 (Y축)
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 지구 본체 - 천천히 회전 */}
      <mesh>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshPhongMaterial map={earthTexture} />
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

// 🎬 메인 씬
function Scene() {
  useEffect(() => {
    console.log("🎬 Low Angle 씬 초기화 완료");
    console.log("📐 지구: [0, -3.4, 0], 반지름: 2.8, 느린 회전");
    console.log("📷 카메라: [0, 0.5, 5.5] → [0, 1.5, 0] (낮은 각도)");
    console.log("✨ 영화 같은 수평선 뷰 - 별과 회전하는 지구만");
  }, []);

  return (
    <>
      {/* ⭐ 별 배경 */}
      <Stars 
        radius={300} 
        depth={60} 
        count={4000} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* 조명 */}
      <directionalLight position={[-5, 3, 8]} intensity={2.0} />
      <directionalLight position={[5, 2, -5]} intensity={1.2} />
      <ambientLight intensity={0.5} />

      {/* 🌍 회전하는 지구 - Low Angle 위치 */}
      <group position={[0, -3.4, 0]}>
        <Suspense fallback={<FallbackEarth radius={EARTH_RADIUS} />}>
          <RotatingEarth radius={EARTH_RADIUS} />
        </Suspense>
      </group>
    </>
  );
}

// 🎬 메인 컴포넌트
export function InFlightEarth({ className = "" }: InFlightEarthProps) {
  useEffect(() => {
    console.log("🚀 InFlightEarth 마운트 - Golden Ratio 회전 지구 버전");
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [0, 2.5, 6.5],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
        onCreated={({ scene, camera }) => {
          console.log("✅ Canvas 생성 완료 - Golden Ratio 회전 지구");
          scene.background = new THREE.Color(0x000000);
          camera.lookAt(0, 0, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
