import { describe, expect, it } from "vitest"
import { calculateKategorieSpecjalne } from "../calculator"

describe("calculateKategorieSpecjalne", () => {
  it("szlifierka 800W przez 30 min + spawarka 3000W przez 15 min -> 400 + 750 = 1150 Wh", () => {
    const result = calculateKategorieSpecjalne({
      kategoria: "warsztat",
      pozycje: [
        { id: "1", nazwa: "Szlifierka", mocW: 800, czasMin: 30 },
        { id: "2", nazwa: "Spawarka", mocW: 3000, czasMin: 15 },
      ],
    })
    expect(result.value.energiaWh).toBeCloseTo(1150, 6)
    expect(result.status).toBe("VALID")
  })

  it("pusta lista pozycji -> INCOMPLETE, BRAK-ZAZNACZONYCH", () => {
    const result = calculateKategorieSpecjalne({ kategoria: "gospodarstwo", pozycje: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings[0].code).toBe("BRAK-ZAZNACZONYCH")
  })

  it("pozycja z mocą 0 -> INVALID_INPUT, POZYCJA-NIEDODATNIA bez message", () => {
    const result = calculateKategorieSpecjalne({
      kategoria: "oswietlenie-terenowe",
      pozycje: [{ id: "1", nazwa: "Lampa podjazdowa", mocW: 0, czasMin: 60 }],
    })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.i18nKey).toBe("POZYCJA-NIEDODATNIA")
    expect(w.message).toBeUndefined()
  })
})
