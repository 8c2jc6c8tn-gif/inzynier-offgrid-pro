#!/usr/bin/env node
/**
 * One-off migration tool for the old screens on the i18n UI ratchet list (D58, entry „Tłumaczenie
 * samych stron” in `docs/lista-do-zrobienia.md`). Remove it when `scripts/i18n-ui-guard-baseline.json`
 * is empty. Uses the same detection as `check-i18n-ui-guard.mjs`, so what it migrates is exactly what
 * the guard counts.
 *
 *   node scripts/migracja-i18n-ui.mjs wyciagnij <grupa> <plik…>   → prints { key: pl } for translation
 *   node scripts/migracja-i18n-ui.mjs zastosuj <grupa> <tlumaczenia.json> <plik…>
 *
 * `tlumaczenia.json` = { "UI-…": ["en", "ru"] }. `zastosuj` rewrites the files, writes
 * `lib/i18n/ui/<grupa>.ts` (pl/en/ru), adds the import to `lib/i18n/ui/index.ts` and lowers the ratchet.
 *
 * Rewrites:
 *  - a run of JSX children (text + value expressions) with user text → one `{t("KEY", {params})}`,
 *    so a sentence with numbers inside stays one key (no glued fragments, D58);
 *  - a text attribute `label="…"` → `label={t("KEY")}`;
 *  - a string/template literal inside a component (or JSX expression) → `t("KEY", {params})`;
 *  - a literal outside any component (module constants, helpers) → the key as a plain string, listed
 *    under „RĘCZNIE” — its render site needs `t(...)` added by hand.
 * `const t = useTranslate()` is added at the top of every component that got a `t(` call.
 */
import ts from "typescript"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { countFile, isUserText } from "./check-i18n-ui-guard.mjs"

const BASELINE_PATH = "scripts/i18n-ui-guard-baseline.json"
const UI_DIR = "lib/i18n/ui"
// Attributes whose value is data, not text. The guard keys hits by line + text, so `<option value="LiFePO4">LiFePO4</option>`
// would otherwise have its `value` rewritten to `t(...)` along with the visible text.
const DATA_ATTR = /^(key|id|href|src|type|name|value|defaultValue|htmlFor|role)$/

const TRANSLIT = { ą: "A", ć: "C", ę: "E", ł: "L", ń: "N", ó: "O", ś: "S", ź: "Z", ż: "Z" }
const STOP = new Set(["ORAZ", "LUB", "DLA", "CZY", "JEST", "SIE", "NIE", "TAK", "JAK", "ALE", "PRZY", "PRZEZ", "TWOJ", "TWOJEGO", "TWOJA", "TWOJE"])

function slugPrefix(file) {
  const parts = file.split(path.sep)
  const idx = parts.indexOf("kalkulatory")
  // Outside /kalkulatory/ a route file is named after its folder (app/ustawienia/page.tsx → UST, app/page.tsx → PULPIT),
  // otherwise every page.tsx would share the prefix „PAG” and identical texts would collide.
  const base = path.basename(file).replace(/\.tsx?$/, "")
  const dir = path.basename(path.dirname(file))
  const slug = idx >= 0 ? parts[idx + 1] : base !== "page" ? base : dir === "app" ? "pulpit" : dir
  const rest = idx >= 0 ? parts.slice(idx + 2).join("-").replace(/(^|-)page\.tsx$/, "").replace(/\.tsx?$/, "") : ""
  const abbr = (s) => s.split(/[-_]/).filter(Boolean).map((w) => w.slice(0, 3).toUpperCase()).join("")
  return abbr(slug) + (rest ? "-" + abbr(rest) : "")
}

function keyWords(text) {
  const words = text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => TRANSLIT[c])
    .toUpperCase()
    .replace(/\{\w+\}/g, " ")
    .match(/[A-Z0-9]+/g) ?? []
  const good = words.filter((w) => w.length >= 3 && !STOP.has(w))
  return (good.length ? good : words).slice(0, 3).join("-").slice(0, 28) || "TXT"
}

