import { describe, expect, it } from "vitest"
import { produkcjaDobowaMiesiaca } from "../produkcja-dobowa"

const DOBA = 86_400_000
const t0 = Date.UTC(2020, 0, 1)

describe("produkcjaDobowaMiesiaca", () => {
  it("sumuje G_poa po dobach UTC danego miesiąca i mnoży przez kWp·PR: 2 doby, 500 + 300 W/m² i 800 W/m² → 0,8 i 0,8 kWh/m² × 5 kWp × 0,8 = 3,2 kWh", () => {
    const czasy = [t0 + 10 * 3_600_000, t0 + 11 * 3_600_000, t0 + DOBA + 11 * 3_600_000, t0 + 40 * DOBA]
    const wynik = produkcjaDobowaMiesiaca({ gPoa: [500, 300, 800, 999], miesiac: [0, 0, 0, 1] }, czasy, 0, 5, 0.8)
    expect(wynik).toHaveLength(2)
    expect(wynik[0]).toBeCloseTo(3.2, 9)
    expect(wynik[1]).toBeCloseTo(3.2, 9)
  })

  it("pomija inne miesiące i zwraca doby w kolejności czasu", () => {
    const czasy = [t0 + 2 * DOBA + 3_600_000, t0 + 3_600_000]
    const wynik = produkcjaDobowaMiesiaca({ gPoa: [1000, 100], miesiac: [0, 0] }, czasy, 0, 1, 1)
    expect(wynik[0]).toBeCloseTo(0.1, 9)
    expect(wynik[1]).toBeCloseTo(1, 9)
    expect(produkcjaDobowaMiesiaca({ gPoa: [1000], miesiac: [0] }, [t0], 5, 1, 1)).toEqual([])
  })
})
