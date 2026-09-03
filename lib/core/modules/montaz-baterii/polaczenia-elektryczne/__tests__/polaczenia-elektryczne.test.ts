import { describe, expect, it } from "vitest"
import { calculatePolaczeniaElektryczne } from "../calculator"

describe("calculatePolaczeniaElektryczne", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/4", () => {
    const result = calculatePolaczeniaElektryczne({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzoneWKolejnosci: 0, razem: 4 })
  })

  it("pierwsze dwa kroki po kolei -> INCOMPLETE, 2/4", () => {
    const result = calculatePolaczeniaElektryczne({
      potwierdzoneIds: ["polaczenia-szeregowe", "szyny-zbiorcze"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzoneWKolejnosci).toBe(2)
  })

  it("wszystkie kroki po kolei -> VALID, 4/4", () => {
    const result = calculatePolaczeniaElektryczne({
      potwierdzoneIds: ["polaczenia-szeregowe", "szyny-zbiorcze", "styki-przetarte", "moment-dokrecenia"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value.potwierdzoneWKolejnosci).toBe(4)
  })

  it("krok zaznaczony poza kolejnością (pominięto szyny zbiorcze) -> ostrzeżenie, nie liczy się do postępu", () => {
    const result = calculatePolaczeniaElektryczne({
      potwierdzoneIds: ["polaczenia-szeregowe", "moment-dokrecenia"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzoneWKolejnosci).toBe(1)
    expect(result.warnings[0].code).toBe("KROK-POZA-KOLEJNOSCIA")
  })
})
