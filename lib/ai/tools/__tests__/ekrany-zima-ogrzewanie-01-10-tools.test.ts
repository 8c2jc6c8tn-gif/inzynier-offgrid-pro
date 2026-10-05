import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { deficytyMiesieczneTool } from "../deficyty-miesieczne-tool"
import { cykleOdszranianiaTool } from "../cykle-odszraniania-tool"
import { wentylacjaGrawitacyjnaTool } from "../wentylacja-grawitacyjna-tool"
import { gwcTool } from "../gwc-tool"
import { oknoSloneczneTool } from "../okno-sloneczne-tool"
import { deepWinterBudgetTool } from "../deep-winter-budget-tool"
import { falownikThdTool } from "../falownik-thd-tool"
import { turbinaWiatrowaTool } from "../turbina-wiatrowa-tool"
import { osadNaPvTool } from "../osad-na-pv-tool"
import { wspolczynnikBezpieczenstwaZimowegoTool } from "../wspolczynnik-bezpieczenstwa-zimowego-tool"
import { wplywCzynnikaTool } from "../wplyw-czynnika-tool"
import { rozruchPompyCieplaTool } from "../rozruch-pompy-ciepla-tool"
import { basenTool } from "../basen-tool"
import { odzyskCieplaSciekowTool } from "../odzysk-ciepla-sciekow-tool"
import { chlodzeniePompaCieplaTool } from "../chlodzenie-pompa-ciepla-tool"

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

  it("horyzont 14 dni + historia z własnego fixture'a → łańcuch, horyzonty i zapas z percentyla", async () => {
    const dni = (blok: number) => Array.from({ length: 365 }, (_, i) => (i >= 9 && i < 9 + blok ? 0 : 4))
    const w = await deficytyMiesieczneTool.handler({
      deficytyKwh: Array.from({ length: 12 }, () => 0),
      mocAgregatuKw: 5,
      zuzyciePaliwaLH: 1.5,
      cenaPaliwaZlL: 8,
      kosztSerwisuZlH: 0,
      zapasPaliwaL: 20,
      horyzontDni: 14,
      zapotrzebowanieDobaKwh: Array.from({ length: 12 }, () => 10),
      historia: {
        zrodlo: "wpisane-reczne",
        rodzaj: "produkcja-pv-kwh",
        lata: [
          { rok: 2021, dni: dni(10) },
          { rok: 2022, dni: dni(5) },
          { rok: 2023, dni: dni(0) },
        ],
      },
      oknoDni: 7,
      percentylPct: 60,
      progSlabegoDniaPct: 30,
    })
    expect(w.lancuch!.litryNaKwh).toBeCloseTo(0.375, 12)
    expect(w.horyzonty.find((h) => h.wybrany)!.dni).toBe(14)
    expect(w.zapasZHistorii!.litryPercentyl).toBeCloseTo(23.25, 9)
    expect(w.historia!.najdluzszaSeriaSlabychDni).toBe(10)
    expect(w.ostrzezenia).toContain(t("pl", "DEFM-HISTORIA-ZAPAS-ZA-MALY", { okno: 7, percentyl: 60, litry: 23, zapas: 20, lataPokryte: 1, lata: 3 }))
  })
})

describe("cykleOdszranianiaTool (M6/E6, dawne 5.6 + 1.14 + 6.8)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(cykleOdszranianiaTool.operationType).toBe("read")
    expect(cykleOdszranianiaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(cykleOdszranianiaTool)).not.toThrow()
  })

  it("−22 °C przy minimum pracy −20 °C → 🟡 jako tekst PL", async () => {
    const w = await cykleOdszranianiaTool.handler({
      tZewnC: -22,
      wilgotnoscPct: 0,
      odstepMin: 60,
      czasDefrostuMin: 5,
      mocDefrostuKw: 2,
      mocBazowaKw: 2,
      godzinySzronieniaH: 0,
      copKatalogowy: 0,
      tMinPracyC: -20,
    })
    expect(w.ostrzezenia).toContain(t("pl", "CYK-PONIZEJ-MIN-PRACY", { tZewn: -22, tMin: -20 }))
  })
})

describe("wentylacjaGrawitacyjnaTool (M6/E9, dawne 5.9)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(wentylacjaGrawitacyjnaTool.operationType).toBe("read")
    expect(wentylacjaGrawitacyjnaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(wentylacjaGrawitacyjnaTool)).not.toThrow()
  })

  it("szczelny dom → 🟡 pleśń jako tekst PL", async () => {
    const w = await wentylacjaGrawitacyjnaTool.handler({
      kubaturaM3: 300,
      wymianyNaDobe: 8,
      tWewC: 20,
      tZewnC: 0,
      stratyPozostaleW: 0,
      sprawnoscOdzyskuPct: 0,
      dni: 0,
      szczelnyDom: true,
    })
    expect(w.strumienM3H).toBeCloseTo(100, 9)
    expect(w.ostrzezenia).toContain(t("pl", "WPOR-NATURALNA-SZCZELNY-DOM"))
  })
})

