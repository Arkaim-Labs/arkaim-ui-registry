import * as React from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"

import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { AdminSortDirection } from "@/hooks/use-admin-sort"

type AdminSortableHeadProps = React.ComponentProps<typeof TableHead> & {
  /** Current sort direction for this column, or null when unsorted. */
  direction: AdminSortDirection | null
  /** Called when the user clicks the header to toggle sort. */
  onToggle: () => void
}

/**
 * Drop-in replacement for `TableHead` that adds a sort indicator and
 * makes the cell clickable. Pair with `useAdminSort`:
 *
 * @example
 * const sort = useAdminSort(items, { name: (a) => a.name })
 * <AdminSortableHead direction={sort.directionFor("name")} onToggle={() => sort.toggle("name")}>
 *   Name
 * </AdminSortableHead>
 */
export function AdminSortableHead({
  direction,
  onToggle,
  children,
  className,
  ...props
}: AdminSortableHeadProps) {
  const Icon = direction === "asc" ? ArrowUpIcon : direction === "desc" ? ArrowDownIcon : ArrowUpDownIcon
  const label = direction === "asc" ? "sorted ascending" : direction === "desc" ? "sorted descending" : "not sorted"

  return (
    <TableHead
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
      className={cn("cursor-pointer select-none", className)}
      {...props}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex items-center gap-1 -ml-1 px-1 py-0.5 rounded text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          direction ? "text-foreground" : undefined
        )}
        aria-label={`Sort by ${typeof children === "string" ? children : "column"} (${label})`}
      >
        {children}
        <Icon className={cn("size-3", direction ? "opacity-100" : "opacity-50")} aria-hidden="true" />
      </button>
    </TableHead>
  )
}
