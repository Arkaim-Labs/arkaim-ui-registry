import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type AdminRegisterSheetProps = {
  /** Controls the sheet visibility (controlled component). */
  open: boolean
  /** Called when Radix requests open state change (overlay click, ESC, close). */
  onOpenChange: (open: boolean) => void
  /** Sheet title text. */
  title: React.ReactNode
  /** Optional sub-title text under the title. */
  description?: React.ReactNode
  /** Text or node for the submit button (e.g. "Register plan"). */
  submitLabel: React.ReactNode
  /** Optional icon rendered before `submitLabel` inside the button. */
  submitIcon?: React.ReactNode
  /** Disables the submit button when draft is invalid. */
  submitDisabled?: boolean
  /** Form submit handler; receives the native submit event. */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  /** Form body — AdminFormField, AdminFieldCard or arbitrary inputs. */
  children: React.ReactNode
}

/**
 * Standard "register/create" Sheet pattern: header + form body + submit
 * footer. Wraps the children in a `<form>` and a vertical flex container
 * so the footer sticks to the bottom.
 *
 * @example
 * <AdminRegisterSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Register plan"
 *   submitLabel="Register plan"
 *   submitDisabled={!draft.name.trim()}
 *   onSubmit={handleSubmit}
 * >
 *   <AdminFormField htmlFor="plan-name" label="Name">...</AdminFormField>
 * </AdminRegisterSheet>
 */
export function AdminRegisterSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submitIcon,
  submitDisabled,
  onSubmit,
  children,
}: AdminRegisterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="grid gap-4 p-4">{children}</div>
          <SheetFooter>
            <Button type="submit" disabled={submitDisabled}>
              {submitIcon}
              {submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
