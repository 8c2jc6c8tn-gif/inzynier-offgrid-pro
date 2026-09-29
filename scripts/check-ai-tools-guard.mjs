#!/usr/bin/env node
/**
 * AI tool completeness guard — standard 9.0a/9.3, Dyrektywa #15 (step 5), lista-do-zrobienia 29.09.2026.
 *
 * The in-app assistant can only use what is registered as a tool, and it picks a tool by reading
 * its `description`. Nobody enforced either, so 27 descriptions lacked the "when to call" sentence
 * and 18 calculators had no tool. This script is the enforcement.
 *
 * Rules:
 *  1. every `lib/ai/tools/*-tool.ts` has a `description` containing „Użyj, gdy …” (when the model
 *     should call it) — no exceptions;
 *  2. every `lib/ai/tools/*-tool.ts` is imported by `lib/ai/pytaj-asystenta.ts` (registered);
 *  3. every `lib/core/modules/**\/calculator.ts` is imported by some tool, unless the calculator
 *     says why not in a comment `ai-tool: nie dotyczy — <reason>`.
 *
 * No ratchet: the baseline list (calculators without a tool on 29.09.2026) emptied the same day and
 * was deleted (standard 11.9 — an empty list means the guard is fully strict).
 */
import ts from "typescript"
import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

const TOOLS_DIR = "lib/ai/tools"
const REGISTRY = "lib/ai/pytaj-asystenta.ts"
const MODULES_DIR = "lib/core/modules"
const EXEMPT = /ai-tool: nie dotyczy — \S/

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : walk(full)
    return [full]
  })
}

function literalText(sf, expr) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text
  if (ts.isParenthesizedExpression(expr)) return literalText(sf, expr.expression)
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken)
    return literalText(sf, expr.left) + literalText(sf, expr.right)
  return expr.getText(sf)
}

export function toolDescription(file, src) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true)
  let found = null
  const visit = (n) => {
    if (found !== null) return
    if (ts.isPropertyAssignment(n) && n.name.getText(sf) === "description") found = literalText(sf, n.initializer)
    else ts.forEachChild(n, visit)
  }
  visit(sf)
  return found
}

function main() {
  const problems = []
  const toolFiles = readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith("-tool.ts"))
    .map((f) => path.join(TOOLS_DIR, f))
  const registry = readFileSync(REGISTRY, "utf8")
  const covered = new Set()

  for (const file of toolFiles) {
    const src = readFileSync(file, "utf8")
    const description = toolDescription(file, src)
    if (description === null) problems.push(`${file}: brak pola description`)
    else if (!/Użyj, gdy /.test(description))
      problems.push(`${file}: description bez zdania „Użyj, gdy …” (kiedy model ma wywołać narzędzie)`)
    const base = path.basename(file, ".ts")
    if (!registry.includes(`"./tools/${base}"`)) problems.push(`${file}: nie zarejestrowane w ${REGISTRY}`)
    for (const m of src.matchAll(/["']@\/lib\/core\/modules\/(.+?)\/calculator["']/g)) covered.add(m[1])
  }

  const calculators = walk(MODULES_DIR)
    .filter((f) => f.endsWith(`${path.sep}calculator.ts`))
    .map((f) => path.relative(MODULES_DIR, path.dirname(f)).split(path.sep).join("/"))
  for (const calc of calculators) {
    const exempt = EXEMPT.test(readFileSync(path.join(MODULES_DIR, calc, "calculator.ts"), "utf8"))
    if (!covered.has(calc) && !exempt) problems.push(`${MODULES_DIR}/${calc}: kalkulator bez narzędzia AI`)
  }

  if (problems.length) {
    console.error(`check:ai-tools-guard — ${problems.length} problem(ów):`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }
  console.log(
    `check:ai-tools-guard OK — ${toolFiles.length} narzędzi z „Użyj, gdy”, ${calculators.length}/${calculators.length} kalkulatorów z narzędziem albo adnotacją „nie dotyczy”.`,
  )
}

if (import.meta.url === `file://${process.argv[1]}`) main()
