import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { kosztyOgrzewaniaTool } from "../koszty-ogrzewania-tool"

describe("kosztyOgrzewaniaTool (M6, dawne 5.39 + D28)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(kosztyOgrzewaniaTool.operationType).toBe("read")
    expect(kosztyOgrzewaniaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(kosztyOgrzewaniaTool)).not.toThrow()
  })

  it("okres bez podania → 10 lat ze źródła; nagrzewnica z karty; teksty PL zamiast kodów", async () => {
    const w = await kosztyOgrzewaniaTool.handler({
      zapotrzebowanieSezonKwh: 10000,
      zrodla: [
        { nazwa: "Webasto", rodzaj: "nagrzewnica-paliwowa", jednostka: "l", cenaZl: 6, mocGrzewczaKw: 4, zuzyciePaliwaNaH: 0.5, kosztInwestycjiZl: 3000, kosztSerwisuRocznyZl: 200 },
        { nazwa: "Pellet bez wartości opałowej", rodzaj: "pellet", cenaZl: 1.4, sprawnoscPct: 80, kosztInwestycjiZl: 0, kosztSerwisuRocznyZl: 0 },
      ],
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.ranking[0]!.kosztKwhCieplaZl).toBeCloseTo(0.75, 12)
    expect(w.ranking[0]!.kosztCalkowityZl).toBeCloseTo(3000 + 10 * (7500 + 200), 9)
    expect(w.pominiete).toEqual(["Pellet bez wartości opałowej"])
    expect(w.zalozenia).toContain(t("pl", "KO-ZALOZENIE-OKRES", { lata: 10, zrodlo: 10 }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})
