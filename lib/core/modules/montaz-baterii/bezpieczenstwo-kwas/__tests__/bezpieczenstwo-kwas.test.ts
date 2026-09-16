import { describe, expect, it } from "vitest"
import { calculateBezpieczenstwoKwas } from "../calculator"

describe("calculateBezpieczenstwoKwas", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/4", () => {
    const result = calculateBezpieczenstwoKwas({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 4 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculateBezpieczenstwoKwas({
      potwierdzoneIds: ["okulary", "rekawice"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(2)
  })

  it("wszystkie potwierdzone -> VALID, 4/4", () => {
    const result = calculateBezpieczenstwoKwas({
      potwierdzoneIds: ["okulary", "rekawice", "soda-oczyszczona", "procedura-kontaktu"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 4, razem: 4 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculateBezpieczenstwoKwas({
      potwierdzoneIds: ["okulary", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
