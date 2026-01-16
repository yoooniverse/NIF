"use client";

import dynamic from "next/dynamic";

export const ClientSpaceBackground = dynamic(
    () => import("@/components/landing/space-background").then((mod) => mod.SpaceBackground),
    {
        ssr: false,
        loading: () => <div className="absolute inset-0 bg-[#050814]" />
    }
);
