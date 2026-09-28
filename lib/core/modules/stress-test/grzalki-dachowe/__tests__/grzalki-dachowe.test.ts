import { describe, expect, it } from "vitest"
import { calculateGrzalkiDachowe } from "../calculator"
import type { GrzalkiDachoweInput } from "../input"

const BAZA: GrzalkiDachoweInput = {
  dlugoscKablaM: 12,
  mocNaMetrW: 30,
  godzinyPracyNaDobe: 6,
  mocPompyCieplaW: null,
  zapasMocyW: null,
}

describe("calculateGrzalkiDachowe (M7/E11, dawne 6.16)", () => {
  it("przykład źródła: 12 m × 30 W/m = 360 W; 6 h → 2,16 kWh/dobę", () => {
    const w = calculateGrzalkiDachowe(BAZA)
    expect(w.value.mocW).toBe(360)
    expect(w.value.energiaKwhDoba).toBeCloseTo(2.16, 12)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["GRZALKI-SPRAWDZ-ZAPAS"])
  })

  it("grzałki mocniejsze niż pompa ciepła → 🟡 ze źródła; równe → bez ostrzeżenia", () => {
    const w = calculateGrzalkiDachowe({ ...BAZA, mocPompyCieplaW: 300, zapasMocyW: 1000 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["GRZALKI-WIEKSZE-NIZ-POMPA"])
    expect(calculateGrzalkiDachowe({ ...BAZA, mocPompyCieplaW: 360, zapasMocyW: 1000 }).warnings).toEqual([])
  })

  it("moc ponad zapas → 🟡; równa zapasowi → OK", () => {
    expect(calculateGrzalkiDachowe({ ...BAZA, zapasMocyW: 300 }).warnings.map((x) => x.code)).toEqual([
      "GRZALKI-BRAK-ZAPASU-MOCY",
    ])
    expect(calculateGrzalkiDachowe({ ...BAZA, zapasMocyW: 360 }).status).toBe("VALID")
  })

  it("brak długości, mocy na metr albo czasu → INCOMPLETE", () => {
    expect(calculateGrzalkiDachowe({ ...BAZA, dlugoscKablaM: null }).status).toBe("INCOMPLETE")
    expect(calculateGrzalkiDachowe({ ...BAZA, mocNaMetrW: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGrzalkiDachowe({ ...BAZA, godzinyPracyNaDobe: null }).status).toBe("INCOMPLETE")
  })

  it("wartość ujemna i czas > 24 h → INVALID_INPUT z polami", () => {
    const w = calculateGrzalkiDachowe({ ...BAZA, dlugoscKablaM: -1, godzinyPracyNaDobe: 25 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["dlugoscKablaM", "godzinyPracyNaDobe"])
  })
})
