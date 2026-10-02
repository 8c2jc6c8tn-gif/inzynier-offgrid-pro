import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { nagrzewnicaPowietrzaTool } from "../nagrzewnica-powietrza-tool"

describe("nagrzewnicaPowietrzaTool (M6, D28 + decyzja 02.10.2026)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(nagrzewnicaPowietrzaTool.operationType).toBe("read")
    expect(nagrzewnicaPowietrzaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(nagrzewnicaPowietrzaTool)).not.toThrow()
  })

  it("dane własne testu: 0,76 zł vs 1,00 zł na kWh ciepła, doba 3,5% baterii; ostrzeżenie CO jako tekst PL", async () => {
    const w = await nagrzewnicaPowietrzaTool.handler({
      mocCieplnaKw: 2,
      zuzyciePaliwaLH: 0.25,
      cenaPaliwaZlL: 6,
      poborPraduW: 20,
      energiaRozruchuWh: 50,
      rozruchyNaDobe: 3,
      cenaPraduZlKwh: 1,
      copElektryczne: 0,
      zapotrzebowanieCieplaDobaKwh: 20,
      dniOgrzewania: 0,
      pojemnoscBateriiKwh: 10,
    })
    expect(w.kosztCieplaNagrzewnicaZlKwh).toBeCloseTo(0.76, 12)
    expect(w.kosztCieplaElektrycznegoZlKwh).toBeCloseTo(1, 12)
    expect(w.taniej).toBe("nagrzewnica")
    expect(w.doba!.procentBateriiNagrzewnica).toBeCloseTo(3.5, 9)
    expect(w.ostrzezenia).toContain(t("pl", "NP-SPALINY-CO"))
  })
})
