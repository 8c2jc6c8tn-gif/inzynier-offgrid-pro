import { describe, expect, it } from "vitest"
import { obliczStrumienCieplaPowietrzaW } from "../../wentylacja-odzysk-ciepla/calculator"
import { calculateGwcPompaCiepla } from "../calculator"

const baza = {
  strumienGwcM3H: 600,
  przyrostGwcK: 6,
  strumienParownikaM3H: 1200,
  mocPompyKw: 6,
  copBezGwc: 3,
  copZGwc: 0,
  cieploKwh: 0,
}

describe("GWC jako wsparcie pompy ciepła (dawne 5.54)", () => {
  it("600 m³/h z GWC +6 K na parownik 1200 m³/h → +3 K na wlocie; ℹ️ tylko wsparcie", () => {
    const r = calculateGwcPompaCiepla(baza)
    expect(r.value.wzrostTempParownikaK).toBeCloseTo(3, 9)
    expect(r.value.mocGwcKw).toBeCloseTo(obliczStrumienCieplaPowietrzaW(600, 6) / 1000, 9)
    expect(r.value.mocDolnegoZrodlaKw).toBeCloseTo(4, 9)
    expect(r.value.udzialGwcPct).toBeCloseTo((r.value.mocGwcKw / 4) * 100, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["GWP-TYLKO-WSPARCIE"])
    expect(r.value.wzrostCopPct).toBeNull()
  })

  it("przykład źródła: COP 3,0 → 3,18 z karty = +6%; 6000 kWh ciepła → oszczędność Q(1/3 − 1/3,18)", () => {
    const r = calculateGwcPompaCiepla({ ...baza, copZGwc: 3.18, cieploKwh: 6000 })
    expect(r.value.wzrostCopPct).toBeCloseTo(6, 9)
    expect(r.value.oszczednoscKwh).toBeCloseTo(6000 * (1 / 3 - 1 / 3.18), 9)
  })

  it("GWC większy niż parownik → pełne ΔT, liczy się tylko strumień parownika; brak COP → INCOMPLETE; COP 0,5 → INVALID_INPUT", () => {
    const r = calculateGwcPompaCiepla({ ...baza, strumienGwcM3H: 2000 })
    expect(r.value.wzrostTempParownikaK).toBeCloseTo(6, 9)
    expect(r.value.mocGwcKw).toBeCloseTo(obliczStrumienCieplaPowietrzaW(1200, 6) / 1000, 9)
    expect(calculateGwcPompaCiepla({ ...baza, copBezGwc: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGwcPompaCiepla({ ...baza, copZGwc: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
