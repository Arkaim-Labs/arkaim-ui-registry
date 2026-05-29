import * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AdminTimestampFormat = "relative" | "absolute" | "auto"

type AdminTimestampProps = {
  /** ISO string, Date, or null/undefined. */
  value: string | Date | null | undefined
  /** "relative" → "3h ago", "absolute" → "May 22, 2026", "auto" (default) → relative for <7d, absolute otherwise. */
  format?: AdminTimestampFormat
  /** Text to show when `value` is empty. Defaults to "—". */
  fallback?: string
  /** Extra utility classes. */
  className?: string
}

const ABSOLUTE_FORMAT = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

function toDate(value: AdminTimestampProps["value"]): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const trimmed = value.trim()
  if (!trimmed) return null
  const date = new Date(trimmed)
  return Number.isNaN(date.getTime()) ? null : date
}

function relativeLabel(date: Date, now: Date): string {
  const diffMs = date.getTime() - now.getTime()
  const absSec = Math.abs(diffMs) / 1000

  if (absSec < 45) return RELATIVE_FORMAT.format(Math.round(diffMs / 1000), "second")
  if (absSec < 60 * 45) return RELATIVE_FORMAT.format(Math.round(diffMs / 60000), "minute")
  if (absSec < 60 * 60 * 22) return RELATIVE_FORMAT.format(Math.round(diffMs / 3_600_000), "hour")
  if (absSec < 60 * 60 * 24 * 26) return RELATIVE_FORMAT.format(Math.round(diffMs / 86_400_000), "day")
  if (absSec < 60 * 60 * 24 * 320) return RELATIVE_FORMAT.format(Math.round(diffMs / (86_400_000 * 30)), "month")
  return RELATIVE_FORMAT.format(Math.round(diffMs / (86_400_000 * 365)), "year")
}

/**
 * Renders a timestamp with `auto` formatting: relative ("3h ago") when
 * recent (<7 days), absolute ("May 22, 2026, 14:32") otherwise. The full
 * absolute string is always shown in a tooltip on hover.
 *
 * @example
 * <AdminTimestamp value={record.updatedAt} />
 * <AdminTimestamp value={event.createdAt} format="absolute" />
 */
export function AdminTimestamp({
  value,
  format = "auto",
  fallback = "—",
  className,
}: AdminTimestampProps) {
  const date = toDate(value)
  if (!date) {
    return <span className={cn("font-mono text-xs text-muted-foreground", className)}>{fallback}</span>
  }

  const now = new Date()
  const absSec = Math.abs(now.getTime() - date.getTime()) / 1000
  const useRelative =
    format === "relative" || (format === "auto" && absSec < 60 * 60 * 24 * 7)

  const display = useRelative ? relativeLabel(date, now) : ABSOLUTE_FORMAT.format(date)
  const tooltip = ABSOLUTE_FORMAT.format(date)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("font-mono text-xs text-muted-foreground", className)}>
          {display}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="font-mono text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
