import { describe, expect, it } from "vitest"
import { formatujMoment, TYPY_OGNIW, znajdzTypOgniwa } from "../constants"

describe("znajdzTypOgniwa", () => {
  it("znajduje istniejący typ po id", () => {
    expect(znajdzTypOgniwa("280ah-m6")?.gwint).toBe("M6")
  })

  it("zwraca undefined dla nieznanego id", () => {
    expect(znajdzTypOgniwa("nieistniejacy")).toBeUndefined()
  })

  it("każdy typ ma unikalne id", () => {
    const ids = TYPY_OGNIW.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("formatujMoment", () => {
  it("formatuje zakres (280 Ah, 6-7 N·m)", () => {
    expect(formatujMoment(znajdzTypOgniwa("280ah-m6")!.moment)).toBe("6–7 N·m")
  })

  it("formatuje maksimum (EVE MB31, maks. 6 N·m)", () => {
    expect(formatujMoment(znajdzTypOgniwa("eve-mb31-m6")!.moment)).toBe("maks. 6 N·m")
  })

  it("zachowuje oryginalną wartość generyczną 4-4,5 N·m (nie usunięta, tylko przeniesiona do wyboru)", () => {
    expect(formatujMoment(znajdzTypOgniwa("generic-m6")!.moment)).toBe("4–4,5 N·m")
  })

  it("fallback 'inne' M6 = bezpieczna najniższa wartość (4 N·m), M8 = 8 N·m", () => {
    expect(formatujMoment(znajdzTypOgniwa("inne-m6")!.moment)).toBe("maks. 4 N·m")
    expect(formatujMoment(znajdzTypOgniwa("inne-m8")!.moment)).toBe("maks. 8 N·m")
  })
})
