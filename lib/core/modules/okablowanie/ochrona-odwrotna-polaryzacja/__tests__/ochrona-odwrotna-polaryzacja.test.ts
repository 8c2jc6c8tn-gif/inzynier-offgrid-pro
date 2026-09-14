import { describe, expect, it } from "vitest"
import { calculateOchronaOdwrotnaPolaryzacja } from "../calculator"

describe("calculateOchronaOdwrotnaPolaryzacja", () => {
  it("dioda blokująca zastosowana -> VALID", () => {
    const result = calculateOchronaOdwrotnaPolaryzacja({ miejsceObwodu: "panele", typOchrony: "dioda-blokujaca" })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("OCHRONA-ZASTOSOWANA")
  })

  it("wyłącznik z blokadą mechaniczną zastosowany -> VALID", () => {
    const result = calculateOchronaOdwrotnaPolaryzacja({
      miejsceObwodu: "bateria",
      typOchrony: "wylacznik-blokada-mechaniczna",
    })
    expect(result.status).toBe("VALID")
  })

  it("KRYTYCZNE — brak ochrony", () => {
    const result = calculateOchronaOdwrotnaPolaryzacja({ miejsceObwodu: "bateria", typOchrony: "brak" })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("BRAK-OCHRONY")
  })

  it("INCOMPLETE — typ ochrony niewybrany", () => {
    const result = calculateOchronaOdwrotnaPolaryzacja({ miejsceObwodu: null, typOchrony: null })
    expect(result.status).toBe("INCOMPLETE")
  })
})
