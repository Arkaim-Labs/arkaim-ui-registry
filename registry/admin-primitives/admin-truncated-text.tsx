import * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AdminTruncatedTextProps = {
  /** Text to render. Tooltip falls back to this string when displayed. */
  value: string
  /** Optional override for the tooltip body (defaults to `value`). */
  tooltip?: React.ReactNode
  /** Extra utility classes appended to the inline element. */
  className?: string
  /** Render `<div>` instead of `<span>`. Useful inside table cells where block layout matters. */
  asDiv?: boolean
}

/**
 * Truncates a single line and reveals the full text in a tooltip on
 * hover/focus. The tooltip only attaches when the element actually
 * overflows, so it doesn't add noise on short strings.
 *
 * @example
 * <AdminTruncatedText value={record.id} />
 * <AdminTruncatedText value={user.email} className="block" asDiv />
 */
export function AdminTruncatedText({
  value,
  tooltip,
  className,
  asDiv,
}: AdminTruncatedTextProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  const measure = React.useCallback(() => {
    const node = ref.current
    if (!node) return
    setIsOverflowing(node.scrollWidth > node.clientWidth + 1)
  }, [])

  React.useEffect(() => {
    measure()
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") return
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure, value])

  const Element = asDiv ? "div" : "span"
  const content = (
    <Element
      ref={ref as React.Ref<HTMLDivElement> & React.Ref<HTMLSpanElement>}
      className={cn("block truncate", className)}
      onMouseEnter={measure}
      onFocus={measure}
    >
      {value}
    </Element>
  )

  if (!isOverflowing) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs break-words font-mono text-xs">
        {tooltip ?? value}
      </TooltipContent>
    </Tooltip>
  )
}
