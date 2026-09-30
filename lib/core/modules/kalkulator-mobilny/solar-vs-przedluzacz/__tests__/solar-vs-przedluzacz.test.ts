import { describe, expect, it } from "vitest"
import { calculateSolarVsPrzedluzacz } from "../calculator"

const BIBLIA = {
  kosztPrzedluzaczaZl: 300,
  zuzycieKwhRok: 50,
  cenaEnergiiZlKwh: 1,
  oplatyStaleZlRok: 0,
  kosztZestawuZl: 800,
  eksploatacjaZestawuZlRok: 0,
  horyzontLat: 10,
}

describe("calculateSolarVsPrzedluzacz (M12/E29, dawne 8.56)", () => {
  it("liczby Biblii §12.44 (300 zł + 50 zł/rok vs 800 zł): zwrot 500/50 = 10 lat, remis w 10 latach → przedłużacz", () => {
    const w = calculateSolarVsPrzedluzacz(BIBLIA)
    expect(w.status).toBe("VALID")
    expect(w.value.kosztRocznySieciZl).toBe(50)
    expect(w.value.zwrotLat).toBe(10)
    expect(w.value.tcoPrzedluzaczZl).toBe(800)
    expect(w.value.tcoZestawZl).toBe(800)
    expect(w.value.tanszy).toBe("przedluzacz")
  })

  it("przykład Treści E29: kabel 2000 zł vs zestaw 1500 zł → zestaw tańszy od razu (zwrot 0)", () => {
    const w = calculateSolarVsPrzedluzacz({ ...BIBLIA, kosztPrzedluzaczaZl: 2000, kosztZestawuZl: 1500 })
    expect(w.value.zwrotLat).toBe(0)
    expect(w.value.tanszy).toBe("zestaw")
  })

  it("opłaty stałe i eksploatacja: 50×1,2 + 120 = 180 zł/rok; oszczędność 180 − 40 = 140; zwrot 700/140 = 5 lat", () => {
    const w = calculateSolarVsPrzedluzacz({
      ...BIBLIA,
      cenaEnergiiZlKwh: 1.2,
      oplatyStaleZlRok: 120,
      kosztZestawuZl: 1000,
      eksploatacjaZestawuZlRok: 40,
    })
    expect(w.value.kosztRocznySieciZl).toBeCloseTo(180, 12)
    expect(w.value.oszczednoscRocznaZl).toBeCloseTo(140, 12)
    expect(w.value.zwrotLat).toBeCloseTo(5, 12)
    expect(w.value.tanszy).toBe("zestaw")
  })

  it("eksploatacja zestawu ≥ koszt sieci i dopłata > 0 → nigdy się nie zwróci (🟡, zwrot null)", () => {
    const w = calculateSolarVsPrzedluzacz({ ...BIBLIA, eksploatacjaZestawuZlRok: 60 })
    expect(w.value.zwrotLat).toBeNull()
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.code).toBe("SP-NIGDY-SIE-NIE-ZWROCI")
  })

  it("brak kwot → INCOMPLETE; ujemna → INVALID_INPUT", () => {
    expect(calculateSolarVsPrzedluzacz({ ...BIBLIA, kosztZestawuZl: 0 }).status).toBe("INCOMPLETE")
    expect(calculateSolarVsPrzedluzacz({ ...BIBLIA, oplatyStaleZlRok: -1 }).status).toBe("INVALID_INPUT")
  })
})
