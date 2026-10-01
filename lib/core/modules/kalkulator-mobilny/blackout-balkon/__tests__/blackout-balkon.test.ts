import { describe, expect, it } from "vitest"
import { calculateBlackoutBalkon } from "../calculator"
import type { BlackoutBalkonInput } from "../input"

// Tresc E40 C: "Balkon 2×1m: 1 panel 400W + mały akumulator …". Railing 2 m, panel 1 m wide → 2 panels;
// other values are test inputs, not defaults.
const BAZA: BlackoutBalkonInput = {
  odbiorniki: [
    { nazwa: "Router", mocW: 10, godzinNaDobe: 24 },
    { nazwa: "Lodówka", mocW: 100, godzinNaDobe: 8 },
  ],
  czasBlackoutuH: 24,
  pojemnoscWh: 1000,
  uzytecznaPct: 100,
  sprawnoscFalownikaPct: 100,
  dlugoscBalustradyM: 0,
  szerokoscPaneluM: 0,
  mocPaneluW: 0,
  godzinSlonca: 0,
  sprawnoscToruPct: 0,
}

describe("calculateBlackoutBalkon (M12/E40, dawne 8.68)", () => {
  it("sama stacja: 1040 Wh/dobę, 1000 Wh → 23,1 h, brakuje 40 Wh na 24 h → 🟡", () => {
    const w = calculateBlackoutBalkon(BAZA)
    expect(w.value.zuzycieDobaWh).toBe(1040)
    expect(w.value.magazynStarczyH).toBeCloseTo((1000 / 1040) * 24, 12)
    expect(w.value.bilansWh).toBe(-40)
    expect(w.warnings.map((x) => x.code)).toEqual(["BB-ZA-MALO-NA-BLACKOUT", "BB-BEZ-KLIMATYZACJI"])
  })

  it("balustrada 2 m, panel 1 m → 2 panele; 400 W × 2 × 3 h × 80% = 1920 Wh/dobę → bilans dodatni", () => {
    const w = calculateBlackoutBalkon({ ...BAZA, dlugoscBalustradyM: 2, szerokoscPaneluM: 1, mocPaneluW: 400, godzinSlonca: 3, sprawnoscToruPct: 80 })
    expect(w.value.liczbaPaneli).toBe(2)
    expect(w.value.energiaPaneliDobaWh).toBeCloseTo(1920, 9)
    expect(w.value.bilansWh).toBeCloseTo(1880, 9)
    expect(w.warnings.map((x) => x.code)).toEqual(["BB-BEZ-KLIMATYZACJI", "BB-MONTAZ-NA-BALKONIE"])
  })

  it("panel szerszy niż balustrada → 🟡 nie mieści się; brak wymiarów panelu przy balustradzie → INCOMPLETE", () => {
    const w = calculateBlackoutBalkon({ ...BAZA, dlugoscBalustradyM: 0.8, szerokoscPaneluM: 1.1, mocPaneluW: 400, godzinSlonca: 3, sprawnoscToruPct: 80 })
    expect(w.warnings.map((x) => x.code)).toContain("BB-PANEL-SIE-NIE-MIESCI")
    expect(calculateBlackoutBalkon({ ...BAZA, dlugoscBalustradyM: 2 }).status).toBe("INCOMPLETE")
  })

  it("ujemne → INVALID_INPUT; brak odbiorników → INCOMPLETE", () => {
    expect(calculateBlackoutBalkon({ ...BAZA, pojemnoscWh: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateBlackoutBalkon({ ...BAZA, odbiorniki: [] }).status).toBe("INCOMPLETE")
  })
})
