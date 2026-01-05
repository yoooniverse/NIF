'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Globe as GlobeIcon } from 'lucide-react';
import * as THREE from 'three';

// NOTE: react-globe.gl의 TS 타입 정의가 controls 관련/일부 props를 완전히 반영하지 못하는 경우가 있어
// 런타임 동작을 우선하기 위해 any로 래핑합니다.
const Globe = dynamic(
  () => {
    console.info('[GLOBE_CANVAS] Starting dynamic import of react-globe.gl');
    return import('react-globe.gl')
      .then((mod) => {
        console.info('[GLOBE_CANVAS] react-globe.gl successfully imported');
        return mod;
      })
      .catch((err) => {
        console.error('[GLOBE_CANVAS] Failed to import react-globe.gl', err);
        throw err;
      });
  },
  {
    ssr: false,
    loading: () => {
      console.info('[GLOBE_CANVAS] Dynamic import loading...');
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-transparent" />
            <div className="mt-4 text-sm text-white/60">3D 지구 라이브러리 로딩 중...</div>
          </div>
        </div>
      );
    },
  }
) as unknown as React.ComponentType<any>;

type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  label: string;
};

type HubDatum = {
  name: string;
  lat: number;
  lng: number;
  color: string;
};

const EARTH_TEXTURES = {
  day: '/earth/textures/earth-blue-marble.jpg',
  night: '/earth/textures/earth-night.jpg',
  bump: '/earth/textures/earth-topology.png',
  specular: '/earth/textures/earth-water.png',
  stars: '/earth/textures/night-sky.png',
} as const;

interface GlobeCanvasProps {
  className?: string;
}

