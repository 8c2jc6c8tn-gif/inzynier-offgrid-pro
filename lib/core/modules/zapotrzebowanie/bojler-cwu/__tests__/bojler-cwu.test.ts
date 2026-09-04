import { describe, expect, it } from "vitest"
import { calculateBojlerCwu } from "../calculator"

describe("calculateBojlerCwu", () => {
  it("VALID — 200l, ΔT=35K, zbliżone do przykładu źródła (ok. 8 kWh/dobę)", () => {
    const result = calculateBojlerCwu({
      wolumenCwuLDoba: 200,
      deltaTK: 35,
      mocGrzalkiKw: 2,
      pojemnoscBojleraL: 200,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.energiaDobowaKwh).toBeCloseTo(8.139444444444445, 9)
    expect(result.value.czasLadowaniaH).toBeCloseTo(8.139444444444445 / 2, 9)
    expect(result.warnings).toHaveLength(0)
  })

  it("VALID_WITH_WARNINGS — bojler mniejszy niż dobowe zapotrzebowanie", () => {
    const result = calculateBojlerCwu({
      wolumenCwuLDoba: 280,
      deltaTK: 35,
      mocGrzalkiKw: 2,
      pojemnoscBojleraL: 150,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("BOJLER-ZA-MALY")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("przypadek graniczny: ΔT=0 -> INCOMPLETE (nie wpisano)", () => {
    const result = calculateBojlerCwu({
      wolumenCwuLDoba: 200,
      deltaTK: 0,
      mocGrzalkiKw: 2,
      pojemnoscBojleraL: 200,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny wolumen", () => {
    const result = calculateBojlerCwu({
      wolumenCwuLDoba: -10,
      deltaTK: 35,
      mocGrzalkiKw: 2,
      pojemnoscBojleraL: 200,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemna moc grzałki", () => {
    const result = calculateBojlerCwu({
      wolumenCwuLDoba: 200,
      deltaTK: 35,
      mocGrzalkiKw: -2,
      pojemnoscBojleraL: 200,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
