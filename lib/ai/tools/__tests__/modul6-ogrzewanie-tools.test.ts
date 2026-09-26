import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { kosztyOgrzewaniaTool } from "../koszty-ogrzewania-tool"
import { obciazenieCieplneTool } from "../obciazenie-cieplne-tool"
import { zapotrzebowanieCoCwuTool } from "../zapotrzebowanie-co-cwu-tool"
import { mostkiTermiczneTool } from "../mostki-termiczne-tool"
import { optymalizacjaIzolacjiTool } from "../optymalizacja-izolacji-tool"
import { pojemnoscCieplnaTool } from "../pojemnosc-cieplna-tool"

describe("kosztyOgrzewaniaTool (M6, dawne 5.39 + D28)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(kosztyOgrzewaniaTool.operationType).toBe("read")
    expect(kosztyOgrzewaniaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(kosztyOgrzewaniaTool)).not.toThrow()
  })

  it("okres bez podania → 10 lat ze źródła; nagrzewnica z karty; teksty PL zamiast kodów", async () => {
    const w = await kosztyOgrzewaniaTool.handler({
      zapotrzebowanieSezonKwh: 10000,
      zrodla: [
        { nazwa: "Webasto", rodzaj: "nagrzewnica-paliwowa", jednostka: "l", cenaZl: 6, mocGrzewczaKw: 4, zuzyciePaliwaNaH: 0.5, kosztInwestycjiZl: 3000, kosztSerwisuRocznyZl: 200 },
        { nazwa: "Pellet bez wartości opałowej", rodzaj: "pellet", cenaZl: 1.4, sprawnoscPct: 80, kosztInwestycjiZl: 0, kosztSerwisuRocznyZl: 0 },
      ],
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.ranking[0]!.kosztKwhCieplaZl).toBeCloseTo(0.75, 12)
    expect(w.ranking[0]!.kosztCalkowityZl).toBeCloseTo(3000 + 10 * (7500 + 200), 9)
    expect(w.pominiete).toEqual(["Pellet bez wartości opałowej"])
    expect(w.zalozenia).toContain(t("pl", "KO-ZALOZENIE-OKRES", { lata: 10, zrodlo: 10 }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("obciazenieCieplneTool (M6/E1, dawne 5.1)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(obciazenieCieplneTool.operationType).toBe("read")
    expect(obciazenieCieplneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(obciazenieCieplneTool)).not.toThrow()
  })

  it("przykład źródła 8 kW przy −20 °C → 192 kWh/dobę, COP 3 → 64 kWh; ostrzeżenie o PN-EN 12831 jako tekst PL", async () => {
    const w = await obciazenieCieplneTool.handler({
      przegrody: [{ nazwa: "Przegrody razem", powierzchniaM2: 200, uWM2K: 1 }],
      temperaturaWewnetrznaC: 20,
      strefaKlimatyczna: 3,
      kubaturaM3: 300,
      wymianyPowietrzaNaH: 0,
      cop: 3,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.obciazenieW).toBe(8000)
    expect(w.cieploDobaObliczeniowaKwh).toBe(192)
    expect(w.energiaElektrycznaDobaKwh).toBe(64)
    expect(w.miesiace).toEqual([])
    expect(w.ostrzezenia).toContain(t("pl", "OC-BEZ-PN-EN-12831"))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("zapotrzebowanieCoCwuTool (M6/E2, dawne 5.2)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(zapotrzebowanieCoCwuTool.operationType).toBe("read")
    expect(zapotrzebowanieCoCwuTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(zapotrzebowanieCoCwuTool)).not.toThrow()
  })

  it("styczeń 1240 kWh → 40 kWh/dobę C.O.; 4 × 50 l × 43 K ≈ 10 kWh C.W.U.; teksty PL zamiast kodów", async () => {
    const w = await zapotrzebowanieCoCwuTool.handler({
      cieploCoMiesiaceKwh: [1240, null, null, null, null, null, null, null, null, null, null, null],
      liczbaOsob: 4,
      cwuLitrowNaOsobeDoba: 50,
      temperaturaZimnejWodyC: 10,
      temperaturaCwuC: 53,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.miesiace).toHaveLength(1)
    expect(w.miesiace[0]!.coKwhDoba).toBe(40)
    expect(w.cwuKwhDoba).toBeCloseTo(9.999888888888888, 12)
    expect(w.ostrzezenia).toContain(t("pl", "COCWU-CWU-BEZ-STRAT"))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })

  it("bez miesięcy z Ekranu 1 → samo C.W.U., informacja zamiast zgadywania C.O.", async () => {
    const w = await zapotrzebowanieCoCwuTool.handler({ liczbaOsob: 2, cwuLitrowNaOsobeDoba: 50, temperaturaZimnejWodyC: 10, temperaturaCwuC: 50 })
    expect(w.miesiace).toEqual([])
    expect(w.ostrzezenia).toContain(t("pl", "COCWU-BRAK-MIESIECY-CO"))
  })
})

describe("mostkiTermiczneTool (M6/E7, dawne 5.7)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(mostkiTermiczneTool.operationType).toBe("read")
    expect(mostkiTermiczneTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(mostkiTermiczneTool)).not.toThrow()
  })

  it("H = 22,5 W/K przy −20/20 °C i 6,6 kW z Ekranu 1 → 900 W, 12% (przykład źródła); nadproże → ostrzeżenie PL", async () => {
    const w = await mostkiTermiczneTool.handler({
      mostki: [{ nazwa: "Nadproża", dlugoscM: 100, psiWmK: 0.225, nadprozeBezIzolacji: true }],
      temperaturaWewnetrznaC: 20,
      temperaturaZewnetrznaC: -20,
      obciazenieBezMostkowW: 6600,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.strataMostkowW).toBeCloseTo(900, 9)
    expect(w.udzialMostkowPct).toBeCloseTo(12, 9)
    expect(w.ostrzezenia).toContain(t("pl", "MT-NADPROZE-BEZ-IZOLACJI", { nazwa: "Nadproża" }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("optymalizacjaIzolacjiTool (M6/E10, dawne 5.10)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(optymalizacjaIzolacjiTool.operationType).toBe("read")
    expect(optymalizacjaIzolacjiTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(optymalizacjaIzolacjiTool)).not.toThrow()
  })

  it("najtańszy wariant, 🟡 przy cenie ciepła, teksty PL zamiast kodów", async () => {
    const w = await optymalizacjaIzolacjiTool.handler({
      nazwaPrzegrody: "Ściana",
      powierzchniaM2: 100,
      uWM2K: 0.5,
      warianty: [
        { nazwa: "Wełna", lambdaWmK: 0.04, gruboscCm: 10, cenaZlM2: 50 },
        { nazwa: "Wełna", lambdaWmK: 0.04, gruboscCm: 20, cenaZlM2: 80 },
      ],
      temperaturaWewnetrznaC: 20,
      srednieTemperaturyMiesieczneC: Array(12).fill(0),
      cenaCieplaZlKwh: 0.2,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.najtanszy).toBe("Wełna 10 cm")
    expect(w.warianty[1]!.kosztKrancowyZaKwhZl).toBeCloseTo(0.21575342465753433, 12)
    expect(w.zalozenia).toContain(t("pl", "IZOL-ZALOZENIE-10-LAT", { lata: 10 }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})

describe("pojemnoscCieplnaTool (M6/E8, dawne 5.8 + 6.11)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(pojemnoscCieplnaTool.operationType).toBe("read")
    expect(pojemnoscCieplnaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(pojemnoscCieplnaTool)).not.toThrow()
  })

  it("τ, czas do granicy i ostrzeżenie o zawyżeniu jako tekst PL", async () => {
    const w = await pojemnoscCieplnaTool.handler({
      warstwy: [{ nazwa: "Strop", powierzchniaM2: 100, gruboscCm: 20, gestoscKgM3: 2000, cieploWlasciweJKgK: 1000 }],
      kubaturaM3: 300,
      hZewnetrzneWK: 200,
      stratyDoInnychStref: [{ hWK: 50, temperaturaC: 10 }],
      temperaturaPoczatkowaC: 20,
      temperaturaZewnetrznaC: -20,
      temperaturaGranicznaC: 5,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.stalaCzasowaH).toBeCloseTo(44.846444444444444, 9)
    expect(w.czasDoGranicyH).toBeCloseTo(26.097112259036162, 9)
    expect(w.ostrzezenia).toContain(t("pl", "POJC-CALA-MASA-ZAWYZA"))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})
