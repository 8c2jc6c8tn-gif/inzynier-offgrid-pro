#!/usr/bin/env node
/**
 * Screen completeness guard — decision D51 (`rejestr-decyzji.md`), standard 8.4, D34.
 *
 * A screen is complete only when it ships, in the same change: autosave (`usePersistedDraft`),
 * translated engine messages (`pnpm check:i18n-guard`), the „?” on every field and the „i”
 * Migawka on the title. D34 already required it for new screens and nobody enforced it — this
 * script is the enforcement, so the work is not done twice.
 *
 * Rules (files: app/kalkulatory/**, components/siec, components/agregat, components/wzorce):
 *  1. every `<Pole>` / `<PoleSelect>` has `pomoc={<PomocPola …/>}` (translated content, not inline
 *     Polish JSX) and no `hint=` (the hint text lives in the „?”);
 *  2. every raw `<input>` (not checkbox/radio/hidden/file) and `<select>` has a `<PomocPola>`
 *     within its three nearest enclosing JSX elements;
 *  3. every `<NaglowekEkranu>` has `ekran=` (renders the „i”);
 *  4. every `app/kalkulatory/<screen>/page.tsx` with a form field (checkboxes included) uses `usePersistedDraft`, unless
 *     the file says why not in a comment `autosave: nie dotyczy — <reason>`.
 *
 * No ratchet: the baseline list (files non-compliant on 29.09.2026) emptied the same day and was
 * deleted (standard 11.9 — an empty list means the guard is fully strict). Every file must pass.
 */
import ts from "typescript"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"

const ROOTS = ["app/kalkulatory", "components/siec", "components/agregat", "components/wzorce"]
const RAW_EXEMPT_TYPES = new Set(["checkbox", "radio", "hidden", "file"])

function listTsx(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : listTsx(full)
    return full.endsWith(".tsx") ? [full] : []
  })
}

function tagName(sf, node) {
  const open = ts.isJsxElement(node) ? node.openingElement : node
  return open.tagName.getText(sf)
}

function attrs(node) {
  const open = ts.isJsxElement(node) ? node.openingElement : node
  return open.attributes.properties
}

function attr(sf, node, name) {
  return attrs(node).find((p) => ts.isJsxAttribute(p) && p.name.getText(sf) === name)
}

function hasSpread(node) {
  return attrs(node).some((p) => ts.isJsxSpreadAttribute(p))
}

function containsTag(sf, node, name) {
  let found = false
  const visit = (n) => {
    if (found) return
    if ((ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) && tagName(sf, n) === name) found = true
    else ts.forEachChild(n, visit)
  }
  visit(node)
  return found
}

export function checkFile(file, src) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const problems = []
  let hasField = false
  const where = (n) => `${file}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`

  const visit = (n) => {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = tagName(sf, n)
      if (tag === "Pole" || tag === "PoleSelect") {
        hasField = true
        const pomoc = attr(sf, n, "pomoc")
        if (!pomoc && !hasSpread(n)) problems.push(`${where(n)} <${tag}> bez pomoc= („?”)`)
        else if (pomoc && !pomoc.getText(sf).includes("<PomocPola"))
          problems.push(`${where(n)} <${tag}> pomoc= bez <PomocPola> — treść musi być w lib/i18n/pomoc (PL/EN/RU)`)
        if (attr(sf, n, "hint")) problems.push(`${where(n)} <${tag}> ma hint= — treść przenieś do „?” (D51)`)
      } else if (tag === "PoleCheckbox") {
        hasField = true
      } else if (tag === "input" || tag === "select") {
        const typeAttr = attr(sf, n, "type")
        const type = typeAttr?.initializer && ts.isStringLiteral(typeAttr.initializer) ? typeAttr.initializer.text : ""
        if (type !== "hidden") hasField = true
        if (tag === "select" || !RAW_EXEMPT_TYPES.has(type)) {
          let parent = n.parent
          let ok = false
          for (let depth = 0; parent && depth < 3 && !ok; parent = parent.parent) {
            if (ts.isJsxElement(parent)) {
              depth++
              ok = containsTag(sf, parent, "PomocPola")
            }
          }
          if (!ok) problems.push(`${where(n)} surowe <${tag}> bez <PomocPola> obok („?”)`)
        }
      } else if (tag === "NaglowekEkranu" && !attr(sf, n, "ekran")) {
        problems.push(`${where(n)} <NaglowekEkranu> bez ekran= („i”)`)
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)

  const isScreenPage = /^app\/kalkulatory\/[^/]+\/page\.tsx$/.test(file.split(path.sep).join("/"))
  if (isScreenPage && hasField && !src.includes("usePersistedDraft") && !/autosave: nie dotyczy — \S/.test(src)) {
    problems.push(`${file} ekran z polami bez usePersistedDraft (autosave)`)
  }
  return problems
}

function main() {
  const files = ROOTS.flatMap(listTsx).map((f) => f.split(path.sep).join("/"))
  const errors = files.flatMap((file) => checkFile(file, readFileSync(file, "utf8")))
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`)
    console.error(
      `\ncheck:pomoc-guard: ekran musi mieć od razu autosave, tłumaczenia, „?” przy każdym polu i „i” przy tytule (D51).`,
    )
    process.exit(1)
  }
  console.log(`check:pomoc-guard OK — ${files.length} plików zgodnych.`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
