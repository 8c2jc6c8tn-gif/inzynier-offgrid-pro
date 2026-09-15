import { describe, expect, it } from "vitest"
import { calculatePorownanieTechnologii } from "../calculator"

describe("calculatePorownanieTechnologii", () => {
  it("baseline (bez podanej pojemności): 4 technologie, licza dla 1 kWh", () => {
    const result = calculatePorownanieTechnologii({})
    expect(result.status).toBe("VALID")
    expect(result.value).toHaveLength(4)
    expect(result.assumptions.some((a) => typeof a === "string" && a.includes("baseline"))).toBe(true)

    // referencja ręczna: LiFePO4 -> 1 kWh × 5000 cykli × 0,8 DoD = 4000 kWh
    const lifepo4 = result.value.find((t) => t.id === "lifepo4")
    expect(lifepo4?.energiaCalkowitaKwh).toBe(4000)

    // AGM -> 1 × 400 × 0,5 = 200 kWh
    const agm = result.value.find((t) => t.id === "agm")
    expect(agm?.energiaCalkowitaKwh).toBe(200)
  })

  it("z podaną pojemnością 45 kWh: skaluje liniowo (referencja ręczna: LiFePO4 45×5000×0,8=180000)", () => {
    const result = calculatePorownanieTechnologii({ pojemnoscKwh: 45 })
    expect(result.status).toBe("VALID")
    const lifepo4 = result.value.find((t) => t.id === "lifepo4")
    expect(lifepo4?.energiaCalkowitaKwh).toBe(180000)
  })

  it("technologia trakcyjna ma sprawnoscPct = null (źródło nie podaje wartości)", () => {
    const result = calculatePorownanieTechnologii({})
    const trakcyjna = result.value.find((t) => t.id === "trakcyjna")
    expect(trakcyjna?.sprawnoscPct).toBeNull()
  })

  it("błędne dane: pojemność ujemna -> INVALID_INPUT, pusta lista", () => {
    const result = calculatePorownanieTechnologii({ pojemnoscKwh: -10 })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.value).toEqual([])
  })

  it("brak danych: pojemność 0 -> INVALID_INPUT", () => {
    const result = calculatePorownanieTechnologii({ pojemnoscKwh: 0 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
