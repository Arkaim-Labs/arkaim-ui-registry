# Admin UI Design Contract

Version: 1.0.0
Status: Draft

This document is the normative source of truth for the Admin UI Design
System. Any panel built with this registry or scaffolded by the
companion Claude Code skill must respect this contract. Components are
distributed as code (shadcn-style "you own the code") — the contract
governs how that code should look, behave, and be composed.

The contract is intentionally opinionated. Its purpose is to make
internal admin and operations panels feel coherent across projects, not
to be a generic UI kit for marketing sites or consumer apps.

---

## 1. Scope

**In scope**

- Internal admin and operations panels.
- Authenticated, role-scoped dashboards.
- CRUD-heavy modules: users, organizations, billing, audit logs,
  notifications, configuration.
- Tools used by engineers, support, finance, and operations staff.

**Out of scope**

- Marketing and landing pages.
- Consumer-facing applications.
- Mobile-first experiences (mobile-responsive is supported; mobile-first
  is not).
- Illustration-heavy or animation-heavy product surfaces.

If a project wants any of the out-of-scope items, this contract is the
wrong fit. Pick a generic design system instead.

---

## 2. Visual contract

The visual identity is **dark first, dense, low-contrast, editorial**.
It looks closer to a terminal-meets-newspaper than to a consumer SaaS
landing.

The non-negotiables:

1. **Dark first.** A single dark theme is shipped. A light theme is
   optional, off by default, and must keep the same token semantics.
2. **Dense by default.** Page padding is `4` on small viewports, `6`
   from `lg` upwards. Card padding is `3`. Tables use a 9-12px vertical
   rhythm. There is no padding scale above `6`.
3. **Low contrast for chrome.** Borders are at `9-11%` opacity over
   black. Surfaces are barely lighter than the background. The eye is
   guided by typography and intent color, not by box outlines.
4. **Editorial typography.** Serif display for titles and large
   numbers, sans for UI body, mono for identifiers and timestamps. The
   serif+sans+mono mix is the signature of the system.
5. **Intent color is rare.** Primary lime accent is used for the active
   sidebar item, focus rings, primary action buttons, and success
   indicators. Warning yellow, danger red, info blue are reserved for
   operational state. Nothing else is colored.
6. **No decoration.** No gradients on chrome surfaces. No drop shadows
   beyond `shadow-sm` on popovers/sheets. No background images. No
   illustrations. No animated orbs.
7. **No hero sections.** The admin starts at the first useful surface
   (page header + content) immediately below the topbar. There is no
   marketing splash anywhere.
8. **No nested cards.** A `Card` does not contain another `Card`. A
   `Panel` does not contain another `Panel`. Sections inside a card use
   dividers or labels, not nested borders.

### What NOT to do (visually)

- Hero blocks with oversized centered text.
- Gradient backdrops, "aurora" effects, or animated mesh backgrounds.
- Stock-photo or illustration-driven empty states.
- Typography that scales with the viewport width.
- Muted text for critical numbers (balance, MRR, error counts).
- Cards inside cards inside cards.
- Color used for decoration instead of operational intent.

---

## 3. Token system

Tokens are **semantic**, not color-named. Components reference
`bg-card`, never `bg-zinc-900`. The actual hex values are
implementation details that may change between versions of the design
contract.

### 3.1 Surfaces

| Token                           | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `--background`                  | Page background — the deepest surface.                           |
| `--foreground`                  | Primary text color over `--background`.                          |
| `--card` / `--card-foreground`  | Card and panel surface + its text color.                         |
| `--popover` / `--popover-foreground` | Popovers, dropdown menus, command palette.                  |
| `--form`                        | Inputs and textareas background (slightly distinct from card).   |
| `--modal`                       | Modal sheet/dialog background.                                   |
| `--table`                       | Table container background.                                      |
| `--topbar`                      | Site header background.                                          |
| `--sidebar` + `*-foreground`    | Sidebar background and its text color.                           |
| `--muted` / `--muted-foreground`| Subtle surfaces and supporting text.                             |
| `--border`                      | Default border, low opacity.                                     |
| `--input`                       | Input border, slightly stronger than `--border`.                 |
| `--ring`                        | Focus ring color (same hue as `--primary`).                      |

### 3.2 Intent colors

