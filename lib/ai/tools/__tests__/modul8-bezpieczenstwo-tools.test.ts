import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { zamkiDrzwiEwakuacyjnychTool } from "../zamki-drzwi-ewakuacyjnych-tool"
import { modulGasniczyTool } from "../modul-gasniczy-tool"
import { awaryjneZrodloCieplaTool } from "../awaryjne-zrodlo-ciepla-tool"

describe("zamkiDrzwiEwakuacyjnychTool (M8/E3, dawne 11.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(zamkiDrzwiEwakuacyjnychTool.operationType).toBe("read")
    expect(zamkiDrzwiEwakuacyjnychTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(zamkiDrzwiEwakuacyjnychTool)).not.toThrow()
  })

  it("zamek blokujący bez zasilania awaryjnego → twardy stop PL", async () => {
    const w = await zamkiDrzwiEwakuacyjnychTool.handler({
      typZamka: "elektrozaczep",
      zachowaniePrzyZanikuZasilania: "blokuje",
      maZasilanieAwaryjne: false,
      maPrzyciskEwakuacyjny: true,
      zwalnianiePoAlarmiePozarowym: true,
      maKontaktron: true,
    })
    expect(w.failSafe).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO"))
  })
})

describe("modulGasniczyTool (M8/E4, dawne 11.52 + 12.51)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(modulGasniczyTool.operationType).toBe("read")
    expect(modulGasniczyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(modulGasniczyTool)).not.toThrow()
  })

  it("CO2 w strefie LiFePO4 → twardy stop PL", async () => {
    const w = await modulGasniczyTool.handler({
      srodek: "co2",
      magazynWStrefie: "lifepo4",
      liczbaCzujnikowPotwierdzenia: 2,
      odcinaWentylacjeIKlapy: true,
      stanModulu: "sprawny",
    })
    expect(w.srodekWlasciwyDlaLifepo4).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4"))
  })
})

describe("awaryjneZrodloCieplaTool (M8/E1, dawne 6.19)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(awaryjneZrodloCieplaTool.operationType).toBe("read")
    expect(awaryjneZrodloCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(awaryjneZrodloCieplaTool)).not.toThrow()
  })

  it("płaszcz 8 kW × 6 h przy 80 kWh/dobę → 60%, 20 kg drewna", async () => {
    const w = await awaryjneZrodloCieplaTool.handler({
      typZrodla: "kominek",
      mocKw: 10,
      plaszczWodny: true,
      mocDoWodyKw: 8,
      godzinyPaleniaNaDobe: 6,
      zapotrzebowanieCieplaKwhDoba: 80,
      sprawnoscProc: 75,
      wartoscOpalowaKwhKg: 4,
    })
    expect(w.pokrycieProc).toBeCloseTo(60, 12)
    expect(w.paliwoKgDoba).toBeCloseTo(20, 12)
    expect(w.ostrzezenia).toContain(t("pl", "ZRODLO-NIE-POKRYWA", { pokrycie: 60 }))
  })
})
