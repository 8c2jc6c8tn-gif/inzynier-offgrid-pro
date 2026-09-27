import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dniBezSloncaTool } from "../dni-bez-slonca-tool"
import { ochronaPrzedRozladowaniemTool } from "../ochrona-przed-rozladowaniem-tool"
import { urzadzenie12vBezposrednioTool } from "../urzadzenie-12v-bezposrednio-tool"
import { panelDoStacjiZasilaniaTool } from "../panel-do-stacji-zasilania-tool"
import { zuzyciePerUrzadzenieTool } from "../zuzycie-per-urzadzenie-tool"
import { gniazdoZapalniczkiTool } from "../gniazdo-zapalniczki-tool"
import { ratowanieAkumulatoraMalyTool } from "../ratowanie-akumulatora-maly-tool"
import { bezpieczenstwoKamperTool } from "../bezpieczenstwo-kamper-tool"
import { ladowanieWGarazuTool } from "../ladowanie-w-garazu-tool"

describe("dniBezSloncaTool (M12/E32, dawne 8.59)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(dniBezSloncaTool.operationType).toBe("read")
    expect(dniBezSloncaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(dniBezSloncaTool)).not.toThrow()
  })

  it("100 Ah / 12 V, DoD 80%, η 100%, 300 Wh → 3,2 dnia; założenia jako tekst PL", async () => {
    const w = await dniBezSloncaTool.handler({
      pojemnoscAh: 100,
      napiecieV: 12,
      dodPct: 80,
      sprawnoscPct: 100,
      zuzycieDoboweWh: 300,
    })
    expect(w.status).toBe("VALID")
    expect(w.dni).toBeCloseTo(3.2, 12)
    expect(w.pelneDoby).toBe(3)
    expect(w.zalozenia).toContain(t("pl", "DBS-ZALOZENIE-BEZ-DOLADOWANIA"))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("ochronaPrzedRozladowaniemTool (M12/E9, dawne 8.11)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(ochronaPrzedRozladowaniemTool.operationType).toBe("read")
    expect(ochronaPrzedRozladowaniemTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(ochronaPrzedRozladowaniemTool)).not.toThrow()
  })

  it("AGM 12 V bez żadnej ochrony → 11,5 V i twardy stop jako tekst PL", async () => {
    const w = await ochronaPrzedRozladowaniemTool.handler({
      chemia: "AGM",
      napiecieZnamionoweV: 12,
      maDozownik: false,
      odbiornikMaWlasneZabezpieczenie: false,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.progOdcieciaV).toBe(11.5)
    expect(w.ostrzezenia).toEqual([t("pl", "LVD-BRAK-OCHRONY-OLOWIOWY")])
  })
})

describe("urzadzenie12vBezposrednioTool (M12/E27, dawne 8.54)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(urzadzenie12vBezposrednioTool.operationType).toBe("read")
    expect(urzadzenie12vBezposrednioTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(urzadzenie12vBezposrednioTool)).not.toThrow()
  })

  it("przykład źródła 12,0 V ±5% → twardy stop jako tekst PL z wartościami", async () => {
    const w = await urzadzenie12vBezposrednioTool.handler({
      napiecieSystemuV: 12,
      napiecieUrzadzeniaV: 12,
      tolerancjaPct: 5,
      przezStabilizator: false,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.zakresPokryty).toBe(false)
    expect(w.ostrzezenia[0]).toBe(t("pl", "U12-PRZEPIECIE-PRZY-LADOWANIU", { aku: "14.5", urzadzenie: "12.6" }))
  })
})

describe("panelDoStacjiZasilaniaTool (M12/E39, dawne 8.66)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(panelDoStacjiZasilaniaTool.operationType).toBe("read")
    expect(panelDoStacjiZasilaniaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(panelDoStacjiZasilaniaTool)).not.toThrow()
  })

  it("pola opcjonalne pominięte; −20 °C, 2 × 22,5 V vs 50 V → twardy stop jako tekst PL", async () => {
    const w = await panelDoStacjiZasilaniaTool.handler({
      vocStcV: 22.5,
      betaPctNaC: -0.3,
      tminC: -20,
      liczbaSzeregowo: 2,
      maxNapiecieWejsciaV: 50,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.pradZwarciowyA).toBeNull()
    expect(w.ostrzezenia[0]).toBe(t("pl", "PST-PRZEKROCZONE-NAPIECIE-WEJSCIA", { voc: "51.1", limit: "50" }))
  })
})

