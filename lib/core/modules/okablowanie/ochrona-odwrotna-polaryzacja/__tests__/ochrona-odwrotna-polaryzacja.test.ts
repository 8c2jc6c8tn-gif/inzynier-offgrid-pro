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

  it("i18n (17.2): BRAK-OCHRONY, OCHRONA-ZASTOSOWANA i założenie mają i18nKey/kod, nie message/string", () => {
    const brak = calculateOchronaOdwrotnaPolaryzacja({ miejsceObwodu: "bateria", typOchrony: "brak" })
    expect(brak.warnings[0].i18nKey).toBe("BRAK-OCHRONY")
    expect(brak.warnings[0].message).toBeUndefined()
    expect(brak.assumptions).toEqual([{ kod: "REKOMENDACJA-TYPU-OCHRONY-NIE-PODANA" }])

    const ok = calculateOchronaOdwrotnaPolaryzacja({ miejsceObwodu: "panele", typOchrony: "dioda-blokujaca" })
    expect(ok.warnings[0].i18nKey).toBe("OCHRONA-ZASTOSOWANA")
    expect(ok.warnings[0].message).toBeUndefined()
  })
})