export default function GlobeCanvas({ className = '' }: GlobeCanvasProps) {
  const globeRef = useRef<any>(null);
  const [globeError, setGlobeError] = useState<string | null>(null);
  const [globeLoading, setGlobeLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.info('[GLOBE_CANVAS] GlobeCanvas component mounted');
    setMounted(true);
    return () => {
      console.info('[GLOBE_CANVAS] GlobeCanvas component unmounted');
    };
  }, []);

  const arcsData: ArcDatum[] = useMemo(
    () => [
      // Major global cities (curved flight paths)
      {
        label: 'NYC → London',
        startLat: 40.7128,
        startLng: -74.006,
        endLat: 51.5074,
        endLng: -0.1278,
        color: ['rgba(56,189,248,0.90)', 'rgba(167,139,250,0.90)'],
      },
      {
        label: 'London → Seoul',
        startLat: 51.5074,
        startLng: -0.1278,
        endLat: 37.5665,
        endLng: 126.978,
        color: ['rgba(167,139,250,0.90)', 'rgba(34,197,94,0.90)'],
      },
      {
        label: 'Seoul → Tokyo',
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        color: ['rgba(34,197,94,0.90)', 'rgba(56,189,248,0.90)'],
      },
      {
        label: 'Tokyo → Singapore',
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 1.3521,
        endLng: 103.8198,
        color: ['rgba(56,189,248,0.90)', 'rgba(251,191,36,0.95)'],
      },
      {
        label: 'Singapore → Sydney',
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        color: ['rgba(251,191,36,0.95)', 'rgba(56,189,248,0.90)'],
      },
    ],
    []
  );

  const hubs: HubDatum[] = useMemo(
    () => [
      { name: 'New York', lat: 40.7128, lng: -74.006, color: 'rgba(56,189,248,1)' },
      { name: 'London', lat: 51.5074, lng: -0.1278, color: 'rgba(167,139,250,1)' },
      { name: 'Seoul', lat: 37.5665, lng: 126.978, color: 'rgba(34,197,94,1)' },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: 'rgba(251,191,36,1)' },
    ],
    []
  );

  const ringsData = useMemo(
    () =>
      hubs.map((h) => ({
        lat: h.lat,
        lng: h.lng,
        color: h.color,
      })),
    [hubs]
  );

  // Check WebGL support
  useEffect(() => {
    if (!mounted) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('[GLOBE_CANVAS] WebGL not supported');
      setGlobeError('WebGL을 지원하지 않는 브라우저입니다');
      setGlobeLoading(false);
      return;
    }

    console.info('[GLOBE_CANVAS] WebGL is supported');
  }, [mounted]);

  // Globe loading timeout
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (globeLoading && !globeError) {
        console.warn('[GLOBE_CANVAS] Globe loading timeout after 15 seconds');
        setGlobeError('3D 지구 로딩 타임아웃 - 페이지를 새로고침해주세요');
        setGlobeLoading(false);
      }
    }, 15000); // 15 seconds timeout (increased from 10)

    return () => clearTimeout(timeout);
  }, [globeLoading, globeError, mounted]);

  const setupControlsAndMaterial = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // 1) Controls: cinematic auto-rotate
    try {
      const controls = globe.controls?.();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;

        // Tilted Bird's-Eye View (In-Flight System)
        // - Polar angle is measured from +Y axis (0 = straight down, PI/2 = horizon-ish).
        // - 지구의 반원(semicircle) 모양이 보이도록 45도 위로 올린 각도로 제한
        controls.minPolarAngle = Math.PI / 3 + Math.PI / 4; // ~1.832rad (약 105도) - 최소 기울기 제한
        controls.maxPolarAngle = Math.PI / 1.5 + Math.PI / 4; // ~2.879rad (약 165도) - 최대 기울기 제한, 반원 모양

        console.info('[GLOBE_CANVAS] camera controls configured', {
          minPolarAngle: `${(controls.minPolarAngle * 180 / Math.PI).toFixed(1)}°`,
          maxPolarAngle: `${(controls.maxPolarAngle * 180 / Math.PI).toFixed(1)}°`,
          autoRotate: controls.autoRotate,
          autoRotateSpeed: controls.autoRotateSpeed
        });

        // In-flight map: 지구 원형이 화면에 가득 차도록 가까이 접근 가능하게 조정
        // (react-globe.gl 내부 camera distance 기반)
        controls.minDistance = 150; // 더 가까이 접근할 수 있도록 낮춤
        controls.maxDistance = 600; // 최대 거리도 적절히 조정
      }

      // In-Flight Map: 지구 원형이 화면에 가득 차도록 가까이 접근
      globe.pointOfView?.({ lat: 51.5, lng: -0.1, altitude: 1.8 }, 0);
      console.info('[GLOBE_CANVAS] initial viewpoint configured', {
        location: 'London, UK',
        coordinates: { lat: 51.5, lng: -0.1 },
        altitude: 1.8,
        description: 'In-Flight Map view - Earth filling the screen'
      });
        console.info('[GLOBE_CANVAS] In-Flight Map controls ready (autoRotate ON)');
    } catch (e) {
      console.warn('[GLOBE_CANVAS] controls setup failed', e);
    }

    // 2) Material: bump/specular + night lights
    try {
      const material = globe.globeMaterial?.();
      if (!material) return;

      const loader = new THREE.TextureLoader();

      const nightTex = loader.load(
        EARTH_TEXTURES.night,
        () => console.info('[GLOBE_CANVAS] ✅ Night texture loaded'),
        undefined,
        (err) => {
          console.error('[GLOBE_CANVAS] ❌ Failed to load night texture', { url: EARTH_TEXTURES.night, err });
          setGlobeError('야간 조명 텍스처 로딩 실패');
        }
      );
      const bumpTex = loader.load(
        EARTH_TEXTURES.bump,
        () => console.info('[GLOBE_CANVAS] ✅ Bump texture loaded'),
        undefined,
        (err) => {
          console.error('[GLOBE_CANVAS] ❌ Failed to load bump texture', { url: EARTH_TEXTURES.bump, err });
          setGlobeError('지형 텍스처 로딩 실패');
        }
      );
      const specularTex = loader.load(
        EARTH_TEXTURES.specular,
        () => console.info('[GLOBE_CANVAS] ✅ Specular texture loaded'),
        undefined,
        (err) => {
          console.error('[GLOBE_CANVAS] ❌ Failed to load specular texture', { url: EARTH_TEXTURES.specular, err });
          setGlobeError('물 반사 텍스처 로딩 실패');
        }
      );

      material.bumpMap = bumpTex;
      material.bumpScale = 8;
      material.specularMap = specularTex;
      material.specular = new THREE.Color('#ffffff');
      material.shininess = 15;

      material.emissiveMap = nightTex;
      material.emissive = new THREE.Color('#ffffff');
      material.emissiveIntensity = 0.8;

      material.needsUpdate = true;

      console.info('[GLOBE_CANVAS] globe material ready (bump/specular/emissive)');
    } catch (e) {
      console.warn('[GLOBE_CANVAS] globe material setup failed', e);
      setGlobeError('Failed to setup globe materials');
    }
  }, []);

  // Don't render Globe until mounted (avoid SSR issues)
  if (!mounted) {
    return (
      <div className={`absolute inset-0 z-0 ${className}`}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-transparent" />
            <div className="mt-4 text-sm text-white/60">초기화 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      {globeError ? (
        // Fallback UI when Globe fails to load
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <GlobeIcon className="mx-auto h-16 w-16 text-white/20" />
            <div className="mt-4 text-sm text-white/50">
              3D 지구 로딩 실패
            </div>
            <div className="mt-2 text-xs text-white/30">
              {globeError}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition"
            >
              새로고침
            </button>
          </div>
        </div>
      ) : (
        <>
        {console.info('[GLOBE_CANVAS] Rendering Globe component')}
        <Globe
          ref={globeRef}
          // Globe look & feel
          backgroundColor="rgba(0,0,0,0)"
          backgroundImageUrl={EARTH_TEXTURES.stars}
          globeImageUrl={EARTH_TEXTURES.day}
          bumpImageUrl={EARTH_TEXTURES.bump}
          showAtmosphere
          atmosphereColor="rgba(56,189,248,0.35)"
          atmosphereAltitude={0.12}
          // Arcs: flight paths - 지구가 가까워져 크기 키움
          arcsData={arcsData}
          arcStartLat={(d: ArcDatum) => d.startLat}
          arcStartLng={(d: ArcDatum) => d.startLng}
          arcEndLat={(d: ArcDatum) => d.endLat}
          arcEndLng={(d: ArcDatum) => d.endLng}
          arcColor={(d: ArcDatum) => d.color}
          arcAltitude={0.15} // 가까워진 시점에 맞게 높이 조정
          arcStroke={0.6}
          arcDashLength={0.35}
          arcDashGap={0.7}
          arcDashAnimateTime={2400}
          // Points: hubs - 가까워진 시점에 맞게 크기 키움
          pointsData={hubs}
          pointLat={(d: HubDatum) => d.lat}
          pointLng={(d: HubDatum) => d.lng}
          pointColor={(d: HubDatum) => d.color}
          pointAltitude={0.01} // 높게
          pointRadius={0.07} // 크게
          // Rings: pulsating markers - 가까워진 시점에 맞게 크기 키움
          ringsData={ringsData}
          ringLat={(d: any) => d.lat}
          ringLng={(d: any) => d.lng}
          ringColor={(d: any) => d.color}
          ringMaxRadius={1.3} // 크게
          ringPropagationSpeed={2.0}
          ringRepeatPeriod={1600}
          onGlobeReady={() => {
            console.info('[GLOBE_CANVAS] ✅ globe ready - initializing controls and materials');
            setGlobeLoading(false);
            
            // Delay setup to ensure globe is fully initialized
            setTimeout(() => {
              console.info('[GLOBE_CANVAS] Setting up controls and materials...');
              setupControlsAndMaterial();
            }, 100);
          }}
          onGlobeClick={() => console.info('[GLOBE_CANVAS] globe click')}
          onPointClick={(d: HubDatum) =>
            console.info('[GLOBE_CANVAS] hub click:', { name: d.name, lat: d.lat, lng: d.lng })
          }
          onArcClick={(d: ArcDatum) => console.info('[GLOBE_CANVAS] arc click:', d.label)}
        />
        {globeLoading && (
          <div className="pointer-events-none absolute inset-0 flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-transparent" />
              <div className="mt-4 text-sm text-white/60">3D 지구 로딩 중...</div>
            </div>
          </div>
        )}
        </>
      )}

      {/* Subtle vignette overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_35%,rgba(255,255,255,0.06),rgba(0,0,0,0.35),rgba(0,0,0,0.70))]" />
    </div>
  );
}
