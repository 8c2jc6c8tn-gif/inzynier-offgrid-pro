#!/usr/bin/env node
/**
 * i18n guard for the UI layer — standard 17.1a/17.9, pattern 11.9. The engine guard
 * (`check-i18n-guard.mjs`) only covers `lib/core`; screens were never checked, so new screens kept
 * shipping Polish text written straight into JSX while every check stayed green (Y.11 run 1, point 1b,
 * `docs/audyt-zgodnosci-kodu.md`). `pnpm check:i18n-guard` runs both scripts.
 *
 * Files: `app/**` and `components/**` (`.tsx`, `.ts`), tests excluded. A user-facing string is text
 * with a Polish letter, or with a word of 3+ letters containing a lowercase letter (not a unit from
 * UNITS) — so translation keys („UMI-OK”), symbols („N–PE”, „RCD”), numbers and units pass. Counted:
 *  1. JSX text („<p>Tekst</p>”);
 *  2. a string or template literal inside a JSX child expression („{ok ? "Tak" : "Nie"}”);
 *  3. a string literal in a JSX attribute, except non-text attributes (NON_TEXT_ATTRS) — for other
 *     attributes only when the name is in TEXT_NAMES or the value has a space or a Polish letter;
 *  4. any other string/template literal: with a Polish letter, or assigned to a TEXT_NAMES property.
 * Known gap: a Polish word without Polish letters outside JSX and outside TEXT_NAMES („Styropian” in a
 * bare array) is not detected.
 *
 * Ratchet (11.9): `scripts/i18n-ui-guard-baseline.json` maps each old file to its count of such
 * strings, recorded once when the guard was introduced (29.09.2026). A file not on the list must have
 * none; a listed file must not exceed its number, and the number must be lowered as soon as the file
 * has fewer (the list only shrinks — never add a file or raise a number). A file at zero leaves the list.
 */
import ts from "typescript"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOTS = ["app", "components"]
const BASELINE_PATH = "scripts/i18n-ui-guard-baseline.json"

const POLISH = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/
const UNITS = new Set(["kWh", "kWp", "kVA", "mAh", "Wh", "kWh/m²", "MWh", "rpm", "kVAr", "Hz", "kHz", "mm²", "cos", "min", "max"])
const NON_TEXT_ATTRS = new Set([
  "className", "key", "id", "href", "src", "type", "name", "value", "defaultValue", "variant", "size", "ekran", "pole",
  "htmlFor", "role", "viewBox", "d", "points", "textAnchor", "inputMode", "autoComplete", "target", "rel", "method",
  "step", "min", "max", "pattern", "lang", "dir", "fill", "stroke", "strokeWidth", "strokeDasharray", "strokeLinecap",
  "strokeLinejoin", "transform", "xmlns", "form", "accept", "encType", "action", "sizes", "loading", "as", "grupa",
  "dominantBaseline", "fontFamily", "preserveAspectRatio", "mode", "side", "align", "orientation",
])
const TEXT_NAMES = new Set([
  "label", "title", "placeholder", "alt", "aria-label", "aria-description", "tytul", "podtytul", "opis", "etykieta",
  "jednostka", "unit", "hint", "tekst", "komunikat", "naglowek", "nazwa", "description", "pustyTekst", "podpis", "wniosek",
  "uwaga", "powod", "tresc", "pytanie", "odpowiedz",
])

export function isUserText(raw) {
  const text = raw.trim()
  if (text === "") return false
  if (POLISH.test(text)) return true
  return (text.match(/\p{L}+/gu) ?? []).some((w) => w.length >= 3 && /\p{Ll}/u.test(w) && !UNITS.has(w))
}

function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(" ")
  return null
}

function isStringish(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node)
}

const EQUALITY = new Set([
  ts.SyntaxKind.EqualsEqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsToken,
])

/** Literals that are code, not text: module specifiers, literal types, property keys, directives, compared values. */
function isCodePosition(node) {
  const p = node.parent
  if (!p) return true
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p)) return true
  if (ts.isLiteralTypeNode(p)) return true
  if ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isMethodDeclaration(p)) && p.name === node) return true
  if (ts.isElementAccessExpression(p) && p.argumentExpression === node) return false
  if (ts.isExpressionStatement(p)) return true // "use client"
  if (ts.isCaseClause(p)) return true
  if (ts.isBinaryExpression(p) && EQUALITY.has(p.operatorToken.kind)) return true
  return false
}

