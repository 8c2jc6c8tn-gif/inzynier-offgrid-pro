import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { rozbijRachunekTool } from "../rozbij-rachunek-tool"
import { dobierzTaryfeTool } from "../dobierz-taryfe-tool"
import { mocBiernaTool } from "../moc-bierna-tool"
import { porownajScenariuszeTool } from "../porownaj-scenariusze-tool"
import { kosztPowrotuTool } from "../koszt-powrotu-tool"

const wspolne = {
  segment: "dom" as const,
  osd: "tauron" as const,
  dataRozliczenia: "2026-06-30",
  fazy: "jednofazowa" as const,
  mocUmownaKw: 0,
  okresRozliczeniowy: "1" as const,
  oplataHandlowaZlMies: 0,
  energiaMocowaKwh: null,
}

describe("narzędzia AI M14", () => {
  it.each([rozbijRachunekTool, dobierzTaryfeTool, mocBiernaTool, porownajScenariuszeTool, kosztPowrotuTool])("kontrakt 9.3: $name — 'read', bez potwierdzenia", (tool) => {
    expect(tool.operationType).toBe("read")
    expect(tool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(tool)).not.toThrow()
  })

  it("rozbij_rachunek_za_prad — Tauron G11, 2 000 kWh → netto 1 929,24 zł", async () => {
    const w = await rozbijRachunekTool.handler({
      ...wspolne,
      grupa: "G11",
      zuzycieStrefKwh: { calodobowa: 2000 },
      cenaEnergiiZlKwh: { calodobowa: 0.5 },
    })
    expect(w.nettoZl).toBeCloseTo(1929.24, 6)
    expect(w.skladniki).toHaveLength(9)
  })

  it("rozbij_rachunek_za_prad — PGE bez faktury → INCOMPLETE z tekstem PL braku", async () => {
    const w = await rozbijRachunekTool.handler({
      ...wspolne,
      osd: "pge",
      grupa: "G11",
      zuzycieStrefKwh: { calodobowa: 2000 },
      cenaEnergiiZlKwh: { calodobowa: 0.5 },
    })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toContain(t("pl", "SIEC-BRAK-SIECIOWAZMIENNA"))
  })

  it("dobierz_taryfe — ranking i najtańsza grupa", async () => {
    const w = await dobierzTaryfeTool.handler({
      ...wspolne,
      warianty: [
        { grupa: "G11", zuzycieStrefKwh: { calodobowa: 3000 }, cenaEnergiiZlKwh: { calodobowa: 0.5 } },
        { grupa: "G12", zuzycieStrefKwh: { dzien: 1000, noc: 2000 }, cenaEnergiiZlKwh: { dzien: 0.55, noc: 0.4 } },
      ],
    })
    expect(w.status).toBe("VALID")
    expect(w.najtanszaGrupa).toBe(w.ranking[0].grupa)
  })

  it("policz_oplate_za_moc_bierna — czynnik 0,0381 bez C_rk", async () => {
    const w = await mocBiernaTool.handler({
      tgFi: 0.5,
      tgFi0: 0.4,
      energiaCzynnaKwh: 100000,
      cRkZlKwh: null,
      energiaPojemnosciowaKvarh: 0,
      mocCzynnaSredniaKw: 0,
      tgFiCel: null,
      kosztBateriiZl: 0,
    })
    expect(w.czynnik).toBeCloseTo(0.0381, 4)
    expect(w.oplataRazemZl).toBeNull()
  })

  it("porownaj_scenariusze_przejscia — pełna tabela A–D, najtańszy A, najbardziej niezależny D", async () => {
    const scen = (inwestycjaZl: number, pojemnoscMagazynuKwh: number, kosztMagazynuZl = 0, serwisRokZl = 0) => ({
      inwestycjaZl,
      dotacjaZl: 0,
      mocPvKwp: 5,
      pojemnoscMagazynuKwh,
      kosztMagazynuZl,
      serwisRokZl,
    })
    const w = await porownajScenariuszeTool.handler({
      segment: "dom",
      horyzontLat: 10,
      tryb: { rodzaj: "suwak", gProcent: 0 },
      stopaDyskontowaProcent: 0,
      zuzycieMiesieczneKwh: Array(12).fill(300),
      uzyskMiesiecznyKwhNaKwp: [20, 20, 120, 120, 120, 120, 120, 120, 120, 120, 20, 20],
      autokonsumpcjaBezposrednia: 0.3,
      sprawnoscMagazynu: 0.9,
      zywotnoscMagazynuLat: 6,
      siec: { kosztStalyRokBruttoZl: 1000, cenaZmiennaKwhBruttoZl: 1, wartoscNadwyzkiKwhZl: 0.3 },
      agregat: { mocKw: 5, zuzycieLH: 2, cenaPaliwaZlL: 7 },
      scenariusze: { A: scen(20000, 0), B: scen(45000, 10), C: scen(55000, 10), D: scen(60000, 10, 30000, 500) },
      kontrola: { osobyZalezneOdZasilania: false, zapasRedundantny: false, progGodzinAgregatuMies: 40, dopuszczalnyCzasBezZasilaniaH: null },
    })
    expect(w.scenariusze.map((s) => s.id)).toEqual(["A", "B", "C", "D"])
    expect(w.scenariusze[0].tcoDzisiejszeZl).toBeCloseTo(39480, 6)
    expect(w.najtanszy).toBe("A")
    expect(w.najbardziejNiezalezny).toBe("D")
  })

  it("oszacuj_koszt_powrotu_do_sieci — stawka testowa 40 zł/kW × 15 kW = 600 zł; bez stawki INCOMPLETE", async () => {
    const w = await kosztPowrotuTool.handler({ stawkaZlKw: 40, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: true })
    expect(w.kosztNettoZl).toBeCloseTo(600, 9)
    const b = await kosztPowrotuTool.handler({ stawkaZlKw: null, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: true })
    expect(b.status).toBe("INCOMPLETE")
    expect(b.ostrzezenia).toContain(t("pl", "SIEC-BRAK-STAWKAPRZYLACZENIOWA"))
  })
})
