"use client"

import {
  AlertTriangleIcon,
  LoaderCircleIcon,
  LockIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AdminStateVariant = "empty" | "loading" | "error" | "forbidden"

type AdminStateProps = {
  /** Selects icon, default copy, ARIA role and live region behavior. */
  variant: AdminStateVariant
  /** Overrides the default title for the variant. */
  title?: string
  /** Overrides the default description; required for `error` to be useful. */
  description?: string
  /** Label for the action button (rendered on `error` and `empty` with `onAction`). */
  actionLabel?: string
  /** Action handler (rendered on `error` and `empty` with `actionLabel`). */
  onAction?: () => void
  /** Optional icon for the action button (typically a Plus or refresh icon). */
  actionIcon?: React.ReactNode
  /** Extra utility classes appended to the wrapper. */
  className?: string
}

const variantDefaults: Record<
  AdminStateVariant,
  { title: string; description?: string; minHeight: string }
> = {
  empty: {
    title: "Nothing here yet",
    minHeight: "min-h-32",
  },
  loading: {
    title: "Loading",
    minHeight: "min-h-40",
  },
  error: {
    title: "Something went wrong",
    minHeight: "min-h-40",
  },
  forbidden: {
    title: "Forbidden",
    description: "Your current admin role does not have permission to open this module.",
    minHeight: "min-h-40",
  },
}

function VariantIcon({ variant }: { variant: AdminStateVariant }) {
  if (variant === "loading") {
    return (
      <LoaderCircleIcon
        aria-hidden="true"
        className="size-5 animate-spin text-muted-foreground"
      />
    )
  }

  if (variant === "error") {
    return (
      <div className="flex size-9 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertTriangleIcon aria-hidden="true" className="size-4" />
      </div>
    )
  }

  if (variant === "forbidden") {
    return (
      <div className="flex size-9 items-center justify-center rounded-lg border border-warning bg-warning-muted text-warning">
        <LockIcon aria-hidden="true" className="size-4" />
      </div>
    )
  }

  return (
    <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-muted-foreground">
      <SearchIcon aria-hidden="true" className="size-4" />
    </div>
  )
}

function ariaRole(variant: AdminStateVariant) {
  if (variant === "error") return "alert"
  if (variant === "loading") return "status"
  return undefined
}

/**
 * Single component for the four mandatory page states: `empty`, `loading`,
 * `error` and `forbidden`. Loading carries `role="status"` + `aria-busy`;
 * error carries `role="alert"`.
 *
 * @example
 * {isLoading ? (
 *   <AdminState variant="loading" title="Loading users" description="Fetching from the API." />
 * ) : error ? (
 *   <AdminState variant="error" title="Users unavailable" description={error} actionLabel="Retry" onAction={reload} />
 * ) : items.length === 0 ? (
 *   <AdminState variant="empty" title="No users found" />
 * ) : null}
 */
export function AdminState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
}: AdminStateProps) {
  const defaults = variantDefaults[variant]
  const resolvedTitle = title ?? defaults.title
  const resolvedDescription = description ?? defaults.description
  const showAction = (variant === "error" || variant === "empty") && actionLabel && onAction
  const gap = showAction ? "gap-3" : "gap-2"

  return (
    <div
      data-slot="admin-state"
      data-variant={variant}
      role={ariaRole(variant)}
      aria-live={variant === "loading" ? "polite" : undefined}
      aria-busy={variant === "loading" ? true : undefined}
      className={cn(
        "flex flex-col items-center justify-center px-4 py-8 text-center",
        defaults.minHeight,
        gap,
        className,
      )}
    >
      <VariantIcon variant={variant} />
      <div className={variant === "error" ? "grid gap-1" : undefined}>
        <div className="text-sm font-medium text-foreground">{resolvedTitle}</div>
        {resolvedDescription ? (
          <div className="max-w-md text-sm text-muted-foreground">
            {resolvedDescription}
          </div>
        ) : null}
      </div>
      {showAction ? (
        <Button size="sm" variant={variant === "empty" ? "default" : "outline"} onClick={onAction}>
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