describe("gwcTool (M6/E4, dawne 5.4)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(gwcTool.operationType).toBe("read")
    expect(gwcTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(gwcTool)).not.toThrow()
  })

  it("za rekuperatorem → założenie (1 − sprawność) jako tekst PL", async () => {
    const w = await gwcTool.handler({
      strumienM3H: 150,
      przyrostTempK: 4,
      godzinyPracyH: 24,
      sprawnoscRekuperatoraPct: 80,
      zapotrzebowanieDobaKwh: 0,
      cop: 0,
    })
    expect(w.oszczednoscDobaKwh).toBeGreaterThan(0)
    expect(w.zalozenia).toContain(t("pl", "GWC-ZALOZENIE-REKUPERATOR"))
  })
})

describe("oknoSloneczneTool (M7/E15, dawne 6.22)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(oknoSloneczneTool.operationType).toBe("read")
    expect(oknoSloneczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(oknoSloneczneTool)).not.toThrow()
  })

  it("4,5 kWh przy SoC 20% → bateria 65%, bez nadwyżki jako tekst PL", async () => {
    const w = await oknoSloneczneTool.handler({
      energiaOknaKwh: 4.5,
      zuzycieWOknieKwh: 0,
      pojemnoscBateriiKwh: 10,
      socStartPct: 20,
      grzalkiBmsKwh: 0,
      bojlerL: 0,
      bojlerTStartC: null,
      bojlerTCelC: null,
    })
    expect(w.socKoniecPct).toBeCloseTo(65, 9)
    expect(w.ostrzezenia).toContain(t("pl", "OKNO-BRAK-NADWYZKI"))
  })
})

describe("osadNaPvTool (M7/E7 + E14, dawne 6.7, 6.20, 6.18)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(osadNaPvTool.operationType).toBe("read")
    expect(osadNaPvTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(osadNaPvTool)).not.toThrow()
  })

  it("śnieg sypki przy 10° → 🟡 nie zsunie się jako tekst PL", async () => {
    const w = await osadNaPvTool.handler({
      rodzaj: "sypki",
      katDeg: 10,
      produkcjaDobaKwh: 4,
      dniWlasne: null,
      pozostalaWlasnaPct: null,
      nierownoStringi: false,
      powierzchniaM2: 0,
      kabel: { mocWNaM2: 0, godziny: 0 },
      folia: { mocWNaM2: 0, godziny: 0 },
      automat: { mocW: 0, godziny: 0 },
    })
    expect(w.scenariusze.map((s) => [s.dni, s.utrataKwh])).toEqual([
      [1, 4],
      [3, 12],
      [5, 20],
      [7, 28],
    ])
    expect(w.ostrzezenia).toContain(t("pl", "OSAD-SNIEG-NIE-ZSUNIE", { kat: 10, prog: 30 }))
  })

  it("kabel grzewczy 200 W/m² × 10 m² × 2 h przy 1 dniu zalegania → 🟡 nie zwraca się jako tekst PL", async () => {
    const w = await osadNaPvTool.handler({
      rodzaj: "sypki",
      katDeg: 40,
      produkcjaDobaKwh: 4,
      dniWlasne: 1,
      pozostalaWlasnaPct: null,
      nierownoStringi: false,
      powierzchniaM2: 10,
      kabel: { mocWNaM2: 200, godziny: 2 },
      folia: { mocWNaM2: 0, godziny: 0 },
      automat: { mocW: 0, godziny: 0 },
    })
    expect(w.opcjeAktywne[0]!.oplacaWReferencji).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "OSAD-GRZANIE-NIE-ZWRACA-KABEL", { energia: 4, odzysk: 3.67, dni: 1 }))
    expect(w.ostrzezenia).toContain(t("pl", "OSAD-GWARANCJA"))
  })
})

