import * as React from "react"

import { cn } from "@/lib/utils"

type StatusTone = "ok" | "warn" | "err" | "info" | "muted"

const toneStyles: Record<StatusTone, { badge: string; dot: string }> = {
  ok:   { badge: "border-success bg-success-muted text-success",   dot: "bg-success" },
  warn: { badge: "border-warning bg-warning-muted text-warning",   dot: "bg-warning" },
  err:  { badge: "border-danger bg-danger-muted text-danger",      dot: "bg-danger" },
  info: { badge: "border-info bg-info-muted text-info",            dot: "bg-info" },
  muted:{ badge: "border-border text-muted-foreground",            dot: "bg-muted-foreground" },
}

type AdminStatusBadgeProps = {
  /** Semantic tone — defaults to "muted". */
  tone?: StatusTone
  /** Badge text (the dot is rendered automatically). */
  children: React.ReactNode
  /** Extra utility classes appended to the badge. */
  className?: string
}

/**
 * Pill badge with a leading colored dot. Use for status indicators
 * inside tables and detail headers when a stronger visual cue than the
 * shadcn `Badge` is needed.
 *
 * @example
 * <AdminStatusBadge tone="ok">active</AdminStatusBadge>
 * <AdminStatusBadge tone="warn">past due</AdminStatusBadge>
 */
export function AdminStatusBadge({
  tone = "muted",
  children,
  className,
}: AdminStatusBadgeProps) {
  const styles = toneStyles[tone]
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles.badge,
        className
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} />
      {children}
    </span>
  )
}

export type { StatusTone }
