import { toast } from "sonner"

/** Shows a success toast with the given message. */
export function toastSuccess(message: string) {
  toast.success(message)
}

/**
 * Shows an error toast derived from any thrown value. Uses
 * `Error.message` when available; falls back to a generic string.
 */
export function toastError(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong"
  toast.error(message)
}

/**
 * Runs an async mutation with automatic success/error feedback. On
 * success, shows `successMessage`; on failure, shows the error and
 * re-throws so callers can keep their own error handling.
 *
 * @example
 * // Fire-and-forget action with feedback:
 * void toastMutation(() => api.deleteRole(id), "Role deleted")
 *
 * // Awaited action with downstream effects:
 * const created = await toastMutation(() => api.create(draft), "Created")
 * setSelectedId(created.id)
 */
export async function toastMutation<T>(
  fn: () => Promise<T>,
  successMessage: string
): Promise<T> {
  try {
    const result = await fn()
    toast.success(successMessage)
    return result
  } catch (error) {
    toastError(error)
    throw error
  }
}
