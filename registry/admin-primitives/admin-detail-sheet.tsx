import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AdminDetailSheetTab = {
  /** Unique value identifying the tab; used by Radix Tabs internally. */
  value: string
  /** Visible label inside `TabsTrigger`. */
  label: React.ReactNode
  /** Tab body rendered inside `TabsContent`. */
  content: React.ReactNode
}

type AdminDetailSheetProps = {
  /** Controls the sheet visibility (controlled). Often `Boolean(record)`. */
  open: boolean
  /** Called when Radix requests open state change. */
  onOpenChange: (open: boolean) => void
  /** Sheet title text — usually the record name or id. */
  title: React.ReactNode
  /** Optional sub-title text under the title. */
  description?: React.ReactNode
  /** Tab definitions; if omitted, `children` is rendered instead. */
  tabs?: AdminDetailSheetTab[]
  /** Default selected tab value; defaults to the first tab. */
  defaultTab?: string
  /** Optional footer node — typically destructive or primary action button. */
  footer?: React.ReactNode
  /** Body when `tabs` is not provided. */
  children?: React.ReactNode
}

/**
 * Standard "detail" Sheet pattern: header + optional tabs + optional footer.
 * Provide `tabs` for tabbed detail views (Overview, Audit, etc) or
 * `children` for single-section content.
 *
 * @example
 * <AdminDetailSheet
 *   open={Boolean(record)}
 *   onOpenChange={(open) => !open && onClose()}
 *   title={record.name}
 *   description={record.id}
 *   tabs={[
 *     { value: "overview", label: "Overview", content: <Overview /> },
 *     { value: "audit", label: "Audit", content: <Audit /> },
 *   ]}
 *   footer={<Button variant="destructive">Delete</Button>}
 * />
 */
export function AdminDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  tabs,
  defaultTab,
  footer,
  children,
}: AdminDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="px-4">
          {tabs ? (
            <Tabs defaultValue={defaultTab ?? tabs[0]?.value} className="gap-4">
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-4"
                >
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            children
          )}
        </div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

export type { AdminDetailSheetTab }
