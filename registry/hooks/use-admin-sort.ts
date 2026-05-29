"use client"

import * as React from "react"

export type AdminSortDirection = "asc" | "desc"

export type AdminSortState<TKey extends string = string> = {
  key: TKey
  direction: AdminSortDirection
}

export type AdminSortApi<T, TKey extends string> = {
  /** Sorted items. */
  items: T[]
  /** Current sort key and direction; null when no sort is active. */
  sort: AdminSortState<TKey> | null
  /**
   * Toggle sort for a column key:
   * - first click → asc
   * - second click → desc
   * - third click → clear
   */
  toggle: (key: TKey) => void
  /** Get a header sort indicator: "asc" | "desc" | null. */
  directionFor: (key: TKey) => AdminSortDirection | null
}

type Accessor<T> = (item: T) => string | number | boolean | Date | null | undefined

function compare(a: ReturnType<Accessor<unknown>>, b: ReturnType<Accessor<unknown>>): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === "number" && typeof b === "number") return a - b
  if (typeof a === "boolean" && typeof b === "boolean") return a === b ? 0 : a ? -1 : 1
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" })
}

/**
 * Stateful sort hook for tables. Caller provides accessor functions per
 * sortable column key; the hook handles 3-state toggle (asc → desc → off)
 * and returns a stable sorted array.
 *
 * @example
 * const sort = useAdminSort(filtered, {
 *   name: (a) => a.name,
 *   created: (a) => a.createdAt,
 * })
 * <TableHead onClick={() => sort.toggle("name")}>Name {sort.directionFor("name")}</TableHead>
 * {sort.items.map((row) => ...)}
 */
export function useAdminSort<T, TKey extends string>(
  items: T[],
  accessors: Record<TKey, Accessor<T>>,
  defaultSort: AdminSortState<TKey> | null = null
): AdminSortApi<T, TKey> {
  const [sort, setSort] = React.useState<AdminSortState<TKey> | null>(defaultSort)

  const toggle = React.useCallback((key: TKey) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" }
      if (current.direction === "asc") return { key, direction: "desc" }
      return null
    })
  }, [])

  const directionFor = React.useCallback(
    (key: TKey): AdminSortDirection | null =>
      sort && sort.key === key ? sort.direction : null,
    [sort]
  )

  const sorted = React.useMemo(() => {
    if (!sort) return items
    const accessor = accessors[sort.key]
    const direction = sort.direction === "asc" ? 1 : -1
    return [...items].sort((a, b) => compare(accessor(a), accessor(b)) * direction)
  }, [items, sort, accessors])

  return { items: sorted, sort, toggle, directionFor }
}
