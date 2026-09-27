import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dniBezSloncaTool } from "../dni-bez-slonca-tool"
import { ochronaPrzedRozladowaniemTool } from "../ochrona-przed-rozladowaniem-tool"
import { urzadzenie12vBezposrednioTool } from "../urzadzenie-12v-bezposrednio-tool"

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
