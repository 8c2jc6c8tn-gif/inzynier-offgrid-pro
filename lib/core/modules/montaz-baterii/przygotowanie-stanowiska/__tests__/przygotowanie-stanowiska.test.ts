import { describe, expect, it } from "vitest"
import { calculatePrzygotowanieStanowiska } from "../calculator"

describe("calculatePrzygotowanieStanowiska", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/6", () => {
    const result = calculatePrzygotowanieStanowiska({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 6 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculatePrzygotowanieStanowiska({
      potwierdzoneIds: ["mata-izolacyjna", "rekawice", "okulary"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(3)
  })

  it("wszystkie potwierdzone -> VALID, 6/6", () => {
    const result = calculatePrzygotowanieStanowiska({
      potwierdzoneIds: [
        "mata-izolacyjna",
        "klucz-dynamometryczny",
        "rekawice",
        "okulary",
        "gasnica",
        "brak-metalu-luzem",
      ],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 6, razem: 6 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculatePrzygotowanieStanowiska({
      potwierdzoneIds: ["mata-izolacyjna", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
