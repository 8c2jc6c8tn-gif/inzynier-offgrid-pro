import { describe, expect, it } from "vitest"
import { calculateMontazMechanicznyOlow } from "../calculator"

describe("calculateMontazMechanicznyOlow", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/4", () => {
    const result = calculateMontazMechanicznyOlow({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 4 })
  })

  it("częściowo potwierdzone -> INCOMPLETE", () => {
    const result = calculateMontazMechanicznyOlow({
      potwierdzoneIds: ["nosnosc-podloza", "stabilne-mocowanie"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(2)
  })

  it("wszystkie potwierdzone -> VALID, 4/4", () => {
    const result = calculateMontazMechanicznyOlow({
      potwierdzoneIds: ["nosnosc-podloza", "stabilne-mocowanie", "wentylacja", "dala-od-iskier"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 4, razem: 4 })
  })

  it("nieznane id ignorowane", () => {
    const result = calculateMontazMechanicznyOlow({
      potwierdzoneIds: ["nosnosc-podloza", "nieistniejace"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
