"use client"

import * as React from "react"

type AdminFiltersOptions = {
  /**
   * When provided, filter values persist to `sessionStorage` under this key.
   * Useful for keeping search and filter state across page reloads. The
   * persisted values are merged on top of `defaults` on mount.
   */
  persistKey?: string
}

type AdminFiltersApi<T extends Record<string, unknown>> = {
  /** Current filter values. */
  values: T
  /** Type-safe setter for a single key. */
  set: <K extends keyof T>(key: K, value: T[K]) => void
  /** Resets all values to the initial `defaults`. */
  reset: () => void
  /** Number of keys whose current value differs from the default. */
  activeCount: number
}

function readPersisted<T>(persistKey: string | undefined, defaults: T): T {
  if (!persistKey || typeof window === "undefined") return defaults
  try {
    const raw = window.sessionStorage.getItem(persistKey)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<T>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

/**
 * Hook for filter-toolbar state. Replaces the 5-10 `useState` + manual
 * `onReset` pattern that every list page used to have. The `defaults`
 * argument is captured once on mount; later renders do not change it.
 *
 * When `options.persistKey` is set, filter values are mirrored to
 * `sessionStorage` so they survive reloads within the same tab.
 *
 * @example
 * const { values, set, reset, activeCount } = useAdminFilters(
 *   { query: "", status: "all", accountMode: "all" },
 *   { persistKey: "applications-filters" }
 * )
 */
export function useAdminFilters<T extends Record<string, unknown>>(
  defaults: T,
  options: AdminFiltersOptions = {}
): AdminFiltersApi<T> {
  const defaultsRef = React.useRef(defaults)
  const persistKeyRef = React.useRef(options.persistKey)
  const [values, setValues] = React.useState<T>(() =>
    readPersisted(persistKeyRef.current, defaults)
  )

  React.useEffect(() => {
    const key = persistKeyRef.current
    if (!key || typeof window === "undefined") return
    try {
      window.sessionStorage.setItem(key, JSON.stringify(values))
    } catch {
      // sessionStorage quota or disabled — ignore
    }
  }, [values])

  const set = React.useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }, [])

  const reset = React.useCallback(() => {
    setValues(defaultsRef.current)
  }, [])

  const activeCount = React.useMemo(() => {
    let count = 0
    for (const key in defaultsRef.current) {
      if (values[key] !== defaultsRef.current[key]) count += 1
    }
    return count
  }, [values])

  return { values, set, reset, activeCount }
}
