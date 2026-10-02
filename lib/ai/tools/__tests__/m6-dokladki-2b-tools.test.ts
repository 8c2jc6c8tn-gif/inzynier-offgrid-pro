import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { doborMocyPompyTool } from "../dobor-mocy-pompy-tool"
import { krzywaGrzewczaTool } from "../krzywa-grzewcza-tool"
import { modelSezonowyPompyTool } from "../model-sezonowy-pompy-tool"
import { buforPracaPompyTool } from "../bufor-praca-pompy-tool"
import { przeplywPompyCieplaTool } from "../przeplyw-pompy-ciepla-tool"

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

describe("modelSezonowyPompyTool (M6 Część 2C, dawne 5.64 + 5.43)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(modelSezonowyPompyTool.operationType).toBe("read")
    expect(modelSezonowyPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(modelSezonowyPompyTool)).not.toThrow()
  })

  it("jeden miesiąc 3100 kWh przy COP 3,1 → 1000 kWh, ℹ️ zapas zimowy jako tekst PL", async () => {
    const pusty = Array<number | null>(12).fill(null)
    const w = await modelSezonowyPompyTool.handler({
      cieploKwh: pusty.map((x, i) => (i === 0 ? 3100 : x)),
      cop: pusty.map((x, i) => (i === 0 ? 3.1 : x)),
      scopKatalogowy: 0,
    })
    expect(w.energiaSumaKwh).toBeCloseTo(1000, 9)
    expect(w.ostrzezenia).toContain(t("pl", "MSP-ZIMA-ZAPAS", { kwh: 1000, doba: 32.26 }))
  })
})

describe("buforPracaPompyTool (M6 Część 2B, dawne 5.28 + 5.70)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(buforPracaPompyTool.operationType).toBe("read")
    expect(buforPracaPompyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(buforPracaPompyTool)).not.toThrow()
  })

  it("bufor 400 l przy 100 l wody → 5× mniej startów; założenie o oszczędnościach jako tekst PL", async () => {
    const w = await buforPracaPompyTool.handler({
      mocPompyKw: 8,
      obciazenieKw: 2,
      wodaInstalacjiL: 100,
      histerezaK: 5,
      buforL: 400,
      dTMagazynK: 0,
      stratyPostojoweW: 0,
      dniPracy: 0,
    })
    expect(w.bez!.startyDoba / w.z!.startyDoba).toBeCloseTo(5, 9)
    expect(w.zalozenia).toContain(t("pl", "BPP-ZAL-BEZ-OSZCZEDNOSCI"))
  })
})

describe("przeplywPompyCieplaTool (M6 Część 2B, dawne 5.65)", () => {
  const r2 = (x: number) => Math.round(x * 100) / 100

  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(przeplywPompyCieplaTool.operationType).toBe("read")
    expect(przeplywPompyCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(przeplywPompyCieplaTool)).not.toThrow()
  })

  it("7 kW przy ΔT 5 K → ok. 1,2 m³/h; pompa obiegowa 0,9 m³/h → 🟡 za mały przepływ jako tekst PL", async () => {
    const w = await przeplywPompyCieplaTool.handler({ mocPompyKw: 7, dTK: 5, przeplywPompyM3H: 0.9, minPrzeplywM3H: 0 })
    expect(w.wymaganyM3H).toBeCloseTo(1.2, 1)
    expect(w.rzeczywistyDTK).not.toBeNull()
    expect(w.ostrzezenia).toContain(
      t("pl", "PRZ-PRZEPLYW-ZA-MALY", { pompa: 0.9, wymagany: r2(w.wymaganyM3H), dt: r2(w.rzeczywistyDTK!) }),
    )
  })
})
