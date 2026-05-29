"use client"

import * as React from "react"

type AdminSelectionOptions = {
  /**
   * When provided, the selected id is mirrored to `window.location.hash`
   * as `#<syncHash>/<id>`. Loading a URL with this shape pre-selects the
   * matching record; calling `close()` strips the id back to `#<syncHash>`.
   */
  syncHash?: string
}

type AdminSelectionApi<T> = {
  /** Currently selected id; null when nothing is selected. */
  selectedId: string | null
  /** Currently selected record; undefined when not found. */
  selected: T | undefined
  /** Select a record by id, or pass `null` to clear. */
  select: (id: string | null) => void
  /** Convenience: same as `select(null)`. */
  close: () => void
}

function readHashId(syncHash: string | undefined): string | null {
  if (!syncHash || typeof window === "undefined") return null
  const hash = window.location.hash.replace(/^#/, "")
  const [page, ...rest] = hash.split("/")
  if (page !== syncHash) return null
  const id = rest.join("/")
  return id ? id : null
}

function writeHashId(syncHash: string | undefined, id: string | null) {
  if (!syncHash || typeof window === "undefined") return
  const next = id ? `${syncHash}/${id}` : syncHash
  const current = window.location.hash.replace(/^#/, "")
  if (current === next) return
  // Use replaceState to avoid polluting history with every selection change.
  window.history.replaceState(null, "", `#${next}`)
}

/**
 * Hook for the detail-sheet selection pattern. Replaces the
 * `selectedXxxId` + `selectedXxx` + `setSelectedXxxId` triplet that
 * every list page used to repeat by hand.
 *
 * When `options.syncHash` is set, the selected id is reflected in the
 * URL hash as `#<syncHash>/<id>`. Loading a URL with that shape
 * pre-selects the matching record.
 *
 * @example
 * const { selected, select, close } = useAdminSelection(applications, {
 *   syncHash: "applications",
 * })
 * <ApplicationDetailSheet
 *   application={selected}
 *   onClose={close}
 * />
 * <TableRow onClick={() => select(app.id)}>...</TableRow>
 */
export function useAdminSelection<T extends { id: string }>(
  items: T[],
  options: AdminSelectionOptions = {}
): AdminSelectionApi<T> {
  const syncHashRef = React.useRef(options.syncHash)
  const [selectedId, setSelectedId] = React.useState<string | null>(() =>
    readHashId(syncHashRef.current)
  )

  React.useEffect(() => {
    const syncHash = syncHashRef.current
    if (!syncHash || typeof window === "undefined") return

    const onHashChange = () => {
      const id = readHashId(syncHash)
      setSelectedId(id)
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const selected = React.useMemo(
    () => (selectedId ? items.find((item) => item.id === selectedId) : undefined),
    [items, selectedId]
  )

  const select = React.useCallback((id: string | null) => {
    setSelectedId(id)
    writeHashId(syncHashRef.current, id)
  }, [])

  const close = React.useCallback(() => {
    setSelectedId(null)
    writeHashId(syncHashRef.current, null)
  }, [])

  return { selectedId, selected, select, close }
}