describe("wplywCzynnikaTool (M6 Część 2D, dawne 5.69, 5.73–5.100)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(wplywCzynnikaTool.operationType).toBe("read")
    expect(wplywCzynnikaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(wplywCzynnikaTool)).not.toThrow()
  })

  it("5.80 szczelność + pompa 7 kW za mała → wynik i 🟡 jako tekst PL", async () => {
    const w = await wplywCzynnikaTool.handler({
      czynnik: "szczelnosc",
      pola: { kubaturaM3: 112, nPrzed: 0.8, nPo: 0.4, dTK: 40, zapotrzebowanieKw: 8, mocPompyKw: 7 },
    })
    expect(w.wynik).toBe(t("pl", "WPC-G-MOC", { przed: 1.2, po: 0.6, zmiana: -0.6 }))
    expect(w.ostrzezenia).toContain(t("pl", "WPC-POMPA-ZA-MALA", { zapotrzebowanie: 7.4, moc: 7 }))
  })
})

describe("rozruchPompyCieplaTool (M6 Część 2C, dawne 5.52, 5.61, 5.66)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(rozruchPompyCieplaTool.operationType).toBe("read")
    expect(rozruchPompyCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(rozruchPompyCieplaTool)).not.toThrow()
  })

  it("40 A × 230 V przy szczycie 7,5 kW → 🟡 nie udźwignie jako tekst PL", async () => {
    const w = await rozruchPompyCieplaTool.handler({
      zrodlo: "falownik",
      fazy: 1,
      napiecieV: 230,
      pradRozruchuA: 40,
      pradSoftstartA: 0,
      poborPracyKw: 2,
      inneObciazenieKw: 0,
      mocCiaglaKw: 5,
      mocSzczytowaKw: 7.5,
    })
    expect(w.ostrzezenia).toContain(t("pl", "ROZ-START-PONAD-SZCZYT", { start: 9.2, szczyt: 7.5 }))
  })
})

describe("basenTool (M6 Część 2C, dawne 5.48)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(basenTool.operationType).toBe("read")
    expect(basenTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(basenTool)).not.toThrow()
  })

  it("40 m³ +1 K przy 8 kW → ok. 5,8 h i założenie o stratach jako tekst PL", async () => {
    const w = await basenTool.handler({ objetoscM3: 40, przyrostK: 1, mocPompyKw: 8, cop: 0, spadekNocK: 0 })
    expect(w.czasH).toBeCloseTo(5.81, 2)
    expect(w.zalozenia).toContain(t("pl", "BAS-ZAL-BEZ-STRAT"))
  })
})

describe("odzyskCieplaSciekowTool (M6 Część 2C, dawne 5.41)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(odzyskCieplaSciekowTool.operationType).toBe("read")
    expect(odzyskCieplaSciekowTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(odzyskCieplaSciekowTool)).not.toThrow()
  })

  it("sprawność 55% → ℹ️ poza widełkami źródła jako tekst PL", async () => {
    const w = await odzyskCieplaSciekowTool.handler({
      litryDoba: 60,
      tSciekowC: 38,
      tZimnejC: 10,
      sprawnoscPct: 55,
      dniRok: 0,
      cwuKwhRok: 0,
      copPodgrzewacza: 0,
    })
    expect(w.cieploDobaKwh).toBeGreaterThan(0)
    expect(w.ostrzezenia).toContain(t("pl", "DWHR-SPRAWNOSC-SPOZA-ZRODLA", { pct: 55, min: 20, max: 40 }))
  })
})

describe("chlodzeniePompaCieplaTool (M6 Część 2C, dawne 5.29/5.47/5.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(chlodzeniePompaCieplaTool.operationType).toBe("read")
    expect(chlodzeniePompaCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(chlodzeniePompaCieplaTool)).not.toThrow()
  })

  it("zasilanie 16 °C przy rosie ≈ 16,7 °C → 🟡 jako tekst PL", async () => {
    const w = await chlodzeniePompaCieplaTool.handler({
      chlodDobaKwh: 16,
      eerPompy: 4,
      eerKlimatyzatora: 2,
      mocObiegowejW: 0,
      godzinyFreeCoolingH: 0,
      tZasilaniaC: 16,
      tPomieszczeniaC: 25,
      wilgotnoscPct: 60,
      cieploSezonKwh: 0,
      copPompy: 0,
      copKlimatyzatora: 0,
    })
    expect(w.pradPompyKwh).toBeCloseTo(4, 9)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.ostrzezenia).toContain(t("pl", "CHL-PONIZEJ-ROSY", { zasilanie: 16, rosa: 16.7 }))
  })
})

