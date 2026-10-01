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
import { laczeniePaneliPrzenosnychTool } from "../laczenie-paneli-przenosnych-tool"
import { powerbankVsAkumulatorTool } from "../powerbank-vs-akumulator-tool"
import { blackoutMinimumTool } from "../blackout-minimum-tool"
import { akumulatorKamperaTool } from "../akumulator-kampera-tool"
import { paneleDachKamperaTool } from "../panele-dach-kampera-tool"
import { panelKamperaTool } from "../panel-kampera-tool"
import { alternatorVsPaneleTool } from "../alternator-vs-panele-tool"
import { przetwornicaTool } from "../przetwornice-tool"
import { kreatorMalegoOdbiornikaTool } from "../kreator-malego-odbiornika-tool"
import { listaKempingTool } from "../lista-kemping-tool"
import { szybkaDiagnozaTool } from "../szybka-diagnoza-tool"
import { urzadzeniaMedyczneTool } from "../urzadzenia-medyczne-tool"
import { urzadzeniaZabronioneTool } from "../urzadzenia-zabronione-falownik-tool"
import { blackoutBalkonTool } from "../blackout-balkon-tool"
import { szablonyZestawowTool } from "../szablony-zestawow-tool"
import { testAkumulatoraTool } from "../test-akumulatora-tool"

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

describe("przetwornicaTool (M12/E8, dawne 8.9 + 8.41 + 8.42)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(przetwornicaTool.operationType).toBe("read")
    expect(przetwornicaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(przetwornicaTool)).not.toThrow()
  })

  it("falownik 1000 W przy sumie 800 W × 1,5 → 🟡 jako tekst PL", async () => {
    const w = await przetwornicaTool.handler({
      tryb: "falownik",
      napiecieAkumulatoraV: 12,
      sprawnoscPct: 90,
      napiecieUrzadzeniaV: 0,
      mocUrzadzeniaW: 0,
      pradPrzetwornicyA: 0,
      urzadzenia: [{ nazwa: "Lodówka", mocW: 800, krotnoscRozruchu: 1 }],
      zapasMocy: 1.5,
      mocFalownikaW: 1000,
      mocSzczytowaFalownikaW: 2000,
    })
    expect(w.minimalnaMocFalownikaW).toBe(1200)
    expect(w.ostrzezenia).toContain(t("pl", "PRZ-FALOWNIK-ZA-SLABY", { posiadany: 1000, minimalna: 1200 }))
  })
})

describe("kreatorMalegoOdbiornikaTool (M12/E12, Biblia §12.24)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(kreatorMalegoOdbiornikaTool.operationType).toBe("read")
    expect(kreatorMalegoOdbiornikaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(kreatorMalegoOdbiornikaTool)).not.toThrow()
  })

  it("alarm 25 W na 24 h, akumulator 20 Ah 12 V → 🟡 jako tekst PL", async () => {
    const w = await kreatorMalegoOdbiornikaTool.handler({
      scenariusz: "alarm",
      skladniki: [{ nazwa: "Centrala", mocW: 25, godzinNaDobe: 24, krotnoscRozruchu: 0 }],
      czasPodtrzymaniaH: 24,
      napiecieV: 12,
      uzytecznaPct: 100,
      przezFalownik: false,
      sprawnoscFalownikaPct: 0,
      posiadanyAh: 20,
      mocPaneluW: 0,
      godzinSlonca: 0,
      sprawnoscToruPct: 0,
    })
    expect(w.minimalnyAh).toBe(50)
    expect(w.ostrzezenia).toContain(t("pl", "KZ-AKUMULATOR-ZA-MALY", { posiadany: 20, minimalny: 50, h: 9.6 }))
  })
})

describe("listaKempingTool (M12/E24, dawne 8.47)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(listaKempingTool.operationType).toBe("read")
    expect(listaKempingTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(listaKempingTool)).not.toThrow()
  })

  it("2 osoby, 3 telefony, zima → ładowarki × 3, osłona zimowa, 🟡 gaśnica/miernik jako tekst PL", async () => {
    const w = await listaKempingTool.handler({
      osoby: 2,
      sezon: "zima",
      telefony: 3,
      maPanel: false,
      maUrzadzenia230: false,
      maLodowke: false,
      maOswietlenie: false,
      maRadio: false,
      zaznaczoneIds: [],
    })
    expect(w.konieczne).toContain(`${t("pl", "UI-M12-LKK-P-LADOWARKI-USB")} × 3`)
    expect(w.konieczne).toContain(t("pl", "UI-M12-LKK-P-OSLONA-ZIMA"))
    expect(w.ostrzezenia).toContain(t("pl", "LKK-GASNICA-MIERNIK"))
  })
})

describe("szybkaDiagnozaTool (M12/E25, dawne 8.50)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(szybkaDiagnozaTool.operationType).toBe("read")
    expect(szybkaDiagnozaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(szybkaDiagnozaTool)).not.toThrow()
  })

  it("brak prądu: start → polecenie pomiaru akumulatora; bezpiecznik 'problem' → przyczyna PL", async () => {
    const start = await szybkaDiagnozaTool.handler({ objaw: "brak-pradu", odpowiedzi: {} })
    expect(start.aktualnyKrok).toEqual({ id: "napiecie-akumulatora", polecenie: t("pl", "UI-M12-DG-K-NAPIECIE-AKUMULATORA") })
    const w = await szybkaDiagnozaTool.handler({ objaw: "brak-pradu", odpowiedzi: { "napiecie-akumulatora": "ok", "bezpiecznik-glowny": "problem" } })
    expect(w.przyczyna?.opis).toBe(t("pl", "UI-M12-DG-P-BEZPIECZNIK-GLOWNY"))
  })
})

