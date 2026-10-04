import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { en, pl, ru } from "../ui/formuly"

const MODULES = path.resolve(import.meta.dirname, "../../core/modules")

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n)
    if (statSync(p).isDirectory()) return n === "__tests__" ? [] : sources(p)
    return p.endsWith(".ts") ? [p] : []
  })
}

const placeholders = (s: string) => [...s.matchAll(/\{(p\d+|kdep|p)\}/g)].map((m) => m[1]).sort()

describe("formula translations (formulaKey)", () => {
  const keys = Object.keys(pl) as (keyof typeof pl)[]

  it("EN/RU are non-empty and carry the same numeric placeholders as PL", () => {
    for (const k of keys) {
      expect(en[k].trim(), k).not.toBe("")
      expect(ru[k].trim(), k).not.toBe("")
      expect(placeholders(en[k]), `${k} EN`).toEqual(placeholders(pl[k]))
      expect(placeholders(ru[k]), `${k} RU`).toEqual(placeholders(pl[k]))
    }
  })

  it("every formulaKey used by a calculator exists, and every key is used", () => {
    const used = new Set<string>()
    for (const f of sources(MODULES)) {
      for (const m of readFileSync(f, "utf8").matchAll(/formulaKey(?:: |\s*=\s*)"(UI-FORMULA-[A-Z0-9-]+)"/g)) used.add(m[1]!)
      for (const m of readFileSync(f, "utf8").matchAll(/, "(UI-FORMULA-[A-Z0-9-]+)"\)/g)) used.add(m[1]!)
    }
    for (const k of used) expect(keys as string[], k).toContain(k)
    for (const k of keys) expect(used.has(k), `unused ${k}`).toBe(true)
  })

  it("PL text of each key equals a formula literal in the module that uses it (drift guard)", () => {
    const literal = /(?:"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`)(?:\s*\+\s*(?:"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`))*/g
    const unescape = (raw: string) => raw.replace(/\\(.)/g, "$1")
    const joined = (src: string) =>
      [...src.matchAll(literal)].map((m) => {
        const parts = [...m[0].matchAll(/"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((x) => x[1] ?? x[2] ?? "")
        let n = 0
        return unescape(parts.join("").replace(/\$\{[^}]*(?:\([^)]*\)[^}]*)*\}/g, () => `{p${++n}}`))
      })
    for (const f of sources(MODULES)) {
      const src = readFileSync(f, "utf8")
      const ids = [...src.matchAll(/(UI-FORMULA-[A-Z0-9-]+)"/g)].map((m) => m[1]!)
      if (ids.length === 0) continue
      const texts = joined(src)
      for (const id of new Set(ids)) {
        const plText = pl[id as keyof typeof pl]
        if (id.endsWith("-STAWKI")) continue
        expect(texts, `${id} PL drifted from ${path.relative(MODULES, f)}`).toContain(plText)
      }
    }
  })
})
