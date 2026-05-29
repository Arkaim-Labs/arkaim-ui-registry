import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type AdminPaginationFooterProps = {
  /** Current 1-indexed page. */
  page: number
  /** Total number of pages. */
  totalPages: number
  /** Number of items currently visible on this page. */
  visibleCount: number
  /** Total number of items across all pages. */
  totalCount: number
  /** Pluralized noun for the counter (e.g. "users", "events"). */
  label: string
  /** Hash href for pagination links (e.g. "#applications"). */
  href: string
  /** Items per page; used to compute the visible range. Defaults to 6. */
  pageSize?: number
  /** Called with the new 1-indexed page when the user navigates. */
  onPageChange: (page: number) => void
}

/**
 * Standard pagination footer below tables. Pair with `useAdminPagination`
 * which provides `page`, `totalPages`, `pageSize` and `setPage`.
 *
 * @example
 * const { items, page, pageSize, setPage, totalPages } = useAdminPagination(filtered)
 * <AdminPaginationFooter
 *   page={page}
 *   totalPages={totalPages}
 *   visibleCount={items.length}
 *   totalCount={filtered.length}
 *   label="users"
 *   href="#identities"
 *   pageSize={pageSize}
 *   onPageChange={setPage}
 * />
 */
export function AdminPaginationFooter({
  page,
  totalPages,
  visibleCount,
  totalCount,
  label,
  href,
  pageSize = 6,
  onPageChange,
}: AdminPaginationFooterProps) {
  const firstVisible = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const lastVisible = Math.min(firstVisible + visibleCount - 1, totalCount)
  const pageNumbers = getVisiblePageNumbers(page, totalPages)

  return (
    <div className="flex flex-col gap-3 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
      <span>
        {firstVisible}-{lastVisible} of {totalCount} {label}
      </span>
      <Pagination className="md:mx-0 md:w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={href}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.max(1, page - 1))
              }}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {pageNumbers.map((pageNumber, index) =>
            pageNumber === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={href}
                  isActive={pageNumber === page}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(pageNumber)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href={href}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.min(totalPages, page + 1))
              }}
              aria-disabled={page === totalPages}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function getVisiblePageNumbers(
  page: number,
  totalPages: number
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const normalized = [...pages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((left, right) => left - right)

  return normalized.flatMap((pageNumber, index) => {
    const previous = normalized[index - 1]
    if (previous !== undefined && pageNumber - previous > 1) {
      return ["ellipsis" as const, pageNumber]
    }
    return [pageNumber]
  })
}
