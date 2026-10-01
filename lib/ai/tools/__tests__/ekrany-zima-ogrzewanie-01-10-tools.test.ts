import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { deficytyMiesieczneTool } from "../deficyty-miesieczne-tool"

describe("deficytyMiesieczneTool (M7/E2, dawne 6.2)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(deficytyMiesieczneTool.operationType).toBe("read")
    expect(deficytyMiesieczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(deficytyMiesieczneTool)).not.toThrow()
  })

  it("luty 160 kWh, agregat 5 kW, zapas 50 l → 🟡 paliwo ponad zapas jako tekst PL", async () => {
    const deficytyKwh = Array.from({ length: 12 }, (_, i) => (i === 1 ? 160 : 0))
    const w = await deficytyMiesieczneTool.handler({
      deficytyKwh,
      mocAgregatuKw: 5,
      zuzyciePaliwaLH: 1.5,
      cenaPaliwaZlL: 7,
      kosztSerwisuZlH: 0,
      zapasPaliwaL: 50,
    })
    expect(w.sumaGodzin).toBeCloseTo(40, 9)
    expect(w.ostrzezenia).toContain(t("pl", "DEFM-PALIWO-PONAD-ZAPAS", { miesiac: 2, godziny: 40, litry: 60, zapas: 50 }))
  })
})
