import { describe, expect, it } from "vitest"
import { calculateStacjaVsDiy } from "../calculator"

const BIBLIA = {
  cenaStacjiZl: 1200,
  pojemnoscStacjiWh: 500,
  uzytecznaStacjiPct: 100,
  masaStacjiKg: 4,
  cenaDiyZl: 700,
  pojemnoscDiyAh: 100,
  napiecieDiyV: 12,
  dodDiyPct: 50,
  masaDiyKg: 12,
}

describe("calculateStacjaVsDiy (M12/E34, dawne 8.61)", () => {
  it("przykład Biblii §12.49 przy DoD 50%: 2,4 zł/Wh vs 700/600 zł/Wh → DIY ok. 2,06× (źródło: „2×”)", () => {
    const w = calculateStacjaVsDiy(BIBLIA)
    expect(w.status).toBe("VALID")
    expect(w.value.energiaDiyWh).toBeCloseTo(600, 12)
    expect(w.value.zlZaWhStacja).toBeCloseTo(2.4, 12)
    expect(w.value.zlZaWhDiy).toBeCloseTo(700 / 600, 12)
    expect(w.value.krotnoscDiy).toBeCloseTo(2.4 / (700 / 600), 12)
    expect(w.value.krotnoscDiy).toBeCloseTo(2.057, 3)
  })

  it("masa na kWh: stacja 4 kg / 0,5 kWh = 8; DIY 12 kg / 0,6 kWh = 20; masa 0 → 0", () => {
    const w = calculateStacjaVsDiy(BIBLIA)
    expect(w.value.kgNaKwhStacja).toBeCloseTo(8, 12)
    expect(w.value.kgNaKwhDiy).toBeCloseTo(20, 12)
    expect(calculateStacjaVsDiy({ ...BIBLIA, masaDiyKg: 0 }).value.kgNaKwhDiy).toBe(0)
  })

  it("część użyteczna stacji 90%: 450 Wh → 1200/450 zł/Wh", () => {
    expect(calculateStacjaVsDiy({ ...BIBLIA, uzytecznaStacjiPct: 90 }).value.zlZaWhStacja).toBeCloseTo(1200 / 450, 12)
  })

  it("brak danych → INCOMPLETE; DoD 150% → INVALID_INPUT", () => {
    expect(calculateStacjaVsDiy({ ...BIBLIA, cenaDiyZl: 0 }).status).toBe("INCOMPLETE")
    expect(calculateStacjaVsDiy({ ...BIBLIA, dodDiyPct: 150 }).status).toBe("INVALID_INPUT")
  })
})
