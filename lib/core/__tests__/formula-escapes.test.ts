import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const BS = String.fromCharCode(92)
/** LaTeX spacing commands that JS silently strips when written with a single backslash in a string literal. */
const SPACING = [";", ",", ":", "!"]

function plikiKalkulatorow(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return e.name === "__tests__" ? [] : plikiKalkulatorow(p)
    return e.name.endsWith(".ts") ? [p] : []
  })
}

/** A backslash not preceded by another backslash, followed by a LaTeX spacing char. */
function pojedynczyEscape(linia: string): boolean {
  for (let i = 0; i < linia.length - 1; i++) {
    if (linia[i] === BS && SPACING.includes(linia[i + 1]!) && linia[i - 1] !== BS) return true
  }
  return false
}

/** Lines of every `FORMULA` expression, including continuation lines (`=`, `+`, `(` at line end). */
function linieWzorow(tresc: string): string[] {
  const wynik: string[] = []
  let wewnatrz = false
  for (const l of tresc.split("\n")) {
    if (l.includes("FORMULA") || wewnatrz) {
      wynik.push(l)
      wewnatrz = /[=+(]$/.test(l.trimEnd())
    }
  }
  return wynik
}

describe("FORMULA — LaTeX escapes", () => {
  it("no single-backslash spacing (JS turns it into a bare character, e.g. ';')", () => {
    const zle = plikiKalkulatorow(join(process.cwd(), "lib/core/modules")).flatMap((p) =>
      linieWzorow(readFileSync(p, "utf8"))
        .filter(pojedynczyEscape)
        .map((l) => `${p}: ${l.trim()}`),
    )
    expect(zle).toEqual([])
  })
})
