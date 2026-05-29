import * as React from "react"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FeedTone = "success" | "warning" | "info" | "danger" | "muted"

function dotClass(tone: FeedTone) {
  if (tone === "success") return "fill-success text-success"
  if (tone === "warning") return "fill-warning text-warning"
  if (tone === "danger") return "fill-danger text-danger"
  if (tone === "muted") return "fill-muted-foreground text-muted-foreground"
  return "fill-info text-info"
}

type AdminFeedItemProps = {
  /** Color of the leading dot; conveys event tone (defaults to "info"). */
  tone?: FeedTone
  /** Main line — usually `actor → action` or short title. */
  primary: React.ReactNode
  /** Optional secondary line shown beneath `primary` in muted style. */
  secondary?: React.ReactNode
  /** Trailing metadata — usually a timestamp. */
  meta?: React.ReactNode
  /** Extra utility classes appended to the row grid. */
  className?: string
}

/**
 * Single row in an event feed (audit log, recent activity, etc).
 * Layout is `dot | primary/secondary | meta`. Use within a
 * `<div className="divide-y">` container for the standard divider.
 *
 * @example
 * <AdminFeedItem
 *   tone="success"
 *   primary={<>{actor} → {action}</>}
 *   secondary={`${module} · ${target}`}
 *   meta={timestamp}
 * />
 */
export function AdminFeedItem({
  tone = "info",
  primary,
  secondary,
  meta,
  className,
}: AdminFeedItemProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3",
        className
      )}
    >
      <CircleIcon aria-hidden="true" className={cn("size-2", dotClass(tone))} />
      <div className="min-w-0">
        <div className="truncate font-mono text-sm">{primary}</div>
        {secondary && (
          <div className="truncate font-mono text-xs text-muted-foreground">
            {secondary}
          </div>
        )}
      </div>
      {meta !== undefined && (
        <div className="font-mono text-xs text-muted-foreground">{meta}</div>
      )}
    </div>
  )
}
