import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { doborMocyPompyTool } from "../dobor-mocy-pompy-tool"
import { krzywaGrzewczaTool } from "../krzywa-grzewcza-tool"

describe("doborMocyPompyTool (M6 Część 2B, dawne 5.27 + 5.67)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(doborMocyPompyTool.operationType).toBe("read")
    expect(doborMocyPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(doborMocyPompyTool)).not.toThrow()
  })

  it("pompa 5 kW przy 6 kW zapotrzebowania → 🟡 deficyt jako tekst PL", async () => {
    const w = await doborMocyPompyTool.handler({
      zapotrzebowanieKw: 6,
      mocPompyProjKw: 5,
      tProjC: -20,
      tWewnC: 20,
      tDrugiC: null,
      mocPompyDrugiKw: 0,
    })
    expect(w.dogrzewanieKw).toBeCloseTo(1, 9)
    expect(w.ostrzezenia).toContain(t("pl", "DMP-DEFICYT", { brak: 1, zapotrzebowanie: 6, moc: 5 }))
  })
})

describe("krzywaGrzewczaTool (M6 Część 2B, dawne 5.71)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(krzywaGrzewczaTool.operationType).toBe("read")
    expect(krzywaGrzewczaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(krzywaGrzewczaTool)).not.toThrow()
  })

  it("przykład źródła: 33 °C przy 0 °C; założenie o grzejnikach jako tekst PL", async () => {
    const w = await krzywaGrzewczaTool.handler({
      tZewn1C: 10,
      tZewn2C: -10,
      tZasil1C: 28,
      tZasil2C: 38,
      tZasilNowa1C: null,
      tZasilNowa2C: null,
      tOcenyC: 0,
      copObecny: 0,
      cieploSezonKwh: 0,
    })
    expect(w.zasilanieC).toBeCloseTo(33, 9)
    expect(w.zalozenia).toContain(t("pl", "KRZ-ZAL-BEZ-GRZEJNIKOW"))
  })
})