/** JSX whitespace semantics: lines trimmed, whitespace-only lines with a newline dropped, joined by space. */
function jsxTextValue(raw) {
  if (!raw.includes("\n")) return decodeEntities(raw)
  const lines = raw.split(/\r?\n/)
  const out = []
  lines.forEach((line, i) => {
    let l = line.replace(/\t/g, " ")
    if (i !== 0) l = l.replace(/^ +/, "")
    if (i !== lines.length - 1) l = l.replace(/ +$/, "")
    if (l) out.push(l)
  })
  return decodeEntities(out.join(" "))
}

const ENTITIES = { gt: ">", lt: "<", amp: "&", quot: '"', apos: "'", nbsp: "\u00a0", ndash: "–", mdash: "—", hellip: "…", bdquo: "„", rdquo: "”", ldquo: "“", rsquo: "’", lsquo: "‘", deg: "°", middot: "·", times: "×", minus: "−", le: "≤", ge: "≥", rarr: "→" }

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
    if (!(e in ENTITIES)) throw new Error(`nieznana encja ${m}`)
    return ENTITIES[e]
  })
}

function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(" ")
  return null
}

function paramName(sf, expr, used) {
  let base = null
  let e = expr
  while (ts.isParenthesizedExpression(e)) e = e.expression
  if (ts.isIdentifier(e)) base = e.text
  else if (ts.isPropertyAccessExpression(e)) base = e.name.text
  else if (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression)) {
    // x.toFixed(1), fmt(x) → name of the object
    let o = e.expression.expression
    while (ts.isParenthesizedExpression(o)) o = o.expression
    if (ts.isIdentifier(o)) base = o.text
    else if (ts.isPropertyAccessExpression(o)) base = o.name.text
  } else if (ts.isCallExpression(e) && e.arguments.length > 0) {
    let a = e.arguments[0]
    if (ts.isIdentifier(a)) base = a.text
    else if (ts.isPropertyAccessExpression(a)) base = a.name.text
  }
  if (!base || !/^\w+$/.test(base) || base === "t") base = "p"
  let name = base
  let i = 2
  while (used.has(name) && used.get(name) !== expr.getText(sf)) name = `${base}${i++}`
  used.set(name, expr.getText(sf))
  return name
}

/** Object literal text for t() params; `{ a }` shorthand when the name equals the expression. */
function paramsObj(entries) {
  if (entries.length === 0) return ""
  return ", { " + entries.map(([n, src]) => (n === src ? n : `${n}: ${src}`)).join(", ") + " }"
}

function isComponentName(name) {
  return !!name && /^[A-Z]/.test(name)
}

function functionName(fn) {
  if (ts.isFunctionDeclaration(fn) && fn.name) return fn.name.text
  const p = fn.parent
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text
  if (p && ts.isCallExpression(p) && p.parent && ts.isVariableDeclaration(p.parent) && ts.isIdentifier(p.parent.name)) return p.parent.name.text // memo/forwardRef
  return null
}

/** Nearest enclosing component function (Capitalized), or null when the node is outside one. */
function enclosingComponent(node) {
  let comp = null
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) {
      const name = functionName(n)
      if (isComponentName(name)) comp = n
      else if (name && !comp && (ts.isFunctionDeclaration(n) || (n.parent && ts.isVariableDeclaration(n.parent)))) {
        // a named non-component function (helper) — only OK if it is nested inside a component
        let inside = false
        for (let m = n.parent; m; m = m.parent) {
          if ((ts.isFunctionDeclaration(m) || ts.isArrowFunction(m) || ts.isFunctionExpression(m)) && isComponentName(functionName(m))) {
            inside = true
            break
          }
        }
        if (!inside) return null
      }
    }
  }
  return comp
}

function isCodePosition(node) {
  const p = node.parent
  if (!p) return true
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p)) return true
  if (ts.isLiteralTypeNode(p)) return true
  if ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isMethodDeclaration(p)) && p.name === node) return true
  if (ts.isExpressionStatement(p)) return true
  if (ts.isCaseClause(p)) return true
  if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(p.operatorToken.kind)) return true
  return false
}

