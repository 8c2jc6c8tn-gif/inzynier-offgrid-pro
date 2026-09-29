import { describe, expect, it } from "vitest"
import { calculateStrumienieBess } from "../calculator"
import type { StrumienieBessInput } from "../input"

// Hand arithmetic (test numbers, not market prices): 3 000 kWh self-consumption × 0,40 = 1 200 zł;
// 1 000 kWh arbitrage × 0,20 = 200 zł; 2 500 kWh in 7–22 × 0,2194 = 548,50 zł. Sum 1 948,50 zł.
// Wear: 4 000 kWh × 0,25 = 1 000 zł → balance 948,50 zł. Payback 20 000 / 1 948,50 = 10,264… years.
const wejscie = (z: Partial<StrumienieBessInput> = {}): StrumienieBessInput => ({
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
  ...z,
})

describe("strumienie-bess — F7 (§8.5)", () => {
  it("suma strumieni, zużycie magazynu, bilans i prosty zwrot", () => {
    const r = calculateStrumienieBess(wejscie())
    expect(r.value!.korzyscRokZl).toBeCloseTo(1948.5, 9)
    expect(r.value!.kosztZuzyciaRokZl).toBeCloseTo(1000, 9)
    expect(r.value!.bilansRokZl).toBeCloseTo(948.5, 9)
    expect(r.value!.prostyZwrotLat).toBeCloseTo(20000 / 1948.5, 9)
    expect(r.value!.stawkaMocowaZlKwh).toBe(0.2194)
  })
  it("arbitraż tańszy niż koszt cyklu → informacja o stratnym strumieniu", () => {
    const r = calculateStrumienieBess(wejscie())
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-BESS-STRATNY-ARBITRAZ")
    expect(r.warnings.map((w) => w.code)).not.toContain("SIEC-BESS-STRATNA-AUTOKONSUMPCJA")
  })
  it("K13: redukcja mocy umownej w C1x → ostrzeżenie", () => {
    const r = calculateStrumienieBess(wejscie({ grupa: "C1x", mocUmownaZlRok: 500 }))
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-BESS-MOC-C1X")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })
  it("bez kosztu cyklu z M4/E23 → INCOMPLETE", () => {
    expect(calculateStrumienieBess(wejscie({ kosztCykluZlKwh: null })).status).toBe("INCOMPLETE")
  })
  it("kWh w godzinach 7–22 większe niż przepływ magazynu → INVALID_INPUT", () => {
    expect(calculateStrumienieBess(wejscie({ mocowaKwhRok: 5000 })).status).toBe("INVALID_INPUT")
  })
})
