import * as React from "react"

import { cn } from "@/lib/utils"

type AdminFieldCardProps = {
  /** Optional uppercase mono label shown above the content. */
  label?: React.ReactNode
  /** Card body — typically a value, badge or short composition. */
  children: React.ReactNode
  /** Extra utility classes appended to the card wrapper. */
  className?: string
}

/**
 * Bordered surface used to display read-only key/value pairs in detail
 * sheets and tabs. Without `label`, it acts as a generic field wrapper.
 *
 * @example
 * <AdminFieldCard label="Status">{statusBadge(record.status)}</AdminFieldCard>
 */
export function AdminFieldCard({ label, children, className }: AdminFieldCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-background/40 p-3",
        className
      )}
    >
      {label !== undefined && (
        <div className="font-mono text-[0.68rem] uppercase tracking-normal text-muted-foreground">
          {label}
        </div>
      )}
      {label !== undefined ? (
        <div className="mt-1 text-sm text-foreground">{children}</div>
      ) : (
        children
      )}
    </div>
  )
}
