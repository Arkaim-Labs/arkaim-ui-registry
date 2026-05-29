import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type AdminFormFieldProps = {
  /** ID of the control rendered as `children`; binds the label. */
  htmlFor: string
  /** Visible label rendered above the control. */
  label: React.ReactNode
  /** The form control (Input, NativeSelect, Textarea, Checkbox, etc). */
  children: React.ReactNode
  /** Optional helper text shown beneath the control. */
  description?: React.ReactNode
  /** Extra utility classes appended to the wrapper grid. */
  className?: string
}

/**
 * Standard label-over-control form field. Wraps shadcn `Label` and the
 * control in a `grid gap-2` and renders an optional description below.
 *
 * @example
 * <AdminFormField htmlFor="name" label="Name" description="Visible to admins">
 *   <Input id="name" value={draft.name} onChange={...} />
 * </AdminFormField>
 */
export function AdminFormField({
  htmlFor,
  label,
  children,
  description,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
