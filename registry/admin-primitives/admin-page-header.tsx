import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  /** Page title rendered as `<h1>` in serif display font. */
  title: React.ReactNode
  /** Optional short description shown beneath the title in muted style. */
  description?: React.ReactNode
  /** Optional eyebrow text (mono caps) shown above the title — e.g. path. */
  eyebrow?: React.ReactNode
  /** Optional trailing action (button, toggle group, etc) aligned to the right on md+. */
  action?: React.ReactNode
  /** When provided, renders a Refresh button to the left of `action`. */
  onRefresh?: () => void | Promise<void>
  /** Disables/spins the refresh button (e.g. while a request is in flight). */
  isRefreshing?: boolean
  /** Extra utility classes appended to the wrapper. */
  className?: string
}

/**
 * Standard page header: eyebrow + h1 + description on the left,
 * refresh + action slot on the right. The first element inside every
 * `AdminPageLayout`.
 *
 * @example
 * <AdminPageHeader
 *   title="Applications"
 *   description="Registered consumer applications."
 *   onRefresh={reload}
 *   isRefreshing={isLoading}
 *   action={<Button onClick={openRegister}>Register</Button>}
 * />
 */
export function AdminPageHeader({
  title,
  description,
  eyebrow,
  action,
  onRefresh,
  isRefreshing,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      data-slot="admin-page-header"
      className={cn(
        "flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        {eyebrow ? (
          <p className="font-mono text-xs text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="font-serif text-3xl font-medium tracking-normal">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {onRefresh || action ? (
        <div className="flex shrink-0 items-center gap-2">
          {onRefresh ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void onRefresh()}
              disabled={isRefreshing}
              aria-label="Refresh"
            >
              <RefreshCwIcon className={isRefreshing ? "animate-spin" : undefined} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  )
}
