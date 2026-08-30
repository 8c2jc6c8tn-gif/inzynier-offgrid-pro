import { describe, expect, it } from "vitest"
import { calculateMomentDokrecania } from "../calculator"

describe("calculateMomentDokrecania", () => {
  it("brak potwierdzeń -> INCOMPLETE, 0/3", () => {
    const result = calculateMomentDokrecania({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 0, razem: 3 })
  })

  it("częściowo potwierdzone -> INCOMPLETE, 2/3", () => {
    const result = calculateMomentDokrecania({
      potwierdzoneIds: ["terminal-m6", "terminal-m8"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value).toEqual({ potwierdzone: 2, razem: 3 })
  })

  it("wszystkie potwierdzone -> VALID, 3/3", () => {
    const result = calculateMomentDokrecania({
      potwierdzoneIds: ["terminal-m6", "terminal-m8", "kontrola-24h"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 3, razem: 3 })
  })

  it("nieznane id w liście jest ignorowane, nie liczy się do postępu", () => {
    const result = calculateMomentDokrecania({
      potwierdzoneIds: ["terminal-m6", "nieistniejacy-krok"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })

  it("duplikat id w liście nie zawyża postępu", () => {
    const result = calculateMomentDokrecania({
      potwierdzoneIds: ["terminal-m6", "terminal-m6"],
    })
    expect(result.value.potwierdzone).toBe(1)
  })
})
