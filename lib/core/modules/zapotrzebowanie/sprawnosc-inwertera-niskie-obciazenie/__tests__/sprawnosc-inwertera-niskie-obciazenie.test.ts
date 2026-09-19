import { describe, expect, it } from "vitest"
import { calculateSprawnoscInwertera } from "../calculator"

describe("calculateSprawnoscInwertera", () => {
  it("falownik 5kW, zapotrzebowanie 300W (6% obciążenia), sprawność 75% -> 400W realnego zużycia, +33,3% straty (nie +25% jak błędnie w przykładzie źródła)", () => {
    const result = calculateSprawnoscInwertera({
      zapotrzebowanieW: 300,
      mocFalownikaW: 5000,
      sprawnoscPct: 75,
    })
    expect(result.value.obciazenieFalownikaPct).toBeCloseTo(6, 6)
    expect(result.value.realneZuzycieW).toBeCloseTo(400, 6)
    expect(result.value.strataPct).toBeCloseTo(33.333333333333336, 6)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("NISKIE-OBCIAZENIE-FALOWNIKA")
  })

  it("obciążenie w zakresie optymalnym (60%), sprawność 95% -> info OBCIAZENIE-FALOWNIKA-OPTYMALNE, status VALID", () => {
    const result = calculateSprawnoscInwertera({
      zapotrzebowanieW: 3000,
      mocFalownikaW: 5000,
      sprawnoscPct: 95,
    })
    expect(result.value.obciazenieFalownikaPct).toBeCloseTo(60, 6)
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("OBCIAZENIE-FALOWNIKA-OPTYMALNE")
  })

  it("obciążenie pomiędzy strefami (20%) -> bez warningów, status VALID", () => {
    const result = calculateSprawnoscInwertera({
      zapotrzebowanieW: 1000,
      mocFalownikaW: 5000,
      sprawnoscPct: 88,
    })
    expect(result.warnings).toEqual([])
    expect(result.status).toBe("VALID")
  })

  it("sprawność poza zakresem (120%) -> INVALID_INPUT, SPRAWNOSC-PROCENT-POZA-ZAKRESEM bez message", () => {
    const result = calculateSprawnoscInwertera({
      zapotrzebowanieW: 300,
      mocFalownikaW: 5000,
      sprawnoscPct: 120,
    })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.i18nKey).toBe("SPRAWNOSC-PROCENT-POZA-ZAKRESEM")
    expect(w.message).toBeUndefined()
  })

  it("zapotrzebowanie ujemne -> INVALID_INPUT", () => {
    const result = calculateSprawnoscInwertera({ zapotrzebowanieW: -100, mocFalownikaW: 5000, sprawnoscPct: 90 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("moc falownika=0 (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateSprawnoscInwertera({ zapotrzebowanieW: 300, mocFalownikaW: 0, sprawnoscPct: 90 })
    expect(result.status).toBe("INCOMPLETE")
  })
})
