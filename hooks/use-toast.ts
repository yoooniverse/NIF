import { toast as sonnerToast } from "sonner"

type ToasterToast = {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    variant?: "default" | "destructive" | "success"
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastActionElement = React.ReactElement

function toast({ title, description, variant = "default", ...props }: Omit<ToasterToast, "id">) {
    const toastVariantMap = {
        default: sonnerToast,
        destructive: sonnerToast.error,
        success: sonnerToast.success,
    }

    const toastFn = toastVariantMap[variant] || sonnerToast

    return toastFn(title, {
        description,
        ...props,
    })
}

export { toast }
export type { ToasterToast, ToastActionElement }