| Token         | Use                                                                        |
| ------------- | -------------------------------------------------------------------------- |
| `--primary`   | Primary CTA, active nav item, focus ring, "ok/success" emphasis.           |
| `--success`   | Healthy state, completed action.                                           |
| `--warning`   | Degraded state, retryable failure, pending review.                         |
| `--danger`    | Destructive action, hard failure, denied authorization.                    |
| `--info`      | Neutral informational signal (e.g. invited, sending, queued).              |
| `--destructive` | Equivalent to `--danger`, kept for shadcn compatibility.                 |

Each intent color **must** ship with three variants:

- The base color (`--success`, `--warning`, ...).
- A muted background variant (`--success-background`) at ~10% alpha.
- A muted border variant (`--success-border`) at ~30% alpha.

Utilities exposed by the registry: `bg-<intent>-muted`,
`border-<intent>`, `text-<intent>`. No other intent-derived utilities
are sanctioned.

### 3.3 Charts

`--chart-1` through `--chart-5` are reserved for data visualization
when the panel ships any. They must be visually distinguishable for the
most common color-vision deficiencies; the default palette already is.

### 3.4 Radius scale

A single `--radius` (default `0.5rem`) drives the full scale via
`calc()`. Components use the named radii (`--radius-sm` ... `--radius-4xl`)
exclusively. Do not hardcode `border-radius` in components.

---

## 4. Typography

Three families. Mixing them is the system signature.

| Family                | Token                   | Used for                                                          |
| --------------------- | ----------------------- | ----------------------------------------------------------------- |
| **Instrument Serif** | `--admin-font-display` | `<h1>` page titles, oversized metric values (4xl+), editorial UI. |
| **Geist**             | `--admin-font-sans`    | Body text, navigation, form controls, button labels.              |
| **JetBrains Mono**   | `--admin-font-mono`    | Identifiers (record id, key, hash), timestamps, code, terminals.  |

### Rules

- A page title is rendered with `font-serif`, weight `medium` (500), at
  the `3xl` step. Do not bold it. Do not use serif for body copy.
- Large metric values inside `AdminMetricCard` use `font-serif` at the
  `4xl` step with `tabular-nums`.
- Anything that the user might want to copy, search, or reference by
  hand — record IDs, keys, hashes, timestamps, raw paths, queue
  identifiers — uses `font-mono` at `xs` (and `tracking-normal`).
- Body copy is `font-sans` at the `sm` step. Descriptions on the page
  header are muted (`text-muted-foreground`).
- Numbers in body copy use `tabular-nums` when they appear in tables or
  comparable lists.

### What NOT to do (typographically)

- Do not introduce a fourth family. The three already shipped are the
  full system.
- Do not use serif for paragraphs or for any text that is not editorial.
- Do not use mono for human-language labels.
- Do not use weight-700 anywhere. The system is `medium` (500) and
  `regular` (400). Bold is reserved for very rare emphasis.

---

## 5. Layout pattern

Every page is a thin shell around a vertical flex container with the
same chrome:

```
<AppSidebar>
  <SidebarInset>
    <SiteHeader/>
    <AdminPageLayout>
      <AdminPageHeader title=... description=... action=... onRefresh=.../>
      [<AlertBanner/>]            // optional, conditional on signals
      [<AdminMetricGrid>...</AdminMetricGrid>]   // optional KPIs
      [<AdminFilterToolbar>...]   // for list pages
      [<AdminTableSurface>...]    // or <AdminPanel> for non-tabular
      [<AdminPaginationFooter/>]
      [<DetailSheet/>] [<RegisterSheet/>] [<ConfirmDialog/>]  // overlays
    </AdminPageLayout>
  </SidebarInset>
</AppSidebar>
```

### Required pieces, in order

1. **`AdminPageLayout`** — the outer container that provides the
   `@container/main`, `flex-1`, vertical flex, gap, and responsive
   padding. Every page uses it.
2. **`AdminPageHeader`** — title (`<h1>`, serif), description (muted
   sans), optional eyebrow, refresh button (auto-rendered when
   `onRefresh` is passed), and an action slot for primary CTA.
3. **Page body** — composition of the primitives below.

### Optional pieces, in the order they appear when used

1. **Alert banner** — yellow/red banner with actionable CTA. Only
   shown when an operational signal is true (failed deliveries,
   degraded queue, past-due invoices). Never decorative.
