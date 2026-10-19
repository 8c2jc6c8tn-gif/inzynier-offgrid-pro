import { describe, expect, it } from "vitest"
import { calculateWiatrPowyzej30 } from "../calculator"
import { cfSzacunekPozaNorma, kodZalozeniaCf } from "../sila-i-balast"

describe("metoda szacunku cf powyżej 30° (D101)", () => {
  it("liniowa: cf30 → 1,80 między 30° a 90°", () => {
    expect(cfSzacunekPozaNorma(35, 0.5, "liniowa")).toBeCloseTo(1.6167, 3)
    expect(cfSzacunekPozaNorma(60, 0, "liniowa")).toBeCloseTo(1.8, 6)
  })

  it("trend: przyrost z ostatniego kroku Tablicy 7.6, limit 1,80", () => {
    expect(cfSzacunekPozaNorma(35, 0.5, "trend")).toBeCloseTo(1.7, 3)
    expect(cfSzacunekPozaNorma(40, 0.5, "trend")).toBeCloseTo(1.8, 6)
  })

  it("trend nie schodzi poniżej liniowej (φ = 1 → brak skoku)", () => {
    expect(cfSzacunekPozaNorma(35, 1, "trend")).toBeGreaterThanOrEqual(cfSzacunekPozaNorma(35, 1, "liniowa")!)
    for (const phi of [0, 0.25, 0.5, 0.75, 1]) {
      for (let kat = 31; kat <= 89; kat++) {
        expect(cfSzacunekPozaNorma(kat, phi, "trend")!).toBeGreaterThanOrEqual(cfSzacunekPozaNorma(kat, phi, "liniowa")! - 1e-12)
        expect(cfSzacunekPozaNorma(kat, phi, "trend")!).toBeLessThanOrEqual(1.8 + 1e-12)
      }
    }
  })

  it("kod założenia zależy od metody", () => {
    expect(kodZalozeniaCf("liniowa")).toBe("WP30-ZALOZENIE-CF-INTERPOLACJA")
    expect(kodZalozeniaCf("trend")).toBe("WP30-ZALOZENIE-CF-TREND")
  })

  it("kalkulator: domyślnie liniowa, trend daje nie mniej balastu", () => {
    const baza = {
      nachylenieDeg: 45, strefaWiatrowa: 2 as const, wysokoscNpmM: 100, kategoriaTerenu: "II" as const,
      wysokoscKonstrukcjiM: 3, powierzchniaM2: 10, wspolczynnikPhi: 0.5, masaPaneliStelazaKg: 100,
    }
    const dom = calculateWiatrPowyzej30(baza)
    const lin = calculateWiatrPowyzej30({ ...baza, metodaCf: "liniowa" })
    const tr = calculateWiatrPowyzej30({ ...baza, metodaCf: "trend" })
    expect(dom.value?.silaWiatruN).toBe(lin.value?.silaWiatruN)
    expect(tr.value!.silaWiatruN!).toBeGreaterThanOrEqual(lin.value!.silaWiatruN!)
    expect(tr.assumptions.map((a) => (typeof a === "string" ? a : a.kod)).includes("WP30-ZALOZENIE-CF-TREND")).toBe(true)
  })
})
