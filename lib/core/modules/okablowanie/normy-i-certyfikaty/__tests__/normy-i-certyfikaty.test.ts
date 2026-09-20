import { describe, expect, it } from "vitest"
import { calculateNormyICertyfikaty } from "../calculator"

describe("calculateNormyICertyfikaty", () => {
  it("INCOMPLETE — nic jeszcze nie potwierdzone", () => {
    const result = calculateNormyICertyfikaty({ potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(0)
  })

  it("częściowo potwierdzone -> VALID_WITH_WARNINGS, brakujące jako critical", () => {
    const result = calculateNormyICertyfikaty({ potwierdzoneIds: ["panele", "falownik"] })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzone).toBe(2)
    expect(result.warnings.some((w) => w.code === "BRAK-CERTYFIKATU")).toBe(true)
    expect(result.warnings).toHaveLength(2)
  })

  it("wszystkie potwierdzone -> VALID, bez ostrzeżeń", () => {
    const result = calculateNormyICertyfikaty({
      potwierdzoneIds: ["panele", "falownik", "baterie-litowe", "pozostale"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value.potwierdzone).toBe(4)
    expect(result.warnings).toHaveLength(0)
  })

  it("ignoruje nieznane/duplikowane id", () => {
    const result = calculateNormyICertyfikaty({ potwierdzoneIds: ["panele", "panele", "nieistniejace-id"] })
    expect(result.value.potwierdzone).toBe(1)
  })
})