describe("urzadzeniaMedyczneTool (M12/E26, dawne 8.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(urzadzeniaMedyczneTool.operationType).toBe("read")
    expect(urzadzeniaMedyczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(urzadzeniaMedyczneTool)).not.toThrow()
  })

  it("CPAP 60 W × 8 h, 100 Ah 80%, bez źródła zapasowego → 🟡 jako tekst PL", async () => {
    const w = await urzadzeniaMedyczneTool.handler({
      urzadzenie: "cpap",
      mocW: 60,
      godzinNaDobe: 8,
      napiecieV: 12,
      uzytecznaPct: 80,
      przezFalownik: false,
      sprawnoscFalownikaPct: 0,
      posiadanyAh: 100,
      maZapasoweZrodlo: false,
    })
    expect(w.dobyPosiadany).toBeCloseTo(2, 12)
    expect(w.ostrzezenia).toContain(t("pl", "MED-BRAK-ZAPASOWEGO-ZRODLA"))
  })
})

describe("urzadzeniaZabronioneTool (M12/E37, dawne 8.64)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(urzadzeniaZabronioneTool.operationType).toBe("read")
    expect(urzadzeniaZabronioneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(urzadzeniaZabronioneTool)).not.toThrow()
  })

  it("suszarka 1800 W na falowniku 1000/2000 W → zabronione, 🔴 jako tekst PL", async () => {
    const w = await urzadzeniaZabronioneTool.handler({ mocFalownikaW: 1000, mocSzczytowaW: 2000, urzadzenia: [{ nazwa: "Suszarka", mocW: 1800, krotnoscRozruchu: 1 }] })
    expect(w.oceny[0].ocena).toBe("zabronione")
    expect(w.ostrzezenia).toContain(t("pl", "UZF-URZADZENIE-ZABRONIONE", { nazwa: "Suszarka", moc: 1800, rozruch: 1800, falownik: 1000, szczyt: 2000 }))
  })
})

describe("blackoutBalkonTool (M12/E40, dawne 8.68)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(blackoutBalkonTool.operationType).toBe("read")
    expect(blackoutBalkonTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(blackoutBalkonTool)).not.toThrow()
  })

  it("1040 Wh/dobę, stacja 1000 Wh na 24 h → brak 40 Wh, 🟡 jako tekst PL", async () => {
    const w = await blackoutBalkonTool.handler({
      odbiorniki: [
        { nazwa: "Router", mocW: 10, godzinNaDobe: 24 },
        { nazwa: "Lodówka", mocW: 100, godzinNaDobe: 8 },
      ],
      czasBlackoutuH: 24,
      pojemnoscWh: 1000,
      uzytecznaPct: 100,
      sprawnoscFalownikaPct: 100,
      dlugoscBalustradyM: 0,
      szerokoscPaneluM: 0,
      mocPaneluW: 0,
      godzinSlonca: 0,
      sprawnoscToruPct: 0,
    })
    expect(w.bilansWh).toBe(-40)
    expect(w.ostrzezenia).toContain(t("pl", "BB-ZA-MALO-NA-BLACKOUT", { wh: 40, h: 23.1 }))
  })
})

describe("szablonyZestawowTool (M12/E3, dawne 8.3 + 8.16)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(szablonyZestawowTool.operationType).toBe("read")
    expect(szablonyZestawowTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(szablonyZestawowTool)).not.toThrow()
  })

  it("kamper 1800 Wh/dobę, 12 V, DoD 100%, 5 h × 100% → 150 Ah/dobę, 360 W, 30 A", async () => {
    const w = await szablonyZestawowTool.handler({
      szablon: "kamper",
      dni: 2,
      osoby: 1,
      urzadzenia: [{ nazwa: "Lodówka", mocW: 75, godzinNaDobe: 24, naOsobe: false }],
      napiecieV: 12,
      dodPct: 100,
      godzinSlonca: 5,
      sprawnoscToruPct: 100,
    })
    expect(w.status).toBe("VALID")
    expect(w.minimalnyAhDoba).toBe(150)
    expect(w.minimalnyAhPobyt).toBe(300)
    expect(w.minimalnyPanelW).toBe(360)
    expect(w.pradRegulatoraA).toBe(30)
    expect(w.zalozenia).toContain(t("pl", "SZ-ZALOZENIE-PANEL-NA-DOBE"))
  })
})

describe("testAkumulatoraTool (M12/E33, dawne 8.60)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(testAkumulatoraTool.operationType).toBe("read")
    expect(testAkumulatoraTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(testAkumulatoraTool)).not.toThrow()
  })

  it("ołów 12 V, 10,4 V w spoczynku → uszkodzony, 🟡 jako tekst PL", async () => {
    const w = await testAkumulatoraTool.handler({
      chemia: "olow",
      napiecieZnamionoweV: 12,
      napiecieSpoczynkoweV: 10.4,
      mocObciazeniaW: 0,
      napiecieObciazenieV: 0,
      rezystancjaKartaMOhm: 0,
    })
    expect(w.stan).toBe("uszkodzony")
    expect(w.ostrzezenia).toContain(t("pl", "TA-PONIZEJ-PROGU-WYRZUCENIA", { napiecie: 10.4, prog: 10.5 }))
  })
})
