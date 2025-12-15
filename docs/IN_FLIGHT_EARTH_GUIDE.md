# 🌍 InFlightEarth 컴포넌트 가이드

항공기 기내 엔터테인먼트 시스템과 같은 고급 3D 지구 시각화 컴포넌트입니다.

## 📋 주요 기능

### ✅ 완료된 기능들

1. **현실적인 3D 지구**

   - NASA 고품질 텍스처 사용 (Diffuse Map)
   - Specular Map (바다 반사 효과)
   - Normal Map 준비 (쉽게 추가 가능)

2. **구름 레이어**

   - 지구보다 약간 큰 투명한 구체
   - 지구보다 빠르게 회전하여 현실감 증대
   - 투명도 0.4로 자연스러운 효과

3. **대기권 효과 (Fresnel)**

   - 커스텀 쉐이더로 구현
   - 지구 가장자리에 푸른 빛 후광
   - 우주에서 본 지구의 대기권을 현실적으로 재현

4. **카메라 & 컨트롤**

   - OrbitControls로 마우스 드래그 회전
   - 줌 제한 (8~20 거리)
   - 극각 제한 (항상 북미 중심 뷰 유지)
   - 자동 회전 (매우 느리게)

5. **비행 경로**

   - LAX (Los Angeles) → ATL (Atlanta)
   - 위도/경도를 3D 좌표로 자동 변환
   - 곡선 경로 (Arc) - 구면 위로 솟아오름
   - 100개 세그먼트로 부드러운 곡선

6. **비행기 애니메이션**

   - 경로를 따라 자동으로 이동
   - 진행 방향을 바라보도록 회전
   - 파란 빛 발광 효과

7. **도시 마커 (Glassmorphism UI)**

   - HTML 오버레이로 3D 공간에 배치
   - 도시 코드 & 이름 표시
   - 펄스 애니메이션
   - 반투명 다크 테마 카드

8. **고급 조명**
   - Directional Light (태양광)
   - Ambient Light (전역 조명)
   - Hemisphere Light (하늘-지면 그라데이션)
   - 그림자 매핑 지원

## 📂 파일 구조

```
components/landing/
  └── in-flight-earth.tsx   # 메인 컴포넌트

app/
  └── demo-earth/
      └── page.tsx           # 데모 페이지
```

## 🚀 사용 방법

### 1. 데모 페이지 실행

```bash
pnpm run dev
```

브라우저에서 다음 주소로 접속:

```
http://localhost:3000/demo-earth
```

### 2. 컴포넌트 직접 사용

```tsx
import { InFlightEarth } from "@/components/landing/in-flight-earth";

export default function MyPage() {
  return (
    <div className="h-screen w-full">
      <InFlightEarth className="your-custom-class" />
    </div>
  );
}
```

## 🎨 커스터마이징

### 1. 다른 비행 경로 추가

`in-flight-earth.tsx` 파일의 `Scene` 컴포넌트에서:

```tsx
// 새로운 도시 좌표 추가
const nycPosition = latLonToVector3(40.7128, -74.0060, 5); // New York
const lonPosition = latLonToVector3(51.5074, -0.1278, 5);  // London

// 새로운 경로 생성
const flightPath2 = useMemo(() => {
  return createFlightPath(nycPosition, lonPosition, 100);
}, [nycPosition, lonPosition]);

// 렌더링
<FlightPathLine points={flightPath2} />
<Airplane path={flightPath2} />
<CityMarker position={nycPosition} cityName="New York" code="NYC" />
<CityMarker position={lonPosition} cityName="London" code="LON" />
```

### 2. 텍스처 교체

더 고품질의 텍스처를 사용하려면:

```tsx
// NASA Blue Marble (8K 버전)
const earthTexture = useLoader(
  THREE.TextureLoader,
  "/textures/earth_8k.jpg", // public 폴더에 저장
);

// Normal Map 추가
const normalMap = useLoader(
  THREE.TextureLoader,
  "/textures/earth_normal_8k.jpg",
);

// Material에 적용
<meshPhongMaterial
  map={earthTexture}
  normalMap={normalMap}
  normalScale={new THREE.Vector2(0.5, 0.5)}
  // ... 기타 속성
/>;
```

### 3. 비행기 속도 조절

```tsx
// Airplane 컴포넌트의 useFrame에서:
progressRef.current += delta * 0.1; // 0.05 → 0.1로 변경하면 2배 빠름
```