function hasUserLiteral(node) {
  let found = false
  const v = (n) => {
    if (found) return
    const txt = literalText(n)
    if (txt !== null && isUserText(txt)) found = true
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) found = true
    ts.forEachChild(n, v)
  }
  v(node)
  return found
}

function containsJsx(node) {
  let found = false
  const v = (n) => {
    if (found) return
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) found = true
    else ts.forEachChild(n, v)
  }
  v(node)
  return found
}

export function analyze(file, src, prefix, sharedByText) {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind)
  const edits = [] // { start, end, text }
  const keys = new Map() // pl → key
  const usedKeys = new Set()
  const manual = []
  const tComponents = new Set()
  const covered = [] // [start,end] ranges already rewritten
  const guardHits = new Set(countFile(file, src).map((h) => `${h.line}|${h.text}`))

  const keyFor = (pl) => {
    if (sharedByText.has(pl)) return sharedByText.get(pl)
    if (keys.has(pl)) return keys.get(pl)
    let base = `UI-${prefix}-${keyWords(pl)}`
    let k = base
    let i = 2
    while (usedKeys.has(k)) k = `${base}-${i++}`
    usedKeys.add(k)
    keys.set(pl, k)
    return k
  }
  const isCovered = (n) => covered.some(([s, e]) => n.getStart(sf) >= s && n.getEnd() <= e)
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1
  const markT = (node) => {
    const c = enclosingComponent(node)
    if (c) tComponents.add(c)
    return c
  }

  // 1. JSX children runs
  const visitRuns = (n) => {
    if (ts.isJsxElement(n) || ts.isJsxFragment(n)) {
      const children = n.children
      let run = []
      const flush = () => {
        const texts = run.filter((c) => ts.isJsxText(c) && isUserText(jsxTextValue(c.text)))
        if (texts.length > 0) {
          // trim leading/trailing whitespace-only text and pure-space expressions
          while (run.length && ts.isJsxText(run[0]) && jsxTextValue(run[0].text).trim() === "") run.shift()
          while (run.length && ts.isJsxText(run.at(-1)) && jsxTextValue(run.at(-1).text).trim() === "") run.pop()
          const used = new Map()
          const params = []
          let tpl = ""
          for (const c of run) {
            if (ts.isJsxText(c)) tpl += jsxTextValue(c.text)
            else {
              const e = c.expression
              const lt = e ? literalText(e) : null
              if (e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) && !isUserText(lt)) tpl += lt
              else if (e) {
                const name = paramName(sf, e, used)
                if (!params.some(([p]) => p === name)) params.push([name, e.getText(sf)])
                tpl += `{${name}}`
              }
            }
          }
          const pl = tpl.replace(/\s+/g, " ").trim()
          const key = keyFor(pl)
          const comp = markT(run[0])
          const start = run[0].getStart(sf)
          const end = run.at(-1).getEnd()
          if (!comp) manual.push(`${file}:${line(run[0])} tekst JSX poza komponentem: ${pl}`)
          // surrounding whitespace stays in the source, so JSX spacing is unchanged
          const s0 = ts.isJsxText(run[0]) ? run[0].pos + (run[0].text.length - run[0].text.trimStart().length) : start
          const e0 = ts.isJsxText(run.at(-1)) ? end - (run.at(-1).text.length - run.at(-1).text.trimEnd().length) : end
          // a `{" "}` at either end of the run is a real space next to a sibling element — keep it
          const spaceExpr = (c) => ts.isJsxExpression(c) && c.expression && /^\s+$/.test(literalText(c.expression) ?? "")
          const pre = spaceExpr(run[0]) ? '{" "}' : ""
          const post = run.length > 1 && spaceExpr(run.at(-1)) ? '{" "}' : ""
          edits.push({ start: s0, end: e0, text: `${pre}{t("${key}"${paramsObj(params)})}${post}` })
          covered.push([start, end])
        }
        run = []
      }
      for (const c of children) {
        if (ts.isJsxText(c)) run.push(c)
        else if (ts.isJsxExpression(c) && c.expression && !containsJsx(c.expression) && !hasUserLiteral(c.expression)) run.push(c)
        else if (ts.isJsxExpression(c) && !c.expression) {
          /* comment */
        } else flush()
      }
      flush()
    }
    ts.forEachChild(n, visitRuns)
  }
  visitRuns(sf)

  // 2./3./4. literals
  const visitLits = (n) => {
    const txt = literalText(n)
    const dataAttr = n.parent && ts.isJsxAttribute(n.parent) && DATA_ATTR.test(n.parent.name.getText(sf))
    if (txt !== null && !dataAttr && !isCovered(n) && !isCodePosition(n) && isUserText(txt)) {
      if (guardHits.has(`${line(n)}|${txt.trim()}`)) {
        const used = new Map()
        const params = []
        let pl
        if (ts.isTemplateExpression(n)) {
          pl = n.head.text
          for (const span of n.templateSpans) {
            const name = paramName(sf, span.expression, used)
            if (!params.some(([p]) => p === name)) params.push([name, span.expression.getText(sf)])
            pl += `{${name}}` + span.literal.text
          }
        } else pl = txt
        const trimmed = pl.trim()
        const leadSp = pl.slice(0, pl.length - pl.trimStart().length)
        const trailSp = pl.slice(pl.trimEnd().length)
        const key = keyFor(trimmed.replace(/\s+/g, " "))
        const p = n.parent
        const inComp = enclosingComponent(n)
        const call = `t("${key}"${paramsObj(params)})`
        const wrapped = leadSp || trailSp ? `\`${leadSp}\${${call}}${trailSp}\`` : call
        if (p && ts.isJsxAttribute(p)) {
          markT(n)
          if (!inComp) manual.push(`${file}:${line(n)} atrybut poza komponentem: ${trimmed}`)
          edits.push({ start: n.getStart(sf), end: n.getEnd(), text: `{${wrapped}}`, pl: trimmed, key })
        } else if (inComp) {
          markT(n)
          edits.push({ start: n.getStart(sf), end: n.getEnd(), text: wrapped, pl: trimmed, key })
        } else if (params.length === 0 && !leadSp && !trailSp) {
          manual.push(`${file}:${line(n)} klucz zamiast tekstu poza komponentem — dodaj t() przy renderze: ${key}  (${trimmed})`)
          edits.push({ start: n.getStart(sf), end: n.getEnd(), text: `"${key}"`, pl: trimmed, key })
        } else {
          manual.push(`${file}:${line(n)} SZABLON poza komponentem — nie zmieniono: ${trimmed}`)
          keys.delete(trimmed)
          usedKeys.delete(key)
        }
        covered.push([n.getStart(sf), n.getEnd()])
      }
      if (ts.isTemplateExpression(n)) return
    }
    ts.forEachChild(n, visitLits)
  }
  visitLits(sf)

  // shadowing check
  const shadows = []
  const visitShadow = (n) => {
    if ((ts.isParameter(n) || ts.isVariableDeclaration(n)) && ts.isIdentifier(n.name) && n.name.text === "t") {
      const init = ts.isVariableDeclaration(n) ? n.initializer?.getText(sf) : ""
      if (init !== "useTranslate()") shadows.push(line(n))
    }
    ts.forEachChild(n, visitShadow)
  }
  visitShadow(sf)
  if (shadows.length && tComponents.size) manual.push(`${file}: ZMIENNA t przesłania tłumacz (linie ${shadows.join(", ")}) — zmień nazwę przed migracją`)

  // hook insertion
  for (const c of tComponents) {
    const body = c.body
    if (!body) continue
    if (!ts.isBlock(body)) {
      manual.push(`${file}:${line(c)} komponent strzałkowy bez bloku — dodaj const t = useTranslate() ręcznie`)
      continue
    }
    const hook = body.statements.map((s) => /const (\w+) = useTranslate\(\)/.exec(s.getText(sf))).find(Boolean)
    if (hook && hook[1] !== "t") manual.push(`${file}:${line(c)} hook nazwany „${hook[1]}” — zmień na t (wstawione wywołania to t(...))`)
    if (hook) continue
    const first = body.statements[0]
    const pos = first ? first.getStart(sf) : body.getStart(sf) + 1
    const indent = first ? src.slice(src.lastIndexOf("\n", pos) + 1, pos) : "  "
    edits.push({ start: pos, end: pos, text: `const t = useTranslate()\n${indent}` })
  }
  if (tComponents.size > 0) {
    const imps = sf.statements.filter(ts.isImportDeclaration)
    const lc = imps.find((d) => d.moduleSpecifier.text === "@/lib/i18n/language-context")
    const named = lc?.importClause?.namedBindings
    if (lc && named && ts.isNamedImports(named)) {
      if (!named.elements.some((e) => e.name.text === "useTranslate")) {
        const lastEl = named.elements.at(-1)
        edits.push({ start: lastEl.getEnd(), end: lastEl.getEnd(), text: ", useTranslate" })
      }
    } else {
      const last = imps.at(-1)
      // No imports: put it before the first statement (after a leading doc comment), not glued to offset 0.
      const pos = last ? last.getEnd() : sf.statements[0] ? sf.statements[0].getStart(sf) : 0
      const imp = `import { useTranslate } from "@/lib/i18n/language-context"`
      edits.push({ start: pos, end: pos, text: last ? `\n${imp}` : `${imp}\n\n` })
    }
    // useTranslate() in a Server Component is HTTP 500 at runtime (docs/memory.md) — the hook needs "use client"
    const first = sf.statements[0]
    const isClient = first && ts.isExpressionStatement(first) && ts.isStringLiteral(first.expression) && first.expression.text === "use client"
    if (!isClient && file.startsWith("app/")) {
      if (/export (const|async function|function) (metadata|generateMetadata)\b/.test(src))
        manual.push(`${file}: Server Component z metadata — useTranslate() wymaga osobnego komponentu klienckiego`)
      else edits.push({ start: 0, end: 0, text: `"use client"\n\n` })
    }
  }
  return { edits, keys, manual, sf }
}

