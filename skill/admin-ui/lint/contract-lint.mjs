#!/usr/bin/env node
// Admin UI contract lint.
//
// Scans .tsx/.ts files for the mechanically-checkable violations of
// design-contract.md. Heuristic by design: it catches the cheap, common
// mistakes (raw colors, nested cards, multiple H1s, direct Radix imports). The
// rules it cannot check statically are listed at the end of the run — those
// stay a human/Claude review against the contract.
//
// Usage:  node contract-lint.mjs [dir]        (default: src)
//         node contract-lint.mjs src --quiet  (errors only)
// Exit code: 1 if any error-level finding, else 0.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, basename } from "node:path";

const root = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "src";
const quiet = process.argv.includes("--quiet");

// Files that legitimately define raw values (the token source) are exempt.
const EXEMPT = [/(^|\/)tokens\.css$/, /(^|\/)styles\.css$/, /(^|\/)globals\.css$/];
// Direct Radix imports are allowed only inside the ui-overrides themselves.
const UI_OVERRIDE = /(^|\/)(components\/)?ui\//;

const findings = [];
function add(level, file, line, rule, msg) {
  findings.push({ level, file, line, rule, msg });
}

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === "node_modules" || name === ".git" || name === "dist") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if ([".tsx", ".ts"].includes(extname(p)) && !p.endsWith(".d.ts")) lintFile(p);
  }
}

function lintFile(path) {
  if (EXEMPT.some((re) => re.test(path))) return;
  const src = readFileSync(path, "utf8");
  const lines = src.split("\n");
  const isTest = /\.test\.[tj]sx?$/.test(path);

  // R1 — arbitrary color utilities: bg-[#fff], text-[#abc], border-[rgb(...)] …
  const arbColor = /\b(?:bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|accent|caret)-\[(?:#|rgb|hsl|oklch)/i;
  // R2 — raw hex literal anywhere (string or jsx)
  const rawHex = /#[0-9a-fA-F]{3,8}\b/;
  // R3 — inline style with a color/background literal
  const inlineColorStyle = /style=\{\{[^}]*(?:color|background)[^}]*\}\}/i;
  // R4 — direct Radix import outside ui-overrides
  const radixImport = /from\s+["'](?:radix-ui|@radix-ui\/)/;
  // R5 — H1 (count per file)
  const h1 = /<h1[\s>]/g;

  let h1Count = 0;
  lines.forEach((ln, i) => {
    const n = i + 1;
    const code = ln.replace(/\/\/.*$/, ""); // strip line comments for color checks
    if (arbColor.test(code)) add("error", path, n, "no-arbitrary-color", "arbitrary color value — use a semantic token utility");
    else if (rawHex.test(code) && !/\/\*|\*\//.test(ln)) add("error", path, n, "no-raw-hex", "raw hex color — use a semantic token");
    if (inlineColorStyle.test(code)) add("error", path, n, "no-inline-color", "inline color/background style — use a token utility");
    if (radixImport.test(code) && !UI_OVERRIDE.test(path)) add("warn", path, n, "no-direct-radix", "direct Radix import outside ui/ — import the shipped override");
    const m = code.match(h1); if (m) h1Count += m.length;
  });

  // R5 — more than one H1 in a page component. Heuristic: counts every <h1> in
  // the file, so mutually-exclusive early-return branches over-report — hence warn.
  if (!isTest && h1Count > 1 && /page\.tsx$/.test(path))
    add("warn", path, 0, "single-h1", `${h1Count} <h1> in the file — the contract allows one per rendered page (check these aren't all on one path)`);

  // R6 — nested Card: a CardContent/Card opened while another Card is open
  let cardDepth = 0, nestedReported = false;
  lines.forEach((ln, i) => {
    for (const tok of ln.match(/<Card\b|<\/Card>/g) || []) {
      if (tok === "</Card>") cardDepth = Math.max(0, cardDepth - 1);
      else { cardDepth++; if (cardDepth > 1 && !nestedReported) { add("warn", path, i + 1, "no-nested-card", "Card nested inside Card — flatten per contract §2"); nestedReported = true; } }
    }
  });

  // R7 — page that fetches but ships no loading/empty/error affordance
  if (!isTest && /page\.tsx$/.test(path)) {
    const fetches = /\b(useQuery|\.list\(|\.get\(|fetch\(|adminApiRequest)/.test(src);
    const hasStates = /(Skeleton|AdminState|isLoading|"loading"|'loading')/.test(src);
    if (fetches && !hasStates) add("warn", path, 0, "mandatory-states", "page fetches data but no loading/empty/error state detected (contract §6)");
  }
}

walk(root);

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");

for (const f of findings) {
  if (quiet && f.level !== "error") continue;
  const tag = f.level === "error" ? "ERROR" : "warn ";
  const loc = `${relative(process.cwd(), f.file)}${f.line ? ":" + f.line : ""}`;
  console.log(`${tag}  ${loc}  [${f.rule}] ${f.msg}`);
}

console.log(`\n${errors.length} error(s), ${warns.length} warning(s) across ${root}/`);
if (!quiet) {
  console.log("\nNot checked mechanically — review against the contract:");
  console.log("  • operational tone of copy (§11)   • typography roles per element (§3)");
  console.log("  • permission gating of affordances (§9)   • focus order & keyboard reachability (§8)");
}
process.exit(errors.length ? 1 : 0);