2. **`AdminMetricGrid`** — responsive KPI grid; each cell is an
   `AdminMetricCard`. Metric values must be numeric or short. Config
   strings ("enabled", "on", "resend") **are not metrics**.
3. **`AdminFilterToolbar`** — search input + filter selects + reset
   button. Use the `collapseFilters` mode when more than four extra
   filters exist.
4. **Tab strip** (`<Tabs>`) — only when the page has 2-4 sibling
   resources (Users + Sessions, Roles + Memberships, Plans +
   Subscriptions + Invoices). Each tab label carries the count.
5. **`AdminTableSurface`** — wraps the table. Inside, handle the four
   mandatory states via `AdminState`.
6. **`AdminPaginationFooter`** — paginated tables always end with it.
7. **Sheets, dialogs, palettes** — overlays declared at the bottom of
   the page, regardless of visual placement.

---

## 6. Mandatory states

Every list, every detail view, every form must declare all of these.
There is no "happy path only" path.

| State            | Component                                          |
| ---------------- | -------------------------------------------------- |
| Loading          | `AdminState variant="loading"` or skeleton.        |
| Empty (no data)  | `AdminState variant="empty"` **with a CTA** when state is initial. |
| Empty (filters)  | `AdminState variant="empty"` with "Reset filters" action. |
| Error            | `AdminState variant="error"` with a retry action.  |
| Forbidden        | `AdminState variant="forbidden"`.                  |
| Disabled         | The action element shows `disabled` plus a hint or `aria-describedby`. |
| Mutation pending | The triggering control disables and a `toast`/banner conveys progress. |