function applyEdits(src, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.end - a.end)
  let out = src
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end)
  return out
}

async function sharedTexts() {
  const m = new Map()
  const src = readFileSync(`${UI_DIR}/wspolne.ts`, "utf8")
  const plBlock = src.slice(src.indexOf("export const pl"), src.indexOf("} as const"))
  for (const [, k, v] of plBlock.matchAll(/"(UI-[^"]+)":\s*"([^"]*)"/g)) m.set(v, k)
  return m
}

function tsString(s) {
  return JSON.stringify(s)
}

function writeGroup(grupa, entries, tr, header) {
  const lines = (lang) =>
    entries.map(([k, pl]) => {
      const v = lang === "pl" ? pl : tr[k][lang === "en" ? 0 : 1]
      const one = `  ${tsString(k)}: ${tsString(v)},`
      return one.length <= 120 ? one : `  ${tsString(k)}:\n    ${tsString(v)},`
    })
  const out = `${header}
export const pl = {
${lines("pl").join("\n")}
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
${lines("en").join("\n")}
}

export const ru: Record<Klucz, string> = {
${lines("ru").join("\n")}
}
`
  writeFileSync(`${UI_DIR}/${grupa}.ts`, out)
}

function camel(grupa) {
  return grupa.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

function addToIndex(grupa) {
  const p = `${UI_DIR}/index.ts`
  let src = readFileSync(p, "utf8")
  const name = camel(grupa)
  if (src.includes(`from "./${grupa}"`)) return
  src = src.replace(/(import \* as pwa from "\.\/pwa"\n)/, `import * as ${name} from "./${grupa}"\n$1`)
  // append at the end of `czesciUi` — the array no longer ends with `pwa`, so anchor on `] as const`
  src = src.replace(/\] as const/, `, ${name}] as const`)
  writeFileSync(p, src)
}

