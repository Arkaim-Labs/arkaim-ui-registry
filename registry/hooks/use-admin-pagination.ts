import * as React from "react"

type UseAdminPaginationOptions = {
  pageSize?: number
  resetDeps?: React.DependencyList
}

export function useAdminPagination<T>(
  items: readonly T[],
  { pageSize = 6, resetDeps = [] }: UseAdminPaginationOptions = {}
) {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const paginatedItems = React.useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  )

  React.useEffect(() => {
    setPage(1)
  }, resetDeps)

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  return {
    items: paginatedItems,
    page,
    pageSize,
    setPage,
    totalPages,
  }
}
