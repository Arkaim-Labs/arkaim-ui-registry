# Contract lint

A standalone, dependency-free Node script that scans a project's source for the
mechanically-checkable violations of [`design-contract.md`](../../../design-contract.md).
No install, no config — it reads `.ts`/`.tsx` files directly.

```bash
node skill/admin-ui/lint/contract-lint.mjs [dir]     # default dir: src
node skill/admin-ui/lint/contract-lint.mjs src --quiet   # errors only
```

Exit code is `1` if any **error**-level finding is present, so it drops into CI or
a pre-commit hook as-is.

## Rules

| Rule                  | Level | What it flags                                                        |
| --------------------- | ----- | -------------------------------------------------------------------- |
| `no-arbitrary-color`  | error | `bg-[#…]`, `text-[rgb(…)]`, etc. — arbitrary color utilities         |
| `no-raw-hex`          | error | A raw `#rrggbb` literal in code (token files are exempt)             |
| `no-inline-color`     | error | `style={{ color / background … }}` instead of a token utility        |
| `no-direct-radix`     | warn  | Importing `radix-ui` / `@radix-ui/*` outside `components/ui/`         |
| `single-h1`           | warn  | More than one `<h1>` in a `*-page.tsx` (heuristic — early-return branches over-report) |
| `no-nested-card`      | warn  | A `<Card>` opened inside another `<Card>`                            |
| `mandatory-states`    | warn  | A page fetches data but shows no loading / empty / error affordance  |

Token sources (`tokens.css`, `styles.css`, `globals.css`) are exempt from the color
rules — they are *supposed* to define raw values.

## What it deliberately does not check

These need judgment, not a regex — review them by hand against the contract:

- **Operational tone** of copy (§11) — calm, specific, no exclamation marks.
- **Typography roles** (§3) — display font for H1s, mono for identifiers/timestamps.
- **Permission gating** (§9) — affordances hidden/disabled by capability, with
  server-side enforcement behind them.
- **Keyboard & focus** (§8) — tab order, focus visibility, row activation.

The `mandatory-states` and `no-nested-card` checks are heuristic (`warn`, not
`error`) because they can miss cross-component compositions. A clean lint run is
necessary, not sufficient — the contract checklist in
[`bootstrap-project.md`](../bootstrap-project.md) §6 still applies.