function propertyName(sf, node) {
  const p = node.parent
  if (p && ts.isPropertyAssignment(p) && p.initializer === node) return p.name.getText(sf).replace(/^["']|["']$/g, "")
  return null
}

/** Nearest JSX context of a literal: the attribute it sits in, or a JSX child expression. */
function jsxContext(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isJsxAttribute(n)) return { kind: "attr", attr: n }
    if (ts.isJsxExpression(n)) {
      if (n.parent && ts.isJsxAttribute(n.parent)) return { kind: "attr", attr: n.parent }
      return { kind: "child" }
    }
    // A nested function or call inside JSX (e.g. `.map(o => ({ label: "…" }))`) is ordinary code again.
    if (ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isCallExpression(n)) return null
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) return null
  }
  return null
}

export function countFile(file, src) {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind)
  const hits = []
  const hit = (n, text) => hits.push({ line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1, text: text.trim() })

  const visit = (n) => {
    if (ts.isJsxText(n)) {
      if (isUserText(n.text)) hit(n, n.text)
    } else if (isStringish(n) && !isCodePosition(n)) {
      const text = literalText(n)
      if (text !== null && isUserText(text)) {
        const ctx = jsxContext(n)
        if (ctx?.kind === "child") hit(n, text)
        else if (ctx?.kind === "attr") {
          const name = ctx.attr.name.getText(sf)
          const nonText = NON_TEXT_ATTRS.has(name) || name.startsWith("on") || name.startsWith("data-") || name.endsWith("ClassName")
          if (!nonText && (TEXT_NAMES.has(name) || /\s/.test(text.trim()) || POLISH.test(text))) hit(n, text)
        } else if (POLISH.test(text) || TEXT_NAMES.has(propertyName(sf, n) ?? "")) hit(n, text)
      }
      if (ts.isTemplateExpression(n)) ts.forEachChild(n, visit)
      return
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  return hits
}

function listFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : listFiles(full)
    return /\.tsx?$/.test(name) && !/\.(test|spec)\.tsx?$/.test(name) && !name.endsWith(".d.ts") ? [full] : []
  })
}

export function countAll() {
  const counts = {}
  for (const file of ROOTS.flatMap(listFiles).sort()) {
    const n = countFile(file, readFileSync(file, "utf8")).length
    if (n > 0) counts[file] = n
  }
  return counts
}

function main() {
  const args = process.argv.slice(2)
  if (args[0] === "--pokaz") {
    for (const file of args.slice(1)) for (const h of countFile(file, readFileSync(file, "utf8"))) console.log(`${file}:${h.line}  ${h.text}`)
    return
  }
  const counts = countAll()
  if (args[0] === "--policz") {
    console.log(JSON.stringify(counts, null, 2))
    return
  }
  const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, "utf8")) : {}
  const problems = []
  for (const [file, n] of Object.entries(counts)) {
    const allowed = baseline[file] ?? 0
    if (n > allowed) {
      problems.push(
        allowed === 0
          ? `${file}: ${n} tekst(ów) wpisanych wprost — użyj t("KLUCZ") i dopisz PL/EN/RU (pokaż: node ${BASELINE_PATH.replace("i18n-ui-guard-baseline.json", "check-i18n-ui-guard.mjs")} --pokaz ${file})`
          : `${file}: ${n} tekstów wpisanych wprost, lista zapadkowa pozwala na ${allowed} — nowy tekst przez t("KLUCZ"), nigdy przez podniesienie liczby`,
      )
    } else if (n < allowed) problems.push(`${file}: zostało ${n} (lista zapadkowa: ${allowed}) — obniż liczbę w ${BASELINE_PATH}`)
  }
  for (const file of Object.keys(baseline)) {
    if (!(file in counts)) problems.push(`${file}: brak tekstów wpisanych wprost albo brak pliku — usuń go z ${BASELINE_PATH}`)
  }
  if (problems.length > 0) {
    console.error(`check:i18n-ui-guard — ${problems.length} problem(ów) (standard 17.1a, 11.9):`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }
  const pozostalo = Object.values(baseline).reduce((a, b) => a + b, 0)
  console.log(`check:i18n-ui-guard OK — nowe teksty UI przez t(); lista zapadkowa: ${Object.keys(baseline).length} plików, ${pozostalo} tekstów do migracji.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