async function main() {
  const [cmd, grupa, ...rest] = process.argv.slice(2)
  const shared = await sharedTexts()
  if (cmd === "wyciagnij") {
    const all = {}
    const manual = []
    for (const file of rest) {
      const src = readFileSync(file, "utf8")
      const r = analyze(file, src, slugPrefix(file), shared)
      for (const [pl, k] of r.keys) all[k] = pl
      manual.push(...r.manual)
    }
    console.log(JSON.stringify(all, null, 1))
    if (manual.length) console.error("RĘCZNIE:\n" + manual.join("\n"))
    return
  }
  if (cmd === "sprawdz") {
    // Leftovers the guard cannot see: literals with a space-separated lowercase word, outside code positions
    // and non-text attributes — printed for a human look (e.g. `lampa ${i + 1}`).
    const NON_TEXT = /^(className|key|id|href|src|type|name|value|defaultValue|variant|size|ekran|pole|htmlFor|role|viewBox|d|points|textAnchor|inputMode|autoComplete|target|rel|fill|stroke|transform|xmlns|grupa|poziom|mode|side|align)$/
    for (const file of [grupa, ...rest]) {
      const src = readFileSync(file, "utf8")
      const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const v = (n) => {
        const txt = literalText(n)
        if (txt !== null && !isCodePosition(n) && /\p{Ll}{3,}/u.test(txt) && !/^UI-/.test(txt) && !/^[\w.:/@#-]+$/.test(txt.trim())) {
          const p = n.parent
          const attr = p && ts.isJsxAttribute(p) ? p.name.getText(sf) : ""
          const call = p && ts.isCallExpression(p) ? p.expression.getText(sf) : ""
          if (!NON_TEXT.test(attr) && !/^(cn|clsx|usePersistedDraft|t|Number|parseFloat|toLocaleString|\w+\.toLocaleString|\w+\.includes|\w+\.startsWith|\w+\.replace|\w+\.split|\w+\.join)$/.test(call) && !/(^|\s)(flex|grid|text-|bg-|border|rounded|px-|py-|gap-|w-|h-|mt-|mb-|font-|min-|max-)/.test(txt))
            console.log(`${file}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}  ${JSON.stringify(txt)}`)
        }
        ts.forEachChild(n, v)
      }
      v(sf)
    }
    return
  }
  if (cmd === "zastosuj") {
    const [trPath, ...files] = rest
    const tr = JSON.parse(readFileSync(trPath, "utf8"))
    const groupFile = `${UI_DIR}/${grupa}.ts`
    const entries = []
    const manual = []
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"))
    for (const file of files) {
      const src = readFileSync(file, "utf8")
      const r = analyze(file, src, slugPrefix(file), shared)
      for (const [pl, k] of r.keys) {
        if (!tr[k]) throw new Error(`brak tłumaczenia ${k} (${pl})`)
        entries.push([k, pl])
      }
      manual.push(...r.manual)
      let out = applyEdits(src, r.edits)
      writeFileSync(file, out)
      const left = countFile(file, out).length
      if (left === 0) delete baseline[file]
      else baseline[file] = Math.min(baseline[file] ?? left, left)
    }
    if (existsSync(groupFile)) throw new Error(`${groupFile} już istnieje — użyj nowej grupy`)
    const header = `/**\n * ${grupa} — screen text migrated from JSX (D58, ratchet list). Screens: ${files.map((f) => f.replace(/^app\/kalkulatory\/|\/page\.tsx$/g, "")).join(", ")}.\n */`
    writeGroup(grupa, entries, tr, header)
    addToIndex(grupa)
    writeFileSync(BASELINE_PATH, JSON.stringify(Object.fromEntries(Object.entries(baseline).sort()), null, 2) + "\n")
    if (manual.length) console.error("RĘCZNIE:\n" + manual.join("\n"))
    console.log(`zapisano ${entries.length} kluczy → ${groupFile}`)
  }
}

main()
