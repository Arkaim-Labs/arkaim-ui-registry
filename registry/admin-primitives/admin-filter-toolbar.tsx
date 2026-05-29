"use client"

import * as React from "react"
import { FilterIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type AdminFilterToolbarProps = {
  /** Accessible label for the search input. */
  searchLabel: string
  /** Placeholder text in the search input. */
  searchPlaceholder: string
  /** Controlled search value. */
  searchValue: string
  /** Called when the search input changes. */
  onSearchChange: (value: string) => void
  /** Called when the user clicks "Reset filters". Should reset all filter state. */
  onReset: () => void
  /** Number of active filters beyond search (drives badge and reset enable). */
  activeFilterCount?: number
  /** When true, additional filters collapse into a sheet (use for 5+ filters). */
  collapseFilters?: boolean
  /** Filter controls (NativeSelect, Input, etc) rendered next to the search. */
  children: React.ReactNode
  /** Extra utility classes appended to the toolbar wrapper. */
  className?: string
}

/**
 * Search + filter row above tables. Pair with `useAdminFilters` to manage
 * `searchValue`, `activeFilterCount` and `onReset` automatically.
 *
 * @example
 * const { values, set, reset, activeCount } = useAdminFilters({ query: "", status: "all" })
 * <AdminFilterToolbar
 *   searchLabel="Search users"
 *   searchPlaceholder="Search users..."
 *   searchValue={values.query}
 *   onSearchChange={(v) => set("query", v)}
 *   activeFilterCount={activeCount}
 *   onReset={reset}
 * >
 *   <NativeSelect value={values.status} onChange={(e) => set("status", e.target.value)}>...</NativeSelect>
 * </AdminFilterToolbar>
 */
export function AdminFilterToolbar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onReset,
  activeFilterCount = 0,
  collapseFilters = false,
  children,
  className,
}: AdminFilterToolbarProps) {
  const hasActiveState = activeFilterCount > 0 || searchValue.length > 0

  if (collapseFilters) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto_auto] sm:items-center",
          className
        )}
      >
        <div className="relative min-w-0 flex-[1_1_18rem]">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={searchLabel}
            className="pl-8"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <FilterIcon />
              Filters
              {activeFilterCount > 0 ? (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] leading-none text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-y-auto border-border/80"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 px-4 [&_[data-slot=native-select-wrapper]]:w-full">
              {children}
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={onReset}>
                Reset filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasActiveState}
          onClick={onReset}
        >
          Reset filters
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-[1_1_18rem]">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={searchLabel}
            className="pl-8"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        {children}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasActiveState}
        onClick={onReset}
      >
        Reset filters
      </Button>
    </div>
  )
}
