import { describe, expect, it } from "vitest"
import { validateAiToolDefinition } from "../../types"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { bilansMiesiecznyTool } from "../bilans-miesieczny-tool"
import { depozytProsumenckiTool } from "../depozyt-prosumencki-tool"
import { mocUmownaTool } from "../moc-umowna-tool"
import { oplataMocowaTool } from "../oplata-mocowa-tool"
import { przelacznikSiecWyspaTool } from "../przelacznik-siec-wyspa-tool"
import { sciezkaCenEnergiiTool } from "../sciezka-cen-energii-tool"
import { strumienieBessTool } from "../strumienie-bess-tool"
import { testLicznikaTool } from "../test-licznika-tool"

// Control examples are the engines' own (lib/core/modules/siec/*/__tests__) — the tool only echoes.
describe("narzędzia AI M14 — partia 2 (kalkulatory bez narzędzia do 29.09.2026)", () => {
  it.each([
    bilansMiesiecznyTool,
    depozytProsumenckiTool,
    mocUmownaTool,
    oplataMocowaTool,
    przelacznikSiecWyspaTool,
    sciezkaCenEnergiiTool,
    strumienieBessTool,
    testLicznikaTool,
  ])("kontrakt 9.3: $name — 'read', bez potwierdzenia, opis z „Użyj, gdy”", (tool) => {
    expect(tool.operationType).toBe("read")
    expect(tool.requiresConfirmation).toBe(false)
    expect(tool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(tool)).not.toThrow()
  })

  it("policz_bilans_miesieczny_energii — echo silnika, miesiące numerowane od 1", async () => {
    const wejscie = {
      tryb: "siec" as const,
      zuzycieMiesieczneKwh: [500, 450, 400, 330, 300, 300, 300, 300, 320, 380, 450, 500],
      uzyskMiesiecznyKwhNaKwp: [20, 35, 75, 110, 135, 140, 140, 120, 85, 55, 25, 15],
      mocPvKwp: 5,
      autokonsumpcjaBezposrednia: 0.3,
      pojemnoscMagazynuKwh: 10,
      sprawnoscMagazynu: 0.9,
    }
    const w = await bilansMiesiecznyTool.handler(wejscie)
    const silnik = calculateBilansMiesieczny(wejscie).value!
    expect(w.niedoborRokKwh).toBeCloseTo(silnik.niedoborRokKwh, 9)
    expect(w.miesiace).toHaveLength(12)
    expect(w.miesiace[0].miesiac).toBe(1)
    expect(w.najgorszyMiesiac).toBe(silnik.najgorszyMiesiac! + 1)
  })

  it("policz_depozyt_prosumencki — 2 MWh × 450 zł/MWh × 1,23 = 1 107 zł", async () => {
    const w = await depozytProsumenckiTool.handler({
      dataMiesiaca: "2026-05-15",
      energiaOddanaKwh: 2000,
      cenaRynkowaZlMwh: 450,
      systemCeny: "rce",
      wykorzystanoZl: null,
      pelnyKosztKwhBruttoZl: null,
    })
    expect(w.depozytZl).toBeCloseTo(1107, 9)
    expect(w.maksZwrotZl).toBeCloseTo(270, 9)
  })

  it("dobierz_moc_umowna — 50 kW: stały 6 000 + przekroczenia 500", async () => {
    const w = await mocUmownaTool.handler({
      osd: "tauron",
      grupa: "C21",
      dataRozliczenia: "2026-06-30",
      mocUmownaKw: 50,
      stalaZlKwMiesWlasna: 10,
      wariantPomiaru: "10xmax",
      miesiace: [55, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45].map((maksKw) => ({ maksKw, dziesiecNajwiekszychKw: null })),
    })
    expect(w.kosztRazemRokZl).toBe(6500)
  })

  it("policz_oplate_mocowa — 0,2194 zł/kWh, udział 60%", async () => {
    const w = await oplataMocowaTool.handler({
      dataRozliczenia: "2026-06-30",
      energiaRocznaKwh: 100000,
      energiaWGodzinachKwh: 60000,
      przesuniecieProcent: 20,
    })
    expect(w.stawkaZlKwh).toBe(0.2194)
    expect(w.udzialProcent).toBeCloseTo(60, 12)
    expect(w.oszczednoscRokZl).toBeCloseTo(12000 * 0.2194, 9)
  })

  it("sprawdz_przelacznik_siec_wyspa — brak przełącznika z blokadą → backfeed, twardy stop", async () => {
    const w = await przelacznikSiecWyspaTool.handler({
      trybPracy: "przelaczany",
      przelacznik: "brak-lub-bez-blokady",
      przelaczaN: true,
      zgloszenieOsd: null,
      maAgregat: false,
    })
    expect(w.backfeed).toBe(true)
    expect(w.twardeStopy).toBeGreaterThan(0)
  })

  it("policz_sciezke_cen_energii — ścieżka UE: mnożnik 1,1470 w 2041; suwak bez g → INCOMPLETE", async () => {
    const baza = { rokBazowy: 2026, horyzontLat: 15, kosztRocznyZl: 5000 }
    const ue = await sciezkaCenEnergiiTool.handler({ ...baza, rodzaj: "ue" })
    expect(ue.mnoznikKoncowy).toBeCloseTo(1.147, 4)
    const bezG = await sciezkaCenEnergiiTool.handler({ ...baza, rodzaj: "suwak" })
    expect(bezG.status).toBe("INCOMPLETE")
  })

  it("policz_strumienie_korzysci_bess — korzyść 1 948,50 zł, bilans 948,50 zł", async () => {
    const w = await strumienieBessTool.handler({
      dataRozliczenia: "2026-06-30",
      grupa: "C2x",
      kosztCykluZlKwh: 0.25,
      cenaMagazynuZl: 20000,
      autokonsumpcjaKwhRok: 3000,
      autokonsumpcjaZyskZlKwh: 0.4,
      arbitrazKwhRok: 1000,
      arbitrazZyskZlKwh: 0.2,
      mocowaKwhRok: 2500,
      mocUmownaZlRok: null,
    })
    expect(w.korzyscRokZl).toBeCloseTo(1948.5, 9)
    expect(w.bilansRokZl).toBeCloseTo(948.5, 9)
  })

  it("sprawdz_licznik_energii — 15 impulsów / 60 s / 1000 imp/kWh = 0,9 kW, −10% wobec 1 000 W", async () => {
    const w = await testLicznikaTool.handler({ liczbaImpulsow: 15, czasS: 60, stalaImpKwh: 1000, mocOdbiornikaW: 1000 })
    expect(w.mocZLicznikaKw).toBeCloseTo(0.9, 12)
    expect(w.roznicaProcent).toBeCloseTo(-10, 9)
    expect(w.ostrzezenia.length).toBeGreaterThan(0)
  })
})
