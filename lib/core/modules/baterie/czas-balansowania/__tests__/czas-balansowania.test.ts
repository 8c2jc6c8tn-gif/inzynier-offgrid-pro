import { describe, expect, it } from "vitest"
import { calculateCzasBalansowania } from "../calculator"

const BAZA = { pojemnoscAh: 314, rozjazdProc: 3, pradBalanseraA: 2, oknoGodzinDobe: 0 }

describe("calculateCzasBalansowania", () => {
  it("INCOMPLETE when any of capacity, mismatch, current is not entered", () => {
    expect(calculateCzasBalansowania({ ...BAZA, pojemnoscAh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateCzasBalansowania({ ...BAZA, rozjazdProc: 0 }).status).toBe("INCOMPLETE")
    expect(calculateCzasBalansowania({ ...BAZA, pradBalanseraA: 0 }).status).toBe("INCOMPLETE")
  })

  it("314 Ah × 3% = 9.42 Ah; at 2 A the balancer runs 4.71 h", () => {
    const r = calculateCzasBalansowania(BAZA)
    expect(r.value.ahDoPrzeniesienia).toBeCloseTo(9.42, 2)
    expect(r.value.czasPracyH).toBeCloseTo(4.71, 2)
    expect(r.value.dniOkna).toBeNull()
  })

  it("no window entered → info CB-BRAK-OKNA, VALID_WITH_WARNINGS", () => {
    const r = calculateCzasBalansowania(BAZA)
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.map((w) => w.code)).toEqual(["CB-BRAK-OKNA"])
  })

  it("window of 2 h/day → 2.36 days and warning CB-WIELE-DNI", () => {
    const r = calculateCzasBalansowania({ ...BAZA, oknoGodzinDobe: 2 })
    expect(r.value.dniOkna).toBeCloseTo(2.36, 2)
    expect(r.warnings.map((w) => w.code)).toEqual(["CB-WIELE-DNI"])
  })

  it("window of 6 h/day fits in one day → VALID, no warnings", () => {
    const r = calculateCzasBalansowania({ ...BAZA, oknoGodzinDobe: 6 })
    expect(r.value.dniOkna).toBeCloseTo(0.79, 2)
    expect(r.status).toBe("VALID")
    expect(r.warnings).toEqual([])
  })

  it("INVALID_INPUT — negative values, mismatch over 100%, window over 24 h", () => {
    expect(calculateCzasBalansowania({ ...BAZA, pojemnoscAh: -1 }).warnings[0].code).toBe("CB-WARTOSC-UJEMNA")
    expect(calculateCzasBalansowania({ ...BAZA, rozjazdProc: 101 }).warnings[0].code).toBe("CB-ROZJAZD-POZA-ZAKRESEM")
    expect(calculateCzasBalansowania({ ...BAZA, oknoGodzinDobe: 25 }).warnings[0].code).toBe("CB-OKNO-POZA-ZAKRESEM")
    expect(calculateCzasBalansowania({ ...BAZA, pradBalanseraA: -2 }).status).toBe("INVALID_INPUT")
  })
})
