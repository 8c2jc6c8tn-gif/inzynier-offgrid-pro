import { describe, expect, it } from "vitest"
import { calculateKolektorGruntowy } from "../calculator"
import type { KolektorGruntowyInput } from "../input"

const BAZA: KolektorGruntowyInput = {
  typ: "poziomy",
  mocPompyKw: 8,
  m2Na10Kw: 0,
  glebokoscUlozeniaM: 1.5,
  glebokoscPrzemarzaniaM: 1.0,
  wNaMetr: 0,
  glebokoscOdwiertuM: 0,
}

describe("calculateKolektorGruntowy (M6, dawne 5.42)", () => {
  it("poziomy: 8 kW × 100 m²/10 kW = 80 m²; widełki źródła 48–96 m²", () => {
    const w = calculateKolektorGruntowy({ ...BAZA, m2Na10Kw: 100 })
    expect(w.value.powierzchniaM2).toBeCloseTo(80, 12)
    expect(w.value.powierzchniaZakresM2).toEqual({ min: 48, max: 96 })
    expect(w.status).toBe("VALID")
  })

  it("pionowy: 8 kW / 50 W/m = 160 m → 2 odwierty po 100 m; widełki 114–160 m", () => {
    const w = calculateKolektorGruntowy({ ...BAZA, typ: "pionowy", wNaMetr: 50, glebokoscOdwiertuM: 100 })
    expect(w.value.dlugoscOdwiertowM).toBeCloseTo(160, 12)
    expect(w.value.liczbaOdwiertow).toBe(2)
    expect(w.value.dlugoscZakresM!.min).toBeCloseTo(8000 / 70, 9)
    expect(w.value.dlugoscZakresM!.max).toBeCloseTo(160, 12)
  })

  it("niespójność przykładu źródła: 400 m² = 500 m²/10 kW, 1 odwiert 100 m = 80 W/m — oba spoza widełek źródła", () => {
    const poz = calculateKolektorGruntowy({ ...BAZA, m2Na10Kw: 500 })
    expect(poz.value.powierzchniaM2).toBeCloseTo(400, 12)
    expect(poz.warnings.map((x) => x.code)).toEqual(["KOL-WSKAZNIK-SPOZA-ZRODLA"])
    const pion = calculateKolektorGruntowy({ ...BAZA, typ: "pionowy", wNaMetr: 80, glebokoscOdwiertuM: 100 })
    expect(pion.value.dlugoscOdwiertowM).toBeCloseTo(100, 12)
    expect(pion.value.liczbaOdwiertow).toBe(1)
    expect(pion.warnings.map((x) => x.code)).toEqual(["KOL-WSKAZNIK-SPOZA-ZRODLA"])
  })

  it("🔴 kolektor poziomy płycej niż przemarzanie (0,8 m przy 1,0 m) + 🟡 poza 1,2–1,8 m", () => {
    const w = calculateKolektorGruntowy({ ...BAZA, m2Na10Kw: 100, glebokoscUlozeniaM: 0.8 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["KOL-PLYCEJ-NIZ-PRZEMARZANIE", "critical"],
      ["KOL-GLEBOKOSC-NIETYPOWA", "warning"],
    ])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    const rowno = calculateKolektorGruntowy({ ...BAZA, m2Na10Kw: 100, glebokoscUlozeniaM: 1.2, glebokoscPrzemarzaniaM: 1.2 })
    expect(rowno.warnings[0]!.code).toBe("KOL-PLYCEJ-NIZ-PRZEMARZANIE")
  })

  it("brak głębokości przemarzania → ℹ️ kontrola nie wykonana; odwiert 150 m → 🟡", () => {
    const w = calculateKolektorGruntowy({ ...BAZA, m2Na10Kw: 100, glebokoscPrzemarzaniaM: null })
    expect(w.warnings.map((x) => x.code)).toEqual(["KOL-BRAK-PRZEMARZANIA"])
    const pion = calculateKolektorGruntowy({ ...BAZA, typ: "pionowy", wNaMetr: 60, glebokoscOdwiertuM: 150 })
    expect(pion.warnings.map((x) => x.code)).toEqual(["KOL-ODWIERT-NIETYPOWY"])
  })

  it("spiralny → OUT_OF_SCOPE; brak danych → INCOMPLETE; ujemna moc → INVALID_INPUT", () => {
    expect(calculateKolektorGruntowy({ ...BAZA, typ: "spiralny" }).status).toBe("OUT_OF_SCOPE")
    expect(calculateKolektorGruntowy({ ...BAZA, typ: null }).status).toBe("INCOMPLETE")
    expect(calculateKolektorGruntowy(BAZA).status).toBe("INCOMPLETE")
    expect(calculateKolektorGruntowy({ ...BAZA, mocPompyKw: -1 }).status).toBe("INVALID_INPUT")
  })
})