### 4. 대기권 색상 변경

```tsx
// Scene 컴포넌트의 atmosphereMaterial에서:
uniforms: {
  glowColor: { value: new THREE.Color(0xff6b6b) }, // 붉은 색 대기권
}
```

### 5. 마커 스타일 변경

```tsx
// CityMarker 컴포넌트의 JSX 수정:
<div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md ...">
  {/* 그라데이션 배경으로 변경 */}
</div>
```

## 🔧 성능 최적화 팁

1. **텍스처 해상도 조절**

   ```tsx
   // 낮은 사양 기기용
   <sphereGeometry args={[EARTH_RADIUS, 64, 64]} /> // 128 → 64
   ```

2. **그림자 끄기** (모바일)

   ```tsx
   <Canvas shadows={false}>
   ```

3. **자동 회전 끄기**
   ```tsx
   <OrbitControls autoRotate={false} />
   ```

## 🐛 문제 해결

### 텍스처가 로드되지 않는 경우

1. 브라우저 콘솔 확인 (F12)
2. CORS 에러인 경우 → 텍스처를 `public` 폴더에 저장
3. 로그 확인:
   ```
   ✅ 선명한 주간 지구 텍스처 로드 완료
   ```

### 비행기가 보이지 않는 경우

1. 콘솔 로그 확인:
   ```
   ✈️ 비행기 애니메이션 시작 - 경로를 따라 이동
   ```
2. 카메라 위치 조절 (더 멀리서 보기)

### 마커가 보이지 않는 경우

1. `<Html>` 컴포넌트는 Canvas 외부에 렌더링됨
2. z-index 확인
3. 브라우저 개발자 도구로 HTML 요소 확인

## 📚 주요 코드 설명

### 좌표 변환 함수

위도/경도를 3D 공간의 Vector3로 변환:

```tsx
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180); // 극각
  const theta = (lon + 180) * (Math.PI / 180); // 방위각

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
```

### 비행 경로 생성

두 점 사이의 곡선 경로:

```tsx
function createFlightPath(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number = 100,
) {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // 선형 보간
    const point = new THREE.Vector3().lerpVectors(start, end, t);

    // 아크 높이 추가 (포물선)
    const arcHeight = Math.sin(t * Math.PI) * 1.5;
    point.normalize().multiplyScalar(point.length() + arcHeight);

    points.push(point);
  }

  return points;
}
```

### Fresnel 쉐이더

대기권 후광 효과:

```glsl
// Vertex Shader
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform vec3 glowColor;
uniform float c;  // 강도
uniform float p;  // 멱승

void main() {
  float intensity = pow(c - dot(vNormal, vPositionNormal), p);
  gl_FragColor = vec4(glowColor, 1.0) * intensity;
}
```

## 🎯 핵심 로그 메시지

컴포넌트 실행 시 다음 로그들이 출력됩니다:

```
🚀 InFlightEarth 컴포넌트 마운트됨
✅ Three.js Canvas 생성 완료 - In-Flight Earth 시스템
🎬 In-Flight Earth 씬 초기화 완료
🌍 지구 텍스처 로드 완료 - Diffuse, Specular, Clouds
📍 좌표 변환 - 위도: 33.9416, 경도: -118.4085 → (x, y, z)
📍 좌표 변환 - 위도: 33.6407, 경도: -84.4277 → (x, y, z)
✈️ 비행 경로 생성 완료 - 101개의 포인트
✏️ 비행 경로 라인 생성 완료
✈️ 비행기 애니메이션 시작 - 경로를 따라 이동
```

## 🌟 다음 단계 개선 아이디어

1. **여러 비행 경로 동시 표시**
2. **실시간 비행 데이터 API 연동**
3. **낮/밤 지역 표시 (도시 불빛)**
4. **클릭 가능한 인터랙티브 마커**
5. **비행 시간 & 거리 정보 표시**
6. **경로 애니메이션 (점진적으로 그려지는 효과)**

## 📞 지원

문제가 발생하면 브라우저 콘솔 로그를 확인하세요. 모든 주요 기능에 로그가 포함되어 있습니다.

---

**제작**: AI Assistant  
**라이브러리**: React Three Fiber, Three.js, @react-three/drei  
**참고**: 항공기 기내 엔터테인먼트 시스템
