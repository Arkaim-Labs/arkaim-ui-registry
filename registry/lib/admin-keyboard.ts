import type * as React from "react"

/**
 * Returns an `onKeyDown` handler that activates the focused element when
 * the user presses Enter or Space — the standard "button-like" pattern
 * for `tabIndex={0}` table rows. Ignores keystrokes that originated from
 * a nested interactive element.
 *
 * @example
 * <TableRow
 *   tabIndex={0}
 *   onClick={() => select(row.id)}
 *   onKeyDown={rowActivationHandler(() => select(row.id))}
 * />
 */
export function rowActivationHandler(activate: () => void) {
  return (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      activate()
    }
  }
}
