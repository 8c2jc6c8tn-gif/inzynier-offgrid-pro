import { describe, expect, it } from "vitest"
import { CIEPLO_WLASCIWE_POWIETRZA_J_KG_K, GESTOSC_POWIETRZA_KG_M3 } from "../../wentylacja-odzysk-ciepla/constants"
import { calculateWentylacjaGrawitacyjna } from "../calculator"
import type { WentylacjaGrawitacyjnaInput } from "../input"

const RHO_CP_WH = (GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K) / 3600

const BAZA: WentylacjaGrawitacyjnaInput = {
  kubaturaM3: 300,
  wymianyNaDobe: 8,
  tWewC: 20,
  tZewnC: 0,
  stratyPozostaleW: 0,
  sprawnoscOdzyskuPct: 0,
  dni: 0,
  szczelnyDom: false,
}

describe("calculateWentylacjaGrawitacyjna (M6/E9, dawne 5.9)", () => {
  it("8 wymian/dobę × 300 m³ = 100 m³/h; strata = V̇·ρ·cp·ΔT (echo E3/E12)", () => {
    const w = calculateWentylacjaGrawitacyjna(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.strumienM3H).toBeCloseTo(100, 12)
    expect(w.value.wymianyNaGodzine).toBeCloseTo(1 / 3, 12)
    expect(w.value.stratyW).toBeCloseTo(100 * RHO_CP_WH * 20, 9)
    expect(w.value.stratyDobaKwh).toBeCloseTo((100 * RHO_CP_WH * 20 * 24) / 1000, 9)
    expect(w.value.udzialPct).toBeNull()
  })

  it("przykład źródła „15% strat → rekuperacja 5%” zgadza się przy sprawności ok. 70%", () => {
    const wentW = 100 * RHO_CP_WH * 20
    const pozostale = (wentW * 85) / 15
    const w = calculateWentylacjaGrawitacyjna({ ...BAZA, stratyPozostaleW: pozostale, sprawnoscOdzyskuPct: 70 })
    expect(w.value.udzialPct).toBeCloseTo(15, 9)
    expect(w.value.udzialRekuperacjaPct).toBeCloseTo((15 * 0.3) / (85 + 15 * 0.3) * 100, 9)
    expect(Math.round(w.value.udzialRekuperacjaPct!)).toBe(5)
  })

  it("suma okresu; 🟡 szczelny dom (ostrzeżenie Ekranu 20)", () => {
    const w = calculateWentylacjaGrawitacyjna({ ...BAZA, dni: 31, szczelnyDom: true })
    expect(w.value.stratyOkresKwh).toBeCloseTo(w.value.stratyDobaKwh * 31, 9)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["WPOR-NATURALNA-SZCZELNY-DOM", "warning"]])
  })

  it("brak danych → INCOMPLETE; ujemne / sprawność > 100% → INVALID_INPUT", () => {
    expect(calculateWentylacjaGrawitacyjna({ ...BAZA, tZewnC: null }).status).toBe("INCOMPLETE")
    expect(calculateWentylacjaGrawitacyjna({ ...BAZA, kubaturaM3: 0 }).status).toBe("INCOMPLETE")
    expect(calculateWentylacjaGrawitacyjna({ ...BAZA, dni: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateWentylacjaGrawitacyjna({ ...BAZA, sprawnoscOdzyskuPct: 110 }).status).toBe("INVALID_INPUT")
  })
})
