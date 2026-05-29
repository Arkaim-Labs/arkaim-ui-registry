import * as React from "react"

import { cn } from "@/lib/utils"

type AdminToggleGroupOption = {
  label: string
  value: string
}

type AdminToggleGroupProps = {
  /** Options shown as pill buttons; first is leftmost. */
  options: AdminToggleGroupOption[]
  /** Currently selected value (single-select). */
  value: string
  /** Called with the new value when the user clicks an option. */
  onValueChange: (value: string) => void
  /** Accessible group label (e.g. "Time range"). */
  ariaLabel?: string
  /** Extra utility classes appended to the wrapper. */
  className?: string
}

/**
 * Compact pill-style toggle group for single-select filters
 * (time ranges, status filters, etc). Each button exposes
 * `aria-pressed` for assistive tech.
 *
 * @example
 * <AdminToggleGroup
 *   ariaLabel="Time range"
 *   options={[
 *     { label: "24h", value: "24h" },
 *     { label: "7d", value: "7d" },
 *     { label: "30d", value: "30d" },
 *   ]}
 *   value={range}
 *   onValueChange={setRange}
 * />
 */
export function AdminToggleGroup({
  options,
  value,
  onValueChange,
  ariaLabel,
  className,
}: AdminToggleGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-md border border-border/70 bg-muted/30 p-0.5",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-xs transition-colors",
            option.value === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export type { AdminToggleGroupOption }
