import { describe, expect, it } from "vitest"
import { calculatePowerbankVsAkumulator } from "../calculator"

// Biblia §12.7: powerbank 300 Wh vs DIY 100 Ah (12 V). Laptop 120 Wh per charge, full usable
// capacity and 100% efficiency only to reproduce the source's arithmetic — not defaults.
const BAZA = {
  mocUrzadzeniaW: 65,
  energiaNaUzycieWh: 120,
  powerbankWh: 300,
  powerbankMocWyjsciaW: 100,
  akumulatorAh: 100,
  akumulatorV: 12,
  akumulatorUzytecznaPct: 100,
  sprawnoscPct: 100,
}

describe("calculatePowerbankVsAkumulator (M12/E7, dawne 8.7)", () => {
  it("przykład Biblii: 100 Ah → 10 ładowań; 300 Wh → 2,5 (źródło podaje 1,5 — niespójne)", () => {
    const w = calculatePowerbankVsAkumulator(BAZA)
    expect(w.value.uzyciaAkumulator).toBeCloseTo(10)
    expect(w.value.uzyciaPowerbank).toBeCloseTo(2.5)
    expect(w.status).toBe("VALID")
  })

  it("lodówka 60 W, powerbank z wyjściem 30 W → 🟡 za mała moc", () => {
    const w = calculatePowerbankVsAkumulator({ ...BAZA, mocUrzadzeniaW: 60, powerbankMocWyjsciaW: 30 })
    expect(w.value.powerbankMaMoc).toBe(false)
    expect(w.warnings.map((x) => x.code)).toContain("PBA-ZA-MALA-MOC-POWERBANKU")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("sprawność i część użyteczna zmniejszają energię", () => {
    const w = calculatePowerbankVsAkumulator({ ...BAZA, akumulatorUzytecznaPct: 50, sprawnoscPct: 90 })
    expect(w.value.energiaAkumulatoraWh).toBeCloseTo(540)
    expect(w.value.energiaPowerbankuWh).toBeCloseTo(270)
  })

  it("brak danych → INCOMPLETE; procent > 100 → INVALID_INPUT", () => {
    expect(calculatePowerbankVsAkumulator({ ...BAZA, powerbankWh: 0 }).status).toBe("INCOMPLETE")
    expect(calculatePowerbankVsAkumulator({ ...BAZA, sprawnoscPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
