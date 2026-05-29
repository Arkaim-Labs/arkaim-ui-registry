"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AdminConfirmDialogProps = {
  /** Controls dialog visibility (controlled). */
  open: boolean
  /** Dialog title — the action being confirmed (e.g. "Delete role"). */
  title: string
  /** Explanation of consequences and reversibility. */
  description: string
  /** Label for the confirm button (e.g. "Delete", "Suspend"). */
  confirmLabel: string
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string
  /** Use "destructive" for delete/revoke/suspend; defaults to "default". */
  variant?: "default" | "destructive"
  /** Called when Radix requests open state change (ESC, overlay, cancel). */
  onOpenChange: (open: boolean) => void
  /** Called when the user confirms; dialog auto-closes after. */
  onConfirm: () => void
}

/**
 * Modal confirmation dialog for destructive or irreversible actions.
 * Renders with `role="alertdialog"` (via Radix) so screen readers
 * announce it immediately.
 *
 * @example
 * <AdminConfirmDialog
 *   open={Boolean(target)}
 *   title="Delete role"
 *   description={`Delete ${target?.name}? Members keep their organization access.`}
 *   confirmLabel="Delete"
 *   variant="destructive"
 *   onOpenChange={(open) => !open && setTarget(null)}
 *   onConfirm={() => target && deleteRole(target.id)}
 * />
 */
export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "default",
  onOpenChange,
  onConfirm,
}: AdminConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </AlertDialogCancel>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
