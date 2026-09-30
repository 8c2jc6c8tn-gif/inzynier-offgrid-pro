import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { akumulatorSamochodowyTool } from "../akumulator-samochodowy-tool"
import { mamAkumulatorTool } from "../mam-akumulator-tool"
import { agregatPaliwoTool } from "../agregat-paliwo-tool"
import { solarVsPrzedluzaczTool } from "../solar-vs-przedluzacz-tool"
import { stacjaVsDiyTool } from "../stacja-vs-diy-tool"
import { weekendTool } from "../weekend-tool"
import { panelDlaUrzadzeniaTool } from "../panel-dla-urzadzenia-tool"

describe("akumulatorSamochodowyTool (M12/E16, dawne 8.14)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(akumulatorSamochodowyTool.operationType).toBe("read")
    expect(akumulatorSamochodowyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(akumulatorSamochodowyTool)).not.toThrow()
  })

  it("60 Ah rozruchowy, 50%, 50 W, plan 10 h → 7,2 h i 🔴 jako tekst PL", async () => {
    const w = await akumulatorSamochodowyTool.handler({
      typ: "rozruchowy",
      pojemnoscAh: 60,
      napiecieV: 12,
      uzytecznaPct: 50,
      mocW: 50,
      planowanyCzasH: 10,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.czasH).toBeCloseTo(7.2, 12)
    expect(w.ostrzezenia).toContain(t("pl", "AS-ROZRUCHOWY-PONAD-UZYTECZNA", { planowany: 10, czas: 7.2 }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("mamAkumulatorTool (M12/E4, dawne 8.4)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(mamAkumulatorTool.operationType).toBe("read")
    expect(mamAkumulatorTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(mamAkumulatorTool)).not.toThrow()
  })

  it("przykład Biblii §12.4: 100 Ah/12 V → lodówka 24 h, czajnik 1,2 h; maks. 50 A → ostrzeżenie PL", async () => {
    const w = await mamAkumulatorTool.handler({
      chemia: "lifepo4",
      pojemnoscAh: 100,
      napiecieV: 12,
      dodPct: 100,
      sprawnoscPct: 100,
      maksPradA: 50,
      urzadzenia: [
        { nazwa: "Lodówka", mocW: 50 },
        { nazwa: "Czajnik", mocW: 1000 },
      ],
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.urzadzenia.map((u) => u.czasH)).toEqual([24, 1.2])
    expect(w.ostrzezenia).toContain(t("pl", "MA-PRAD-URZADZENIA-PONAD-MAKS", { nazwa: "Czajnik", prad: 83, maks: 50 }))
  })
})

describe("agregatPaliwoTool (M12/E35, dawne 8.62)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(agregatPaliwoTool.operationType).toBe("read")
    expect(agregatPaliwoTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(agregatPaliwoTool)).not.toThrow()
  })

  it("przykład Biblii §12.50: 1,5 l/dobę; agregat w budynku → 🔴 w tekstach", async () => {
    const w = await agregatPaliwoTool.handler({
      mocAgregatuKw: 2,
      obciazeniePct: 50,
      zuzycieLH: 0.5,
      godzinNaDobe: 3,
      cenaZlL: 6.5,
      kosztPorownawczyZlKwh: 0,
      miejsceAgregatu: "wewnatrz-budynku",
      podlaczenieAgregatu: null,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.litrowNaDobe).toBeCloseTo(1.5, 12)
    expect(w.ostrzezenia).toContain(t("pl", "AGREGAT-W-BUDYNKU-CZAD"))
  })
})

describe("solarVsPrzedluzaczTool (M12/E29, dawne 8.56)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(solarVsPrzedluzaczTool.operationType).toBe("read")
    expect(solarVsPrzedluzaczTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(solarVsPrzedluzaczTool)).not.toThrow()
  })

  it("kabel 2000 zł vs zestaw 1500 zł → zestaw tańszy od razu", async () => {
    const w = await solarVsPrzedluzaczTool.handler({
      kosztPrzedluzaczaZl: 2000,
      zuzycieKwhRok: 50,
      cenaEnergiiZlKwh: 1,
      oplatyStaleZlRok: 0,
      kosztZestawuZl: 1500,
      eksploatacjaZestawuZlRok: 0,
      horyzontLat: 10,
    })
    expect(w.zwrotLat).toBe(0)
    expect(w.tanszy).toBe("zestaw")
    expect(w.ostrzezenia).toContain(t("pl", "SP-SPADEK-NAPIECIA-KABLA"))
  })
})

describe("stacjaVsDiyTool (M12/E34, dawne 8.61)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(stacjaVsDiyTool.operationType).toBe("read")
    expect(stacjaVsDiyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(stacjaVsDiyTool)).not.toThrow()
  })

  it("przykład Biblii §12.49 (DoD 50%): DIY ok. 2× więcej energii za złotówkę", async () => {
    const w = await stacjaVsDiyTool.handler({
      cenaStacjiZl: 1200,
      pojemnoscStacjiWh: 500,
      uzytecznaStacjiPct: 100,
      masaStacjiKg: 0,
      cenaDiyZl: 700,
      pojemnoscDiyAh: 100,
      napiecieDiyV: 12,
      dodDiyPct: 50,
      masaDiyKg: 0,
    })
    expect(w.status).toBe("VALID")
    expect(w.krotnoscDiy).toBeCloseTo(2.057, 3)
    expect(w.ostrzezenia).toContain(t("pl", "SD-DIY-WYMAGA-WIEDZY"))
  })
})

describe("weekendTool (M12/E5, dawne 8.5)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(weekendTool.operationType).toBe("read")
    expect(weekendTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(weekendTool)).not.toThrow()
  })

  it("800 Wh/dobę, 12 V 80 Ah, DoD 100%, 2 dni → 1,2 doby i 🟡 jako tekst PL", async () => {
    const w = await weekendTool.handler({
      dni: 2,
      osoby: 1,
      urzadzenia: [{ nazwa: "Razem", mocW: 800, godzinNaDobe: 1, naOsobe: false }],
      pojemnoscAh: 80,
      napiecieV: 12,
      dodPct: 100,
      mocPaneluW: 0,
      godzinSlonca: 0,
      sprawnoscToruPct: 0,
    })
    expect(w.dniBezSlonca).toBeCloseTo(1.2, 12)
    expect(w.ostrzezenia).toContain(t("pl", "WK-BRAK-NA-POCHMURNY-POBYT", { dniAkum: 1.2, dni: 2 }))
  })
})

describe("panelDlaUrzadzeniaTool (M12/E6, dawne 8.6)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(panelDlaUrzadzeniaTool.operationType).toBe("read")
    expect(panelDlaUrzadzeniaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(panelDlaUrzadzeniaTool)).not.toThrow()
  })

  it("50 W × 8 h, 4 h słońca, 70%, panel 100 W → min. 142,9 W i 🟡 jako tekst PL", async () => {
    const w = await panelDlaUrzadzeniaTool.handler({ mocUrzadzeniaW: 50, godzinPracy: 8, godzinSlonca: 4, uzyskPct: 70, posiadanyPanelW: 100 })
    expect(w.minimalnaMocPaneluW).toBeCloseTo(400 / 2.8, 12)
    expect(w.ostrzezenia).toContain(t("pl", "PU-PANEL-ZA-MALY", { posiadany: 100, minimalna: 143 }))
  })
})
