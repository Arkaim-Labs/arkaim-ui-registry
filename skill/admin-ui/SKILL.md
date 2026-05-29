---
name: admin-ui
description: >-
  Build admin panels, dashboards, and internal back-office tools that follow the
  Admin UI design system (shadcn registry + design contract). Use when scaffolding a
  new admin project, adding a resource page (list + filters + detail/register sheets),
  or composing screens from the admin-* primitives. Covers tokens, the app shell
  (AppSidebar/SiteHeader/NavUser), the mandatory loading/empty/error states, the
  filter/pagination/selection hooks, and createResourceApi. Trigger when the user
  mentions the admin registry, "admin-ui", an admin/dashboard built on these tokens,
  or asks to add a module/page to such a project.
---

# Admin UI design system

A shadcn registry plus a normative design contract for building consistent admin
panels. The registry ships tokens, overridden shadcn primitives, the `admin-*`
composite primitives, a parameterized app shell, hooks, and lib helpers. The
consumer owns the code once `shadcn add` copies it in.

**The design contract is normative. Read it before composing anything:**
[`design-contract.md`](../../design-contract.md). It defines the visual contract,
token system, typography, the layout pattern, the mandatory states, accessibility
rules, the operational tone for copy, and the SemVer policy. Do not invent new
tokens, nest cards, or skip a mandatory state — those are contract violations.

## Registry

- Base URL: `https://arkaim-labs.github.io/arkaim-ui-registry`
- Items resolve at `<base>/r/<name>.json`
- Manifest: [`registry.json`](../../registry.json) — the full item inventory.

Pin to a tag for reproducible installs (`registry-v1.0.0`); use `main` only while
developing the registry itself.

## When to do what

| The user wants to…                                   | Do this                                      |
| ---------------------------------------------------- | -------------------------------------------- |
| Start a brand-new admin project from scratch         | Follow [`bootstrap-project.md`](./bootstrap-project.md) |
| Add a resource module (list + detail + register)     | Follow [`add-resource-module.md`](./add-resource-module.md) |
| Add one screen/widget to an existing admin           | `shadcn add` the primitives, compose per the recipe below |
| Change a shared primitive                            | Edit it locally; if it's generic, backport to the registry per the sync policy in plan 38 |
| Check a screen before calling it done                | Run the lint: `node skill/admin-ui/lint/contract-lint.mjs src` ([rules](./lint/README.md)) |

## Installing primitives

`tokens` is required by everything and must be installed first. Every other item
declares its own `registryDependencies`, so the shadcn CLI pulls the ui-overrides,
`utils`, hooks, etc. transitively — you only name the top-level item you want.

```bash
npx shadcn add <base>/r/tokens.json          # always first
npx shadcn add <base>/r/app-sidebar.json     # pulls nav-user, sidebar, utils…
npx shadcn add <base>/r/admin-page-layout.json
npx shadcn add <base>/r/admin-state.json
# …name only what you compose with; deps come along.
```

## The resource-page recipe

A standard module (Users, Invoices, Applications…) is a list page plus a detail
sheet plus a register/edit sheet. Compose it from these items — install each with
`shadcn add`, then wire them:

1. **Data** — `createResourceApi("/your/resource")` from `admin-api` for
   list/get/create/update/remove. Wrap calls in `toastMutation` (`admin-toast`).
2. **Page frame** — `AdminPageLayout` + `AdminPageHeader` (title, description,
   primary action).
3. **Filters** — `AdminFilterToolbar` driven by `useAdminFilters` (search +
   facets; collapses into a sheet on mobile).
4. **Table** — `AdminTableSurface` + the `table` primitive. Column headers that
   sort use `AdminSortableHead` bound to `useAdminSort`. Bulk actions use
   `useAdminSelection` + the `checkbox` indeterminate state. Identifiers/timestamps
   use `AdminTimestamp` / `AdminTruncatedText`. Status cells use `AdminStatusBadge`.
5. **Footer** — `AdminPaginationFooter` driven by `useAdminPagination`.
6. **Mandatory states** — `AdminTableSkeleton` while loading, `AdminState` for
   empty / no-results / error. These are not optional (contract §6).
7. **Detail** — `AdminDetailSheet` (tabbed if the record has sections), built from
   `AdminFieldCard` rows.
8. **Register/edit** — `AdminRegisterSheet` wrapping a form of `AdminFormField`s.
   Destructive actions go through `AdminConfirmDialog`.

Keyboard-activate a row with `rowActivationHandler` (`admin-keyboard`).

## Hard rules (from the contract — enforce them)

- One H1 per page, in `--admin-font-display`. Body in Geist, identifiers/timestamps
  in JetBrains Mono.
- Every async surface ships loading, empty, and error states.
- Colors come from the semantic tokens only. No raw hex, no nested cards.
- Copy uses the operational tone in contract §11 (calm, specific, no exclamation).
- Permissions gate UI affordances; they are not a substitute for server checks.

For the full project setup (Tailwind v4, fonts, shadcn config, the shell), see
[`bootstrap-project.md`](./bootstrap-project.md).
