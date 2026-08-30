import { describe, expect, it } from "vitest"
import { calculateProceduraBlackStart } from "../calculator"

describe("calculateProceduraBlackStart", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/5", () => {
    const result = calculateProceduraBlackStart({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzoneWKolejnosci: 0, razem: 5 })
  })

  it("pierwsze dwa kroki po kolei -> INCOMPLETE, 2/5", () => {
    const result = calculateProceduraBlackStart({
      potwierdzoneIds: ["uruchom-agregat", "podlacz-do-ladowarki"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzoneWKolejnosci).toBe(2)
  })

  it("wszystkie kroki po kolei -> VALID, 5/5", () => {
    const result = calculateProceduraBlackStart({
      potwierdzoneIds: [
        "uruchom-agregat",
        "podlacz-do-ladowarki",
        "wybudz-bms",
        "naladuj-baterie",
        "wlacz-falownik",
      ],
    })
    expect(result.status).toBe("VALID")
    expect(result.value.potwierdzoneWKolejnosci).toBe(5)
  })

  it("krok zaznaczony poza kolejnością -> ostrzeżenie, nie liczy się do postępu", () => {
    const result = calculateProceduraBlackStart({
      potwierdzoneIds: ["uruchom-agregat", "wlacz-falownik"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzoneWKolejnosci).toBe(1)
    expect(result.warnings[0].code).toBe("KROK-POZA-KOLEJNOSCIA")
  })
})
