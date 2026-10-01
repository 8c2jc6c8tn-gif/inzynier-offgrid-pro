import { describe, expect, it } from "vitest"
import { AGM_DOD_REFERENCYJNY_PCT, calculateAkumulatorKampera } from "../calculator"

// Test values only — cycles, DoD, prices and masses come from the user's datasheets (Directive #1).
const BAZA = {
  zapotrzebowanieWhDoba: 1000,
  dniBezLadowania: 2,
  napiecieV: 12,
  agmAh: 100,
  agmCenaZl: 800,
  agmMasaKg: 30,
  agmDodPct: 50,
  agmCykle: 400,
  lfpAh: 100,
  lfpCenaZl: 1600,
  lfpMasaKg: 12,
  lfpDodPct: 80,
  lfpCykle: 5000,
  zapasMasyKg: 0,
}

describe("calculateAkumulatorKampera (M12/E17, dawne 8.37)", () => {
  it("2000 Wh: AGM 600 Wh/szt. → 4 szt., 120 kg; LiFePO4 960 Wh/szt. → 3 szt., 36 kg", () => {
    const w = calculateAkumulatorKampera(BAZA)
    expect(w.value.agm.sztuk).toBe(4)
    expect(w.value.agm.masaKg).toBe(120)
    expect(w.value.lfp.sztuk).toBe(3)
    expect(w.value.lfp.masaKg).toBe(36)
    expect(w.status).toBe("VALID")
  })

  it("koszt kWh w życiu: AGM 800 / (0,6 × 400) ≈ 3,33 zł; LiFePO4 1600 / (0,96 × 5000) ≈ 0,33 zł", () => {
    const w = calculateAkumulatorKampera(BAZA)
    expect(w.value.agm.kosztKwhZyciaZl).toBeCloseTo(3.333, 2)
    expect(w.value.lfp.kosztKwhZyciaZl).toBeCloseTo(0.333, 2)
  })

  it("AGM rozładowywany głębiej niż próg M4/E30 → 🟡", () => {
    expect(AGM_DOD_REFERENCYJNY_PCT).toBe(50)
    const w = calculateAkumulatorKampera({ ...BAZA, agmDodPct: 80 })
    expect(w.warnings.map((x) => x.code)).toContain("AKK-AGM-ZA-GLEBOKO")
  })

  it("zapas masy 50 kg: AGM 120 kg → 🟡, LiFePO4 36 kg OK", () => {
    const kody = calculateAkumulatorKampera({ ...BAZA, zapasMasyKg: 50 }).warnings.map((x) => x.code)
    expect(kody).toEqual(["AKK-PRZEKROCZONA-MASA-AGM"])
  })

  it("brak danych → INCOMPLETE (zapas masy opcjonalny)", () => {
    expect(calculateAkumulatorKampera({ ...BAZA, lfpCykle: 0 }).status).toBe("INCOMPLETE")
  })
})
