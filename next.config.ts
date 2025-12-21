import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  experimental: {
    optimizeCss: true, // CSS 최적화
    scrollRestoration: true, // 스크롤 복원
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // 프로덕션에서 console 제거
  },
  // 번들 분석을 위한 설정 (개발 시 성능 모니터링용)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 번들 최적화
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Clerk 라이브러리 분리
          clerk: {
            test: /[\\/]node_modules[\\/]@clerk[\\/]/,
            name: 'clerk',
            chunks: 'all',
            priority: 10,
          },
          // 3D 라이브러리 분리
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)/,
            name: 'three',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/(fonts|images|textures)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }
    ];
  },
};

export default nextConfig;
