import * as React from "react"

import { cn } from "@/lib/utils"

type AdminPageLayoutProps = {
  /** Page content (header, filters, tables, sheets, dialogs). */
  children: React.ReactNode
  /** Extra utility classes appended to the default container. */
  className?: string
}

/**
 * Top-level container for every admin page. Provides the `@container/main`
 * query context, vertical flex layout, gap and responsive padding so all
 * pages share the same chrome.
 */
export function AdminPageLayout({ children, className }: AdminPageLayoutProps) {
  return (
    <div
      className={cn(
        "@container/main flex flex-1 flex-col gap-4 px-4 py-4 lg:px-6 lg:py-6",
        className
      )}
    >
      {children}
    </div>
  )
}
