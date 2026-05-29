"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type AdminCommandItem = {
  /** Stable id used for keys. */
  id: string
  /** Short label shown as the main item text. */
  label: string
  /** Optional secondary text (e.g. URL or hint). */
  hint?: string
  /** Optional icon shown before the label. */
  icon?: React.ReactNode
  /** Optional group label. Items with the same group are rendered together. */
  group?: string
  /** Called when the user picks this item. */
  onSelect: () => void
}

type AdminCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: AdminCommandItem[]
  placeholder?: string
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

function fuzzyMatch(item: AdminCommandItem, query: string): boolean {
  if (!query) return true
  const needle = normalize(query)
  return (
    normalize(item.label).includes(needle) ||
    (item.hint ? normalize(item.hint).includes(needle) : false) ||
    (item.group ? normalize(item.group).includes(needle) : false)
  )
}

/**
 * Command palette modal. Filters items as the user types, navigates with
 * arrow keys, selects with Enter, closes with Esc. Intended for global
 * navigation and quick actions; pair with a Cmd/Ctrl+K listener.
 *
 * @example
 * const [open, setOpen] = React.useState(false)
 * <AdminCommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   items={routes.map(r => ({ id: r.key, label: r.title, hint: r.url, onSelect: () => { window.location.hash = r.url } }))}
 * />
 */
export function AdminCommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Type a command or search...",
}: AdminCommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  const filtered = React.useMemo(
    () => items.filter((item) => fuzzyMatch(item, query)),
    [items, query]
  )

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
    }
  }, [open])

  React.useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(Math.max(filtered.length - 1, 0))
    }
  }, [activeIndex, filtered.length])

  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    node?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % Math.max(filtered.length, 1))
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => {
        const length = Math.max(filtered.length, 1)
        return (current - 1 + length) % length
      })
      return
    }
    if (event.key === "Enter") {
      event.preventDefault()
      const item = filtered[activeIndex]
      if (item) {
        item.onSelect()
        onOpenChange(false)
      }
    }
  }

  // Group items keeping their original order.
  const grouped = React.useMemo(() => {
    const groups: { label: string | undefined; items: AdminCommandItem[] }[] = []
    for (const item of filtered) {
      const last = groups[groups.length - 1]
      if (last && last.label === item.group) {
        last.items.push(item)
      } else {
        groups.push({ label: item.group, items: [item] })
      }
    }
    return groups
  }, [filtered])

  let runningIndex = 0

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/35 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        <DialogPrimitive.Content
          aria-label="Command palette"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus()
          }}
          onKeyDown={handleKeyDown}
          className="fixed left-1/2 top-[12vh] z-50 w-[min(94vw,38rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <div className="flex items-center gap-2 border-b border-border/70 px-3">
            <SearchIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              placeholder={placeholder}
              aria-label="Command query"
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border/70 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground sm:inline">
              esc
            </kbd>
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results.
            </div>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[60vh] overflow-y-auto py-1"
            >
              {grouped.map((group) => (
                <React.Fragment key={group.label ?? "default"}>
                  {group.label ? (
                    <li
                      role="presentation"
                      className="px-3 pt-3 pb-1 font-mono text-[0.65rem] uppercase tracking-normal text-muted-foreground"
                    >
                      {group.label}
                    </li>
                  ) : null}
                  {group.items.map((item) => {
                    const index = runningIndex++
                    const active = index === activeIndex
                    return (
                      <li
                        key={item.id}
                        role="option"
                        aria-selected={active}
                        data-index={index}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          item.onSelect()
                          onOpenChange(false)
                        }}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                          active ? "bg-muted text-foreground" : "text-foreground"
                        )}
                      >
                        {item.icon ? (
                          <span aria-hidden="true" className="flex size-4 items-center justify-center text-muted-foreground [&>svg]:size-4">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hint ? (
                          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                            {item.hint}
                          </span>
                        ) : null}
                      </li>
                    )
                  })}
                </React.Fragment>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between border-t border-border/70 px-3 py-2 text-[0.65rem] text-muted-foreground">
            <div className="flex items-center gap-3 font-mono">
              <span><kbd className="rounded border border-border/70 px-1">↑</kbd> <kbd className="rounded border border-border/70 px-1">↓</kbd> navigate</span>
              <span><kbd className="rounded border border-border/70 px-1">↵</kbd> select</span>
            </div>
            <span className="font-mono">{filtered.length} {filtered.length === 1 ? "match" : "matches"}</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
