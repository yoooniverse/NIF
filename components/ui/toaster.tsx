"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                className: "font-sans",
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    success: "group-[.toaster]:border-green-100 group-[.toaster]:bg-green-50/90",
                    error: "group-[.toaster]:border-red-100 group-[.toaster]:bg-red-50/90",
                    info: "group-[.toaster]:border-blue-100 group-[.toaster]:bg-blue-50/90",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
