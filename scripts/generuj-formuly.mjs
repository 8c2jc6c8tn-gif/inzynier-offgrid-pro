#!/usr/bin/env node
/**
 * Formula translation generator (docs/standards/17-i18n.md 17.11, order of work: the literal in the module first,
 * then a copy into the dictionary by script).
 *
 * The module's `formula` literal (Polish, stable contract for AI tools and tests) is the source of truth.
 * `lib/i18n/ui/formuly.ts` holds one key per formula; its `pl` object must mirror the literal, with every
 * `${...}` substitution written as `{p1}`, `{p2}`, ... (numbered in order of appearance).
 *
 *   node scripts/generuj-formuly.mjs            check only, exit 1 on any problem (also run by the Vitest test)
 *   node scripts/generuj-formuly.mjs --write    repair `pl` entries that drifted and add keys the modules use but
 *                                               the dictionary lacks (PL text copied into en/ru as a DRAFT to translate)
 *
 * Pairing of a key with its literal (TypeScript AST, no regexes over source):
 *   (1) an object literal with both `formula: <literal>` and `formulaKey: "UI-FORMULA-..."`;
 *   (2) a call that has a string argument "UI-FORMULA-..." and an identifier argument resolving to a `const`
 *       literal in the same file (e.g. `fabrykaWyniku(input, FORMULA, "szt.", "UI-FORMULA-...")`).
 * A key used in a way that fits neither shape is reported as UNPAIRED (needs a manual look), never skipped silently.
 * Keys ending with `-STAWKI` are set dynamically from a rate table and are excluded from drift checks (as in the test).
 *
 * Problems detected: DRIFT (dictionary differs from module), BRAK (module uses a key missing in the dictionary),
 * NIEUŻYWANY (dictionary key no module uses), NIESPARZONY, ZNAK_STERUJĄCY (a control character in a formula, almost
 * always `"\times"` written with one backslash: it is a TAB followed by "imes"), BRAK_EN_RU (a locale lacks the key).
 */
import { createRequire } from "node:module"
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const ts = require("typescript")

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const MODULES = path.join(ROOT, "lib/core/modules")
const SLOWNIK = path.join(ROOT, "lib/i18n/ui/formuly.ts")
const PREFIKS = /^UI-FORMULA-[A-Z0-9-]+$/
const DYNAMICZNE = /-STAWKI$/
const STERUJACE = /[\u0000-\u001f]/

function pliki(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n)
    if (statSync(p).isDirectory()) return n === "__tests__" ? [] : pliki(p)
    return p.endsWith(".ts") ? [p] : []
  })
}

/** Literal text of a string/template/concatenation node; `${...}` becomes {pN}. null = not a plain literal. */
function tekst(node, licznik = { n: 0 }) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) {
    let out = node.head.text
    for (const span of node.templateSpans) out += `{p${++licznik.n}}` + span.literal.text
    return out
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const l = tekst(node.left, licznik)
    const r = l === null ? null : tekst(node.right, licznik)
    return l === null || r === null ? null : l + r
  }
  if (ts.isParenthesizedExpression(node)) return tekst(node.expression, licznik)
  return null
}

/** The `const` initializer a name refers to: the nearest enclosing block that declares it, then the file level. */
function rozwiaz(nazwaZm, od, stale) {
  for (let n = od.parent; n; n = n.parent) {
    const instrukcje = ts.isBlock(n) || ts.isSourceFile(n) ? n.statements : []
    for (const s of instrukcje) {
      if (!ts.isVariableStatement(s)) continue
      for (const d of s.declarationList.declarations) if (ts.isIdentifier(d.name) && d.name.text === nazwaZm && d.initializer) return d.initializer
    }
  }
  return stale.get(nazwaZm) ?? null
}

const nazwa = (p) => (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null)