describe("zuzyciePerUrzadzenieTool (M12/E11, dawne 8.15 + 8.23–8.28)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(zuzyciePerUrzadzenieTool.operationType).toBe("read")
    expect(zuzyciePerUrzadzenieTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(zuzyciePerUrzadzenieTool)).not.toThrow()
  })

  it("przykład źródła: lodówka 45 W, 24 h, 40% → 432 Wh; info jako tekst PL", async () => {
    const w = await zuzyciePerUrzadzenieTool.handler({
      urzadzenia: [{ nazwa: "Lodówka", mocW: 45, godzinNaDobe: 24, cykliczne: true, wspolczynnikPracyPct: 40 }],
    })
    expect(w.status).toBe("VALID")
    expect(w.sumaWh).toBeCloseTo(432, 9)
    expect(w.ostrzezenia).toEqual([t("pl", "ZPU-CYKLICZNE-REALNIE-MNIEJ", { nazwa: "Lodówka", realne: "432", znamionowe: "1080" })])
  })
})

describe("gniazdoZapalniczkiTool (M12/E30, dawne 8.57)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(gniazdoZapalniczkiTool.operationType).toBe("read")
    expect(gniazdoZapalniczkiTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(gniazdoZapalniczkiTool)).not.toThrow()
  })

  it("czajnik 200 W przy 10 A / 12 V → twardy stop jako tekst PL", async () => {
    const w = await gniazdoZapalniczkiTool.handler({ napiecieV: 12, pradBezpiecznikaA: 10, urzadzenia: [{ nazwa: "Czajnik", mocW: 200 }] })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.ostrzezenia).toEqual([t("pl", "GZ-PRZECIAZENIE-GNIAZDA", { prad: "16.7", bezpiecznik: "10", mocMax: "120" })])
  })
})

describe("ratowanieAkumulatoraMalyTool (M12/E42, dawne 8.70)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(ratowanieAkumulatoraMalyTool.operationType).toBe("read")
    expect(ratowanieAkumulatoraMalyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(ratowanieAkumulatoraMalyTool)).not.toThrow()
  })

  it("AGM 10,2 V → B10 + B11, krytycznie rozładowany jako tekst PL", async () => {
    const w = await ratowanieAkumulatoraMalyTool.handler({ chemia: "AGM", napiecieSpoczynkoweV: 10.2 })
    expect(w.procedury.map((p) => p.ekran)).toEqual(["M11/B10", "M11/B11"])
    expect(w.ostrzezenia).toEqual([t("pl", "RAM-KRYTYCZNIE-ROZLADOWANY", { napiecie: "10.20", prog: "10.5" })])
  })
})

describe("bezpieczenstwoKamperTool + ladowanieWGarazuTool (M12/E22, E36)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    for (const tool of [bezpieczenstwoKamperTool, ladowanieWGarazuTool]) {
      expect(tool.operationType).toBe("read")
      expect(tool.requiresConfirmation).toBe(false)
      expect(() => validateAiToolDefinition(tool)).not.toThrow()
    }
  })

  it("kwasowy bez wentylacji → ostrzeżenie o wodorze jako tekst PL (oba ekrany)", async () => {
    const k = await bezpieczenstwoKamperTool.handler({ chemia: "kwasowy", potwierdzoneIds: [] })
    expect(k.ostrzezenia).toEqual([t("pl", "BK-OLOW-BEZ-WENTYLACJI")])
    expect(k.razem).toBe(5)
    const g = await ladowanieWGarazuTool.handler({ chemia: "kwasowy", potwierdzoneIds: [] })
    expect(g.ostrzezenia).toEqual([t("pl", "LG-OLOW-BEZ-WENTYLACJI")])
  })
})
