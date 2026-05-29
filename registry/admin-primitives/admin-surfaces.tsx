import type * as React from "react"

import { cn } from "@/lib/utils"

type AdminPanelProps = React.ComponentProps<"section">

/**
 * Generic bordered surface used for content blocks that need a card-like
 * frame but not the full shadcn `Card` styling. Pair with `AdminPanelHeader`
 * and `AdminPanelBody`.
 */
export function AdminPanel({ className, ...props }: AdminPanelProps) {
  return (
    <section
      data-slot="admin-panel"
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 bg-card text-sm text-card-foreground shadow-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * Header row for an `AdminPanel` with title, optional description and
 * action slot. The action is right-aligned and shrink-protected.
 */
export function AdminPanelHeader({
  action,
  children,
  className,
  description,
  title,
  ...props
}: React.ComponentProps<"div"> & {
  /** Optional right-aligned action (button, link, etc). */
  action?: React.ReactNode
  /** Optional sub-title in mono style. */
  description?: React.ReactNode
  /** Panel title rendered as `<h2>`. */
  title: React.ReactNode
}) {
  return (
    <div
      data-slot="admin-panel-header"
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border/70 px-4 py-3",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <h2 className="truncate text-base font-medium leading-snug text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/** Padded body for an `AdminPanel`. Provides consistent inner spacing. */
export function AdminPanelBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-panel-body"
      className={cn("p-4", className)}
      {...props}
    />
  )
}

/**
 * Responsive grid for `AdminMetricCard`s at the top of pages. Defaults to
 * 1 → 2 → 4 columns; override with `className` for denser layouts.
 */
export function AdminMetricGrid({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-metric-grid"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Bordered table container with `var(--table)` background. Wrap any
 * shadcn `Table` plus its loading/error/empty states inside.
 */
export function AdminTableSurface({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-table-surface"
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 bg-[var(--table)]",
        className
      )}
      {...props}
    />
  )
}
