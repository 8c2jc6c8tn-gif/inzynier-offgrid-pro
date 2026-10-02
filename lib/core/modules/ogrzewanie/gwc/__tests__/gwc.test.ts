import { describe, expect, it } from "vitest"
import { CIEPLO_WLASCIWE_POWIETRZA_J_KG_K, GESTOSC_POWIETRZA_KG_M3 } from "../../wentylacja-odzysk-ciepla/constants"
import { calculateGwc } from "../calculator"
import type { GwcInput } from "../input"

const RHO_CP_WH = (GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K) / 3600

const BAZA: GwcInput = {
  strumienM3H: 150,
  przyrostTempK: 4,
  godzinyPracyH: 24,
  sprawnoscRekuperatoraPct: 0,
  zapotrzebowanieDobaKwh: 0,
  cop: 0,
}

describe("calculateGwc (M6/E4, dawne 5.4)", () => {
  it("+4 K przy 150 m³/h przez dobę = V̇·ρ·cp·ΔT·24 h", () => {
    const w = calculateGwc(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.mocCieplnaW).toBeCloseTo(150 * RHO_CP_WH * 4, 9)
    expect(w.value.oszczednoscDobaKwh).toBeCloseTo((150 * RHO_CP_WH * 4 * 24) / 1000, 9)
  })

  it("przykład źródła „+4 °C → −5%”: spójny np. przy zapotrzebowaniu 20 × zysku doby (brak danych w źródle)", () => {
    const zysk = (150 * RHO_CP_WH * 4 * 24) / 1000
    const w = calculateGwc({ ...BAZA, zapotrzebowanieDobaKwh: zysk * 20, cop: 3 })
    expect(w.value.udzialPct).toBeCloseTo(5, 9)
    expect(w.value.oszczednoscPraduKwh).toBeCloseTo(zysk / 3, 9)
  })

  it("za rekuperatorem 80% GWC daje tylko 20% surowego zysku", () => {
    const bez = calculateGwc(BAZA).value.oszczednoscDobaKwh
    const z = calculateGwc({ ...BAZA, sprawnoscRekuperatoraPct: 80 })
    expect(z.value.oszczednoscDobaKwh).toBeCloseTo(bez * 0.2, 9)
    expect(z.assumptions).toContainEqual({ kod: "GWC-ZALOZENIE-REKUPERATOR" })
  })

  it("brak danych → INCOMPLETE; godziny > 24, COP < 1 → INVALID_INPUT", () => {
    expect(calculateGwc({ ...BAZA, przyrostTempK: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGwc({ ...BAZA, godzinyPracyH: 25 }).status).toBe("INVALID_INPUT")
    expect(calculateGwc({ ...BAZA, cop: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