describe("wspolczynnikBezpieczenstwaZimowegoTool (M7/E12, dawne 6.14)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(wspolczynnikBezpieczenstwaZimowegoTool.operationType).toBe("read")
    expect(wspolczynnikBezpieczenstwaZimowegoTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(wspolczynnikBezpieczenstwaZimowegoTool)).not.toThrow()
  })

  it("domyślne wagi → 74%, najsłabsza autonomia, informacja o wstępnych wagach jako tekst PL", async () => {
    const w = await wspolczynnikBezpieczenstwaZimowegoTool.handler({
      produkcjaNajgorszyMiesiacKwh: 80,
      zapotrzebowanieNajgorszyMiesiacKwh: 100,
      autonomiaDni: 6,
      wymaganaAutonomiaDni: 10,
      liczbaKomponentow: 10,
      liczbaSpof: 1,
      brakAgregatu: false,
      mocAgregatuKw: 3.5,
      mocWymaganaAgregatuKw: 5,
      oknoReakcjiH: 6.5,
      wymaganyCzasReakcjiH: 10,
      wagiWlasne: null,
      progSlabegoPunktuPct: null,
    })
    expect(w.wskaznikPct).toBeCloseTo(74, 9)
    expect(w.ranking[0]).toBe("autonomia")
    expect(w.najslabsza).toEqual({ id: "autonomia", wynikPct: 60 })
    expect(w.ostrzezenia).toContain(t("pl", "WSP-WAGI-WSTEPNE"))
  })
})

describe("deepWinterBudgetTool (M7/E25, dawne 6.39→7.37)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(deepWinterBudgetTool.operationType).toBe("read")
    expect(deepWinterBudgetTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(deepWinterBudgetTool)).not.toThrow()
  })

  it("plan 700 kWh, dzień 20 z 31, zużyto 500 → zostało 200, ograniczenie 27,27%, 🟡 ponad budżet jako tekst PL", async () => {
    const w = await deepWinterBudgetTool.handler({
      dniMiesiaca: 31,
      biezacyDzien: 20,
      planPvKwh: 400,
      planAgregatKwh: 200,
      planMagazynKwh: 100,
      zuzycieNarastajaceKwh: 500,
      cele: [],
      udzialOgrzewaniaPct: 0,
      roznicaTemperaturK: 0,
      oszczednoscKwhDobaNaK: 0,
    })
    expect(w.zostaloKwh).toBeCloseTo(200, 9)
    expect(w.wymaganeOgraniczeniePct).toBeCloseTo(27.2727, 3)
    expect(w.ostrzezenia).toContain(t("pl", "DWB-PONAD-BUDZET", { odchylenie: 10.7, dzien: 28, ograniczenie: 27.3 }))
  })
})

describe("falownikThdTool (M7/E24, dawne 6.38→7.36)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(falownikThdTool.operationType).toBe("read")
    expect(falownikThdTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(falownikThdTool)).not.toThrow()
  })

  it("THD 30% między 20% (0,9) i 40% (0,7) → k=0,8, dostępna 4 kW; obciążenie 4,5 kW → 🔴 jako tekst PL", async () => {
    const w = await falownikThdTool.handler({
      mocZnamionowaKw: 5,
      mocObciazeniaKw: 4.5,
      thdPct: 30,
      tabela: [
        { thdPct: 0, wspolczynnik: 1 },
        { thdPct: 20, wspolczynnik: 0.9 },
        { thdPct: 40, wspolczynnik: 0.7 },
      ],
    })
    expect(w.wspolczynnik).toBeCloseTo(0.8, 12)
    expect(w.dostepnaKw).toBeCloseTo(4, 12)
    expect(w.przekroczone).toBe(true)
    expect(w.ostrzezenia).toContain(t("pl", "FTHD-OBCIAZENIE-PRZEKRACZA-DOSTEPNA", { obciazenie: 4.5, dostepna: 4, brak: 0.5 }))
  })
})

describe("turbinaWiatrowaTool (M7/E16, dawne 6.24→7.23)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(turbinaWiatrowaTool.operationType).toBe("read")
    expect(turbinaWiatrowaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(turbinaWiatrowaTool)).not.toThrow()
  })

  it("stała moc 2 kW na [4, 8] m/s, v̄=6, A=0,8 → ok. 17,6 kWh/dobę + ostrzeżenie o średniej bez rozkładu", async () => {
    const w = await turbinaWiatrowaTool.handler({
      sredniaPredkoscMs: 6,
      krzywa: [
        { predkoscMs: 4, mocKw: 2 },
        { predkoscMs: 6, mocKw: 2 },
        { predkoscMs: 8, mocKw: 2 },
      ],
      predkoscWylaczeniaMs: 8,
      wspolczynnikDostepnosciStrat: 0.8,
    })
    expect(w.energiaDobaKwh).toBeCloseTo(24 * 0.8 * 0.9157, 1)
    expect(w.ostrzezenia).toContain(t("pl", "TURBW-SREDNIA-BEZ-ROZKLADU", { srednia: 6 }))
  })
})
