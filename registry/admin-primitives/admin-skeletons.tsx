import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type AdminTableSkeletonProps = {
  /** Number of body rows to render. Defaults to 6. */
  rows?: number
  /** Number of columns to render. Defaults to 5. */
  columns?: number
  /** Extra utility classes appended to the surface. */
  className?: string
}

/**
 * Placeholder skeleton matching the standard `AdminTableSurface` shape.
 * Use as a Suspense fallback or while waiting for the first API response.
 */
export function AdminTableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: AdminTableSkeletonProps) {
  return (
    <div
      data-slot="admin-table-skeleton"
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 bg-[var(--table)]",
        className,
      )}
    >
      <div className="border-b border-border/70 px-3 py-2">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`head-${index}`} className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border/70">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-3 py-3">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className="h-4 w-full max-w-32"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type AdminCardSkeletonProps = {
  /** Number of metric-card-shaped placeholders to render. Defaults to 4. */
  count?: number
  /** Extra utility classes appended to the grid. */
  className?: string
}

/**
 * Placeholder skeleton matching `AdminMetricGrid` + `AdminMetricCard` shape.
 * Useful for the initial page render while data is loading.
 */
export function AdminCardSkeleton({
  count = 4,
  className,
}: AdminCardSkeletonProps) {
  return (
    <div
      data-slot="admin-card-skeleton"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-28 flex-col justify-between rounded-lg border border-border/70 bg-card/70 p-4"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}