Empty states distinguish between **initial empty** ("you have no
applications yet — register your first one") and **filtered empty**
("no applications match these filters — reset?"). Generic "Nothing
found" is not enough.

Loading uses `role="status"` + `aria-live="polite"` + `aria-busy="true"`.
Error uses `role="alert"`. Both are provided by `AdminState`.

---

## 7. Interaction patterns

### 7.1 Tables

- Each row is **focusable** (`tabIndex={0}`) with an `aria-label`
  describing the activation target ("Open application Acme details").
- Activation handler accepts **Enter and Space**, ignores events from
  nested interactive elements. Use `rowActivationHandler` (provided).
- Truncated cells use `AdminTruncatedText` so the full value is
  revealed on hover/focus when it actually overflows.
- Sortable columns wrap their header in `AdminSortableHead`. Sort is a
  three-state toggle: asc → desc → off. Sort state lives in
  `useAdminSort`.
- Bulk-action tables add a leading checkbox column. The header
  checkbox supports `indeterminate`. A context bar appears above the
  table when `selectedCount > 0`.

### 7.2 Detail and register sheets

- **Detail** = read-mostly with inline edit. Use `AdminDetailSheet`.
  Tabs declared as `{ value, label, content }`. Footer slot is for a
  destructive or primary terminal action (Delete, Suspend, Cancel).
- **Register** = create a new record. Use `AdminRegisterSheet`. It
  wraps children in a `<form>`. Submit button is in the footer; pass
  `submitDisabled` for client-side validation.
- Both sheets restore focus to the trigger when closed (Radix handles
  it). Esc closes. Click-outside closes only when there are no unsaved
  changes (the consumer enforces this — the registry does not).

### 7.3 Confirm dialogs

- Use `AdminConfirmDialog` for every destructive or irreversible
  action (delete, suspend, void, cancel, log out, revoke).
- `variant="destructive"` for delete/suspend/void/revoke.
- Description must state **consequences and reversibility**, not just
  rephrase the title.
- A confirmed action shows a `toastSuccess`; a rejected one shows a
  `toastError` carrying the API error message.

### 7.4 Toasts

- Sonner is the only toast library.
- Use `toastMutation(fn, "X created")` for create / explicit-action
  mutations. Field-level live-save uses `fn().catch(toastError)`.
- Never queue more than one toast per user gesture.
- Toasts are **bottom-right**, `richColors`.

### 7.5 Forms

- Every input has a visible `<Label>` or an `aria-label`. Never both.
- Use `AdminFormField` to compose label + control + optional
  description.
- Validation is done at submit time, not on each keystroke, unless the
  validation is cheap and the form is short (e.g., key normalization).
- Error messages live below the field that triggered them.
- `Save changes` buttons disable when there are no unsaved changes
  and switch their label to `Saved` when the form is clean. The
  Settings page also installs a `beforeunload` warning while dirty.

### 7.6 Deep linking

- Page-level navigation is hash-based: `#applications`, `#audit-logs`.
- Record-level deep links use `#<page>/<id>`. The selection hook
  (`useAdminSelection`) handles the bidirectional sync.
- Bookmarking a specific record opens its detail sheet on load.

### 7.7 Command palette

- Bind `Cmd/Ctrl+K` to open `AdminCommandPalette`.
- Items group by sidebar section. Include account-level shortcuts
  (User account, Log out) below the navigation items.
- Filter is fuzzy over label, hint, and group. ArrowUp/ArrowDown
  navigate, Enter selects, Esc closes.

---

## 8. Accessibility

The contract assumes WCAG 2.1 AA as the floor.

- Color contrast: 4.5:1 for body, 3:1 for large text and UI components.
- Focus: visible at all times via `focus-visible:ring-2 ring-ring`.
  Never disable focus rings.
- Sidebar exposes `aria-label="Primary navigation"`.
- Icon-only buttons (more menu, close, copy) **must** have
  `aria-label`. The registry's audit ensures none are missed.
- Decorative icons (status dots, leading bullets in feed items)
  carry `aria-hidden="true"`.
- Time values render via `AdminTimestamp`, which exposes the absolute
  timestamp via tooltip while showing the relative or absolute label.
- Live regions: loading → `role="status"`; error → `role="alert"`;
  in-flight async work toggles `aria-busy`.
- Keyboard navigation must reach every interactive element. Modal
  surfaces (sheets, dialogs, palette) trap focus while open and
  release it on close.

---

## 9. Permissions

- Page-level permissions are declared in a single map
  (`pagePermissions`) keyed by route. The sidebar filters by it.
- **Hiding a page in the sidebar is never enough**. The API must
  enforce the same permission. The UI hide is a courtesy.
- Manage-level permissions (`canManage<Resource>`) gate the
  destructive/mutating actions inside a page. Read-only roles see a
  banner explaining they can read but not save.
- When a forbidden record is reached via URL (deep link, bookmark, or
  shared link), render `AdminState variant="forbidden"` with a clear
  next step ("Request access from your admin").

---

## 10. Data layer

The registry is **data-agnostic**. It does not assume any specific
backend, fetcher, or query library.

- Every hook in the registry accepts a `fetcher` argument or uses
  `createResourceApi(basePath, fetcher)`.
- `createResourceApi` returns `{ get, post, patch, del, request }`. Its
  default `fetcher` is the consuming project's; the registry does not
  ship one.
- Errors that the API returns as JSON `{ "error": "..." }` or
  `{ "message": "..." }` are surfaced through the toast and inline
  states.
- Mutations use optimistic UI **only** when the API returns the full
  updated record and a rollback path is implemented. Otherwise, wait
  for the response and toast on completion. Optimistic stubs (fake
  timestamps, hardcoded audit entries) are forbidden.

---

## 11. Naming and copy

### Code

- Component, hook, type, route, and field names are in **English**.
- No transliteration of non-English domain terms into English. If the
  business concept is "membresía", the type is `Membership`, not
  `Membresia`.

### Visible copy

- Visible copy lives in the consumer project's language. The registry
  ships English defaults; replace at the call site.
- Default action verbs are: Register, Invite, Reactivate, Suspend,
  Delete, Cancel, Void, Revoke. They are uniform across the system.
- Module names in the sidebar are **nouns** in title case (Applications,
  Identities, Plans & Billing). They are not localized in the registry
  default.

---

## 12. Operational tone

The system claims it is **operational software, not a demo**. Every
visible affordance must reflect that.

- Buttons that mutate state must call a real backend with a real
  permission check. A button that does nothing, sets local-only state,
  or has no backing endpoint must not exist.
- "Metric" cards show numbers or short status that the API returns. A
  card whose value is "on" or "enabled" or a provider name is a
  configuration chip, not a metric, and must move to the header.
- Sparklines, charts, and graphs only when the backend ships real
  series. Decorative sparklines derived from arrays of booleans are
  forbidden.
- Hardcoded sample timestamps ("2025-01-01") in optimistic updates,
  fake "last seen" values, or stub audit entries are forbidden.
- The Help page either ships actionable content (shortcuts, version,
  status, contact) or is removed from the sidebar.

---

## 13. What goes inside a `wrappers/` folder

Each consumer project will inevitably need composition-level
customizations: a custom column in a table, a project-specific
permission chip, an extra panel on the Overview. The convention:

- Registry primitives are imported and composed at the call site —
  never modified in place.
- Project-specific composites live in `apps/<project>/src/components/`
  and import from the registry.
- If the same composite emerges in three or more consumer projects,
  it is a candidate for the next registry minor release.

---

## 14. What goes inside the registry

The registry ships, by category:

1. **Tokens** — the CSS file with the `:root` variables and the
   `@theme inline` block. The consumer copies it into their global
   stylesheet.
2. **UI overrides** — shadcn primitives that we override (Button,
   Input, NativeSelect, Sheet, Tabs, Table, Badge, Textarea,
   AlertDialog, Pagination, Checkbox, Tooltip, DropdownMenu).
3. **Admin primitives** — the `admin-*` components built on top of
   the overrides (AdminPageLayout, AdminPageHeader, AdminPanel,
   AdminMetricCard, AdminMetricGrid, AdminTableSurface,
   AdminFilterToolbar, AdminPaginationFooter, AdminConfirmDialog,
   AdminState, AdminSparkline, AdminSkeletons, AdminFeedItem,
   AdminToggleGroup, AdminStatusBadge, AdminFieldCard,
   AdminFormField, AdminRegisterSheet, AdminDetailSheet,
   AdminTimestamp, AdminTruncatedText, AdminSortableHead,
   AdminCommandPalette).
4. **App shell** — AppSidebar (parameterized), SiteHeader,
   NavUser.
5. **Hooks** — `useAdminFilters`, `useAdminSelection`,
   `useAdminPagination`, `useAdminSort`, `useMobile`.
6. **Lib** — `cn` (Tailwind class merger), `createResourceApi`,
   `rowActivationHandler`, `toastSuccess`/`toastError`/`toastMutation`.

What the registry does **not** ship:

- A specific backend client.
- A router. Hash routing is suggested but the consumer can replace it.
- An auth flow. The consumer wires login and session.
- Routing-level permission enforcement.
- Translations.
- A specific charting library.

---

## 15. Compatibility

- React 19+.
- TypeScript strict.
- Tailwind v4 (the registry's CSS uses `@theme inline` from v4).
- Vite 5+ or Next.js 15+. SSR works for static pages; client-only is
  fine for the modules that depend on `window`.
- shadcn CLI v4+.
- Radix UI primitives via the shipped overrides only. Direct Radix
  imports outside the registry are discouraged but not forbidden.
- Sonner for toasts.
- lucide-react for icons.
- Geist + Instrument Serif + JetBrains Mono (Google Fonts).

---

## 16. Versioning

The contract follows SemVer:

- **Major** — a published page composed strictly to the contract would
  break (new mandatory states, removed primitive, renamed token).
- **Minor** — a new primitive, a new mandatory state that has a sane
  default, a new token added at the end.
- **Patch** — clarifications, typo fixes, additional examples.

Each release is tagged `contract-vX.Y.Z` in the registry repository.

---

## 17. How to evolve this contract

Changes are proposed as PRs to the registry repository, with at least
one of:

- A concrete shipped page in a consumer project that proves the change
  is needed.
- A measurable accessibility, performance, or UX regression in the
  current behaviour.

Changes that "feel nicer" without a concrete trigger are rejected.
This document is a contract, not an aesthetic preference log.

---

## 18. Out-of-band

If a project genuinely needs a one-off deviation (a custom color, a
non-standard layout, a different toast position), the convention is:

- Ship the deviation as a project-local wrapper.
- Add a comment pointing to the contract section being overridden.
- If the deviation recurs in three or more projects, propose a contract
  amendment.

Silent forks of the registry are the worst-case scenario. They split
the design language by accident and are very hard to merge later.

---

Version history:

- **1.0.0** (2026-05-28) — Initial contract. Captures the state of
  the admin after planes 37 + 39 + 40 (admin pre-extraction).
