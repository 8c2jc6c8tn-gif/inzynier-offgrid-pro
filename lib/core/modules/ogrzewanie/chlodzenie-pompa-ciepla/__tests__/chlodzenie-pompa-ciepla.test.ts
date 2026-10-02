import { describe, expect, it } from "vitest"
import { calculateChlodzeniePompaCiepla } from "../calculator"
import type { ChlodzeniePompaCieplaInput } from "../input"

const baza: ChlodzeniePompaCieplaInput = {
  chlodDobaKwh: 16,
  eerPompy: 4,
  eerKlimatyzatora: 2,
  mocObiegowejW: 0,
  godzinyFreeCoolingH: 0,
  tZasilaniaC: null,
  tPomieszczeniaC: null,
  wilgotnoscPct: 0,
  cieploSezonKwh: 0,
  copPompy: 0,
  copKlimatyzatora: 0,
}

describe("chłodzenie latem (dawne 5.29, 5.47, 5.51, 5.53)", () => {
  it("5.29: 4 kWh/dobę pompą zamiast 8 kWh klimatyzatorem (EER 4 vs 2)", () => {
    const r = calculateChlodzeniePompaCiepla(baza)
    expect(r.value.pradPompyKwh).toBeCloseTo(4, 9)
    expect(r.value.pradKlimatyzatoraKwh).toBeCloseTo(8, 9)
    expect(r.status).toBe("VALID")
  })

  it("5.47: free cooling 50 W × 4 h = 0,2 kWh/dobę + założenie o pokryciu", () => {
    const r = calculateChlodzeniePompaCiepla({ ...baza, mocObiegowejW: 50, godzinyFreeCoolingH: 4 })
    expect(r.value.pradFreeCoolingKwh).toBeCloseTo(0.2, 9)
    expect(r.assumptions).toContainEqual({ kod: "CHL-ZAL-FREE-COOLING" })
  })

  it("punkt rosy 25 °C / 60% ≈ 16,7 °C — zasilanie 16 °C → 🔴, 18 °C → bez ostrzeżenia", () => {
    const zimno = calculateChlodzeniePompaCiepla({ ...baza, tZasilaniaC: 16, tPomieszczeniaC: 25, wilgotnoscPct: 60 })
    expect(zimno.value.punktRosyC).toBeCloseTo(16.7, 1)
    expect(zimno.warnings.map((w) => w.code)).toEqual(["CHL-PONIZEJ-ROSY"])
    expect(zimno.warnings[0].level).toBe("critical")
    expect(calculateChlodzeniePompaCiepla({ ...baza, tZasilaniaC: 18, tPomieszczeniaC: 25, wilgotnoscPct: 60 }).warnings).toEqual([])
  })

  it("5.51: COP 4,5 vs 3,0 → 33% mniej prądu w grzaniu (nie 40% z przykładu)", () => {
    const r = calculateChlodzeniePompaCiepla({ ...baza, cieploSezonKwh: 9000, copPompy: 4.5, copKlimatyzatora: 3 })
    expect(r.value.grzanieOszczednoscPct).toBeCloseTo(100 / 3, 9)
  })

  it("brak EER pompy → INCOMPLETE; wilgotność 120% → INVALID_INPUT", () => {
    expect(calculateChlodzeniePompaCiepla({ ...baza, eerPompy: 0 }).status).toBe("INCOMPLETE")
    expect(calculateChlodzeniePompaCiepla({ ...baza, wilgotnoscPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
