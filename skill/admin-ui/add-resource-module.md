# Workflow: add a resource module

A "resource module" is one domain entity (Users, Invoices, Applications, Roles…)
presented as a **list page + detail sheet + register/edit sheet**. This is the unit
the admin is built from. Follow these steps when the user asks to add a module.

Read [`design-contract.md`](../../design-contract.md) §5 (layout) and §6 (mandatory
states) first. The skeleton below is the contract made concrete — adapt names and
columns, do not remove states.

## 1. Gather the shape

Ask only what you can't infer:

- Resource name (singular + plural) and API path.
- The list columns and which are sortable.
- The filters/facets (besides free-text search).
- The detail fields, grouped into sections if there are many.
- The create/edit fields and their validation.
- Permission keys gating create / edit / delete, if any.

## 2. Install primitives

```bash
npx shadcn add <base>/r/admin-page-layout.json <base>/r/admin-page-header.json \
  <base>/r/admin-surfaces.json <base>/r/admin-filter-toolbar.json \
  <base>/r/admin-pagination-footer.json <base>/r/admin-sortable-head.json \
  <base>/r/admin-skeletons.json <base>/r/admin-state.json \
  <base>/r/admin-status-badge.json <base>/r/admin-detail-sheet.json \
  <base>/r/admin-register-sheet.json <base>/r/admin-form-field.json \
  <base>/r/admin-field-card.json <base>/r/admin-confirm-dialog.json \
  <base>/r/admin-timestamp.json <base>/r/admin-truncated-text.json \
  <base>/r/use-admin-filters.json <base>/r/use-admin-selection.json \
  <base>/r/use-admin-pagination.json <base>/r/admin-api.json <base>/r/admin-toast.json
```

(`use-admin-sort` arrives with `admin-sortable-head`.)

## 3. Page skeleton

```tsx
// src/components/<resource>-page.tsx
import { useEffect, useState } from "react"

import { AdminPageLayout } from "@/components/admin-page-layout"
import { AdminPageHeader } from "@/components/admin-page-header"
import { AdminTableSurface } from "@/components/admin-surfaces"
import { AdminFilterToolbar } from "@/components/admin-filter-toolbar"
import { AdminPaginationFooter } from "@/components/admin-pagination-footer"
import { AdminSortableHead } from "@/components/admin-sortable-head"
import { AdminTableSkeleton } from "@/components/admin-skeletons"
import { AdminState } from "@/components/admin-state"
import { AdminStatusBadge } from "@/components/admin-status-badge"
import { AdminTimestamp } from "@/components/admin-timestamp"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAdminFilters } from "@/hooks/use-admin-filters"
import { useAdminSort } from "@/hooks/use-admin-sort"
import { useAdminPagination } from "@/hooks/use-admin-pagination"
import { createResourceApi } from "@/lib/admin-api"
import { rowActivationHandler } from "@/lib/admin-keyboard"

const api = createResourceApi("/admin/<resource>")

export function <Resource>Page() {
  const filters = useAdminFilters({ search: "" })
  const sort = useAdminSort({ column: "createdAt", direction: "desc" })
  const pagination = useAdminPagination()
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [rows, setRows] = useState<Row[]>([])
  const [selected, setSelected] = useState<Row | null>(null)

  useEffect(() => {
    setState("loading")
    api.list({ ...filters.values, ...sort.value, ...pagination.value })
      .then((res) => { setRows(res.items); setState("ready") })
      .catch(() => setState("error"))
  }, [filters.values, sort.value, pagination.value])

  return (
    <AdminPageLayout
      header={
        <AdminPageHeader
          title="<Resource plural>"
          description="<one calm sentence>"
          primaryAction={{ label: "New <resource>", onClick: openRegister }}
        />
      }
    >
      <AdminFilterToolbar search={filters.search} onSearchChange={filters.setSearch}>
        {/* facets: NativeSelect / toggle group bound to filters.setX */}
      </AdminFilterToolbar>

      <AdminTableSurface>
        {state === "loading" ? (
          <AdminTableSkeleton rows={8} columns={5} />
        ) : state === "error" ? (
          <AdminState variant="error" onRetry={refetch} />
        ) : rows.length === 0 ? (
          <AdminState variant={filters.isFiltered ? "no-results" : "empty"} action={...} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <AdminSortableHead sort={sort} column="name">Name</AdminSortableHead>
                <TableHead>Status</TableHead>
                <AdminSortableHead sort={sort} column="createdAt">Created</AdminSortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  tabIndex={0}
                  onClick={() => setSelected(row)}
                  onKeyDown={rowActivationHandler(() => setSelected(row))}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell><AdminStatusBadge status={row.status} /></TableCell>
                  <TableCell><AdminTimestamp value={row.createdAt} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AdminTableSurface>

      {state === "ready" && rows.length > 0 && (
        <AdminPaginationFooter pagination={pagination} total={total} />
      )}

      {/* <Resource>DetailSheet bound to `selected` */}
      {/* <Resource>RegisterSheet bound to the create/edit form */}
    </AdminPageLayout>
  )
}
```

## 4. Detail + register sheets

- **Detail** — wrap `AdminDetailSheet` (tabbed if the record has sections). Render
  each field as an `AdminFieldCard`. Read-only.
- **Register/edit** — wrap `AdminRegisterSheet` around a form of `AdminFormField`s.
  Submit through `toastMutation(api.create(...) | api.update(id, ...))`. Destructive
  buttons open `AdminConfirmDialog` first.

## 5. Wire into the shell

Add a nav item (key, title, url, lucide icon) to the `groups` passed to
`AppSidebar`. Gate it with `visibleKeys` if the module is permissioned.

## 6. Lint

Run the contract lint before finishing:

```bash
node skill/admin-ui/lint/contract-lint.mjs src
```

Fix every error. See [`lint/README.md`](./lint/README.md) for what it checks and
the rules it can't check mechanically.
