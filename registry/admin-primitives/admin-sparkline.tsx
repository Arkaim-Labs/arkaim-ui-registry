import { cn } from "@/lib/utils"

type SparklineTone = "success" | "warning" | "danger" | "info" | "muted"

type AdminSparklineProps = {
  /** Accessible label describing what the series represents. */
  label: string
  /** Series of numeric values; returns null if fewer than 2 finite values. */
  values: number[]
  /** Color tone of the polyline. Defaults to "success". */
  tone?: SparklineTone
  /** Extra utility classes appended to the SVG. */
  className?: string
  /** Internal viewBox width. Defaults to 76. */
  width?: number
  /** Internal viewBox height. Defaults to 30. */
  height?: number
}

const toneClass: Record<SparklineTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  muted: "text-muted-foreground",
}

/**
 * Inline SVG polyline sparkline for the `visual` slot of `AdminMetricCard`.
 * No axes, no tooltip — just a trend hint. Exposed as `role="img"` with
 * the provided `label` for screen readers.
 *
 * @example
 * <AdminSparkline
 *   label="Failed deliveries last 7 days"
 *   tone="warning"
 *   values={dailyFailureCounts}
 * />
 */
export function AdminSparkline({
  label,
  values,
  tone = "success",
  className,
  width = 76,
  height = 30,
}: AdminSparklineProps) {
  const normalized = values.filter((value) => Number.isFinite(value))

  if (normalized.length < 2) {
    return null
  }

  const max = Math.max(...normalized, 1)
  const min = Math.min(...normalized)
  const range = Math.max(max - min, 1)

  const points = normalized
    .map((value, index) => {
      const x =
        normalized.length === 1
          ? width
          : (index / (normalized.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-8 w-20", toneClass[tone], className)}
      fill="none"
    >
      <polyline
        points={points}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
