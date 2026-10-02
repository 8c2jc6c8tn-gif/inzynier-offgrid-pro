import { describe, expect, it } from "vitest"
import { calculateCykleOdszraniania } from "../calculator"
import type { CykleOdszranianiaInput } from "../input"

const BAZA: CykleOdszranianiaInput = {
  tZewnC: 2,
  wilgotnoscPct: 90,
  odstepMin: 45,
  czasDefrostuMin: 5,
  mocDefrostuKw: 1,
  mocBazowaKw: 1,
  godzinySzronieniaH: 0,
  copKatalogowy: 0,
  tMinPracyC: null,
}

describe("calculateCykleOdszraniania (M6/E6, dawne 5.6 + 1.14 + 6.8)", () => {
  it("Ekran 6 „co 45 min, 5 min → ok. 8%”: przy mocy defrostu = mocy pracy wychodzi 11,1%; 8% dopiero przy 0,72 × moc", () => {
    const rowna = calculateCykleOdszraniania(BAZA)
    expect(rowna.status).toBe("VALID")
    expect(rowna.value.udzialCzasuPct).toBeCloseTo(100 / 9, 9)
    expect(rowna.value.narzutPct).toBeCloseTo(100 / 9, 9)
    expect(calculateCykleOdszraniania({ ...BAZA, mocDefrostuKw: 0.72 }).value.narzutPct).toBeCloseTo(8, 9)
  })

  it("Biblia §2.14: +2 kW przez 5 min co godzinę → 0,167 kWh/h; 0,8 kWh/dobę = 4,8 h szronienia", () => {
    const w = calculateCykleOdszraniania({ ...BAZA, odstepMin: 60, mocDefrostuKw: 2, godzinySzronieniaH: 4.8 })
    expect(w.value.energiaNaGodzineKwh).toBeCloseTo(2 / 12, 12)
    expect(w.value.energiaDobaKwh).toBeCloseTo(0.8, 12)
  })

  it("Biblia §7.8: COP 2,8 i zużycie +27,27% → realny COP 2,2", () => {
    // narzut = P_def·t / (P_baz·T) = 3·5 / (1·55) = 27,27%
    const w = calculateCykleOdszraniania({ ...BAZA, odstepMin: 55, mocDefrostuKw: 3, copKatalogowy: 2.8 })
    expect(w.value.narzutPct).toBeCloseTo(300 / 11, 9)
    expect(w.value.copEfektywny).toBeCloseTo(2.2, 9)
  })

  it("🟡 poniżej minimalnej temperatury pracy z karty; ℹ️ powyżej 7 °C", () => {
    const zimno = calculateCykleOdszraniania({ ...BAZA, tZewnC: -22, tMinPracyC: -20 })
    expect(zimno.warnings.map((x) => [x.code, x.level])).toEqual([["CYK-PONIZEJ-MIN-PRACY", "warning"]])
    expect(zimno.status).toBe("VALID_WITH_WARNINGS")
    const cieplo = calculateCykleOdszraniania({ ...BAZA, tZewnC: 8 })
    expect(cieplo.warnings.map((x) => [x.code, x.level])).toEqual([["CYK-POWYZEJ-ZAKRESU-SZRONIENIA", "info"]])
    expect(calculateCykleOdszraniania({ ...BAZA, tZewnC: 7 }).warnings).toEqual([])
  })

  it("brak danych → INCOMPLETE; defrost ≥ odstęp, godziny > 24, COP < 1 → INVALID_INPUT", () => {
    expect(calculateCykleOdszraniania({ ...BAZA, tZewnC: null }).status).toBe("INCOMPLETE")
    expect(calculateCykleOdszraniania({ ...BAZA, mocBazowaKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateCykleOdszraniania({ ...BAZA, czasDefrostuMin: 45 }).warnings[0]!.code).toBe("CYK-DEFROST-DLUZSZY-NIZ-ODSTEP")
    expect(calculateCykleOdszraniania({ ...BAZA, godzinySzronieniaH: 25 }).status).toBe("INVALID_INPUT")
    expect(calculateCykleOdszraniania({ ...BAZA, copKatalogowy: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
