import { execFileSync } from "node:child_process"
import path from "node:path"
import { describe, expect, it } from "vitest"

const SKRYPT = path.resolve(import.meta.dirname, "../../../scripts/generuj-formuly.mjs")

describe("generuj-formuly (formula dictionary generator and check)", () => {
  it("every formulaKey is paired with its module literal, the dictionary matches it, and no formula holds a control character", { timeout: 60_000 }, () => {
    // Exit code 0 = no DRIFT / BRAK / NIESPARZONY / NIEUŻYWANY / BRAK_EN_RU / ZNAK_STERUJĄCY; a failure prints the list.
    const wyjscie = execFileSync("node", [SKRYPT], { encoding: "utf8" })
    expect(wyjscie).toContain("generuj-formuly OK")
  })
})
