import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dniBezSloncaTool } from "../dni-bez-slonca-tool"
import { ochronaPrzedRozladowaniemTool } from "../ochrona-przed-rozladowaniem-tool"
import { urzadzenie12vBezposrednioTool } from "../urzadzenie-12v-bezposrednio-tool"
import { panelDoStacjiZasilaniaTool } from "../panel-do-stacji-zasilania-tool"
import { zuzyciePerUrzadzenieTool } from "../zuzycie-per-urzadzenie-tool"

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
