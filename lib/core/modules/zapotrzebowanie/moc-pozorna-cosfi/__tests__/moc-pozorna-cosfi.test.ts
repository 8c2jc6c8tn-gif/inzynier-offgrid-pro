import { describe, expect, it } from "vitest"
import { calculateMocPozornaCosfi } from "../calculator"

describe("calculateMocPozornaCosfi", () => {
  it("VALID — domyślny cos φ 0,7: 2000W → 2857,1 VA", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 2000, cosFi: 0.7 })
    expect(result.status).toBe("VALID")
    expect(result.value.mocPozornaVA).toBeCloseTo(2857.1428571428573, 6)
  })

  it("cos φ = 1 (obciążenie rezystancyjne): moc pozorna = moc czynna", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 1000, cosFi: 1 })
    expect(result.value.mocPozornaVA).toBeCloseTo(1000, 6)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 0, cosFi: 0.7 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — cos φ poza zakresem (0,1]", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: 2000, cosFi: 1.5 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna moc czynna", () => {
    const result = calculateMocPozornaCosfi({ mocCzynnaW: -2000, cosFi: 0.7 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
