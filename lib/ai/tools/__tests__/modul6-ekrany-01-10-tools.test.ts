import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dystrybucjaCieplaTool } from "../dystrybucja-ciepla-tool"
import { sterowanieStrefoweTool } from "../sterowanie-strefowe-tool"
import { zasobnikCwuTool } from "../zasobnik-cwu-tool"
import { grzalkaCwuTool } from "../grzalka-cwu-tool"
import { oslonyPrzeciwsloneczneTool } from "../oslony-przeciwsloneczne-tool"

describe("dystrybucjaCieplaTool (M6/E13, dawne 5.13 + 5.17 + 5.18)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(dystrybucjaCieplaTool.operationType).toBe("read")
    expect(dystrybucjaCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(dystrybucjaCieplaTool)).not.toThrow()
  })

  it("pompa + grzejniki standardowe → 🔴 jako tekst PL", async () => {
    const w = await dystrybucjaCieplaTool.handler({
      zrodloCiepla: "pompa-ciepla",
      system: "grzejniki-standardowe",
      cieploRocznieKwh: 0,
      copSystemu: 0,
      copOdniesienia: 0,
      doplataZl: 0,
      cenaPraduZlKwh: 0,
    })
    expect(w.dopasowanie).toBe("zle")
    expect(w.ostrzezenia).toContain(t("pl", "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA", { standard: "75/65/20", nisko: "45/35/20" }))
  })
})

describe("sterowanieStrefoweTool (M6/E16, dawne 5.16)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(sterowanieStrefoweTool.operationType).toBe("read")
    expect(sterowanieStrefoweTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(sterowanieStrefoweTool)).not.toThrow()
  })

  it("18% zysku ciepła, założenie o H strefy jako tekst PL", async () => {
    const w = await sterowanieStrefoweTool.handler({
      strefy: [{ nazwa: "Dom", hWK: 100, tKomfortC: 20, tObnizonaC: 14, godzinObnizenia: 14.4 }],
      tZewnC: 0,
      liczbaSilownikow: 10,
      mocSilownikaW: 2,
      godzinPracySilownikow: 24,
      mocSterownikowW: 5,
      copOgrzewania: 3,
    })
    expect(w.oszczednoscPct).toBeCloseTo(18, 9)
    expect(w.zalozenia).toContain(t("pl", "STREF-ZALOZENIE-H-STREFY"))
  })
})

describe("zasobnikCwuTool (M6/E17, dawne 5.19 + 5.20 + 5.21)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(zasobnikCwuTool.operationType).toBe("read")
    expect(zasobnikCwuTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(zasobnikCwuTool)).not.toThrow()
  })

  it("0,8 W/K przy ΔT 62,5 K → 1,2 kWh/dobę; garaż → 🟡 jako tekst PL", async () => {
    const w = await zasobnikCwuTool.handler({
      osoby: 4,
      litrowNaOsobe: 50,
      tZimnaC: 10,
      tCwuC: 70,
      pojemnoscL: 200,
      uaWK: 0.8,
      uaPorownawczyWK: 0,
      tOtoczeniaC: 7.5,
      nieogrzewane: true,
      dlugoscCyrkulacjiM: 0,
      strataRuryWmK: 0,
      tOtoczeniaRurC: null,
      godzinCyrkulacji: 0,
      mocPompyW: 0,
    })
    expect(w.strataPostojowaKwh).toBeCloseTo(1.2, 12)
    expect(w.ostrzezenia).toContain(t("pl", "ZAS-NIEOGRZEWANE", { strata: 1.2 }))
  })
})

describe("grzalkaCwuTool (M6/E18, dawne 5.22)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(grzalkaCwuTool.operationType).toBe("read")
    expect(grzalkaCwuTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(grzalkaCwuTool)).not.toThrow()
  })

  it("2 kW na falowniku 1,5 kW → 🟡 jako tekst PL", async () => {
    const w = await grzalkaCwuTool.handler({ pojemnoscL: 200, tStartC: 10, tKoniecC: 50, mocGrzalkiKw: 2, mocPvKw: 0, sterowanie: null, mocFalownikaKw: 1.5 })
    expect(w.czasH).toBeCloseTo(4.651, 3)
    expect(w.ostrzezenia).toContain(t("pl", "GRZ-PONAD-FALOWNIK", { grzalka: 2, falownik: 1.5 }))
  })
})

describe("oslonyPrzeciwsloneczneTool (M6/E19, dawne 5.25)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(oslonyPrzeciwsloneczneTool.operationType).toBe("read")
    expect(oslonyPrzeciwsloneczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(oslonyPrzeciwsloneczneTool)).not.toThrow()
  })

  it("okap 2 m tuż nad oknem na 52°N → 🟡 zimowy cień jako tekst PL", async () => {
    const w = await oslonyPrzeciwsloneczneTool.handler({ szerokoscDeg: 52, wysiegM: 2, odstepM: 0, wysokoscOknaM: 1.5 })
    expect(w.zacienienieLatoPct).toBe(100)
    expect(w.ostrzezenia).toContain(t("pl", "OSL-OKAP-ZIMA", { pct: Math.round(w.zacienienieZimaPct) }))
  })
})
