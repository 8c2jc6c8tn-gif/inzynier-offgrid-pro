import { describe, expect, it } from "vitest"
import { calculatePreHeat } from "../calculator"
import type { PreHeatInput } from "../input"

const BAZA: PreHeatInput = {
  pojemnoscCieplnaKwhK: 6,
  podniesienieTempDomuK: 3,
  stratyCieplaKw: 1.5,
  pojemnoscBojleraL: 200,
  podniesienieTempBojleraK: 20,
  cop: 3,
  zrodloEnergii: "pv-dzien",
  nadwyzkaPvKwh: null,
}

describe("calculatePreHeat (M7/E18, dawne 6.28)", () => {
  it("C = 6 kWh/K, +3 K → 18 kWh w masie; bojler 200 l × 20 K; COP 3; straty 1,5 kW → bufor 12 h", () => {
    const w = calculatePreHeat(BAZA)
    const bojler = 200 * 20 * (4186 / 3_600_000)
    expect(w.value.cieploDomuKwh).toBeCloseTo(18, 12)
    expect(w.value.cieploBojleraKwh).toBeCloseTo(bojler, 12)
    expect(w.value.energiaElektrycznaKwh).toBeCloseTo((18 + bojler) / 3, 12)
    expect(w.value.buforGodzin).toBeCloseTo(12, 12)
    expect(w.status).toBe("VALID")
  })

  it("grzanie nocą z baterii → 🔴 (źródło)", () => {
    const w = calculatePreHeat({ ...BAZA, zrodloEnergii: "bateria-noc" })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["PREHEAT-GRZANIE-NOCA-Z-BATERII", "critical"]])
  })

  it("energia większa niż nadwyżka PV → 🟡; wystarczająca → bez", () => {
    expect(calculatePreHeat({ ...BAZA, nadwyzkaPvKwh: 5 }).warnings[0]!.code).toBe("PREHEAT-ZA-MALA-NADWYZKA")
    expect(calculatePreHeat({ ...BAZA, nadwyzkaPvKwh: 20 }).warnings).toEqual([])
  })

  it("bez bojlera i bez strat → tylko ciepło domu i energia", () => {
    const w = calculatePreHeat({ ...BAZA, pojemnoscBojleraL: null, stratyCieplaKw: null })
    expect(w.value.cieploBojleraKwh).toBeNull()
    expect(w.value.buforGodzin).toBeNull()
    expect(w.value.energiaElektrycznaKwh).toBeCloseTo(6, 12)
  })

  it("brak źródła energii → INCOMPLETE; COP 0 albo ujemna pojemność → INVALID_INPUT", () => {
    expect(calculatePreHeat({ ...BAZA, zrodloEnergii: null }).status).toBe("INCOMPLETE")
    expect(calculatePreHeat({ ...BAZA, cop: 0 }).status).toBe("INVALID_INPUT")
    expect(calculatePreHeat({ ...BAZA, pojemnoscBojleraL: -1 }).status).toBe("INVALID_INPUT")
  })
})
