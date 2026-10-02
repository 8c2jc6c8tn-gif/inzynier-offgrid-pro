import { describe, expect, it } from "vitest"
import { calculateDoborMocyPompy, punktBiwalentny } from "../calculator"
import type { DoborMocyPompyInput } from "../input"

const baza: DoborMocyPompyInput = {
  zapotrzebowanieKw: 6,
  mocPompyProjKw: 5,
  tProjC: -20,
  tWewnC: 20,
  tDrugiC: null,
  mocPompyDrugiKw: 0,
}

describe("dobór mocy pompy ciepła (dawne 5.27 + 5.67)", () => {
  it("przykład 5.27: 6 kW przy −20 °C, pompa 5 kW → brakuje 1 kW (źródło: grzałka 2 kW — niespójność), 🟡", () => {
    const r = calculateDoborMocyPompy(baza)
    expect(r.value.dogrzewanieKw).toBeCloseTo(1, 9)
    expect(r.value.zapasKw).toBeCloseTo(-1, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["DMP-DEFICYT"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("pompa 8 kW → zapas 33,3% (ℹ️), bez dogrzewania", () => {
    const r = calculateDoborMocyPompy({ ...baza, mocPompyProjKw: 8 })
    expect(r.value.przewymiarowaniePct).toBeCloseTo(100 / 3, 9)
    expect(r.value.dogrzewanieKw).toBe(0)
    expect(r.value.pokryciePompaPct).toBe(100)
    expect(r.status).toBe("VALID")
  })

  it("przykład 5.67: straty 12 kW, pompa 9,6 kW → pompa 80%, grzałki 20%", () => {
    const r = calculateDoborMocyPompy({ ...baza, zapotrzebowanieKw: 12, mocPompyProjKw: 9.6 })
    expect(r.value.pokryciePompaPct).toBeCloseTo(80, 9)
    expect(r.value.pokrycieDogrzewaniePct).toBeCloseTo(20, 9)
  })

  it("punkt biwalentny: 6 kW przy −20/20 °C, pompa 5 kW przy −20 i 8 kW przy +7 → przecięcie prostych", () => {
    const r = calculateDoborMocyPompy({ ...baza, tDrugiC: 7, mocPompyDrugiKw: 8 })
    const th = r.value.punktBiwalentnyC!
    expect((6 * (20 - th)) / 40).toBeCloseTo(5 + (3 / 27) * (th + 20), 9)
    expect(th).toBeGreaterThan(-20)
    expect(th).toBeLessThan(7)
    expect(r.warnings.map((w) => w.code)).toEqual(["DMP-DEFICYT"])
  })

  it("punkt biwalentny poniżej θe (pompa z zapasem) → ℹ️ ekstrapolacja; równoległe proste → null", () => {
    const r = calculateDoborMocyPompy({ ...baza, mocPompyProjKw: 8, tDrugiC: 7, mocPompyDrugiKw: 10 })
    expect(r.value.punktBiwalentnyC!).toBeLessThan(-20)
    expect(r.warnings.map((w) => w.code)).toContain("DMP-BIWALENTNY-EKSTRAPOLACJA")
    // k = 6/40 = 0.15 kW/K, s = (2 − 5)/20 = −0.15 kW/K → parallel
    expect(punktBiwalentny(6, 20, -20, 5, 0, 2)).toBeNull()
  })

  it("brak mocy pompy → INCOMPLETE; θi ≤ θe albo dwa punkty w tej samej temperaturze → INVALID_INPUT", () => {
    expect(calculateDoborMocyPompy({ ...baza, mocPompyProjKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateDoborMocyPompy({ ...baza, tWewnC: -25 }).status).toBe("INVALID_INPUT")
    expect(calculateDoborMocyPompy({ ...baza, tDrugiC: -20, mocPompyDrugiKw: 7 }).status).toBe("INVALID_INPUT")
    expect(calculateDoborMocyPompy({ ...baza, zapotrzebowanieKw: -1 }).status).toBe("INVALID_INPUT")
  })
})
