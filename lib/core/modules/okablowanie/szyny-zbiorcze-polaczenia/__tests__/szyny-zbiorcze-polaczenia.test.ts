import { describe, expect, it } from "vitest"
import { calculateSzynyZbiorczePolaczenia } from "../calculator"

describe("calculateSzynyZbiorczePolaczenia", () => {
  it("INCOMPLETE — 0/4 potwierdzone", () => {
    const result = calculateSzynyZbiorczePolaczenia({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 4 })
  })

  it("VALID — 4/4 potwierdzone", () => {
    const result = calculateSzynyZbiorczePolaczenia({
      potwierdzoneIds: ["zacisk-baterii-m8", "szyna-glowna-m10", "uziom-m8", "kontrola-24h"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 4, razem: 4 })
  })

  it("duplikaty liczone raz", () => {
    const result = calculateSzynyZbiorczePolaczenia({ potwierdzoneIds: ["uziom-m8", "uziom-m8"] })
    expect(result.value.potwierdzone).toBe(1)
  })
})
