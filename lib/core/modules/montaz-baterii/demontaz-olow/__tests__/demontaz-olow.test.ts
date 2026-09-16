import { describe, expect, it } from "vitest"
import { calculateDemontazOlow } from "../calculator"

const WSZYSTKIE_KROKI = ["odlacz-minus", "odlacz-plus", "rozpiecie-szeregu", "zaslepki", "brak-metalu"]

describe("calculateDemontazOlow", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/5, brak ostrzeżeń", () => {
    const result = calculateDemontazOlow({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzoneWKolejnosci: 0, razem: 5 })
    expect(result.warnings).toHaveLength(0)
  })

  it("kroki po kolei, częściowo -> INCOMPLETE, bez ostrzeżeń", () => {
    const result = calculateDemontazOlow({
      potwierdzoneIds: ["odlacz-minus", "odlacz-plus"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzoneWKolejnosci).toBe(2)
    expect(result.warnings).toHaveLength(0)
  })

  it("wszystkie kroki po kolei -> VALID, 5/5", () => {
    const result = calculateDemontazOlow({ potwierdzoneIds: WSZYSTKIE_KROKI })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzoneWKolejnosci: 5, razem: 5 })
    expect(result.warnings).toHaveLength(0)
  })

  it("krok potwierdzony poza kolejnością -> VALID_WITH_WARNINGS, nie liczy się do postępu", () => {
    const result = calculateDemontazOlow({
      potwierdzoneIds: ["odlacz-minus", "brak-metalu"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzoneWKolejnosci).toBe(1)
    expect(result.warnings.some((w) => w.code === "KROK-POZA-KOLEJNOSCIA")).toBe(true)
  })

  it("nieznane id w zestawie nie przerywa liczenia kolejnych, znanych kroków", () => {
    const result = calculateDemontazOlow({
      potwierdzoneIds: ["odlacz-minus", "nieistniejace", "odlacz-plus"],
    })
    expect(result.value.potwierdzoneWKolejnosci).toBe(2)
    expect(result.status).toBe("INCOMPLETE")
  })
})
