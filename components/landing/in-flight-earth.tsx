"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useEffect, useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

interface InFlightEarthProps {
  className?: string;
}

// 위도/경도를 3D 좌표로 변환하는 유틸리티 함수
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  console.log(`📍 좌표 변환 - 위도: ${lat}, 경도: ${lon} → (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);

  return new THREE.Vector3(x, y, z);
}

// 두 지점 사이의 곡선 경로를 생성하는 함수
function createFlightPath(start: THREE.Vector3, end: THREE.Vector3, segments: number = 100): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  // 두 점 사이의 중간점을 계산하고 높이를 추가하여 아크 생성
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    // 구면 선형 보간 (Slerp)
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    
    // 아크 높이 추가 (포물선 형태) - 지표면에서 더 높이 떠있도록
    const arcHeight = Math.sin(t * Math.PI) * 2.5; // 지표면 위로 2.5 단위 상승
    point.normalize().multiplyScalar(point.length() + arcHeight);
    
    points.push(point);
  }

  console.log(`✈️ 비행 경로 생성 완료 - ${segments + 1}개의 포인트 (Arc 높이: 2.5)`);
  return points;
}

// 도시 마커 컴포넌트
interface CityMarkerProps {
  position: THREE.Vector3;
  cityName: string;
  code: string;
}

function CityMarker({ position, cityName, code }: CityMarkerProps) {
  return (
    <Html position={position.toArray()} center distanceFactor={8}>
      <div className="relative -translate-y-8">
        {/* 마커 핀 (더 크게) */}
        <div className="flex flex-col items-center">
          <div className="bg-cyan-400 rounded-full w-4 h-4 animate-pulse shadow-2xl shadow-cyan-400/70 border-2 border-white" />
          <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
        
        {/* 도시 정보 카드 (Glassmorphism 스타일) - 더 크고 선명하게 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl px-4 py-2 shadow-2xl shadow-cyan-500/20">
            <div className="text-cyan-300 font-bold text-base tracking-wide">{code}</div>
            <div className="text-slate-300 text-sm">{cityName}</div>
          </div>
          {/* 카드 화살표 */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900/90" />
          </div>
        </div>
      </div>
    </Html>
  );
}

// 비행기 컴포넌트 (경로를 따라 이동)
interface AirplaneProps {
  path: THREE.Vector3[];
}

function Airplane({ path }: AirplaneProps) {
  const planeRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (planeRef.current && path.length > 0) {
      // 경로를 따라 천천히 이동
      progressRef.current += delta * 0.08; // 속도 증가 (더 역동적)
      if (progressRef.current > 1) progressRef.current = 0;

      const index = Math.floor(progressRef.current * (path.length - 1));
      const nextIndex = Math.min(index + 1, path.length - 1);
      const t = (progressRef.current * (path.length - 1)) % 1;

      // 현재 위치
      const currentPos = path[index];
      const nextPos = path[nextIndex];
      const position = new THREE.Vector3().lerpVectors(currentPos, nextPos, t);

      planeRef.current.position.copy(position);

      // 비행기가 경로를 향하도록 회전
      if (nextIndex > index) {
        const direction = new THREE.Vector3().subVectors(nextPos, currentPos).normalize();
        planeRef.current.lookAt(planeRef.current.position.clone().add(direction));
      }
    }
  });

  useEffect(() => {
    console.log("✈️ 비행기 애니메이션 시작 - In-flight 스타일");
  }, []);

  return (
    <group ref={planeRef}>
      {/* 비행기 본체 (더 크고 눈에 띄게) */}
      <mesh castShadow>
        <coneGeometry args={[0.3, 1.0, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#00d9ff"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* 비행기 날개 (양쪽) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 0.4]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#00d9ff"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* 비행기 주변 강한 광채 */}
      <pointLight 
        intensity={5} 
        color="#00d9ff"
        distance={3}
      />
      
      {/* 추가 발광 효과 (펄스) */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Fallback 지구 컴포넌트 (텍스처 로딩 실패 시)
interface EarthSphereProps {
  radius: number;
}

function FallbackEarth({ radius }: EarthSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  console.log("⚠️ Fallback 모드: 단색 지구 렌더링");

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshPhongMaterial
          color="#1E90FF"
          specular={new THREE.Color(0x333333)}
          shininess={15}
        />
      </mesh>
      
      {/* 대기권 효과 */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// 지구 본체 컴포넌트 (텍스처 포함)
function EarthSphereWithTexture({ radius }: EarthSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 안정적인 텍스처 URL 사용
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  );

  useEffect(() => {
    console.log("🌍 지구 텍스처 로드 완료 - Earth Blue Marble");
  }, [earthTexture]);

  // 느린 자동 회전 (지구 자전)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03; // 매우 느린 회전
    }
  });

  // 대기권 쉐이더 머티리얼 (Fresnel 효과)
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.4 },  // 강도 증가
        p: { value: 3.5 },  // 부드러운 효과
        glowColor: { value: new THREE.Color(0x60a5fa) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        
        void main() {
          float intensity = pow(c - dot(vNormal, vPositionNormal), p);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
  }, []);

  return (
    <group>
      {/* 지구 본체 */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 256, 256]} />
        <meshPhongMaterial
          map={earthTexture}
          specular={new THREE.Color(0x222222)}
          shininess={20}
        />
      </mesh>

      {/* 대기권 효과 (Fresnel glow) - 더 크게 */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[radius, 128, 128]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
      
      {/* 추가 대기권 레이어 (더 넓은 후광) */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// 에러 경계를 가진 지구 컴포넌트
function EarthSphere({ radius }: EarthSphereProps) {
  console.log("🌍 EarthSphere 컴포넌트 로드 시도");
  
  return (
    <Suspense fallback={<FallbackEarth radius={radius} />}>
      <EarthSphereWithTexture radius={radius} />
    </Suspense>
  );
}

// 비행 경로 라인 컴포넌트
interface FlightPathLineProps {
  points: THREE.Vector3[];
}

function FlightPathLine({ points }: FlightPathLineProps) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00d9ff,  // 밝은 시안 색상 (In-flight 스타일)
      transparent: true,
      opacity: 0.9,
      linewidth: 3,
    });
    const lineObject = new THREE.Line(geometry, material);
    console.log("✏️ 비행 경로 라인 생성 완료 - 시안 발광 효과");
    return lineObject;
  }, [points]);

  // 경로 주변에 발광 효과 추가
  const glowLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      linewidth: 5,
    });
    return new THREE.Line(geometry, material);
  }, [points]);

  return (
    <>
      <primitive object={glowLine} />
      <primitive object={line} />
    </>
  );
}

// 메인 씬 컴포넌트
function Scene() {
  const EARTH_RADIUS = 10; // 더 큰 지구 (화면을 가득 채우기 위해)
  
  // 도시 좌표 (LAX, ATL) - 큰 반지름 사용
  const laxPosition = latLonToVector3(33.9416, -118.4085, EARTH_RADIUS); // Los Angeles
  const atlPosition = latLonToVector3(33.6407, -84.4277, EARTH_RADIUS); // Atlanta

  // 비행 경로 생성 (지표면 위로 살짝 떠있도록)
  const flightPath = useMemo(() => {
    const path = createFlightPath(laxPosition, atlPosition, 100);
    return path;
  }, [laxPosition, atlPosition]);

  useEffect(() => {
    console.log("🎬 In-Flight Earth 씬 초기화 완료 - 영화적 뷰포트");
  }, []);

  return (
    <>
      {/* 조명 설정 - 더 강렬하게 */}
      {/* 태양광 (주 조명) - 북미 대륙을 비추도록 */}
      <directionalLight 
        position={[-5, 8, 10]} 
        intensity={3.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 보조 조명 (지구 전체를 밝게) */}
      <directionalLight 
        position={[10, 5, -5]} 
        intensity={1.5}
      />
      
      {/* 환경 조명 (어두운 면도 보이도록) */}
      <ambientLight intensity={0.6} />
      
      {/* 반구 조명 (하늘 & 지면 색상) */}
      <hemisphereLight
        color="#87ceeb"
        groundColor="#1a2332"
        intensity={0.8}
      />

      {/* 지구 - 북미가 보이도록 회전 */}
      <group rotation={[0.2, -0.8, 0]}>
        <EarthSphere radius={EARTH_RADIUS} />
      </group>

      {/* 비행 경로 라인 */}
      <FlightPathLine points={flightPath} />

      {/* 비행기 애니메이션 */}
      <Airplane path={flightPath} />

      {/* 도시 마커 */}
      <CityMarker 
        position={laxPosition} 
        cityName="Los Angeles" 
        code="LAX" 
      />
      <CityMarker 
        position={atlPosition} 
        cityName="Atlanta" 
        code="ATL" 
      />

      {/* 카메라 컨트롤 - In-flight 스타일로 제한적 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={12}  // 최소 거리 (너무 가까이 못 가게)
        maxDistance={25}  // 최대 거리 (너무 멀리 못 가게)
        minPolarAngle={Math.PI / 3}  // 위쪽 각도 제한
        maxPolarAngle={Math.PI / 1.8}  // 아래쪽 각도 제한
        autoRotate={true}
        autoRotateSpeed={0.2}  // 느린 자동 회전
        enableDamping={true}  // 부드러운 움직임
        dampingFactor={0.05}
      />
    </>
  );
}

// 메인 컴포넌트
export function InFlightEarth({ className = "" }: InFlightEarthProps) {
  useEffect(() => {
    console.log("🚀 InFlightEarth 컴포넌트 마운트됨 - 영화적 In-Flight 뷰");
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ 
          position: [0, 5, 18],  // 카메라를 더 가깝게, 약간 위에서 내려다보기
          fov: 60,  // 더 넓은 시야각 (immersive)
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,  // 영화적 색감
          toneMappingExposure: 1.2  // 밝기 증가
        }}
        shadows
        onCreated={({ camera }) => {
          console.log("✅ Three.js Canvas 생성 완료 - In-Flight Entertainment 뷰");
          // 카메라가 약간 아래를 바라보도록
          camera.lookAt(0, 0, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
