import { describe, expect, it } from "vitest"
import { calculateZlaczaMc4 } from "../calculator"

describe("calculateZlaczaMc4", () => {
  it("ten sam producent po obu stronach -> VALID, zgodne", () => {
    const result = calculateZlaczaMc4({
      producentZenski: "Stäubli (oryginalny MC4)",
      producentMeski: "Stäubli (oryginalny MC4)",
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zgodne).toBe(true)
    expect(result.warnings[0].code).toBe("ZLACZA-MC4-ZGODNE")
  })

  it("KRYTYCZNE — mieszani producenci (realne ryzyko łukowania/pożaru)", () => {
    const result = calculateZlaczaMc4({
      producentZenski: "Stäubli (oryginalny MC4)",
      producentMeski: "Amphenol H4",
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zgodne).toBe(false)
    expect(result.warnings.some((w) => w.code === "MIESZANI-PRODUCENCI-MC4" && w.level === "critical")).toBe(true)
  })

  it("obie strony 'Inny / nieznany', ten sam wybór -> ostrzeżenie (nie da się potwierdzić zgodności)", () => {
    const result = calculateZlaczaMc4({
      producentZenski: "Inny / nieznany",
      producentMeski: "Inny / nieznany",
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zgodne).toBe(false)
    expect(result.warnings.some((w) => w.code === "PRODUCENT-MC4-NIEZNANY")).toBe(true)
  })

  it("INCOMPLETE — brak wyboru jednej strony", () => {
    const result = calculateZlaczaMc4({ producentZenski: "Stäubli (oryginalny MC4)", producentMeski: "" })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): warningi mają i18nKey, nie message", () => {
    const result = calculateZlaczaMc4({
      producentZenski: "Stäubli (oryginalny MC4)",
      producentMeski: "Amphenol H4",
    })
    expect(result.warnings[0].i18nKey).toBe("MIESZANI-PRODUCENCI-MC4")
    expect(result.warnings[0].message).toBeUndefined()
  })
})
