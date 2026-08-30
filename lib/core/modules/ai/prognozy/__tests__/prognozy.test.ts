import { describe, expect, it } from "vitest"
import { calculatePrognozy } from "../calculator"
import { SAMPLE_PROGNOZA_24H } from "../constants"

describe("calculatePrognozy", () => {
  it("pusta lista -> INCOMPLETE", () => {
    const result = calculatePrognozy([])
    expect(result.status).toBe("INCOMPLETE")
  })

  it("referencja ręczna: 2 punkty, suma i bilans policzone poprawnie", () => {
    const result = calculatePrognozy([
      { godzina: 0, produkcjaKw: 1, zuzycieKw: 2 },
      { godzina: 1, produkcjaKw: 3, zuzycieKw: 1 },
    ])
    expect(result.status).toBe("VALID")
    expect(result.value.produkcjaLacznaKwh).toBe(4)
    expect(result.value.zuzycieLaczneKwh).toBe(3)
    expect(result.value.bilansKwh).toBe(1)
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
    expect(result.value.bilansKwh).toBeCloseTo(9.1 - 8.7, 6)
  })
})
