import type { TTagColor } from "@/types"

export const TAG_COLOR_CLASSES: Record<TTagColor, string> = {
  info: "border-info/25 bg-info/10 text-info",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  error: "border-error/25 bg-error/10 text-error",
  neutral: "border border-muted text-highlighted bg-muted"
} as const
