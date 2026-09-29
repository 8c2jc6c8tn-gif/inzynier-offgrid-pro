import { describe, expect, it } from "vitest"
import { calculatePrognozy } from "../calculator"
import { SAMPLE_PROGNOZA_24H } from "../constants"

describe("calculatePrognozy", () => {
  it("pusta lista -> INCOMPLETE", () => {
    const result = calculatePrognozy([])
    expect(result.status).toBe("INCOMPLETE")
  })

  it("referencja ręczna: 2 punkty × 3 h — energia = Σ P × Δt", () => {
    const result = calculatePrognozy([
      { godzina: 0, produkcjaKw: 1, zuzycieKw: 2 },
      { godzina: 1, produkcjaKw: 3, zuzycieKw: 1 },
    ])
    expect(result.status).toBe("VALID")
    // (1 + 3) kW × 3 h = 12 kWh; (2 + 1) kW × 3 h = 9 kWh
    expect(result.value.produkcjaLacznaKwh).toBe(12)
    expect(result.value.zuzycieLaczneKwh).toBe(9)
    expect(result.value.bilansKwh).toBe(3)
    expect(result.formula).toContain("Δt = 3 h")
  })

  it("znajduje godzinę szczytu zużycia", () => {
    const result = calculatePrognozy([
      { godzina: 6, produkcjaKw: 0, zuzycieKw: 0.5 },
      { godzina: 18, produkcjaKw: 0, zuzycieKw: 2.4 },
      { godzina: 21, produkcjaKw: 0, zuzycieKw: 1.5 },
    ])
    expect(result.value.godzinaSzczytuZuzycia).toBe(18)
  })

  it("dane demonstracyjne SAMPLE_PROGNOZA_24H liczą się bez błędu", () => {
    const result = calculatePrognozy(SAMPLE_PROGNOZA_24H)
    expect(result.status).toBe("VALID")
    expect(result.value.godzinaSzczytuZuzycia).toBe(18)
    // Σ produkcja 9,1 kW × 3 h = 27,3 kWh; Σ zużycie 8,7 kW × 3 h = 26,1 kWh
    expect(result.value.produkcjaLacznaKwh).toBeCloseTo(27.3, 6)
    expect(result.value.zuzycieLaczneKwh).toBeCloseTo(26.1, 6)
    expect(result.value.bilansKwh).toBeCloseTo(1.2, 6)
  })
})
