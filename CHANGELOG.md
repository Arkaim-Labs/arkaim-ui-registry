# Changelog

The three components of the system version independently under SemVer, per
`design-contract.md` §16. Tags: `contract-v<X.Y.Z>`, `registry-v<X.Y.Z>`,
`skill-v<X.Y.Z>`.

## contract-v1.0.0 — unreleased

Initial normative design contract: scope, visual contract, token system,
typography, layout pattern, mandatory states, interaction patterns, accessibility,
permissions, data layer, naming, operational tone, registry inventory,
compatibility, versioning, evolution process, deviation policy.

## registry-v1.0.0 — unreleased

Initial registry, 55 items, dependency graph fully closed.

- **Tokens** (1): `tokens` — semantic color/typography/radius tokens; dark-first.
- **Lib** (5): `utils` (cn), `admin-api` (createResourceApi), `admin-keyboard`
  (rowActivationHandler), `admin-toast`, `app-scope`.
- **Hooks** (5): `use-mobile`, `use-admin-filters`, `use-admin-selection`,
  `use-admin-pagination`, `use-admin-sort`.
- **UI overrides** (20): alert-dialog, avatar, badge, breadcrumb, button, card,
  checkbox, dropdown-menu, input, label, native-select, pagination, separator,
  sheet, sidebar, skeleton, table, tabs, textarea, tooltip.
- **Admin primitives** (21): page-layout, page-header, surfaces, metric-card,
  sparkline, filter-toolbar, pagination-footer, sortable-head, skeletons, state,
  status-badge, feed-item, toggle-group, timestamp, truncated-text, form-field,
  field-card, detail-sheet, register-sheet, confirm-dialog, command-palette.
- **App shell** (3): app-sidebar, site-header, nav-user.

## skill-v0.1.0 — unreleased

Initial Claude Code skill.

- `SKILL.md` — routing, primitive installation, resource-page recipe, hard rules.
- `bootstrap-project.md` — end-to-end new-project setup + contract checklist.
- `add-resource-module.md` — list + detail + register scaffold workflow.
- `lint/contract-lint.mjs` — dependency-free contract lint (7 rules) + README.

---

Releases are marked `unreleased` until this folder is migrated to its own repo and
the tags are pushed there (see README "Becoming a real repo"). They are not tagged
in the monorepo to keep its tag namespace clean.
