import { describe, expect, it } from "vitest"
import { calculateBlackoutMinimum } from "../calculator"

// Test values only — the user enters powers, efficiency and usable share (Directive #1).
const BAZA = {
  odbiorniki: [
    { nazwa: "lodówka", mocW: 100, godzinNaDobe: 8 },
    { nazwa: "router", mocW: 10, godzinNaDobe: 24 },
    { nazwa: "oświetlenie", mocW: 20, godzinNaDobe: 5 },
  ],
  czasBlackoutuH: 24,
  napiecieV: 12,
  uzytecznaPct: 80,
  sprawnoscPrzetwornicyPct: 90,
  posiadanyAh: 0,
}

describe("calculateBlackoutMinimum (M12/E13, dawne 8.20)", () => {
  it("doba: 800 + 240 + 100 = 1140 Wh; akumulator 1140 / (0,9 × 12 × 0,8) ≈ 131,9 Ah; przetwornica ≥ 130 W", () => {
    const w = calculateBlackoutMinimum(BAZA)
    expect(w.value.zuzycieDobaWh).toBe(1140)
    expect(w.value.minimalnyAh).toBeCloseTo(131.94, 1)
    expect(w.value.minimalnaPrzetwornicaW).toBe(130)
    expect(w.value.energiaReferencyjnaWh).toEqual([570, 1140, 2280])
    expect(w.status).toBe("VALID")
  })

  it("posiadany 100 Ah < minimum → 🟡, starczy na ok. 18 h", () => {
    const w = calculateBlackoutMinimum({ ...BAZA, posiadanyAh: 100 })
    expect(w.warnings.map((x) => x.code)).toContain("BM-AKUMULATOR-ZA-MALY")
    expect(w.value.posiadanyStarczyH).toBeCloseTo(18.19, 1)
  })

  it("brak odbiorników → INCOMPLETE; godziny > 24 → INVALID_INPUT", () => {
    expect(calculateBlackoutMinimum({ ...BAZA, odbiorniki: [] }).status).toBe("INCOMPLETE")
    const zle = { ...BAZA, odbiorniki: [{ nazwa: "x", mocW: 10, godzinNaDobe: 30 }] }
    expect(calculateBlackoutMinimum(zle).status).toBe("INVALID_INPUT")
  })
})
