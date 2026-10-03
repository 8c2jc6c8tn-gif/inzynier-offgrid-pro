import { describe, expect, it } from "vitest"
import { uiEn, uiPl, uiRu } from "@/lib/i18n/ui"
import { KATALOG_PSI_14683 } from "../katalog-psi"

describe("opisy detali katalogu Ψ (PN-EN ISO 14683, Tablica A.2)", () => {
  it("każdy detal ma klucz UI-PSI-<kod> w PL/EN/RU, a tekst PL = opis z katalogu", () => {
    for (const x of KATALOG_PSI_14683) {
      const klucz = `UI-PSI-${x.kod}`
      expect(uiPl[klucz], klucz).toBe(x.opis)
      expect(uiEn[klucz], klucz).toBeTruthy()
      expect(uiRu[klucz], klucz).toBeTruthy()
    }
  })
})
