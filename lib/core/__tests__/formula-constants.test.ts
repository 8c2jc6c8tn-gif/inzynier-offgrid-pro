import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { latexLiczba } from "../latex"
import { calculateDepozyt } from "../modules/siec/depozyt-prosumencki/calculator"
import { calculateWindChill } from "../modules/stress-test/wind-chill/calculator"

/**
 * Decimal numbers that are part of the formula's structure, not engine constants
 * (½ in the kinetic pressure, 3,6·10⁶ J per kWh).
 */
const STRUKTURALNE = ["0{,}5 \\\\times \\\\rho", "3{,}6\\\\cdot 10^6"]

function plikiKalkulatorow(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return e.name === "__tests__" ? [] : plikiKalkulatorow(p)
    return e.name === "calculator.ts" ? [p] : []
  })
}

describe("FORMULA — numbers come from engine constants (8.4b)", () => {
  it("latexLiczba writes the decimal comma LaTeX needs", () => {
    expect(latexLiczba(1.25)).toBe("1{,}25")
    expect(latexLiczba("0.001163")).toBe("0{,}001163")
    expect(latexLiczba(284)).toBe("284")
  })

  it("no calculator retypes a decimal constant into its FORMULA literal", () => {
    const zle = plikiKalkulatorow(join(process.cwd(), "lib/core/modules")).flatMap((p) =>
      readFileSync(p, "utf8")
        .split("\n")
        .filter((l) => /\d\{,\}\d/.test(l) && !STRUKTURALNE.some((s) => l.includes(s)))
        .map((l) => `${p}: ${l.trim()}`),
    )
    expect(zle).toEqual([])
  })

  it("wind chill: formula shows the coefficients the calculation uses", () => {
    const r = calculateWindChill({ temperaturaC: -10, predkoscWiatruKmh: 40 })
    expect(r.formula).toBe("WC = 13{,}12 + 0{,}6215T - 11{,}37V^{0{,}16} + 0{,}3965TV^{0{,}16}")
    expect(r.value.temperaturaOdczuwalnaC).toBeCloseTo(-20.8, 1)
  })

  it("prosumer deposit: formula carries the dated statutory rates for the month", () => {
    const baza = {
      dataMiesiaca: "2026-05-15",
      energiaOddanaKwh: 2000,
      cenaRynkowaZlMwh: 450,
      wykorzystanoZl: null,
      pelnyKosztKwhBruttoZl: null,
    }
    expect(calculateDepozyt({ ...baza, systemCeny: "rce" }).formula).toMatch(/k_\{dep\} = 1\{,\}23,\\ p = 30\\%$/)
    expect(calculateDepozyt({ ...baza, systemCeny: "rcem" }).formula).toMatch(/p = 20\\%$/)
  })
})
