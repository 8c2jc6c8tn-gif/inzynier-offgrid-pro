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

describe("FORMULA — LaTeX escapes", () => {
  it("no single-backslash spacing (JS turns it into a bare character, e.g. ';')", () => {
    const zle = plikiKalkulatorow(join(process.cwd(), "lib/core/modules")).flatMap((p) =>
      readFileSync(p, "utf8")
        .split("\n")
        .filter((l) => l.includes("FORMULA") && pojedynczyEscape(l))
        .map((l) => `${p}: ${l.trim()}`),
    )
    expect(zle).toEqual([])
  })
})
