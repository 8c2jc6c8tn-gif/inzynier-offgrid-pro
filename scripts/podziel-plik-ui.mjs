#!/usr/bin/env node
/**
 * One-off helper of the per-language split of the screen texts (3.54.0): turns a group file
 * `lib/i18n/ui/<grupa>.ts` that still holds `pl`, `en` and `ru` together into the three files of the new layout
 *
 *   <grupa>.ts      Polish (the source, the header comment stays here)
 *   <grupa>.en.ts   English, typed with the keys of `pl`
 *   <grupa>.ru.ts   Russian, typed with the keys of `pl`
 *
 * so that a language is its own lazy chunk (`lib/i18n/rejestr-slownikow.ts`). A file that is already split is skipped,
 * so the script can be run again after a merge that brought an old-layout file (a branch that was started before the
 * split): `git checkout --theirs lib/i18n/ui/<grupa>.ts && node scripts/podziel-plik-ui.mjs && pnpm slowniki:napraw`.
 * Remove it when no branch with the old layout is open.
 *
 *   node scripts/podziel-plik-ui.mjs                  every old-layout file in lib/i18n/ui
 *   node scripts/podziel-plik-ui.mjs <grupa> [...]    only the named groups
 */
import { createRequire } from "node:module"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const ts = require("typescript")
const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../lib/i18n/ui")

function podziel(grupa) {
  const plik = path.join(KATALOG, `${grupa}.ts`)
  const src = readFileSync(plik, "utf8")
  const sf = ts.createSourceFile(plik, src, ts.ScriptTarget.Latest, true)
  const zm = {}
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue
    for (const d of st.declarationList.declarations) if (["pl", "en", "ru"].includes(d.name.getText())) zm[d.name.getText()] = st
  }
  if (!zm.pl || !zm.en || !zm.ru) return false
  const naglowek = src.slice(0, zm.pl.getStart()).trimEnd()
  const tekst = (st) => src.slice(st.getFullStart(), st.getEnd()).trim()
  const uwaga = `// English: ./${grupa}.en.ts, Russian: ./${grupa}.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).`
  writeFileSync(plik, `${naglowek}\n${uwaga}\n${src.slice(zm.pl.getStart(), zm.pl.getEnd())}\n`)
  for (const [kod, nazwa] of [["en", "English"], ["ru", "Russian"]]) {
    const tresc = tekst(zm[kod])
    // Some files type with `Klucz`, others with `keyof typeof pl` directly — keep exactly what the file used.
    const alias = /\bKlucz\b/.test(tresc) ? "type Klucz = keyof typeof pl\n\n" : ""
    const wstep = `// ${nazwa} texts of ./${grupa}.ts — the same keys as \`pl\` (a missing or an extra key is a compile error).\nimport type { pl } from "./${grupa}"\n\n${alias}`
    writeFileSync(path.join(KATALOG, `${grupa}.${kod}.ts`), `${wstep}${tresc}\n`)
  }
  return true
}

const wskazane = process.argv.slice(2)
const grupy = wskazane.length
  ? wskazane
  : readdirSync(KATALOG)
      .filter((n) => /^[\w-]+\.ts$/.test(n) && n !== "index.ts")
      .map((n) => n.slice(0, -3))
const podzielone = grupy.filter(podziel)
console.log(`podziel-plik-ui: rozdzielono ${podzielone.length} plików z ${grupy.length}.`)
