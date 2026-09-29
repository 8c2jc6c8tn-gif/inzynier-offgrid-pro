#!/usr/bin/env node
/**
 * Hard-stop registry guard — standard 4.3 (addendum 29.09.2026) + 11.9, lista-do-zrobienia 29.09.2026.
 *
 * `docs/rejestr-twardych-stopow.md` is the audit index of every condition that must always end in 🔴.
 * Filling it "by discipline" failed (a whole module's stops were missing for two weeks), so this
 * script checks it mechanically: every warning code that can be emitted with `level: "critical"`
 * anywhere in `lib/core/**` must be either
 *   (a) named in the registry as `CODE` (backticks), or
 *   (b) a declared exception in `scripts/stopy-guard-wyjatki.json` — input validation or
 *       "outside the model/source range", i.e. not an engineering fact about the installation, or
 *   (c) on the ratchet list `scripts/stopy-guard-baseline.json` (old code, one-off snapshot; the list
 *       only shrinks — standard 11.9).
 *
 * How a critical warning is found (AST, not regex — 17.11):
 *   - an object literal with a `level` property that is "critical", a conditional with a "critical"
 *     branch, or any non-literal expression (conservative: it may be critical);
 *   - a call with a "critical" string argument (helpers like `ostrzezenie("CODE", "critical", …)`).
 * Its code is the `code` property (object) or the first CODE-shaped string argument (call). A template
 * literal becomes a wildcard (`${field}-NIEDODATNI` → `*-NIEDODATNI`); a local `const code = …` is
 * followed. A code that stays unknown (passed in as a parameter) is a "dynamic site": the enclosing
 * function must be declared in `zrodlaDynamiczne` with the codes it can receive — a new site fails.
 *
 * Also checked: registry codes that no longer exist in `lib/core` (stale index), and stale entries in
 * both JSON lists.
 */
import ts from "typescript"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

const CORE_DIR = "lib/core"
const REGISTRY = "docs/rejestr-twardych-stopow.md"
const EXCEPTIONS_PATH = "scripts/stopy-guard-wyjatki.json"
const BASELINE_PATH = "scripts/stopy-guard-baseline.json"
const CODE_SHAPE = /^[A-Z0-9]+(?:-[A-Z0-9*]+)+$|^\*-[A-Z0-9-]+$/

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : walk(full)
    return full.endsWith(".ts") && !full.endsWith(".test.ts") ? [full] : []
  })
}

const posix = (p) => p.split(path.sep).join("/")

/** "critical" | "maybe" | null for a `level` expression. */
function levelKind(expr) {
  if (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isSatisfiesExpression(expr))
    return levelKind(expr.expression)
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr))
    return expr.text === "critical" ? "critical" : null
  if (ts.isConditionalExpression(expr)) {
    const a = levelKind(expr.whenTrue)
    const b = levelKind(expr.whenFalse)
    return a === "critical" || b === "critical" ? "critical" : a || b
  }
  return "maybe"
}

function enclosingFunctionName(node) {
  for (let n = node.parent; n; n = n.parent) {
    if ((ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name) return n.name.getText()
    if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && ts.isVariableDeclaration(n.parent))
      return n.parent.name.getText()
  }
  return "<moduł>"
}

/** Resolves an expression to a code string (wildcards for template parts) or null. */
function codeOf(expr, node) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text
  if (ts.isTemplateExpression(expr))
    return expr.head.text + expr.templateSpans.map((s) => "*" + s.literal.text).join("")
  if (ts.isIdentifier(expr)) {
    // Follow `const code = …` declared in the same function.
    for (let n = node.parent; n; n = n.parent) {
      if (ts.isBlock(n) || ts.isSourceFile(n)) {
        for (const st of n.statements) {
          if (!ts.isVariableStatement(st)) continue
          for (const d of st.declarationList.declarations)
            if (d.name.getText() === expr.text && d.initializer) return codeOf(d.initializer, d)
        }
      }
      if (ts.isFunctionLike(n)) break
    }
  }
  return null
}

