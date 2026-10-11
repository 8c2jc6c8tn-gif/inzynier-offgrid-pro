import { describe, expect, it } from "vitest"
import type { ZapisTmy } from "../dane-tmy"
import { nadpisaniePasuje, sumyMiesieczneGhiKwhM2, zastosujNadpisanie, type NadpisanieNasloneczenia } from "../nadpisanie-nasloneczenia"

const rekord = (m: number, d: number, h: number, ghi: number, dni: number, dhi: number, tempC?: number) => ({
  czasUtcMs: Date.UTC(2010, m, d, h, 30),
  ghi,
  dni,
  dhi,
  ...(tempC === undefined ? {} : { tempC }),
})

// January: 500 + 300 W/m² over two hours = 0,8 kWh/m²; February: 250 W/m² for one hour = 0,25 kWh/m²
const zapis: ZapisTmy = {
  szerokosc: 52,
  dlugosc: 21,
  pobrano: "2026-10-11T00:00:00Z",
  dane: {
    rekordy: [rekord(0, 15, 11, 500, 600, 100, -3), rekord(0, 15, 12, 300, 400, 80, -2), rekord(1, 10, 12, 250, 300, 90, 0)],
    meta: { szerokosc: 52, dlugosc: 21, wysokoscNpmM: 100, przesuniecieCzasuH: 0.5, bazaPromieniowania: "SARAH3", bazaMeteo: "ERA5", rokOd: 2005, rokDo: 2023, horyzontTerenu: false, zrodloHoryzontu: "" },
  },
}
const wpis = (ghiKwhM2: (number | null)[]): NadpisanieNasloneczenia => ({ szerokosc: 52, dlugosc: 21, ghiKwhM2 })
const puste = Array<number | null>(12).fill(null)

describe("sumyMiesieczneGhiKwhM2", () => {
  it("sumuje godzinowe W/m² po miesiącach UTC: styczeń 0,8, luty 0,25, reszta 0", () => {
    const s = sumyMiesieczneGhiKwhM2(zapis.dane.rekordy)
    expect(s[0]).toBeCloseTo(0.8, 12)
    expect(s[1]).toBeCloseTo(0.25, 12)
    expect(s.slice(2).every((x) => x === 0)).toBe(true)
  })
})

describe("zastosujNadpisanie", () => {
  it("bez wpisów zostawia te same rekordy i podaje sumy PVGIS", () => {
    const w = zastosujNadpisanie(zapis, wpis(puste))
    expect(w.dane.rekordy).toBe(zapis.dane.rekordy)
    expect(w.bazoweGhiKwhM2[0]).toBeCloseTo(0.8, 12)
    expect(w.wspolczynniki.every((k) => k === null)).toBe(true)
    expect(zastosujNadpisanie(zapis, null).dane.rekordy).toBe(zapis.dane.rekordy)
  })

  it("styczeń 1,6 kWh/m² zamiast 0,8: współczynnik 2, GHI/DNI/DHI × 2, temperatura i luty bez zmian, suma miesiąca = wpisana", () => {
    const w = zastosujNadpisanie(zapis, wpis([1.6, ...Array(11).fill(null)]))
    expect(w.wspolczynniki[0]).toBeCloseTo(2, 12)
    expect(w.dane.rekordy[0]).toMatchObject({ ghi: 1000, dni: 1200, dhi: 200, tempC: -3 })
    expect(w.dane.rekordy[1]).toMatchObject({ ghi: 600, dni: 800, dhi: 160, tempC: -2 })
    expect(w.dane.rekordy[2]).toEqual(zapis.dane.rekordy[2])
    expect(sumyMiesieczneGhiKwhM2(w.dane.rekordy)[0]).toBeCloseTo(1.6, 12)
    // the stored record is not mutated
    expect(zapis.dane.rekordy[0]!.ghi).toBe(500)
  })

  it("luty 0,125 zamiast 0,25: współczynnik 0,5", () => {
    const w = zastosujNadpisanie(zapis, wpis([null, 0.125, ...Array(10).fill(null)]))
    expect(w.wspolczynniki[1]).toBeCloseTo(0.5, 12)
    expect(w.dane.rekordy[2]!.ghi).toBeCloseTo(125, 12)
  })

  it("wartości niedodatnie, nieskończone i miesiąc bez danych PVGIS są pomijane", () => {
    const w = zastosujNadpisanie(zapis, wpis([0, -1, Number.NaN, 5, ...Array(8).fill(Number.POSITIVE_INFINITY)]))
    expect(w.wspolczynniki.every((k) => k === null)).toBe(true) // March = 5 but PVGIS sum is 0: nothing to scale
    expect(w.dane.rekordy).toBe(zapis.dane.rekordy)
  })

  it("nadpisanie z innej lokalizacji nie jest stosowane", () => {
    const obce: NadpisanieNasloneczenia = { szerokosc: 40, dlugosc: 10, ghiKwhM2: [1.6, ...Array(11).fill(null)] }
    expect(nadpisaniePasuje(obce, 52, 21)).toBe(false)
    expect(zastosujNadpisanie(zapis, obce).dane.rekordy).toBe(zapis.dane.rekordy)
    expect(nadpisaniePasuje(wpis(puste), 52.005, 21.005)).toBe(true)
  })
})