/** key -> { plik, tekst | null, jak } for every UI-FORMULA key used in the modules. */
export function zbierzZModulow() {
  const uzycia = new Map()
  const dodaj = (klucz, plik, wartosc, jak) => {
    const stare = uzycia.get(klucz)
    if (!stare || (stare.tekst === null && wartosc !== null)) uzycia.set(klucz, { plik, tekst: wartosc, jak })
  }
  for (const plik of pliki(MODULES)) {
    const src = readFileSync(plik, "utf8")
    if (!src.includes("UI-FORMULA-")) continue
    const sf = ts.createSourceFile(plik, src, ts.ScriptTarget.Latest, true)
    const stale = new Map()
    for (const s of sf.statements) {
      if (!ts.isVariableStatement(s)) continue
      for (const d of s.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) stale.set(d.name.text, d.initializer)
      }
    }
    const widziane = new Set()
    ts.forEachChild(sf, function odwiedz(n) {
      if (ts.isStringLiteral(n) && PREFIKS.test(n.text)) widziane.add(n.text)
      if (ts.isObjectLiteralExpression(n)) {
        const formula = n.properties.find((p) => (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) && nazwa(p) === "formula")
        const klucz = n.properties.find((p) => ts.isPropertyAssignment(p) && nazwa(p) === "formulaKey")
        if (formula && klucz && ts.isStringLiteral(klucz.initializer) && PREFIKS.test(klucz.initializer.text)) {
          let wyrazenie = ts.isShorthandPropertyAssignment(formula) ? formula.name : formula.initializer
          if (ts.isIdentifier(wyrazenie)) wyrazenie = rozwiaz(wyrazenie.text, n, stale)
          dodaj(klucz.initializer.text, plik, wyrazenie ? tekst(wyrazenie) : null, "obiekt")
        }
      }
      if (ts.isCallExpression(n)) {
        const klucz = n.arguments.find((a) => ts.isStringLiteral(a) && PREFIKS.test(a.text))
        const id = n.arguments.find((a) => ts.isIdentifier(a) && rozwiaz(a.text, n, stale))
        if (klucz && id) dodaj(klucz.text, plik, tekst(rozwiaz(id.text, n, stale)), "wywołanie")
      }
      ts.forEachChild(n, odwiedz)
    })
    for (const k of widziane) if (!uzycia.has(k)) uzycia.set(k, { plik, tekst: null, jak: "niesparowany" })
  }
  return uzycia
}

/** `pl`, `en`, `ru` objects of the dictionary (evaluated from the source with the same AST, values are plain literals). */
export function wczytajSlownik() {
  const src = readFileSync(SLOWNIK, "utf8")
  const sf = ts.createSourceFile(SLOWNIK, src, ts.ScriptTarget.Latest, true)
  const wynik = {}
  for (const s of sf.statements) {
    if (!ts.isVariableStatement(s)) continue
    for (const d of s.declarationList.declarations) {
      if (!ts.isIdentifier(d.name) || !["pl", "en", "ru"].includes(d.name.text) || !d.initializer) continue
      let obj = d.initializer
      if (ts.isAsExpression(obj)) obj = obj.expression
      if (!ts.isObjectLiteralExpression(obj)) continue
      wynik[d.name.text] = Object.fromEntries(
        obj.properties.filter((p) => ts.isPropertyAssignment(p) && ts.isStringLiteral(p.initializer)).map((p) => [nazwa(p), p.initializer.text]),
      )
    }
  }
  return { src, ...wynik }
}

