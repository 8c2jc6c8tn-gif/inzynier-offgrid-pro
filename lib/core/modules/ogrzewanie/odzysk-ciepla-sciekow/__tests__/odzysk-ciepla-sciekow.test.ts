import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateOdzyskCieplaSciekow } from "../calculator"
import type { OdzyskCieplaSciekowInput } from "../input"

const baza: OdzyskCieplaSciekowInput = {
  litryDoba: 0,
  tSciekowC: 38,
  tZimnejC: 10,
  sprawnoscPct: 30,
  dniRok: 365,
  cwuKwhRok: 1825,
  copPodgrzewacza: 0,
}

describe("odzysk ciepła ze ścieków (dawne 5.41)", () => {
  it("przykład źródła: 0,5 kWh/dobę → 182,5 kWh/rok (źródło: 180) = 10% z 1825 kWh C.W.U.", () => {
    const litry = 0.5 / (WSPOLCZYNNIK_KWH_NA_L_K * 28 * 0.3)
    const r = calculateOdzyskCieplaSciekow({ ...baza, litryDoba: litry })
    expect(r.value.cieploDobaKwh).toBeCloseTo(0.5, 9)
    expect(r.value.cieploRokKwh).toBeCloseTo(182.5, 9)
    expect(r.value.udzialCwuPct).toBeCloseTo(10, 9)
    expect(r.warnings).toEqual([])
  })

  it("sprawność spoza widełek źródła 20–40% → ℹ️; z COP podgrzewacza 3 → prąd = ciepło / 3", () => {
    const r = calculateOdzyskCieplaSciekow({ ...baza, litryDoba: 60, sprawnoscPct: 55, copPodgrzewacza: 3 })
    expect(r.warnings.map((w) => w.code)).toEqual(["DWHR-SPRAWNOSC-SPOZA-ZRODLA"])
    expect(r.value.pradDobaKwh).toBeCloseTo(r.value.cieploDobaKwh / 3, 9)
    expect(r.status).toBe("VALID")
  })

  it("brak temperatury → INCOMPLETE; sprawność 120% → INVALID_INPUT", () => {
    expect(calculateOdzyskCieplaSciekow({ ...baza, litryDoba: 60, tZimnejC: null }).status).toBe("INCOMPLETE")
    expect(calculateOdzyskCieplaSciekow({ ...baza, litryDoba: 60, sprawnoscPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