export function collectCriticals(file, src) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true)
  const found = [] // { code | null, site }
  const visit = (n) => {
    if (ts.isObjectLiteralExpression(n)) {
      let level = null
      let code
      for (const p of n.properties) {
        const name = p.name?.getText(sf)
        if (name === "level" && ts.isPropertyAssignment(p)) level = levelKind(p.initializer)
        if (name === "code")
          code = ts.isShorthandPropertyAssignment(p) ? codeOf(p.name, p) : ts.isPropertyAssignment(p) ? codeOf(p.initializer, p) : null
      }
      if (level && code !== undefined) found.push({ code, site: `${posix(file)}#${enclosingFunctionName(n)}` })
    } else if (ts.isCallExpression(n) && n.arguments.some((a) => ts.isStringLiteral(a) && a.text === "critical")) {
      const first = n.arguments.find((a) => ts.isStringLiteral(a) || ts.isTemplateExpression(a) || ts.isIdentifier(a))
      const code = first ? codeOf(first, n) : null
      found.push({ code: code && CODE_SHAPE.test(code) ? code : null, site: `${posix(file)}#${enclosingFunctionName(n)}` })
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  return found
}

export function registryCodes(markdown) {
  return new Set([...markdown.matchAll(/`((?:[A-Z0-9]+|\*)(?:-(?:[A-Z0-9]+|\*))+)`/g)].map((m) => m[1]))
}

function main() {
  const problems = []
  const exceptions = JSON.parse(readFileSync(EXCEPTIONS_PATH, "utf8"))
  const baseline = new Set(existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, "utf8")) : [])
  const registry = registryCodes(readFileSync(REGISTRY, "utf8"))

  const excepted = new Map() // code -> category
  for (const [category, codes] of Object.entries(exceptions.walidacja))
    for (const c of codes) excepted.set(c, category)
  const declaredSites = exceptions.zrodlaDynamiczne

  const files = walk(CORE_DIR)
  const allSource = files.map((f) => readFileSync(f, "utf8")).join("\n")
  const codes = new Map() // code -> Set(site)
  const usedSites = new Set()
  files.forEach((file) => {
    for (const { code, site } of collectCriticals(file, readFileSync(file, "utf8"))) {
      if (code === null) {
        usedSites.add(site)
        if (!declaredSites[site])
          problems.push(`${site}: kod 🔴 przekazywany z zewnątrz — zadeklaruj możliwe kody w ${EXCEPTIONS_PATH} (zrodlaDynamiczne)`)
        continue
      }
      if (!codes.has(code)) codes.set(code, new Set())
      codes.get(code).add(site)
    }
  })
  for (const [site, list] of Object.entries(declaredSites)) {
    if (!usedSites.has(site)) problems.push(`${EXCEPTIONS_PATH}: zrodlaDynamiczne["${site}"] — takiego miejsca już nie ma, usuń wpis`)
    for (const c of list) {
      if (!codes.has(c)) codes.set(c, new Set())
      codes.get(c).add(site)
    }
  }

  for (const [code, sites] of codes) {
    const where = [...sites][0] + (sites.size > 1 ? ` (+${sites.size - 1})` : "")
    const inRegistry = registry.has(code)
    if (inRegistry && excepted.has(code))
      problems.push(`${code}: jest i w rejestrze, i w wyjątkach (${excepted.get(code)}) — wybierz jedno`)
    if (inRegistry || excepted.has(code)) {
      if (baseline.has(code)) problems.push(`${code}: już obsłużony — usuń z ${BASELINE_PATH} (lista tylko maleje, 11.9)`)
      continue
    }
    if (!baseline.has(code))
      problems.push(`${code} (${where}): twardy stop 🔴 bez wpisu w ${REGISTRY} — dopisz go (albo, jeśli to walidacja danych, do ${EXCEPTIONS_PATH})`)
  }

  for (const code of baseline)
    if (!codes.has(code)) problems.push(`${code}: na ${BASELINE_PATH}, ale nie ma już takiego stopu 🔴 w kodzie — usuń z listy`)
  for (const code of excepted.keys())
    if (!codes.has(code)) problems.push(`${code}: w ${EXCEPTIONS_PATH}, ale nie ma już takiego kodu 🔴 — usuń wpis`)
  for (const code of registry)
    if (!code.includes("*") && !allSource.includes(`"${code}"`)) problems.push(`${REGISTRY}: \`${code}\` — brak takiego kodu w ${CORE_DIR} (nieaktualny indeks)`)

  if (problems.length) {
    console.error(`check:stopy-guard — ${problems.length} problem(ów):`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }
  const inReg = [...codes.keys()].filter((c) => registry.has(c)).length
  console.log(
    `check:stopy-guard OK — ${codes.size} kodów 🔴: ${inReg} w rejestrze, ${excepted.size} wyjątków (walidacja/zakres), lista zapadkowa: ${baseline.size} do uzupełnienia.`,
  )
}

if (import.meta.url === `file://${process.argv[1]}`) main()
