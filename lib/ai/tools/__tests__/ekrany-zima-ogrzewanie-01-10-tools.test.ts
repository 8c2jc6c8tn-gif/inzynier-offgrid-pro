import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { deficytyMiesieczneTool } from "../deficyty-miesieczne-tool"
import { cykleOdszranianiaTool } from "../cykle-odszraniania-tool"
import { wentylacjaGrawitacyjnaTool } from "../wentylacja-grawitacyjna-tool"
import { gwcTool } from "../gwc-tool"
import { oknoSloneczneTool } from "../okno-sloneczne-tool"
import { osadNaPvTool } from "../osad-na-pv-tool"
import { wplywCzynnikaTool } from "../wplyw-czynnika-tool"
import { rozruchPompyCieplaTool } from "../rozruch-pompy-ciepla-tool"

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
      dniZalegania: 3,
      pozostalaProdukcjaPct: 0,
      nierownoStringi: false,
    })
    expect(w.utrataKwh).toBeCloseTo(12, 9)
    expect(w.ostrzezenia).toContain(t("pl", "OSAD-SNIEG-NIE-ZSUNIE", { kat: 10, prog: 30 }))
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