export function sprawdz() {
  const uzycia = zbierzZModulow()
  const { pl, en, ru } = wczytajSlownik()
  const problemy = []
  for (const [klucz, u] of [...uzycia].sort(([a], [b]) => a.localeCompare(b))) {
    const rel = path.relative(ROOT, u.plik)
    if (!(klucz in pl)) problemy.push({ rodzaj: "BRAK", klucz, plik: rel, nowy: u.tekst })
    else if (DYNAMICZNE.test(klucz)) continue
    else if (u.tekst === null) problemy.push({ rodzaj: "NIESPARZONY", klucz, plik: rel })
    else if (pl[klucz] !== u.tekst) problemy.push({ rodzaj: "DRIFT", klucz, plik: rel, nowy: u.tekst, stary: pl[klucz] })
    if (u.tekst !== null && STERUJACE.test(u.tekst)) problemy.push({ rodzaj: "ZNAK_STERUJĄCY", klucz, plik: rel })
    for (const [jezyk, s] of [["EN", en], ["RU", ru]]) if (klucz in pl && !(klucz in s)) problemy.push({ rodzaj: "BRAK_EN_RU", klucz, plik: `${jezyk} w słowniku` })
  }
  for (const klucz of Object.keys(pl)) if (!uzycia.has(klucz)) problemy.push({ rodzaj: "NIEUŻYWANY", klucz, plik: path.relative(ROOT, SLOWNIK) })
  for (const [jezyk, s] of [["pl", pl], ["en", en], ["ru", ru]]) {
    for (const [klucz, wartosc] of Object.entries(s)) if (STERUJACE.test(wartosc)) problemy.push({ rodzaj: "ZNAK_STERUJĄCY", klucz, plik: `${jezyk} w słowniku` })
  }
  return { problemy, kluczy: uzycia.size }
}

function napraw(problemy) {
  let src = readFileSync(SLOWNIK, "utf8")
  const linia = (k, w) => `  ${JSON.stringify(k)}: ${JSON.stringify(w)},`
  const poprawione = []
  for (const p of problemy.filter((x) => x.rodzaj === "DRIFT")) {
    const re = new RegExp(`^  ${JSON.stringify(p.klucz).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}: .*,$`, "m")
    const m = re.exec(src) // the first occurrence is the `pl` object (it is declared first)
    if (!m) continue
    src = src.slice(0, m.index) + linia(p.klucz, p.nowy) + src.slice(m.index + m[0].length)
    poprawione.push(p.klucz)
  }
  const nowe = problemy.filter((x) => x.rodzaj === "BRAK" && x.nowy !== null)
  if (nowe.length > 0) {
    // closing brace of each of the three objects: the `}` lines at column 0 that end `pl`, `en`, `ru`
    const koniec = [...src.matchAll(/^\}( as const)?\s*$/gm)].slice(0, 3)
    if (koniec.length === 3) {
      for (const m of koniec.reverse()) {
        const blok = nowe.map((p) => linia(p.klucz, p.nowy)).join("\n") + "\n"
        src = src.slice(0, m.index) + (m === koniec[2] ? "" : "") + blok + src.slice(m.index)
      }
    }
  }
  writeFileSync(SLOWNIK, src)
  return { poprawione, dodane: nowe.map((p) => p.klucz) }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { problemy, kluczy } = sprawdz()
  if (process.argv.includes("--write")) {
    const { poprawione, dodane } = napraw(problemy)
    console.log(`formuly: poprawiono ${poprawione.length} wpisów PL, dodano ${dodane.length} nowych kluczy (EN/RU = szkic z PL do przetłumaczenia).`)
    const reszta = sprawdz().problemy
    for (const p of reszta) console.log(`  ${p.rodzaj}  ${p.klucz}  (${p.plik})`)
    process.exit(reszta.length === 0 ? 0 : 1)
  }
  for (const p of problemy) console.log(`${p.rodzaj}  ${p.klucz}  (${p.plik})${p.stary ? `\n    słownik: ${p.stary}\n    moduł:   ${p.nowy}` : ""}`)
  console.log(problemy.length === 0 ? `generuj-formuly OK — ${kluczy} kluczy, moduły i słownik zgodne.` : `generuj-formuly: ${problemy.length} problemów (napraw: node scripts/generuj-formuly.mjs --write).`)
  process.exit(problemy.length === 0 ? 0 : 1)
}
