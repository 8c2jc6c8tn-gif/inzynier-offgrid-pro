import { describe, expect, it } from "vitest"
import { calculateNormyICertyfikaty } from "../calculator"
import { CHECKLIST_ITEMS } from "../constants"
import { t } from "@/lib/i18n/t"
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/language"

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

describe("normy-i-certyfikaty — i18n", () => {
  it("checklist labels and BRAK-CERTYFIKATU resolve in every UI language (no Polish data in EN)", () => {
    for (const item of CHECKLIST_ITEMS) {
      for (const jezyk of SUPPORTED_LANGUAGES) {
        expect(t(jezyk, item.komponentKey)).not.toMatch(/⚠/)
        expect(t(jezyk, item.normaKey)).not.toMatch(/⚠/)
      }
    }
    const w = calculateNormyICertyfikaty({ potwierdzoneIds: ["panele", "falownik", "baterie-litowe"] }).warnings[0]!
    expect(w.params).toEqual({ komponentKey: "CERT-KOMPONENT-POZOSTALE" })
    expect(t("en", w.i18nKey!, w.params)).toMatch(/^Other components/)
  })
})
