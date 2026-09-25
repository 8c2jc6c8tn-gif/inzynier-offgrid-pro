import { describe, expect, it } from "vitest"
import { CALCULATOR_VERSION as WERSJA_E7 } from "@/lib/core/modules/pv/mikropekniecia-termiczne/calculator"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { mikropeknieciaTermiczneTool } from "../mikropekniecia-termiczne-tool"
import { powlokiAntyrefleksyjneTool } from "../powloki-antyrefleksyjne-tool"
import { technologiePaneliTool } from "../technologie-paneli-tool"
import { mikroinwerteryVsCentralnyTool } from "../mikroinwertery-vs-centralny-tool"
import { warunkiNadmorskiePylisteTool } from "../warunki-nadmorskie-pyliste-tool"

const bezBrakujacegoKlucza = (teksty: string[]) => {
  for (const tekst of teksty) expect(tekst.startsWith("⚠")).toBe(false)
}

describe("narzędzia AI Modułu 3 — kontrakt 9.3", () => {
  it("wszystkie: 'read', bez potwierdzenia, przechodzą validateAiToolDefinition", () => {
    for (const n of [mikropeknieciaTermiczneTool, powlokiAntyrefleksyjneTool, technologiePaneliTool, mikroinwerteryVsCentralnyTool, warunkiNadmorskiePylisteTool]) {
      expect(n.operationType).toBe("read")
      expect(n.requiresConfirmation).toBe(false)
      expect(() => validateAiToolDefinition(n)).not.toThrow()
    }
  })
})

describe("mikropeknieciaTermiczneTool (M3/E7)", () => {
  it("deleguje do kalkulatora: sztywny montaż → ostrzeżenia jako tekst PL, nie kod", async () => {
    const wynik = await mikropeknieciaTermiczneTool.handler({ odstepDylatacyjnyMm: 2, podkladkiEpdm: false })
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.montazSztywny).toBe(true)
    expect(wynik.wersjaKalkulatora).toBe(WERSJA_E7)
    expect(wynik.ostrzezenia).toContain(
      t("pl", "MIKROPEKNIECIA-ODSTEP-ZA-MALY", { odstep: 2, min: 5, lata: 2 }),
    )
    expect(wynik.zalozenia).toEqual([t("pl", "MIKROPEKNIECIA-DANE-ZE-ZRODLA")])
    bezBrakujacegoKlucza([...wynik.ostrzezenia, ...wynik.zalozenia])
  })

  it("montaż elastyczny → VALID, montazSztywny=false", async () => {
    const wynik = await mikropeknieciaTermiczneTool.handler({ odstepDylatacyjnyMm: 8, podkladkiEpdm: true })
    expect(wynik.status).toBe("VALID")
    expect(wynik.montazSztywny).toBe(false)
  })
})

describe("powlokiAntyrefleksyjneTool (M3/E23)", () => {
  it("deleguje do kalkulatora: 4000 kWh → 40–120 kWh, założenie i uwaga jako tekst PL", async () => {
    const wynik = await powlokiAntyrefleksyjneTool.handler({ rocznyUzyskKwh: 4000 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.zyskMinKwh).toBeCloseTo(40, 9)
    expect(wynik.zyskMaxKwh).toBeCloseTo(120, 9)
    expect(wynik.jednostka).toBe("kWh/rok")
    expect(wynik.ostrzezenia).toEqual([t("pl", "POWLOKA-AR-CZYSZCZENIE")])
    expect(wynik.zalozenia).toEqual([t("pl", "POWLOKA-AR-ZAKRES-ZE-ZRODLA", { min: 1, max: 3 })])
    bezBrakujacegoKlucza([...wynik.ostrzezenia, ...wynik.zalozenia])
  })
})

describe("technologiePaneliTool (M3/E15)", () => {
  it("z mocą: powierzchnie z kalkulatora + założenie 🔎 o uzysku jako tekst PL", async () => {
    const wynik = await technologiePaneliTool.handler({ mocInstalacjiKwp: 4 })
    expect(wynik.status).toBe("VALID")
    const perc = wynik.technologie.find((x) => x.nazwa === "PERC")
    expect(perc?.powierzchniaModulow?.maxM2).toBeCloseTo(20, 6)
    expect(perc?.uzyskWzgledemPercWgZrodla).toBe("100% (wzorzec)")
    expect(wynik.zalozenia).toContain(t("pl", "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA"))
    bezBrakujacegoKlucza(wynik.zalozenia)
  })

  it("bez mocy (0): dane porównawcze nadal zwrócone, powierzchnia null, zastrzeżenie o uzysku obecne", async () => {
    const wynik = await technologiePaneliTool.handler({ mocInstalacjiKwp: 0 })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.technologie).toHaveLength(4)
    expect(wynik.technologie[0].powierzchniaModulow).toBeNull()
    expect(wynik.zalozenia).toEqual([t("pl", "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA")])
  })
})

describe("mikroinwerteryVsCentralnyTool (M3/E21)", () => {
  it("zacienienie → mikroinwertery + ostrzeżenie off-grid jako tekst PL, tabela 4 kryteriów", async () => {
    const wynik = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: true })
    expect(wynik.rekomendacja).toBe("mikroinwertery")
    expect(wynik.porownanie).toHaveLength(4)
    expect(wynik.ostrzezenia).toContain(t("pl", "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC"))
    bezBrakujacegoKlucza(wynik.ostrzezenia)
  })

  it("brak zacienienia → centralny", async () => {
    const wynik = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: false })
    expect(wynik.rekomendacja).toBe("centralny")
    expect(wynik.status).toBe("VALID")
  })
})

describe("warunkiNadmorskiePylisteTool (M3/E25)", () => {
  it("nadmorska bez zabezpieczeń → 4 reguły, komunikaty jako tekst PL", async () => {
    const wynik = await warunkiNadmorskiePylisteTool.handler({
      typLokalizacji: "nadmorska",
      wilgotnoscWysoka: false,
      certyfikatIec61701: false,
      ramaAnodowana: false,
      zlaczkiMorskie: false,
      certyfikatAntyPid: false,
    })
    expect(wynik.niespelnioneReguly).toBe(4)
    expect(wynik.ostrzezenia).toContain(t("pl", "NADMORSKA-BRAK-IEC-61701"))
    bezBrakujacegoKlucza(wynik.ostrzezenia)
  })
})
