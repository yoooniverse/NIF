"use client";

import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface EarthGlobe3DProps {
  autoRotate?: boolean;
}

// 비행기 컴포넌트 (움직이는 애니메이션)
function Airplane() {
  const planeRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((t) => t + delta);
    
    if (planeRef.current) {
      // 지구 주위를 천천히 이동하는 애니메이션
      const radius = 13.5;
      const speed = 0.3;
      const x = Math.cos(time * speed) * radius;
      const z = Math.sin(time * speed) * radius;
      const y = 2 + Math.sin(time * speed * 2) * 0.5;
      
      planeRef.current.position.set(x, y, z);
      planeRef.current.rotation.y = -time * speed + Math.PI / 2;
    }
  });

  useEffect(() => {
    console.log("✈️ 비행기 아이콘 마운트됨");
  }, []);

  return (
    <group ref={planeRef} position={[13.5, 2, 0]}>
      {/* 비행기 본체 */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.3, 0.6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* 비행기 날개 */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.08, 0.3]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* 비행기 꼬리 수평 날개 */}
      <mesh position={[-0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.25]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* 비행기 꼬리 수직 날개 */}
      <mesh position={[-0.6, 0.25, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.08]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* 비행기 주변 광채 */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={1.5} 
        color="#60a5fa"
        distance={3}
      />
    </group>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    console.log("🌍 3D 지구 컴포넌트 마운트됨 - In-flight map 스타일 렌더링");
  }, []);

  // 선명한 주간 지구 텍스처 (In-flight map 스타일)
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
  );

  useEffect(() => {
    if (earthTexture) {
      console.log("✅ 선명한 주간 지구 텍스처 로드 완료 (In-flight map 스타일)");
    }
  }, [earthTexture]);

  return (
    <>
      {/* 메인 지구 구체 - In-flight map 스타일 (더 크고 진한 색감) */}
      <group rotation={[0.2, -0.5, 0]} position={[0, -10, 0]}>
        {/* 지구 본체 (주간 텍스처 - 진한 색감) */}
        <Sphere ref={meshRef} args={[15, 256, 256]} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.3}
            metalness={0.05}
            color="#ffffff"
          />
        </Sphere>

        {/* 대기권 효과 (미묘하게) */}
        <Sphere args={[15.25, 64, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#87ceeb"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* 대기권 외곽 광채 */}
        <Sphere args={[15.45, 64, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#b0d4f1"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>

      {/* 비행기 (지구 주위를 날아다님) */}
      <Airplane />

      {/* 태양 조명 (매우 강렬한 주광 - 진한 색감 표현) */}
      <directionalLight 
        position={[-15, 10, 12]} 
        intensity={8} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 보조 조명 (전체 지구를 밝게) */}
      <directionalLight 
        position={[10, 6, -6]} 
        intensity={2} 
        color="#ffffff"
      />
      
      {/* 추가 보조 조명 (색상 강조) */}
      <directionalLight 
        position={[0, -5, 10]} 
        intensity={1.5} 
        color="#f0f8ff"
      />
      
      {/* 환경 조명 (밝고 선명한 색상) */}
      <ambientLight intensity={0.7} />

      {/* 반구형 환경 조명 (하늘색 - 더 밝게) */}
      <hemisphereLight
        color="#87ceeb"
        groundColor="#1a1a3e"
        intensity={1.2}
      />
    </>
  );
}

export function EarthGlobe3D({ autoRotate = false }: EarthGlobe3DProps) {
  useEffect(() => {
    console.log("🌌 3D Canvas 초기화 - 레퍼런스 스타일 적용");
  }, []);

  return (
    <div className="w-full h-full flex items-end justify-center overflow-hidden">
      <div className="w-full h-full">
        <Canvas
          camera={{ 
            position: [0, 0, 18], 
            fov: 65,
            near: 0.1,
            far: 1000
          }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 2.2
          }}
          onCreated={() => {
            console.log("✅ Three.js Canvas 생성 완료 - 진한 색감 + 비행기 애니메이션");
          }}
        >
          <Earth />
        </Canvas>
      </div>
    </div>
  );
}
