import { describe, expect, it } from "vitest"
import { calculateKosztPowrotu } from "../calculator"

// Hand arithmetic with an arbitrary test rate (not a tariff value): 40 zł/kW × 15 kW = 600 zł netto.
describe("koszt-powrotu — K ≈ stawka × moc (§5.3)", () => {
  it("odległość standardowa → stawka × moc, zawsze z R1", () => {
    const r = calculateKosztPowrotu({ stawkaZlKw: 40, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: true })
    expect(r.value.kosztNettoZl).toBeCloseTo(600, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["SIEC-POWROT-NIEODWRACALNE"])
  })
  it("powyżej odległości standardowej → tylko wzór i „wycena indywidualna OSD”", () => {
    const r = calculateKosztPowrotu({ stawkaZlKw: 40, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: false })
    expect(r.value).toEqual({ kosztNettoZl: null, wycenaIndywidualna: true })
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-POWROT-WYCENA-INDYWIDUALNA")
  })
  it("brak stawki → INCOMPLETE, nic nie zgadujemy", () => {
    const r = calculateKosztPowrotu({ stawkaZlKw: null, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: true })
    expect(r.status).toBe("INCOMPLETE")
    expect(r.warnings.map((w) => w.code)).toEqual(["SIEC-BRAK-STAWKAPRZYLACZENIOWA"])
  })
  it("wartość ujemna → INVALID_INPUT", () => {
    expect(calculateKosztPowrotu({ stawkaZlKw: -1, mocPrzylaczeniowaKw: 15, odlegloscStandardowa: true }).status).toBe("INVALID_INPUT")
  })
})
