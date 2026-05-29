# Bootstrap a new admin project

End-to-end setup for a fresh admin panel on the Admin UI design system. Read
[`design-contract.md`](../../design-contract.md) first — it is the spec these steps
implement.

Registry base URL: `https://arkaim-labs.github.io/arkaim-ui-registry` (referred
to below as `<base>`). Pin a tag (`registry-v1.0.0`) for reproducible installs.

## 0. Prerequisites

- React 19+, TypeScript strict.
- Vite 5+ **or** Next.js 15+.
- Tailwind v4 (the tokens use `@theme inline`).
- shadcn CLI v4+ initialized in the project (`npx shadcn init`).

## 1. Fonts

Add the three Google Fonts to your `index.html` `<head>` (Vite) or root layout
(Next.js):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
/>
```

## 2. Tokens

```bash
npx shadcn add <base>/r/tokens.json
```

This drops `tokens.css`. Import it from your global stylesheet **after** the
Tailwind/shadcn imports:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./tokens.css";
```

The system is **dark-first**. To run dark by default, put `class="dark"` on
`<html>`. A light theme is the consumer's responsibility; keep token semantics
intact if you add one.

## 3. App shell

```bash
npx shadcn add <base>/r/app-sidebar.json   # pulls nav-user, sidebar, utils
npx shadcn add <base>/r/site-header.json   # pulls breadcrumb, native-select, separator, app-scope
```

Compose them around your routed content. `AppSidebar` is fully parameterized —
pass `brand`, `groups` (your nav items, each with a lucide icon), `user`,
`activePage`, optional `visibleKeys` (permission filtering), `primaryAction`, and
`onLogout`. `SiteHeader` takes `breadcrumbRoot`, `pageTitle`, and the app-scope
selector props.

```tsx
<SidebarProvider>
  <AppSidebar brand={brand} groups={navGroups} user={user} activePage={page} onLogout={logout} />
  <SidebarInset>
    <SiteHeader breadcrumbRoot="Admin" pageTitle={title} />
    <main>{/* the routed page */}</main>
  </SidebarInset>
</SidebarProvider>
```

Routing, auth/login, and the backend client are **not** shipped — you wire them.
Hash routing is suggested but replaceable.

## 4. Data layer

```bash
npx shadcn add <base>/r/admin-api.json     # adminApiRequest, AdminApiError, createResourceApi
npx shadcn add <base>/r/admin-toast.json   # toastSuccess / toastError / toastMutation (sonner)
```

Set your API base URL in `admin-api.ts` (it reads `VITE_API_BASE_URL`, default
`/api`). Create one resource client per module:

```ts
const usersApi = createResourceApi("/admin/users")
await toastMutation(usersApi.update(id, patch), { success: "User updated" })
```

Add a `<Toaster />` (sonner) at the app root.

## 5. First resource page

Install the primitives the page composes with — dependencies come transitively:

```bash
npx shadcn add <base>/r/admin-page-layout.json
npx shadcn add <base>/r/admin-page-header.json
npx shadcn add <base>/r/admin-surfaces.json
npx shadcn add <base>/r/admin-filter-toolbar.json
npx shadcn add <base>/r/admin-pagination-footer.json
npx shadcn add <base>/r/admin-sortable-head.json
npx shadcn add <base>/r/admin-skeletons.json
npx shadcn add <base>/r/admin-state.json
npx shadcn add <base>/r/admin-status-badge.json
npx shadcn add <base>/r/admin-detail-sheet.json
npx shadcn add <base>/r/admin-register-sheet.json
npx shadcn add <base>/r/admin-form-field.json
npx shadcn add <base>/r/admin-field-card.json
npx shadcn add <base>/r/admin-confirm-dialog.json
npx shadcn add <base>/r/admin-timestamp.json
npx shadcn add <base>/r/admin-truncated-text.json
```

Then follow the **resource-page recipe** in [`SKILL.md`](./SKILL.md): page frame →
filters (`useAdminFilters`) → table with sortable heads (`useAdminSort`) and bulk
selection (`useAdminSelection`) → pagination (`useAdminPagination`) → the three
mandatory states → detail sheet → register/edit sheet.

The hooks are installed transitively where a primitive needs them (e.g.
`admin-sortable-head` pulls `use-admin-sort`); install the others explicitly:

```bash
npx shadcn add <base>/r/use-admin-filters.json
npx shadcn add <base>/r/use-admin-selection.json
npx shadcn add <base>/r/use-admin-pagination.json
```

## 6. Verify against the contract

Before calling a screen done, check it against the contract:

- [ ] One H1 in the display font; body in Geist; ids/timestamps in JetBrains Mono.
- [ ] Loading, empty, and error states all present on every async surface.
- [ ] Colors are semantic tokens only — no raw hex, no nested cards.
- [ ] Destructive actions confirm via `AdminConfirmDialog`.
- [ ] Copy follows the operational tone (contract §11).
- [ ] Keyboard: rows activate on Enter/Space; focus is visible; tab order is sane.

## 7. Optional: dashboard / overview

For an overview screen use `admin-metric-card` (KPI cards), `admin-sparkline`
(dependency-free inline charts), and `admin-feed-item` (activity timeline). Group
metric cards with the grid surface from `admin-surfaces`; never nest cards.
