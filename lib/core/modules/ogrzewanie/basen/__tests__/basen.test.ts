import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateBasen } from "../calculator"

describe("basen (dawne 5.48)", () => {
  it("przykład źródła: 40 m³ +1 °C, 8 kW → 46,5 kWh i 5,8 h (nie 5 h); COP 4,65 → 10 kWh", () => {
    const r = calculateBasen({ objetoscM3: 40, przyrostK: 1, mocPompyKw: 8, cop: 4.652, spadekNocK: 0 })
    expect(r.value.cieploKwh).toBeCloseTo(40000 * WSPOLCZYNNIK_KWH_NA_L_K, 9)
    expect(r.value.czasH).toBeCloseTo(5.81, 2)
    expect(r.value.pradKwh).toBeCloseTo(10, 2)
    expect(r.value.cieploNocKwh).toBeNull()
  })

  it("nocny spadek 3 K → dogrzanie 139,5 kWh ciepła; bez COP prąd null", () => {
    const r = calculateBasen({ objetoscM3: 40, przyrostK: 1, mocPompyKw: 8, cop: 0, spadekNocK: 3 })
    expect(r.value.cieploNocKwh).toBeCloseTo(3 * 40000 * WSPOLCZYNNIK_KWH_NA_L_K, 9)
    expect(r.value.pradNocKwh).toBeNull()
  })

  it("brak objętości → INCOMPLETE; COP 0,5 → INVALID_INPUT", () => {
    expect(calculateBasen({ objetoscM3: 0, przyrostK: 1, mocPompyKw: 8, cop: 0, spadekNocK: 0 }).status).toBe("INCOMPLETE")
    expect(calculateBasen({ objetoscM3: 40, przyrostK: 1, mocPompyKw: 8, cop: 0.5, spadekNocK: 0 }).status).toBe("INVALID_INPUT")
  })
})
