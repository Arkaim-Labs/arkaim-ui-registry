import type * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

type AdminMetricCardProps = {
  /** Short uppercase mono label shown above the value. */
  label: string
  /** Primary metric value (big serif number/string). */
  value: string
  /** Trailing detail line below the metric; tone is auto-derived if omitted. */
  detail: string
  /** Optional icon shown in the upper-right corner box. */
  icon?: React.ReactNode
  /** Optional row of badges or state shown below the value. */
  meta?: React.ReactNode
  /** Optional visual (sparkline, chart) shown in the upper-right column. */
  visual?: React.ReactNode
  /** Explicit tone for `detail`; bypasses keyword auto-detection. */
  detailTone?: "muted" | "success" | "warning" | "danger"
}

/**
 * KPI/metric card used inside `AdminMetricGrid` at the top of pages.
 * Layout is `label → value → meta` on the left, `icon` and `visual`
 * on the right, with `detail` in the footer.
 *
 * @example
 * <AdminMetricCard
 *   label="Total users"
 *   value={String(users.length)}
 *   detail={`${active} active`}
 *   icon={<UsersIcon />}
 * />
 */

function resolveDetailTone(
  detail: string,
  tone?: AdminMetricCardProps["detailTone"]
) {
  if (tone) return tone

  const normalized = detail.toLowerCase()

  if (
    detail.trim().startsWith("+") ||
    normalized.includes("healthy") ||
    normalized.includes("verified") ||
    normalized.includes("active")
  ) {
    return "success"
  }

  if (
    normalized.includes("failed") ||
    normalized.includes("failure") ||
    normalized.includes("error") ||
    normalized.includes("denied") ||
    normalized.includes("rate-limited") ||
    normalized.includes("sensitive")
  ) {
    return "danger"
  }

  if (
    normalized.includes("degraded") ||
    normalized.includes("pending") ||
    normalized.includes("missing") ||
    normalized.includes("past due")
  ) {
    return "warning"
  }

  return "muted"
}

function detailToneClass(tone: ReturnType<typeof resolveDetailTone>) {
  if (tone === "success") return "text-success"
  if (tone === "warning") return "text-warning"
  if (tone === "danger") return "text-danger"
  return "text-muted-foreground"
}

export function AdminMetricCard({
  label,
  value,
  detail,
  icon,
  meta,
  visual,
  detailTone,
}: AdminMetricCardProps) {
  const tone = resolveDetailTone(detail, detailTone)

  return (
    <Card className="min-h-28 bg-card shadow-none" size="sm">
      <CardHeader
        className={icon ? "flex flex-row items-start justify-between gap-3" : undefined}
      >
        <div>
          <CardDescription className="font-mono text-[0.68rem] uppercase tracking-normal text-muted-foreground/70">
            {label}
          </CardDescription>
          <div className="mt-3 font-serif text-4xl font-medium leading-none tabular-nums text-foreground">
            {value}
          </div>
          {meta ? <div className="mt-2">{meta}</div> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          {icon ? (
            <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground">
              {icon}
            </span>
          ) : null}
          {visual ? <div className="hidden sm:block">{visual}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={`font-mono text-xs ${detailToneClass(tone)}`}>
        {detail}
      </CardContent>
    </Card>
  )
}
