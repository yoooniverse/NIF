"use client";

import dynamic from "next/dynamic";

export const ClientLazyEarth = dynamic(
    () => import("@/components/landing/lazy-earth").then((mod) => mod.LazyEarth),
    {
        ssr: false,
        loading: () => <div className="absolute inset-0 bg-[#050814]" />
    }
);
