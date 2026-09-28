import { describe, expect, it } from "vitest"
import { calculateTestLicznika, obliczMocZDiodyKw } from "../calculator"

describe("calculateTestLicznika — D12/F11", () => {
  it("przykład kontrolny M14: 15 imp w 60 s, stała 1000 → 0,9 kW", () => {
    const r = calculateTestLicznika({ liczbaImpulsow: 15, czasS: 60, stalaImpKwh: 1000, mocOdbiornikaW: null })
    expect(r.status).toBe("VALID")
    expect(r.value.mocZLicznikaKw).toBeCloseTo(0.9, 12)
    // Minute form from the material: 15 imp/min × 60 / 1000.
    expect(obliczMocZDiodyKw(15, 60, 1000)).toBeCloseTo((15 * 60) / 1000, 12)
  })

  it("porównanie ze znanym odbiornikiem — różnica w %, bez werdyktu", () => {
    const r = calculateTestLicznika({ liczbaImpulsow: 15, czasS: 60, stalaImpKwh: 1000, mocOdbiornikaW: 1000 })
    expect(r.value.roznicaProcent).toBeCloseTo(-10, 9)
    expect(r.warnings[0].code).toBe("SIEC-LICZNIK-ROZNICA-BEZ-WERDYKTU")
  })

  it("brak danych → INCOMPLETE; ujemne → INVALID_INPUT", () => {
    expect(calculateTestLicznika({ liczbaImpulsow: 0, czasS: 60, stalaImpKwh: 1000, mocOdbiornikaW: null }).status).toBe("INCOMPLETE")
    expect(calculateTestLicznika({ liczbaImpulsow: 5, czasS: -1, stalaImpKwh: 1000, mocOdbiornikaW: null }).status).toBe("INVALID_INPUT")
  })
})
